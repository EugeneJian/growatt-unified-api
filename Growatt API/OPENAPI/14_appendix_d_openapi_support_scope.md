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

| Product Family | Series | Model | Topology / Device Type | OpenAPI Support Status | OAuth2 Access | Device Info / Data | Dispatch | Readback | Push | Constraints / Notes | Evidence Source | Effective Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Inverter / PCE | MID 10-30KTL3-XH | MID 10KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 11KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 12KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 13KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 15KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 17KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 20KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 25KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MID 10-30KTL3-XH | MID 30KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN 7000-10000TL-X2 | MIN 10000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN 7000-10000TL-X2 | MIN 7000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN 7000-10000TL-X2 | MIN 8000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN 7000-10000TL-X2 | MIN 9000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN TL-XH2 | MIN 2500TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN TL-XH2 | MIN 3000TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN TL-XH2 | MIN 3600TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN TL-XH2 | MIN 4200TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN TL-XH2 | MIN 4600TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN TL-XH2 | MIN 5000TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MIN TL-XH2 | MIN 6000TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 10KTL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 3000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 4000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 5000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 6000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 7000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 8000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD | MOD 9000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 10KTL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 3000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 4000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 5000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 6000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 7000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 8000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | MOD-XA | MOD 9000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AU | SPA 3600TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AU | SPA 4000TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AU | SPA 4600TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AU | SPA 5000TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AU | SPA 6000TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AUB | SPA 3600TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AUB | SPA 4000TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AUB | SPA 4600TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AUB | SPA 5000TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPA 3000-6000 TL-AUB | SPA 6000TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPF | SPF 3000T HVM-G2 (AS4777-2 2020) | Stand - Alone PV Inverter With Grid Input | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPF | SPF 6000 ES PLUS (AS4777-2 2020) | Stand - Alone PV Inverter With Grid Input | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPF | SPF 6000T HVM-G2 (AS4777-2 2020) | Stand - Alone PV Inverter With Grid Input | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HU | SPH 3600TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HU | SPH 4000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HU | SPH 4600TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HU | SPH 5000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HU | SPH 6000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HUB | SPH 3600TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HUB | SPH 4000TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HUB | SPH 4600TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HUB | SPH 5000TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPH 3000-6000 TL-HUB | SPH 6000TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPM | SPM 10000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |
| Inverter / PCE | SPM | SPM 8000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU baseline seeded on 2026-04-24; OpenAPI pending confirmation. | CEC approved inverters list | TBD |

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
| `2026-04-24` | Seeded Appendix D with current CEC-listed Growatt inverter / PCE and battery product models; all OpenAPI fields remain pending confirmation |
