# Appendix D OpenAPI Product Support Scope

**Version**: draft  
**Status**: Pending model confirmation  
**Purpose**: This appendix records which Growatt products are confirmed to support the public OpenAPI integration scope at model level. It is intended to serve as a contract-facing and customer-facing attachment that can be updated as support is confirmed.

---

## 1. Scope

- This appendix covers only public Growatt OpenAPI support scope.
- It does not, by itself, confirm VPP readiness, DNSP enrollment, CEC compliance, or market-program eligibility.
- A product should be marked as supported only after written vendor confirmation, official published documentation, or successful live integration validation.
- If support differs by firmware, cloud region, plant type, or topology, those constraints must be recorded in the notes column.

---

## 2. Status Definitions

| Status | Meaning |
| :--- | :--- |
| `Confirmed` | Confirmed to support the listed OpenAPI scope based on official evidence or completed validation |
| `Partial` | Supports only part of the listed OpenAPI scope, such as monitoring-only without dispatch |
| `Planned` | Planned or verbally indicated, but not yet confirmed by official evidence |
| `Not Supported` | Confirmed not to support the listed OpenAPI scope |
| `Pending Confirmation` | Still under collection or awaiting confirmation |

---

## 3. OpenAPI Capability Matrix

Initial product baseline for this appendix is seeded from the current Australian CEC Growatt product lists checked on `2026-04-24`:

- `61` inverter / PCE entries
- `50` battery entries
- All rows below are initialized as `Pending Confirmation` until OpenAPI support is confirmed model by model

### 3.1 Inverters / PCE

#### 3.1.1 Residential Hybrid Storage Inverters

| Series | Models | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback Verification | Data Push | Constraints / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| SPH/SPA TL | SPH 3000-6000TL BL; SPH 3000-6000 TL BL-UP; SPH 6000 TL US; SPA 1000-3000TL BL; SPA 3000TL BL-UP | Confirmed | Supported | Supported | Supported | Supported | Supported | SPA/SPH series do not currently support reading discharge cutoff SOC and backup cutoff SOC fields |
| SPH TL-HU | SPH 3000-6000TL HU; SPH 3000-6000TL HUB | Confirmed | Supported | Supported | Supported | Supported | Supported | SPA/SPH series do not currently support reading discharge cutoff SOC and backup cutoff SOC fields |
| SPH/SPA TL3-UP | SPH 4000-10000TL3 BH; SPH 4000-10000TL3 BH-UP; SPA 4000-10000TL3 BH; SPA 4000-10000TL3 BH-UP | Confirmed | Supported | Supported | Supported | Supported | Supported | SPA/SPH series do not currently support reading discharge cutoff SOC and backup cutoff SOC fields |
| SPA TL-AU | SPA 3000-6000TL AU; SPA 3000-6000TL AUB | Confirmed | Supported | Supported | Supported | Supported | Supported | SPA/SPH series do not currently support reading discharge cutoff SOC and backup cutoff SOC fields |
| SPH-HU | SPH 8-10KTL-HU-US; SPH 8-10KTL-HU-US(B); SPH 8-10KTL-HU; SPH 12-18KTL-HU-US | Confirmed | Supported | Supported | Supported | Supported | Supported | SPA/SPH series do not currently support reading discharge cutoff SOC and backup cutoff SOC fields |
| SPM-HU | SPM 8-10KTL-HU(AU); SPM 6-10KTL-HU(EU); SPM 8-10KTL-HU(UK); SPM 3000-6000TL-HU; SPM 3000-6000TL-HU(BR); SPM 3000-6000TL-HU2; SPM 8-10KTL-HU2; SPM 3000-6000TL-HU(IT); SPM 2500-6000TL-HU(EU); SPM 8-10KTL-HU(CL) | Confirmed | Supported | Supported | Supported | Supported | Supported | None |

#### 3.1.2 Residential Battery-Ready Inverters

