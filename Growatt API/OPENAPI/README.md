# Growatt Open API Documentation

Baseline source: `docs/3 接口列表.md` (synced from the approved vendor document dated April 1, 2026)

This directory is the English published split of the Growatt Open API documentation. The vendor baseline is the factual source; this directory exists to publish aligned endpoint pages, preserve cross-links, and clearly demote environment findings into non-normative observations.

## Documentation Structure

| File | Description |
| :--- | :--- |
| [01_authentication.md](./01_authentication.md) | Authentication guide |
| [02_api_access_token.md](./02_api_access_token.md) | Get `access_token` |
| [03_api_refresh.md](./03_api_refresh.md) | Refresh `access_token` |
| [04_api_device_auth.md](./04_api_device_auth.md) | Device authorization and unbind |
| [05_api_device_dispatch.md](./05_api_device_dispatch.md) | Device dispatch |
| [06_api_read_dispatch.md](./06_api_read_dispatch.md) | Read device dispatch parameters |
| [07_api_device_info.md](./07_api_device_info.md) | Device information query |
| [08_api_device_data.md](./08_api_device_data.md) | Device data query |
| [09_api_device_push.md](./09_api_device_push.md) | Device data push |
| [10_global_params.md](./10_global_params.md) | Global parameter description |
| [11_api_troubleshooting.md](./11_api_troubleshooting.md) | Troubleshooting FAQ |

## Quick Navigation

- [Authentication Guide](./01_authentication.md)
- [Get access_token API](./02_api_access_token.md)
- [OAuth2-refresh API](./03_api_refresh.md)
- [Device Authorization API](./04_api_device_auth.md)
- [Device Dispatch API](./05_api_device_dispatch.md)
- [Read Device Dispatch Parameters API](./06_api_read_dispatch.md)
- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)
- [Device Data Push API](./09_api_device_push.md)
- [Global Parameter Description](./10_global_params.md)
- [Troubleshooting FAQ](./11_api_troubleshooting.md)

## Baseline Reminders

- Both vendor examples for `POST /oauth2/token` include `redirect_uri`.
- `POST /oauth2/getDeviceList` is supported only in `authorization_code` mode.
- In `POST /oauth2/bindDevice`, `deviceSnList[].pinCode` is required in client mode.
- The parameter table for `POST /oauth2/readDeviceDispatch` marks `requestId` as required even though the vendor sample omits it.
- The test domains include `https://opencloud-test-au.growatt.com`.

## Entry Guide

For the consolidated integration guide, see:

- [../Growatt Open API Professional Integration Guide.md](../Growatt Open API Professional Integration Guide.md)

## Appendix

- [Growatt Codes](/growatt-openapi/growatt-codes)
