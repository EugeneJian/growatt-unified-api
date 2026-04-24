# AU oauth2-openApi Full Test Report

This report records the live rerun completed on 2026-04-24 against the Australia test environment.  
It follows the same endpoint order and request shapes documented in [oauth2-openApi-platform-au-full-test-report-2026-04-23.en.md](./oauth2-openApi-platform-au-full-test-report-2026-04-23.en.md).

Sensitive credentials, tokens, auth codes, and device `pinCode` values are masked as `***`.

## Run Metadata

| Item | Content |
| :--- | :--- |
| Backend Address | `https://opencloud-test-au.growatt.com/prod-api` |
| Frontend Login Address | `https://opencloud-test-au.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| Baseline Report | `test/oauth2-openApi-platform-au-full-test-report-2026-04-23.en.md` |
| Test Method | Live API integration test |
| Test Tool | Node.js `fetch` |
| Test Date | `2026-04-24` |
| Run Started | `2026-04-24 17:20:05.734 +08:00` |
| Run Ended | `2026-04-24 17:20:12.599 +08:00` |
| Time Zone | Asia/Shanghai (UTC+8) |
| Test Device | `WUP0N3500C` |

## Overall Verdict

| Area | Result | Notes |
| :--- | :--- | :--- |
| Authorization-code mode | PASS | `16/16` core steps passed |
| Client-credentials mode | PASS | `14/14` core steps passed |
| Post-run environment state | PASS | Final `getDeviceListAuthed` rechecks returned empty arrays |
| Defensive extra cleanup | Expected old-token invalidation observed | Two extra cleanup calls used already-invalid tokens and returned `TOKEN_IS_INVALID`; core cleanup had already succeeded |

Core flow result: `30/30` primary test steps passed.

## Key Observations

1. `authorization_code` still returns a refreshable token set.  
   Observed token response keys: `access_token`, `refresh_token`, `refresh_expires_in`, `token_type`, `expires_in`.

2. `client_credentials` still returns access-token-only responses, both with and without `redirect_uri`.  
   Observed token response keys: `access_token`, `token_type`, `expires_in`.

3. `POST /oauth2/getDeviceList` still rejects `client_credentials` mode with `code=103`, `message=WRONG_GRANT_TYPE`.

4. The AU test device `WUP0N3500C` still binds successfully with object-array payload plus `pinCode` in both modes.

5. The refresh flow still invalidates the pre-refresh access token.  
   Reusing the old authorization-code token on `getDeviceListAuthed` returned `code=2`, `message=TOKEN_IS_INVALID`.

6. Device reads succeeded in both modes.  
   Observed telemetry remained stable in this rerun with `soc=39`, `batteryList[0].soc=39`, and `status=9`.

## SOC Fields Observed

```json
{
  "authorizationCodeMode": {
    "dataSoc": 39,
    "batteryListSoc": [
      39
    ]
  },
  "clientCredentialsMode": {
    "dataSoc": 39,
    "batteryListSoc": [
      39
    ]
  }
}
```

## Authorization Code Mode Rerun

| Step | Endpoint | Result | Observed Outcome |
| :--- | :--- | :--- | :--- |
| A1 | `GET /#/login` | PASS | Frontend login page reachable, HTTP `200` |
| A2 | `POST /login` | PASS | Login succeeded with `code=200` |
| A3 | `GET /auth` | PASS | Authorization code issued successfully |
| A4 | `POST /oauth2/token` | PASS | `expires_in=515790`, `refresh_expires_in=2502666` |
| A5 | `POST /oauth2/getDeviceList` | PASS | Returned candidate device `WUP0N3500C`, `authFlag=false` |
| A6 | `POST /oauth2/unbindDevice` | PASS | Pre-clean succeeded with `code=0` |
| A7 | `POST /oauth2/getDeviceListAuthed` | PASS | Pre-clean recheck returned empty array |
| A8 | `POST /oauth2/bindDevice` | PASS | Object-array plus `pinCode` returned `code=0`, `data=1` |
| A9 | `POST /oauth2/getDeviceListAuthed` | PASS | Authorized list contained `WUP0N3500C`, `authFlag=true` |
| A10 | `POST /oauth2/getDeviceInfo` | PASS | Returned `deviceSn=WUP0N3500C`, `model=SPH 6000TL-HUB`, `authFlag=true` |
| A11 | `POST /oauth2/getDeviceData` | PASS | Returned `deviceSn=WUP0N3500C`, `soc=39`, `status=9` |
| A12 | `POST /oauth2/refresh` | PASS | Refreshed token set returned `expires_in=604800`, `refresh_expires_in=2591999` |
| A13 | `POST /oauth2/getDeviceListAuthed` with old token | PASS | Returned `code=2`, `message=TOKEN_IS_INVALID` |
| A14 | `POST /oauth2/getDeviceListAuthed` with fresh token | PASS | Authorized list still contained `WUP0N3500C` |
| A15 | `POST /oauth2/unbindDevice` with fresh token | PASS | Unbind succeeded with `code=0` |
| A16 | `POST /oauth2/getDeviceListAuthed` with fresh token | PASS | Final recheck returned empty array |