| Series | Models | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback Verification | Data Push | Constraints / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| MIN-XH | MIN 2500-6000TL-XH2; MIN 2500-6000TL-XH/XE/XA | Confirmed | Supported | Supported | Supported | Supported | Supported | None |
| MIN-XH US | MIN 3000-11400TL-XH US; MIN 3000-11400TL-XH2 US | Confirmed | Supported | Supported | Supported | Supported | Supported | None |
| MIN-XH JP | MIN 6000TL-XH-JP | Confirmed | Supported | Supported | Supported | Supported | Supported | None |
| MOD-XH/MID-XH | MOD 3-10KTL3-XH/BP; MID 11-30KTL3-XH; MID 8-15KTL3-XHL/JP | Confirmed | Supported | Supported | Supported | Supported | Supported | None |
| MOD/MID-HU | MOD 3-15KTL3-HU; MID 33-50KTL3-HU | Confirmed | Supported | Supported | Supported | Supported | Supported | None |
| WIT 25K HU/XHU | WIT 4-15K-HU; WIT 17-25K-HU; WIT 4-25K-XHU | Confirmed | Supported | Supported | Supported | Supported | Supported | None |

#### 3.1.3 Commercial Storage Inverters

| Series | Models | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback Verification | Data Push | Constraints / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| WIS/WIT 100K | WIS 100K-AM; WIT 50-100K-H/HE/HU/A/AE/AU; WIT 50-100K-H/HE/HU/A/AE/AU-US; WIT 28-55K-H/HE/HU/A/AE/AU-US L2 | Confirmed | Supported | Supported | Supported | Supported | Supported | None |
| WIT XHU | WIT 29.9-50K-XHU | Confirmed | Supported | Supported | Supported | Supported | Supported | None |
| WIS 125K | WIS 125K-AM | Confirmed | Supported | Supported | Supported | Supported | Supported | None |

### 3.2 Batteries

| Product Family | Series | Model | Topology / Device Type | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback | Push | Constraints / Notes | Evidence Source | Effective Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Battery | ALP | ALP 10.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 15.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 20.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 25.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 30.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 35.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 40.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 45.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 5.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP | ALP 50.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 10.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 15.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 20.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 25.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 30.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 35.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 40.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 45.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 5.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | ALP LV | ALP 50.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 10.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 10.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 15.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 15.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 20.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 20.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 25.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 25.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 30.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 5.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX | APX 5.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S1 | APX 10.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S1 | APX 15.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S1 | APX 20.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S1 | APX 25.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S1 | APX 30.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S1 | APX 5.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 10.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 10.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 15.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 15.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 20.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 20.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 25.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 25.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 30.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 30.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 5.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX S2 | APX 5.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |
| Battery | APX (CEC source series = APXAPX) | APX 30.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved batteries list | TBD |

---

## 4. How To Fill This Appendix

- Add one row per exact supported model unless support is explicitly confirmed at series level.
- If a whole series is supported, still note the exact model range in the `Model` column.
- If a model supports monitoring only, mark `Dispatch`, `Readback`, and `Push` separately instead of using a single blanket status.
- If support is region-specific, record the target region in `Constraints / Notes`.
- If support depends on firmware, ShineServer, plant registration type, or installer configuration, that dependency must be recorded.

---

## 5. Required Input From Product / Platform Team

- Confirmed supported product families, series, and exact model numbers
- Whether support includes monitoring only or also dispatch and readback
- Any region-specific limitations such as AU / EU / global cloud differences
- Any firmware, cloud, logger, or registration prerequisites
- Effective date for customer-facing publication

---

## 6. Editorial Notes

- This appendix should be maintained as a live compatibility attachment.
- CEC listing, VPP participation, and OpenAPI support should be tracked as separate dimensions.
- If a product appears in a regulatory or compatibility list but has no confirmed OpenAPI capability, keep it out of the `Confirmed` scope until OpenAPI evidence is available.

---

## 7. Change Record

| Date | Change |
| :--- | :--- |
| `2026-07-20` | Updated Section 3.1 "Inverters/PCE" with 31 series from Lark DTC Model Database with full OpenAPI capability support |
| `2026-04-24` | Seeded Appendix D with current CEC-listed Growatt inverter / PCE and battery product models; all OpenAPI fields remain pending confirmation |
