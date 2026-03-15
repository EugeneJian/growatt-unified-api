#!/usr/bin/env bash

set -euo pipefail

API_BASE="${GROWATT_API_BASE:-https://api-test.growatt.com:9290}"
CLIENT_ID="${GROWATT_CLIENT_ID:-testclientmode}"
CLIENT_SECRET="${GROWATT_CLIENT_SECRET:-testsecretgrowatt1}"
REDIRECT_URI="${GROWATT_REDIRECT_URI:-https://api-test.growatt.com:9290/testToken/testToken1}"

usage() {
  cat <<'EOF'
Run the verified Growatt 9290 client_credentials flow end to end.

Usage:
  ./scripts/run-growatt-9290-flow.sh [--raw-json] 'SN=PINCODE' ['SN=PINCODE' ...]

Examples:
  ./scripts/run-growatt-9290-flow.sh \
    'SPH:YRP0N4S00Q=TESTPINCODE753951' \
    'SPM:HCQSKJMSJ1=TESTPINCODE753951'

  ./scripts/run-growatt-9290-flow.sh --raw-json \
    'SPH:YRP0N4S00Q=TESTPINCODE753951'

Notes:
  - The script accepts either prefixed SNs (for example SPH:xxxx) or raw SNs.
  - The script automatically strips the device type prefix before calling the API.
  - This script is for the Growatt 9290 test environment only.
EOF
}

require_python() {
  if ! command -v python3 >/dev/null 2>&1; then
    echo "python3 is required but was not found." >&2
    exit 1
  fi
}

mask_token() {
  python3 - "$1" <<'PY'
import sys
token = sys.argv[1]
if len(token) <= 10:
    print(token)
else:
    print(f"{token[:6]}...{token[-4:]}")
PY
}

extract_access_token() {
  python3 - "$1" <<'PY'
import json
import sys

payload = json.loads(sys.argv[1])
token = payload.get("access_token")
if not token:
    raise SystemExit("Token response did not contain access_token")
print(token)
PY
}

ensure_success_code() {
  local response="$1"
  local step="$2"
  python3 - "$step" "$response" <<'PY'
import json
import sys

step = sys.argv[1]
payload = json.loads(sys.argv[2])
code = payload.get("code", 0)
if code != 0:
    raise SystemExit(f"{step} failed: {json.dumps(payload, ensure_ascii=False)}")
PY
}

print_device_summary() {
  local sn="$1"
  local info_response="$2"
  local data_response="$3"
  python3 - "$sn" "$info_response" "$data_response" <<'PY'
import json
import sys

sn = sys.argv[1]
info = json.loads(sys.argv[2])
data = json.loads(sys.argv[3])
info_data = info["data"]
telemetry = data["data"]

print(f"设备 {sn}")
print(f"  model={info_data.get('model')}")
print(f"  nominalPower={info_data.get('nominalPower')}")
print(f"  authFlag={info_data.get('authFlag')}")
print(f"  utcTime={telemetry.get('utcTime')}")
print(f"  ppv={telemetry.get('ppv')}")
print(f"  payLoadPower={telemetry.get('payLoadPower')}")
print(f"  batPower={telemetry.get('batPower')}")
print(f"  soc={telemetry.get('batteryList', [{}])[0].get('soc', telemetry.get('soc'))}")
print(f"  status={telemetry.get('status')}")
PY
}

show_raw_json=0
declare -a device_args=()

for arg in "$@"; do
  case "$arg" in
    --raw-json)
      show_raw_json=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      device_args+=("$arg")
      ;;
  esac
done

if [[ ${#device_args[@]} -lt 1 ]]; then
  usage
  exit 1
fi

require_python

echo "==> Step 1/4: fetching fresh client_credentials token"
token_response="$(
  curl -fsS "${API_BASE}/oauth2/token" \
    -X POST \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data "grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}"
)"
access_token="$(extract_access_token "$token_response")"
echo "token=$(mask_token "$access_token")"

declare -a normalized_devices=()

for device_arg in "${device_args[@]}"; do
  if [[ "$device_arg" != *=* ]]; then
    echo "Invalid device argument: $device_arg" >&2
    echo "Expected format: SN=PINCODE" >&2
    exit 1
  fi

  input_sn="${device_arg%%=*}"
  pin_code="${device_arg#*=}"
  raw_sn="${input_sn##*:}"

  if [[ -z "$raw_sn" || -z "$pin_code" ]]; then
    echo "Invalid device argument: $device_arg" >&2
    exit 1
  fi

  normalized_devices+=("${raw_sn}=${pin_code}")
done

echo "==> Step 2/4: binding devices"
for device in "${normalized_devices[@]}"; do
  raw_sn="${device%%=*}"
  pin_code="${device#*=}"
  bind_response="$(
    curl -fsS "${API_BASE}/oauth2/bindDevice" \
      -X POST \
      -H "Authorization: Bearer ${access_token}" \
      -H 'Content-Type: application/json' \
      --data "{\"deviceSnList\":[{\"deviceSn\":\"${raw_sn}\",\"pinCode\":\"${pin_code}\"}]}"
  )"
  ensure_success_code "$bind_response" "bindDevice(${raw_sn})"
  echo "bound ${raw_sn}: ${bind_response}"
done

echo "==> Step 3/4 + 4/4: querying device info and telemetry"
for device in "${normalized_devices[@]}"; do
  raw_sn="${device%%=*}"

  info_response="$(
    curl -fsS "${API_BASE}/oauth2/getDeviceInfo" \
      -X POST \
      -H "Authorization: Bearer ${access_token}" \
      -H 'Content-Type: application/json' \
      --data "{\"deviceSn\":\"${raw_sn}\"}"
  )"
  ensure_success_code "$info_response" "getDeviceInfo(${raw_sn})"

  data_response="$(
    curl -fsS "${API_BASE}/oauth2/getDeviceData" \
      -X POST \
      -H "Authorization: Bearer ${access_token}" \
      -H 'Content-Type: application/json' \
      --data "{\"deviceSn\":\"${raw_sn}\"}"
  )"
  ensure_success_code "$data_response" "getDeviceData(${raw_sn})"

  print_device_summary "$raw_sn" "$info_response" "$data_response"

  if [[ "$show_raw_json" -eq 1 ]]; then
    echo "  raw getDeviceInfo response:"
    echo "$info_response"
    echo "  raw getDeviceData response:"
    echo "$data_response"
  fi
done
