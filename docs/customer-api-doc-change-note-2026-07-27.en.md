# Growatt Open API Documentation Change Notice

Release date: 2026-07-27

Applicable audience: platform customers, aggregators, VPP partners, and technical integration teams that have already integrated with, or are planning to integrate with, the Growatt Open API.

## 1. Overview

This update covers three areas: removal of an unavailable telemetry field, updates to the supported-model list, and publication of API rate-limiting documentation.

The main updates in this release are:

- The `smartLoadPower` field has been removed from `getDeviceData` and the device-data push payload.
- The supported-model list has been updated with new models.
- API rate-limiting rules are now publicly documented for all endpoints.

## 2. Key Changes

### 2.1 Removal of `smartLoadPower`

The `smartLoadPower` field has been removed from the following:

- `POST /oauth2/getDeviceData` response
- Device-data push payload

Notes:

- This field was not actually served through the public OpenAPI. Its presence in the documentation was misleading.
- If your parser already ignores unknown fields, no action is needed.
- If you reference `smartLoadPower` in field-mapping tables or integration code, remove it.

### 2.2 Supported-Model List Updates

The supported inverter / PCE model list has been updated:

**Newly added models:**

- Expanded MODA series models with additional regional variants
- Added all-in-one energy storage models (MINA, MODA) to the confirmed list

### 2.3 API Rate Limiting Documentation

Rate-limiting rules for all public API endpoints are now publicly documented.

**Rate limiting modes:**

| Mode | Description |
|---|---|
| `CLIENT_ONLY` | Rate limit by clientId; all calls from the same client share the quota |
| `CLIENT_AND_DEVICE` | Rate limit by clientId + deviceSn; each device has an independent quota per client |

**Rate limits by endpoint:**

| Endpoint | Window | Mode |
|---|---|---|
| `getDeviceInfo` | 60s | `CLIENT_AND_DEVICE` |
| `getDeviceData` | 10s | `CLIENT_AND_DEVICE` |
| `deviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `readDeviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `getDeviceList` | 60s | `CLIENT_ONLY` |
| `getDeviceListAuthed` | 60s | `CLIENT_ONLY` |

**Rate-limit exceeded response (error code 105):**

```json
{
  "code": 105,
  "data": null,
  "message": "Endpoint rate limited for clientId=client***, retry after 43217ms"
}
```

- `clientId` is masked after the first 6 characters
- `retry after Xms` indicates the remaining wait time

## 3. Affected APIs and Documentation

- `POST /oauth2/getDeviceData` — `smartLoadPower` field removed
- Device-data push payload — `smartLoadPower` field removed
- Supported-model list — new models added
- API rate limiting — newly published for all endpoints

## 4. Impact on Customers

### 4.1 For new integrations

- Ignore `smartLoadPower`; it is not served through the API.
- Review the rate-limiting rules and implement rate-limit handling (error code 105) in your API client.

### 4.2 For existing integrations

- **`smartLoadPower` removal**: If your code references this field, remove it from field-mapping tables and parsing logic.
- **Supported-model updates**: If you maintain an internal compatibility matrix, update it with the newly added models.
- **Rate limiting**: If you call endpoints at a high frequency, review the rate limits and implement appropriate backoff and retry logic for error code 105.

## 5. Recommended Customer Actions

1. Remove `smartLoadPower` from any integration code, field mappings, or SDK wrappers.
2. Add rate-limit handling for error code 105: parse `retry after Xms` and implement exponential backoff.
3. If you maintain an API gateway, SDK, or wrapper layer, update its external documentation accordingly.

## 6. Compatibility Notes

- API paths are unchanged.
- The OAuth2 integration flow is unchanged.
- No existing fields are renamed or restructured.
- `smartLoadPower` was never served through the API; its removal from documentation has no runtime impact.
- Rate limiting has always been enforced server-side; the rules are now documented publicly.
