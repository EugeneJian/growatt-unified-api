# Growatt Open API Documentation Change Notice (Customer-Facing)

Release date: 2026-07-17

Applicable audience: platform customers, aggregators, VPP partners, and technical integration teams that have already integrated with, or are planning to integrate with, the Growatt Open API.

## 1. Overview

This update adds a set of new fields to the device-info and device-data APIs for VPP aggregator integration, covering site location information, discharge cut-off SOC, maximum battery charge/discharge power, and today's PV generation.

The main updates in this release are:

- `getDeviceInfo` now returns site name, latitude/longitude, timezone, and discharge cut-off SOC fields.
- `getDeviceData` and the device-data push payload now include maximum battery charge/discharge power and today's PV generation.
- The push payload fields stay aligned with the `getDeviceData` query fields.

## 2. Key Changes

### 2.1 New `getDeviceInfo` fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `siteName` | string | Name of the site (plant) the device belongs to |
| `latitude` | string | Site latitude in decimal degrees |
| `longitude` | string | Site longitude in decimal degrees |
| `timezone` | string | Site UTC offset in hours |
| `dischargeCutOffSOC` | int | Battery discharge cut-off SOC in percent |
| `backupCutOffSOC` | int | Off-grid (backup) discharge cut-off SOC in percent |

Notes:


### 2.2 New `getDeviceData` and push payload fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `maxChargePower` | int | Maximum battery charge power in W |
| `maxDischargePower` | int | Maximum battery discharge power in W |
| `epvToday` | double | PV generation today in kWh |

Notes:

- `maxChargePower` / `maxDischargePower` are not available on SPA/SPH models.
- The device-data push payload stays aligned with the `getDeviceData` response, so the new fields also appear in push messages.

## 3. Affected APIs

This documentation update mainly affects the following public APIs:

- `POST /oauth2/getDeviceInfo`
- `POST /oauth2/getDeviceData`
- Device-data push payload

## 4. Impact on Customers

### 4.1 New integrations

We recommend implementing against the latest documentation directly and including the new fields in your data model and parsing logic.

### 4.2 Existing integrations

- All changes are additive response fields. API paths, request parameters, and the meaning of existing fields are unchanged, so existing parsing logic is not affected.
- If your platform applies strict JSON schema validation (rejecting unknown fields) to responses or push payloads, please allow or add the new fields to avoid validation failures.
- Use `siteName`, `latitude`, `longitude`, and `timezone` when you need to report timestamps in local time or match user billing addresses.
- `dischargeCutOffSOC` is the battery discharge cut-off SOC; `backupCutOffSOC` is the off-grid (backup) discharge cut-off SOC.

## 5. Recommended Customer Actions

1. Update the field-mapping tables for `getDeviceInfo` / `getDeviceData` / push payloads to include the new fields.
2. Check that payload validation logic tolerates the new fields.
3. For SPA/SPH models, confirm your handling of missing `maxChargePower` / `maxDischargePower` values.
4. If you maintain an API gateway, SDK, or wrapper layer, update its external documentation accordingly.

## 6. Compatibility Notes

- API paths are unchanged.
- The OAuth2 integration flow is unchanged.
- This release is purely additive; no existing fields are renamed or restructured.
- Some new fields vary by device model (see Section 2); we recommend treating them as optional fields in your parsers.
