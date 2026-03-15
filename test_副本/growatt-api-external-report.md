# Growatt API Test Report (External Summary)

## Overview

- Test date: 2026-03-12
- Test environment: `https://api-test.growatt.com:9290`
- Test mode: OAuth2 `client_credentials`
- Test scope:
  - Access token retrieval
  - Test device binding
  - Device information query
  - Device telemetry query

## Executive Summary

The end-to-end validation on the Growatt test environment was successful.

The following capabilities were verified:

- Successfully obtained `access_token`
- Successfully bound two test devices
- Successfully queried device information
- Successfully queried device telemetry data

Conclusion:

- The test environment is available for integration verification.
- The `token -> bindDevice -> getDeviceInfo -> getDeviceData` workflow is operational.

## Test Devices

To avoid exposing sensitive identifiers, device serial numbers are masked below:

- Device A: `SPH:YRP***00Q`
- Device B: `SPM:HCQ***SJ1`

Note:

- The user-facing labels include prefixes such as `SPH:` and `SPM:`
- The actual API request for binding and query uses the raw SN without the prefix

## Validation Results

### 1. Access Token

- Endpoint: `POST /oauth2/token`
- Result: Success
- Outcome: `access_token` returned normally

### 2. Device Binding

- Endpoint: `POST /oauth2/bindDevice`
- Result: Success
- Outcome: Both test devices were successfully authorized

### 3. Device Information

- Endpoint: `POST /oauth2/getDeviceInfo`
- Result: Success
- Outcome: Device profile fields were returned for both devices

### 4. Device Telemetry

- Endpoint: `POST /oauth2/getDeviceData`
- Result: Success
- Outcome: High-frequency telemetry was returned for both devices

## Key Device Findings

### Device A

- Device type: `sph`
- Model: `SPH 5000TL-HUB`
- Rated power: `6000`
- Datalogger type: `ShineWiLan-X2`
- Battery: Present
- Battery capacity: `9000`
- Authorization status: `authFlag=true`

### Device B

- Device type: `sph`
- Model: `SPH 10000TL-HU (AU)`
- Rated power: `15000`
- Datalogger type: `ShineWiLan-X2`
- Battery: Present
- Battery capacity: `4500`
- Authorization status: `authFlag=true`

## Telemetry Highlights

### Device A

- Timestamp: `2026-03-12 12:03:10`
- Battery SOC: `60`
- PV power: `18.00`
- Load power: `18.20`
- Status: `9`

### Device B

- Timestamp: `2026-03-12 10:46:17`
- Battery SOC: `56`
- Battery power: `15.00`
- PV power: `5.00`
- Status: `0`

## Final Assessment

This round of validation confirms that the Growatt test environment on port `9290` supports:

- token acquisition
- device authorization
- device information retrieval
- device telemetry retrieval

The environment is ready for continued integration and business-side validation.
