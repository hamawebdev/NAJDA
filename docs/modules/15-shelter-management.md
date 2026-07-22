# Module 15 — Shelter Management

Two features, two very different users: the **public shelter finder** (a frightened family's question: "where do we go?") and **shelter operations** (Karim's question: "how do I run this school-turned-shelter without drowning?").

---

## Shelter Finder (public)

### What it is
A public directory and map layer of shelters, each with a status chip and the three facts an evacuating family needs:

```
┌──────────────────────────────────────┐
│ 🏠 CEM Ibn Khaldoun — commune center │
│ 🟢 OPEN — space available            │
│ 🍲 Meals ✓   🛏️ Beds ✓   🩺 Nurse ✓  │
│ Updated 20 min ago by shelter staff  │
│ ▶ 🗺️ Route   ▶ 📞 Call               │
└──────────────────────────────────────┘
```

Status values: 🟢 **Open — space** / 🟠 **Open — nearly full** / 🔴 **Full** (with "nearest alternative" link) / ⚫ **Closed**. Statuses come only from the Shelter Manager or Local Coordinator — never from rumor — and show their age.

### Why it matters
"Where are shelters located" is a founding pain point, and wrong shelter information is uniquely cruel: it sends exhausted families across closed mountain roads to locked doors. Evacuation alerts (module 11) point at shelters; this directory is what they point *to*. Serves goals: **save lives, help affected families, reduce misinformation**.

### Who uses it
- **Citizens/Affected Persons** evacuating, and relatives guiding them remotely (Aïcha's son picked her shelter from Algiers).
- **Coordinators** when writing alerts (the alert composer warns if the chosen shelter is Full).
- **Volunteers/NGOs** delivering to shelters.

### How the user interacts
From the map (🏠 layer), from any alert's "Route to shelter" button, or from the home screen "Find shelter". List is sorted by distance from the user's commune, **reachability-aware**: a shelter behind a Closed road (module 19) is demoted and marked "⚠️ road to this shelter reported closed".

### User flow
1. **Entry:** ORANGE alert tells a family in Aït Yenni to prepare. Father opens "Find shelter".
2. List: nearest is 🔴 Full → automatically shows "nearest alternative: CEM Ibn Khaldoun, 🟢 Open, 9 km, road open (confirmed 30 min ago)".
3. Taps Route → safe-route view (module 19). Drives the family there.
4. On arrival, Karim checks them in (below). **Resolved state:** family sheltered, check-in feeds reunification (module 13).

*Edge — no open shelter in range:* the finder never dead-ends; it shows the Local Emergency Center contact (module 21) with tap-to-call: "No open shelter nearby — call the commune coordination center."

### Low-connectivity behavior
The shelter list for the user's wilaya is cached aggressively with visible age; it is among the first content prefetched when an area enters Crisis mode.

### Priority: **Critical**
Alerts without a working "where to go" answer are half an evacuation.

---

## Shelter Operations (manager side)

### What it is
Karim's one-screen command post:

- **Status & capacity:** the shelter's public chip, and an occupancy counter operated with two giant buttons — **[+] arrived / [−] left** — that's the whole interface for the most-updated number. Capacity threshold auto-flips the public chip to "nearly full"/"Full".
- **Check-in registry:** name + approximate age + village of origin per person or family group (one line each, voice-note fallback). Feeds the reunification matcher (module 13). An "assisted safe check-in" button marks a guest safe on their behalf.
- **Needs:** posts supply requests to the needs board (module 16) with the shelter pre-filled as delivery point; sees pledge/delivery status.
- **People power:** requests shelter-staffing volunteer missions (module 14) with one tap ("need 3 people tonight, 2 cooking 1 cleaning").
- **Registration:** a shelter is registered by its manager and **activated by the Local Coordinator** (who confirms it's real, reachable, and safe — a shelter is a Verified item like everything else).

### Why it matters
Shelters are where every module converges: evacuees arrive (12), families search (13), volunteers staff (14), supplies land (16), medical needs surface (18). If the manager's tooling is harder than a paper notebook, the platform loses its most important data source. Every element here is designed to be *less* work than the notebook. Serves goals: **improve coordination, help affected families, improve resource distribution**.

### Who uses it
- **Shelter Managers** (Karim) — the whole surface.
- **Local Coordinators** (Salim) — activate shelters, see all shelter statuses in sector, reassign flows when one fills.
- **NGO Coordinators** (Nadia) — read needs and delivery points.

### How the user interacts
A dedicated "My shelter" screen, four tiles: **Count** (the two buttons + big number), **People** (check-in list), **Needs** (post/track), **Help** (request volunteers). Everything else is elsewhere. Designed for a shared tablet at the entrance table as much as for Karim's phone.

### User flow
1. **Entry:** evacuation alert issued for the neighboring douars. Salim calls Karim: "open the school." Karim taps "Open my shelter" → status flips 🟢, capacity 250 set at registration.
2. Families arrive. At the entrance table: [+] per person, one registry line per family ("Aïcha B., ~67, Taourirt Mokrane" — voice note). Count: 178.
3. The matcher flags Aïcha against a missing-person case → Karim confirms → reunification flow completes (module 13).
4. Blankets run low → **Needs** tile → "Blankets, 80, urgent, deliver: CEM Ibn Khaldoun" → onto the needs board; Nadia's committee claims it within the hour; Karim sees "pledged — arriving tonight".
5. Count hits 230 → public chip auto-flips 🟠 "nearly full"; Salim sees it and edits tonight's alert template to point at the next shelter.
6. Three days later, families return or relocate: [−] as they leave; at zero, Karim taps **Close shelter** → chip ⚫, open needs auto-cancelled with notice to claimants. **Resolved state:** shelter closed clean — no ghost "open" shelters haunting next week's map.

### Low-connectivity behavior
The counter and registry work fully offline on the entrance tablet and sync whenever signal appears; the public chip shows the sync age ("count as of 25 min ago"). Needs posts queue.

### Priority: **High**
The public finder is Critical and can launch with coordinator-updated statuses alone; the full ops surface follows immediately after — it is what makes shelter data self-sustaining.
