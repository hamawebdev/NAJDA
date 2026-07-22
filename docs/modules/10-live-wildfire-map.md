# Module 10 — Live Wildfire Map

## Live Wildfire Map

### What it is
A national map showing every known fire as a colored marker with a status — **Active 🔴 / Contained 🟠 / Extinguished ⚪** — plus toggleable layers for everything a person under threat needs in the same view: open shelters, road status, distribution points, and local emergency centers. Each fire marker carries its verification badge and age ("verified · updated 18 min ago"). The map is fed by verified incident reports (module 20) and coordinator updates — it shows what the platform *knows*, with honesty about how fresh that knowledge is.

The map always opens paired with a **plain-language status banner** for the user's own area, because the most common question is not "where are all the fires" but "am I in danger":

```
┌──────────────────────────────────────────┐
│ 📍 Your area: Aïn El Hammam              │
│ 🔴 ACTIVE FIRE 4 km away — Tala Guilef   │
│    direction. Verified 12 min ago.       │
│ ▶ 🔊 Listen   ▶ 🏠 Nearest shelter        │
└──────────────────────────────────────────┘
```

### Why it matters
"Where are the fires happening?" is the first question of every stakeholder and today it is answered by rumor. A single trustworthy map removes the deadliest information gap and is the surface almost every other module hangs off (shelters, roads, requests). Serves goals: **save lives, reduce response time, reduce misinformation, improve coordination**.

### Who uses it
- **Citizens** (Aïcha, and her son in Algiers watching her village) — "is my family's area threatened, where do they go?"
- **Verified Volunteers / Team Leaders** (Yacine) — see where help is concentrated before accepting missions.
- **Local Coordinators** (Salim) and **NGO Coordinators** (Nadia) — the shared operating picture for decisions.
- **Diaspora & media** (Lynda) — the verified public picture that displaces rumor screenshots.

### How the user interacts
- Opens from the home screen ("Map · Shelters · Roads" button in Crisis mode). Centers on GPS location, or asks once for wilaya → commune (remembered).
- Status banner on top (as above), map below. Pinch/zoom standard.
- **Layer chips** across the bottom, icon-first: 🔥 Fires · 🏠 Shelters · 🛣️ Roads · 💧 Distribution · 🏢 Centers. One tap toggles each.
- Tap a fire marker → **detail card**: status, verification badge, age, affected communes, spread direction if known, linked active alert, and two actions — "Nearest shelter" and "Report an update" (feeds module 20).
- A **"Watch this area"** star on any commune subscribes the user to its alerts (module 11) — this is how Aïcha's son watches her village from Algiers.
- Prominent **"My village isn't shown"** entry that opens the list view with commune search — the map must never strand someone whose area has no marker.

### User flow
*Primary flow — threatened citizen:*
1. **Entry:** Aïcha's son (Citizen, in Algiers) hears of fires near his mother's village; opens NAJDA → taps "Map".
2. Searches "Aïn El Hammam" in the commune picker → map centers, banner reads: 🔴 Active fire 4 km away, verified 12 min ago.
3. Taps the fire marker → detail card: contained on the north flank, spreading east; alert level Orange for the commune.
4. Taps "Nearest shelter" → shelter card for the CEM in the commune center: Open, has space (module 15).
5. Taps "Watch this area" → he now receives every alert for the commune.
6. Calls his mother with concrete facts and the shelter name. **Resolved state:** user leaves with a verified answer ("threatened, where to go") instead of a rumor.

*Coordinator flow:* Salim (Local Coordinator) opens the map filtered to his sector each morning of the crisis → sees two active fires, one shelter near capacity, one road closed → uses it to decide the day's assignments (module 14). The map is his dashboard; every marker links into the owning module.

*Edge — no data for an area:* commune has no markers → banner says "No reports for this area. This means no reports — not certainty of safety." with the Report a Fire button one tap away. The map never displays absence of data as safety.

### Low-connectivity behavior
Map tiles are the first thing dropped: the same content renders as a **list view per commune** (fires, shelters, roads as text rows with badges and ages). Last-loaded data stays visible, watermarked "Loaded 40 min ago — may be outdated". The status banner is always text and loads first.

### Priority: **Critical**
The shared operating picture; the module most other modules render onto. Without it, NAJDA is another information fragment.
