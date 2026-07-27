# Appendix D OpenAPI Supported Inverter Models

**Version**: v1.0

**Status**: Customer Integration Reference

**Purpose**: List inverter / PCE model ranges with confirmed Growatt public OpenAPI capabilities.

> **How to read:** Every row in this appendix is confirmed. A `✓` in the OpenAPI Support Status column means the row is confirmed. In capability columns, `✓` means supported and `!` means supported with model-specific field limitations; see the row notes for details.

---

## 1. Scope

- This appendix lists inverter / PCE model ranges confirmed for Growatt public OpenAPI integration.
- Support applies to the exact model range and constraints recorded in each row.
- It does not, by itself, confirm VPP readiness, DNSP enrollment, CEC compliance, or market-program eligibility.
- Customers should use this matrix together with the endpoint documentation and their onboarding confirmation.

---

## 2. Capability Legend

| Icon | Location | Meaning |
| :---: | :--- | :--- |
| `✓` | OpenAPI Support Status | The listed inverter / PCE model range is confirmed |
| `✓` | Capability column | The capability is supported |
| `!` | Capability column | Supported with model-specific field limitations; see the row notes |

Model names are shown as code labels, one model per line.

---

## 3. Supported Inverter / PCE Models

This matrix contains 12 confirmed inverter / PCE model groups. Use the constraints and notes in each row when determining deployment compatibility.

### 3.1 Inverters / PCE

#### 3.1.1 Residential Hybrid Inverters

| Reference ID | Series | Models | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback Verification | Data Push | Constraints / Notes |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INV-001 | SPH TL | `SPH 3000-6000TL BL` `SPH 3000-6000 TL BL-UP` `SPH 6000 TL US` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH models do not provide `maxChargePower` or `maxDischargePower` |
| INV-002 | SPH TL-HU | `SPH 3000-6000TL HU` `SPH 3000-6000TL HUB` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH models do not provide `maxChargePower` or `maxDischargePower` |
| INV-003 | SPH TL3-UP | `SPH 4000-10000TL3 BH` `SPH 4000-10000TL3 BH-UP` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH models do not provide `maxChargePower` or `maxDischargePower` |
| INV-004 | SPH-HU | `SPH 8-10KTL-HU-US` `SPH 8-10KTL-HU-US(B)` `SPH 8-10KTL-HU` `SPH 12-18KTL-HU-US` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH models do not provide `maxChargePower` or `maxDischargePower` |
| INV-005 | SPM-HU | `SPM 8-10KTL-HU(AU)` `SPM 6-10KTL-HU(EU)` `SPM 8-10KTL-HU(UK)` `SPM 3000-6000TL-HU` `SPM 3000-6000TL-HU(BR)` `SPM 3000-6000TL-HU2` `SPM 8-10KTL-HU2` `SPM 3000-6000TL-HU(IT)` `SPM 2500-6000TL-HU(EU)` `SPM 8-10KTL-HU(CL)` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |

#### 3.1.2 Residential Battery-Ready Inverters

| Reference ID | Series | Models | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback Verification | Data Push | Constraints / Notes |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INV-006 | MIN-XH | `MIN 2500-6000TL-XH2` `MIN 2500-6000TL-XH/XE/XA` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| INV-007 | MIN-XH US | `MIN 3000-11400TL-XH US` `MIN 3000-11400TL-XH2 US` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| INV-008 | MIN-XH JP | `MIN 6000TL-XH-JP` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| INV-009 | MOD-XH/MID-XH | `MOD 3-10KTL3-XH/BP` `MID 11-30KTL3-XH` `MID 8-15KTL3-XHL/JP` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| INV-010 | MOD/MID-HU | `MOD 3-15KTL3-HU` `MID 33-50KTL3-HU` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |

### 3.2 All-in-one Energy Storage

| Reference ID | Series | Models | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback Verification | Data Push | Constraints / Notes |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| AIO-001 | MINA | `MINA 3-10KTL-HU` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |
| AIO-002 | MODA | `MODA 4-15KTL3 HU` `MODA 10-15KTL3 H` `MODA 10-15KTL3 HU` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | None |

---

## 4. VPP Integration Exclusions

The following product categories are excluded from VPP integration scope:

- **SPA, WIT, WIS series and balcony storage products**: These residential storage inverter models and balcony storage systems do not support VPP dispatch capabilities.
- **PV-only inverters**: Not recommended for VPP integration as they lack battery interface and cannot provide dispatchable storage services.

---

## 5. Customer Compatibility Check

For a deployment-specific decision:

1. Confirm the assigned production service region and OAuth client.
2. Confirm the device appears in the authorized device list.
3. Record `model`, `communicationVersion`, `unifiedAPIver`, `deviceVersion`, and `datalogVersion` from `getDeviceInfo`.
4. Treat model-dependent telemetry fields as optional.
5. Validate every required `setType` on the target model and read the value back before production dispatch.
6. Apply documented per-device rate limits.

Published model difference: SPH models do not provide `maxChargePower` or `maxDischargePower`.

## 6. Change Record

| Date | Change |
| :--- | :--- |
| `2026-07-27` | 1) Expanded MODA series models; 2) Added VPP integration exclusions guidance |
| `2026-07-23` | Added VPP integration exclusion guidance: clarified SPA/WIT/WIS series and PV-only inverters do not support VPP dispatch |
| `2026-07-23` | Removed all SPA, WIT, WIS models; updated series names and renumbered INV references; count from 15 to 10 |
| `2026-07-22` | Published the inverter-only support matrix with compact status icons, SPA/SPH field-limitation indicators, and one-model-per-line labels |
| `2026-07-20` | Updated inverter / PCE entries from the DTC model register |

## Related Documentation

- [Device Authorization API](./04_api_device_auth.md)
- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)
- [Device Dispatch API](./05_api_device_dispatch.md)
- [Appendix E API Rate Limiting](./15_api_rate_limiting.md)
- [Global Parameters](./10_global_params.md)
