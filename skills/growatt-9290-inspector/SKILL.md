---
name: growatt-9290-inspector
description: Use when you need to inspect Growatt devices on https://api-test.growatt.com:9290, fetch current token/device info/device telemetry, or troubleshoot why bindDevice/getDeviceInfo/getDeviceData are failing in the 9290 test environment.
---

# Growatt 9290 Inspector

Use this skill for the verified Growatt test environment on `https://api-test.growatt.com:9290`.

This skill is specifically for:

- fetching a fresh `client_credentials` token
- binding devices with the temporary pin code
- reading `getDeviceInfo`
- reading `getDeviceData`
- explaining why requests fail in the 9290 environment
- producing inspection reports from live API responses

Do not use this skill for generic Growatt production environments unless the user explicitly says the 9290 compatibility behavior also applies there.

## What is special about 9290

The test environment differs from the generic docs in a few important ways:

- Device labels may appear as `SPH:xxxx` / `SPM:xxxx`, but request payloads should use the raw SN only.
- `bindDevice` works with:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
  - JSON body containing raw SN values
- `getDeviceInfo` works with:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
  - JSON body `{"deviceSn":"RAW_SN"}`
- `getDeviceData` also works with:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
  - JSON body `{"deviceSn":"RAW_SN"}`

If the user provides device labels such as `SPH:YRP...` or `SPM:HCQ...`, strip the prefix before constructing request bodies.

## Default workflow

Always follow this order unless the user explicitly wants only one step:

1. Get a fresh token from `/oauth2/token`
2. If needed, call `/oauth2/bindDevice`
3. Call `/oauth2/getDeviceInfo`
4. Call `/oauth2/getDeviceData`
5. Summarize what information is currently available

## One-pass shortcut

If the goal is "give me SN and PINCODE once, then run everything", prefer the repo script:

```bash
./scripts/run-growatt-9290-flow.sh 'SPH:YRP0N4S00Q=TESTPINCODE753951'
```

The script already bakes in the verified 9290 `client_credentials` flow and strips `SPH:` / `SPM:` prefixes automatically.

## Request templates

### 1. Get token

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/token' \
  -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials&client_id=<client_id>&client_secret=<client_secret>&redirect_uri=https://api-test.growatt.com:9290/testToken/testToken1'
```

### 2. Bind device

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/bindDevice' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSnList":[{"deviceSn":"RAW_DEVICE_SN","pinCode":"TEST_PIN_CODE"}]}'
```

### 3. Get device info

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"RAW_DEVICE_SN"}'
```

### 4. Get device data

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"RAW_DEVICE_SN"}'
```

## Failure handling

Interpret these responses first:

- `TOKEN_IS_INVALID`
  - Refresh or fetch a new token, then retry.
- `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`
  - Bind the device first, then retry info/data queries.
- `parameter error`
  - Most often caused by prefixed SNs or the wrong body format.
  - Switch to JSON body and pass the raw SN only.
- `code=400, message=fail`
  - In 9290, this usually means the auth/body combination is wrong for `getDeviceData`.
  - Use `Authorization: Bearer` and JSON body.

## Reporting guidance

When reporting current device state:

- include the exact inspection date
- distinguish between static device info and telemetry snapshot
- include the API-returned timestamp (`utcTime`) for telemetry
- mention if one device's timestamp is older than the other
- avoid printing full secrets or full tokens
- if the user asks for a report, mask the middle of sensitive SNs unless they explicitly ask for raw identifiers

Preferred summary structure:

1. overall result
2. device-by-device status
3. currently available fields
4. curl interaction snippets if requested

## Source-of-truth docs in this repo

Read these when you need the surrounding documentation context:

- `Growatt API/OPENAPI/04_api_device_auth.md`
- `Growatt API/OPENAPI/07_api_device_info.md`
- `Growatt API/OPENAPI/08_api_device_data.md`
- `Growatt API/OPENAPI/11_api_troubleshooting.md`

For Chinese-aligned docs, use the matching files under `Growatt API/OPENAPI.zh-CN/`.
