# Growatt Open API Documentation Change Notice (Customer-Facing)

Release date: 2026-04-24

Applicable audience: platform customers, aggregators, VPP partners, and technical integration teams that have already integrated with, or are planning to integrate with, the Growatt Open API.

## 1. Overview

This update aligns the public API documentation with the latest published device-setting baseline and the latest integration findings.

The main updates in this release are:

- Device dispatch and dispatch read-back documentation has been synchronized to the latest public settings baseline.
- The English naming for the anti-backflow setting has been unified as `export_limit` / `exportLimitEnabled`.
- The public dispatch `setType` list has been expanded from 3 items to 7 items.
- The `readDeviceDispatch` response documentation now explicitly states that the `data` field may return different structures depending on `setType`, instead of assuming an array-only response.

## 2. Key Changes

### 2.1 Export-limit naming update

The previous public documentation used the following anti-backflow names:

- `anti_backflow`
- `antiBackflowEnabled`

These have now been updated to:

- `export_limit`
- `exportLimitEnabled`

Notes:

- The public documentation now uses `Export Limit` as the standard term.
- For new integrations and future maintenance, we recommend standardizing on `export_limit`.

### 2.2 Public dispatch `setType` list expanded to 7 items

The current public documentation now includes the following 7 dispatch `setType` values:

1. `time_slot_charge_discharge`
2. `duration_and_power_charge_discharge`
3. `export_limit`
4. `enable_control`
5. `active_power_derating_percentage`
6. `active_power_percentage`
7. `remote_charge_discharge_power`

The following items have been newly added to the public documentation:

- `enable_control`
- `active_power_derating_percentage`
- `active_power_percentage`
- `remote_charge_discharge_power`

### 2.3 Dispatch read-back structure clarification

For `POST /oauth2/readDeviceDispatch`, the `data` field is now explicitly documented as one of the following, depending on `setType`:

- Array
- Object
- Scalar number

Examples:

- `time_slot_charge_discharge`: typically returns an array
- `export_limit`: typically returns an object
- `enable_control`: typically returns a scalar number

As a result, if your platform performs response parsing, validation, or comparison on dispatch read-back results, we recommend handling `data` by `setType` instead of assuming a single fixed structure.

## 3. Main APIs Affected

This documentation update mainly affects the interpretation and implementation of the following public APIs:

- `POST /oauth2/deviceDispatch`
- `POST /oauth2/readDeviceDispatch`

The following supporting documentation pages were also updated:

- Global Parameters
- ESS Terminology Glossary
- ESS Semantic Model
- Quick Guide / Unified API summary documentation

## 4. Impact on Customers

### 4.1 For new integrations

We recommend implementing directly against the latest documentation and no longer using the old `anti_backflow` naming.

### 4.2 For existing integrations

If your current implementation still uses the following names from the previous documentation:

- `anti_backflow`
- `antiBackflowEnabled`

we recommend reviewing and updating your documentation and code mappings, and validating the change in your test environment before switching to:

- `export_limit`
- `exportLimitEnabled`

If your platform currently supports only the original 3 `setType` values, we also recommend adding recognition and compatibility handling for the 4 newly documented public settings.

### 4.3 For dispatch read-back logic

If your platform automatically parses, validates, or compares `readDeviceDispatch.data`, please review the following:

- Whether your logic assumes that `data` is always an array
- Whether all `setType` values are validated against one fixed JSON schema
- Whether object-shaped and scalar-number responses are both supported

## 5. Recommended Actions

We recommend that customers complete the following checks in a future release:

1. Update the `setType` enumeration list for `deviceDispatch` and `readDeviceDispatch`.
2. Update anti-backflow related field mappings to `export_limit` / `exportLimitEnabled`.
3. Adjust `readDeviceDispatch.data` parsing logic so it handles array, object, and scalar-number responses by `setType`.
4. Add parameter validation and integration tests for the 4 newly documented public settings.
5. If you maintain an API gateway, SDK, or any secondary abstraction layer, update the corresponding external-facing documentation as well.

## 6. Compatibility Notes

This release is primarily a documentation synchronization update intended to align the public docs with the latest published settings baseline.

Please note:

- API paths have not changed.
- The OAuth2 integration model has not changed.
- The main changes are concentrated in dispatch parameter enums, field naming, and dispatch read-back structure documentation.
- If your implementation strictly depends on the old naming or a fixed response structure, adaptation is still required.

## 7. Suggested External Messaging

If you need a short version for business or project communication, you may use the following wording:

"This Growatt Open API documentation update mainly adds the latest public dispatch settings and standardizes the naming of the export-limit setting. For new integrations, we recommend following the latest documentation directly. For existing integrations, we recommend reviewing dispatch parameter enums, replacing the old naming with `export_limit`, and confirming compatibility with the `readDeviceDispatch` response structure."

## 8. Recommended Announcement Focus

If this notice is sent together with the latest documentation update, we recommend highlighting the following three points:

- The anti-backflow naming has been updated to `export_limit`
- The public dispatch `setType` list has been expanded to 7 items
- `readDeviceDispatch.data` should no longer be treated as array-only by default
