# Module 23 — Damage Reports & Recovery Tracking

The crisis doesn't end when the fire does. This module is the platform's long tail: recording what was lost, and making the slow repair visible so affected families aren't forgotten when the news cycle moves on.

---

## Damage Reports

### What it is
A structured loss declaration filed by an Affected Person (or by a clerk/Relay Captain on their behalf — the paper-to-platform path is first-class here): **what was damaged** (icon categories: 🏚️ home · 🐄 livestock · 🌳 orchard/olive trees · 🐝 beehives · 🚗 vehicle · 🏪 business/equipment), **how badly** (three-level: partial / severe / total), **where** (landmark cascade), **photos**, and contact. Each report becomes a case:

**Filed → Assessed (an assessor visited) → Aid-matched → Closed**

The platform is a *register and tracker*, not an adjudicator: it does not compute compensation or promise amounts. It gives the family a case number and a visible status, and gives assessing bodies (commune commissions, NGOs running aid programs) a deduplicated, located, photo-documented list instead of a stack of loose papers.

### Why it matters
After the 2021 fires, families queued for days to declare losses, declarations were lost or duplicated across bodies, and livestock/orchard losses — the actual economic destruction in Kabylie, where a burned olive grove is a decade of income — were undercounted because forms were built for houses. A digital case with photos, filed once and readable by every legitimate aid actor, shortens the queue and widens what gets counted. The status ladder answers the question that corrodes trust most in the aftermath: *"did my declaration go anywhere?"* Serves goals: **help affected families, increase transparency, improve coordination**.

### Who uses it
- **Affected Persons** file and track (phone-number identity, same as all citizen cases).
- **Relay Captains / center clerks** file on behalf of others (flagged "assisted"), including from the paper desk at the Local Emergency Center (module 21 flow hands off here).
- **Local Coordinators** see their sector's damage register; schedule/record assessor visits.
- **NGO Coordinators** running aid programs read the register (scoped, with consent captured at filing) to target help.
- **Admins** manage which bodies may read what.

### How the user interacts
Appears on the home screen only when a commune exits Crisis mode ("Declare damage" tile — the right feature at the right moment, invisible during the emergency). Filing is one screen per loss category: icons, three-level severity, photos, done. The case screen shows the ladder, the case number (big, copyable — families will read it over the phone to officials), and "what happens next" text per status.

### User flow
1. **Entry:** the fire is out; Crisis mode lifts in Aïn El Hammam. Aïcha's son opens NAJDA at her kitchen table → "Declare damage".
2. Files for her (flagged assisted): 🐝 beehives — total (12 hives), 🌳 olive trees — severe (~40 trees), photos of both. Case **#AEH-2214, Filed**.
3. Salim's damage register gains a row; the week's assessor route groups nearby cases → an assessor visits Tuesday, confirms on-site, taps **Assessed** with notes. Aïcha's son sees the status change and the meaning: "your declaration is verified — aid bodies can now see it".
4. An NGO agricultural-recovery program filters the register for 🐝 total losses in the wilaya → matches her case → **Aid-matched**: "Program X — replacement hives, contact: …" → delivery is a needs-board line like any other (module 16 lifecycle, confirmed by the family).
5. Case **Closed** with the outcome recorded. **Resolved state:** loss counted, aid traceable, and case #AEH-2214 answerable at any desk. *(Money-compensation branches leave the platform by design — the case notes "referred to commune commission" and tracks nothing further.)*

*Edge — disputed or inflated reports:* assessors mark discrepancies at the Assessed step; the case shows "assessed — differs from declaration" neutrally. The platform records both statements and adjudicates neither.

### Low-connectivity behavior
Filing queues offline (photos trail the text, as everywhere). The assessor's field view caches their day's route and syncs visits in the evening.

### Priority: **Medium**
Post-crisis timing, but the filing surface must be *ready before* the first season ends — data lost in the first post-fire week never comes back.

---

## Recovery Tracking

### What it is
A public, per-commune **recovery board** — the peacetime sibling of the statistics dashboard — showing the repair of what the fire broke, fed by the damage register and coordinator updates:

```
┌─────────────────────────────────────────┐
│ 🌱 RECOVERY — Aïn El Hammam             │
│ updated this week                       │
│                                         │
│ 🏚️ Homes: 34 damaged · 21 repairs       │
│    started · 9 families rehoused        │
│ 💧 Water network: restored (12 Oct)     │
│ ⚡ Electricity: restored                 │
│ 🐄 Livestock aid: 61 of 88 cases        │
│    aid-matched                          │
│ 🌳 Orchards: replanting program open —  │
│    register at APC desk                 │
│ 🏫 School: reopened 4 Oct               │
└─────────────────────────────────────────┘
```

Aggregate numbers come straight from damage-case statuses (nothing hand-tallied); infrastructure lines are posted by the Local Coordinator like community updates, but persistent.

### Why it matters
Recovery is where public attention and pressure evaporate — and with them, follow-through. A visible board does three things: tells scattered families whether home is livable again (many watch from relatives' houses in other wilayas); keeps aid bodies honest with public aid-matched counts; and gives the diaspora (Lynda) a constructive thing to watch and fund after the flames stop trending. It is the transparency goal applied to the slowest, least glamorous phase. Serves goals: **increase transparency, help affected families**.

### Who uses it
- **Affected families** — especially displaced ones deciding when to return.
- **Local Coordinators** — post infrastructure milestones; the board doubles as their public accountability page.
- **NGOs & donors** — see which recovery lines lag (the "61 of 88" gap is a fundable target, linking into module 17 campaigns).
- **Media & diaspora** — the long-tail story, citable like the dashboard.

### How the user interacts
"Recovery" tab appears for any commune that went through Crisis mode, linked from the commune's community-updates feed and from the wilaya dashboard drill-down. Read-only for citizens; coordinators edit infrastructure lines with the same template discipline as updates.

### User flow
1. **Entry:** a family displaced from Aïn El Hammam to relatives in Boumerdès checks the recovery board weekly.
2. Week 3: "💧 Water network: restored" appears → the father calls the neighbor to confirm the tap runs → they plan the return; the board's school-reopened line decides the date.
3. Meanwhile in Paris, Lynda sees "🌳 replanting program open" → the linked verified campaign (module 17) → funds olive saplings; the campaign's transparency feed later shows the delivery confirmed at the APC. **Resolved state (per line):** each recovery line eventually reads *restored / completed*; **(per commune):** when all lines close, the board archives into the season archive (module 22) — the record that the commune came back.

*Edge — stagnation:* a line untouched for a set period shows its age loudly ("no update in 6 weeks") — the board is honest about neglect, which is precisely its power.

### Low-connectivity behavior
Tiny text page, cached, age-stamped — readable on the worst connection in a relative's village.

### Priority: **Medium**
Follows the damage register (its data source). Cheap to build once cases and updates exist; its value compounds each season the platform persists.
