# Growatt Open API Documentation Change Notice (Customer-Facing)

Release date: 2026-08-06

Applicable audience: platform customers, aggregators, VPP partners, and technical integration teams that have already integrated with, or are planning to integrate with, the Growatt Open API.

## 1. Overview

This update introduces a new API for querying device battery operation mode, and updates the rate-limiting documentation to reflect the new endpoint.

The main updates in this release are:

- New `getDeviceOperationMode` API for querying the current battery operation mode of a device.
- The rate-limiting table has been updated to include the new endpoint.

## 2. Key Changes

### 2.1 New `getDeviceOperationMode` API

A new endpoint allows VPP aggregators to query the current battery operation mode for a device.

**Endpoint:** `POST /oauth2/getDeviceOperationMode`

**Request parameters:**

| Parameter | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `deviceSn` | Yes | string | Unique device serial number |
| `setType` | Yes | string | Request type: `"duration_and_power_charge_discharge"` |
| `requestId` | Yes | string | Unique request identifier |

**Response:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `code` | int | `0` = success |
| `data` | string | Current battery operation mode value |
| `message` | string | Response description |

**Operation mode values:**

| Value | Business Meaning | Typical Use Cases |
| :--- | :--- | :--- |
| `SELF_RELIANCE` | Self-consumption mode | Self-consumption optimization, minimizing grid imports |
| `TIME_OF_USE` | Time-of-use optimization | Cost optimization based on time-varying rates |
| `IMPORT_FOCUS` | Charge priority mode | Low-rate charging, pre-event battery preparation |
| `EXPORT_FOCUS` | Discharge priority mode | VPP dispatch, demand response, peak shaving |
| `IDLE` | Idle mode | Battery preservation, SoC locking, strategy transition |

**Rate limit:** 1 request per minute per device (`CLIENT_AND_DEVICE` mode).

### 2.2 Rate Limiting Table Updated

The rate-limiting table now includes `getDeviceOperationMode`:

| Endpoint | Window | Mode |
|---|---|---|
| `getDeviceOperationMode` | 60s | `CLIENT_AND_DEVICE` |

## 3. Affected APIs and Documentation

- New: `POST /oauth2/getDeviceOperationMode`
- Updated: Rate-limiting table — added new endpoint

## 4. Impact on Customers

### 4.1 For new integrations

- Add `getDeviceOperationMode` to your API integration scope if your VPP platform needs to monitor battery scheduling states.
- Respect the 1 request / min / device rate limit to avoid `TOO_MANY_REQUEST` errors.

### 4.2 For existing integrations

- No breaking changes. All existing API paths, request parameters, and response structures are unchanged.
- If you maintain an API gateway, SDK, or wrapper layer, add support for the new endpoint.

## 5. Recommended Customer Actions

1. Review the `getDeviceOperationMode` API and assess whether your platform needs battery operation-mode visibility for VPP scheduling.
2. If adopting the new endpoint, implement the polling logic with the 1 req/min/device rate limit.
3. Ensure the device is authorized via the Device Authorization API before querying.
4. Handle `DEVICE_OFFLINE` responses with exponential backoff retry logic.

## 6. Compatibility Notes

- API paths for existing endpoints are unchanged.
- The OAuth2 integration flow is unchanged.
- No existing fields are renamed or restructured.
- This release is purely additive.