## Client Credentials Mode Rerun

| Step | Endpoint | Result | Observed Outcome |
| :--- | :--- | :--- | :--- |
| C1 | `POST /oauth2/token` without `redirect_uri` | PASS | Returned `access_token`, `token_type`, `expires_in=604800` |
| C2 | `POST /oauth2/token` with `redirect_uri` | PASS | Returned `access_token`, `token_type`, `expires_in=604800` |
| C3 | `POST /oauth2/getDeviceList` | PASS | Returned `code=103`, `message=WRONG_GRANT_TYPE` |
| C4 | `POST /oauth2/unbindDevice` | PASS | Pre-clean succeeded with `code=0` |
| C5 | `POST /oauth2/bindDevice` | PASS | Object-array plus `pinCode` returned `code=0`, `data=1` |
| C6 | `POST /oauth2/getDeviceListAuthed` with pre-bind token | PASS | Authorized list contained `WUP0N3500C`, `authFlag=true` |
| C7 | `POST /oauth2/getDeviceInfo` with pre-bind token | PASS | Returned `deviceSn=WUP0N3500C`, `model=SPH 6000TL-HUB`, `authFlag=true` |
| C8 | `POST /oauth2/getDeviceData` with pre-bind token | PASS | Returned `deviceSn=WUP0N3500C`, `soc=39`, `status=9` |
| C9 | `POST /oauth2/token` after bind | PASS | Fresh client token returned `expires_in=604800` |
| C10 | `POST /oauth2/getDeviceListAuthed` with fresh token | PASS | Authorized list contained `WUP0N3500C` |
| C11 | `POST /oauth2/getDeviceInfo` with fresh token | PASS | Device info remained readable |
| C12 | `POST /oauth2/getDeviceData` with fresh token | PASS | Device data remained readable with `soc=39` |
| C13 | `POST /oauth2/unbindDevice` | PASS | Unbind succeeded with `code=0` |
| C14 | `POST /oauth2/getDeviceListAuthed` | PASS | Final recheck returned empty array |

## Cleanup Notes

- The core cleanup inside the rerun passed in both modes:
  - Authorization-code mode: `A15` and `A16`
  - Client-credentials mode: `C13` and `C14`
- After the main flow completed, additional defensive `unbindDevice` calls were issued with every collected token.
- Two of those extra cleanup attempts used already-invalidated tokens and returned:

```json
{
  "code": 2,
  "message": "TOKEN_IS_INVALID"
}
```

- These responses are consistent with the old-token invalidation already verified in `A13` and do not indicate a residual authorization binding.

## Conclusion

This 2026-04-24 live rerun matches the 2026-04-23 AU full report on all primary behaviors:

- `authorization_code` remains refresh-capable.
- `client_credentials` remains access-token-only.
- `getDeviceList` remains authorization-code-only.
- AU `bindDevice` remains valid with object-array plus `pinCode`.
- Device info and telemetry remain readable in both modes.
- Final cleanup completed successfully and the post-run authorized-device state returned to empty.
