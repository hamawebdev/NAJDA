# Users & Roles

Every flow in the module specs uses the role names defined here. Roles are cumulative where noted; one person can hold several (a Shelter Manager is usually also a Verified Volunteer).

## Role & permission model

| Role | Who they are | Account? | Can do | Cannot do |
|---|---|---|---|---|
| **Citizen** | Anyone in Algeria (or abroad) using NAJDA without signing up | No | View everything public (map, alerts, shelters, roads, contacts, updates, dashboard); send emergency requests; report incidents; report/search missing persons; mark "I am safe"; flag misinformation | Verify anything; post updates; see personal data of others |
| **Affected Person** | A Citizen whose request/report created a case | No (phone number only) | Track their own case status; receive callbacks; file damage reports; check into shelters | See other people's cases |
| **Verified Volunteer** | Citizen who registered, listed skills, and passed ID verification | Yes | See and accept assignments; check in/out of missions; use safety check-in & SOS; log completed work | Create assignments; verify reports; access case queues |
| **Team Leader** | Experienced Verified Volunteer promoted by a Local Coordinator | Yes | Everything a Verified Volunteer can, plus: manage a team roster on a mission, receive overdue-check-in alerts, confirm mission completion | Create assignments outside their mission; verify public reports |
| **NGO Coordinator** | Staff of an accredited association (e.g., Croissant-Rouge local committee) | Yes (organization account) | Post & claim supply requests; run distribution points; publish verified donation campaigns; register volunteer groups; post community updates in their sector | Issue alerts; verify fire reports; access medical records |
| **Shelter Manager** | The person physically running a shelter (often a school director or APC employee) | Yes | Register/update their shelter (status, capacity, needs); run the shelter check-in registry; post supply requests for the shelter | Manage other shelters; issue alerts |
| **Medical Coordinator** | Physician/nurse/pharmacist attached to a facility or medical NGO | Yes | Update facility status board; view & claim medical-tagged requests and medical needs queue; manage medical volunteer roster | See non-medical case queues; issue alerts |
| **Local Coordinator** | The platform's anchor in one commune — typically APC civil-protection focal point or a recognized community leader | Yes | Triage the commune's emergency-request queue; verify reports in their sector; draft & issue alerts (Red alerts need second approval); create volunteer assignments; activate Crisis mode (with Admin co-sign); promote Team Leaders; manage local centers & distribution points | Act outside their sector; delete cases (only close with reason) |
| **Moderator** | Trained platform staff/volunteers working the national verification queues | Yes | Verify/reject incident reports, road statuses, community updates; screen missing-person reports for privacy/abuse; handle misinformation flags; co-approve Red alerts | Local operational decisions (assignments, shelters) |
| **Admin** | Small national platform team | Yes | Manage roles & accreditation; co-sign Crisis mode activation; configure wilayas/communes; audit logs | Bypass the verification ladder silently — every admin override is publicly logged as such |
| **Relay Captain** *(new — see doc 30)* | Trusted local person who relays platform info verbally to low-literacy neighbors | Yes (lightweight) | Receive priority notifications for their village; mark "relayed to neighborhood"; submit reports on behalf of others | Verify anything |

**Case ownership rule:** every case (emergency request, missing person, supply request, damage report) has exactly one owning role at any time, and the owner is shown on the case. Handoffs are explicit ("transferred to Medical Coordinator — 14:32") so nothing silently falls between chairs.

## Personas

These seven people appear by name throughout the module flows. They are composites of real user situations from recent Algerian fire seasons.

### Aïcha — 67, villager, Aïn El Hammam (Tizi Ouzou)
Speaks Kabyle and Darja; reads very little. Has a low-end Android phone she uses for calls and voice messages. Lives alone; her son works in Algiers. **She must be able to:** understand an evacuation alert (spoken, not read), press one button to ask for help, and be findable by her son. If a feature doesn't work for Aïcha, it fails principle 2.

### Yacine — 22, student volunteer, Béjaïa
Comfortable with phones, energetic, zero formal training. In 2021 he drove supplies into the mountains guided by contradictory Facebook posts. **He must be able to:** register once, prove who he is, see missions that match his skills (driver, strong back), and never be accidentally sent toward a fire front.

### Karim — 35, school director, Bouira
His school becomes a shelter every bad season. He manages 200 evacuees with a paper notebook. **He must be able to:** declare his shelter open, keep an occupancy count with two buttons, ask for blankets without phoning six people, and check people in so families can find them.

### Nadia — 41, logistics officer, Croissant-Rouge local committee
Coordinates trucks, warehouses, and donors. Her enemy is the unrequested truckload of used clothes blocking the loading bay. **She must be able to:** see real, quantified, located needs; claim them so no one else duplicates; and mark delivery so the requester confirms.

### Salim — 50, APC employee & Local Coordinator, Larbaâ Nath Irathen
The human switchboard of his commune during a crisis. **He must be able to:** see every open request in his sector on one screen, triage in seconds, verify what locals report, and issue an evacuation alert in under two minutes.

### Dr. Meriem — 38, physician, Tizi Ouzou hospital
During fires she fields calls about burns, smoke inhalation, and dialysis patients cut off from care. **She must be able to:** see medical-tagged requests in one queue, tell the network which facility can take burn patients right now, and route insulin to the shelter that flagged the need.

### Lynda — 29, diaspora, Paris
Wants to help from abroad and shares everything she sees. **She must be able to:** watch the verified picture (map, dashboard), give to accredited campaigns with visible follow-through, and *not* amplify rumors — the verification badges are for her too.

## Account & verification of people (summary)

- Citizens: no account, ever, for critical actions (principle 3).
- Volunteers: register in-app → ID document photo + phone verification → approved in person or by video by a Local Coordinator or accredited NGO → badge "Verified Volunteer".
- Organizations: accreditation dossier reviewed by Admin (legal registration, references) → organization account with named staff.
- Coordinators & Moderators: appointed by Admin; identity known to the platform team; their verifications are logged and auditable.
