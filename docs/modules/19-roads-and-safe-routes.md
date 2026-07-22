# Module 19 — Roads & Safe Routes

Two features on one dataset: the status of **road segments** (stretches between two named places — "RN15 between Larbaâ Nath Irathen and Aïn El Hammam"). Segments, not pins, because that's how people describe roads and how closures actually work.

---

## Road Closures

### What it is
A live layer (map 🛣️ + list) of road-segment statuses:

| Status | Meaning |
|---|---|
| 🟢 Open | Confirmed passable |
| 🟠 Risky | Passable but hazardous — smoke, embers, emergency traffic; avoid unless necessary |
| 🔴 Closed | Blocked — fire, barrier, fallen trees/poles |
| ⚪ Unknown | No fresh report — treat with caution |

Statuses follow the verification ladder: a citizen report marks a segment ⚪→ candidate (muted), corroboration raises it, a Local Coordinator or Moderator confirmation makes it Verified. **Freshness decays visibly**: a 🟢 not re-confirmed within its decay window (short during active fires) drops to ⚪ "last confirmed 3 h ago". A road layer that lies about freshness kills people; this one wears its age on every segment.

### Why it matters
"Which roads are safe" is a founding pain point, and the deadliest one: in past seasons families fled *into* fire on roads that a village 5 km away already knew were cut. Closures also silently reshape everything else — which shelter is reachable, whether the water tanker arrives, whether the ambulance route holds. Serves goals: **save lives, reduce response time, improve coordination**.

### Who uses it
- **Citizens** evacuating or moving between villages; relatives guiding them remotely.
- **Coordinators of every kind** — alerts reference roads to avoid (module 11), the shelter finder demotes unreachable shelters (module 15), missions route drivers (module 14).
- **Reporters:** any Citizen ("blocked road" in module 20's hazard types), volunteers on the move (the best sensors — they drive these roads all day), coordinators.

### How the user interacts
Map layer 🛣️ colors the segments; list view groups by axis ("RN15: 2 segments closed, 1 risky"). Tap a segment → status, badge, age, cause ("fallen pylon"), and **"Report a change"** (two taps: "I passed — it's open" / "It's blocked"). Volunteers returning from missions get a one-tap prompt: "How was the road you took?" — harvesting freshness from the people already moving.

### User flow
1. **Entry:** a volunteer driver hits fallen trees on the CW9 above Aït Yenni. Taps the segment → "It's blocked" → photo → send. Segment: ⚪→ candidate 🔴 (muted, "1 report, 10 min ago").
2. A second driver and a resident report the same → 🟡 community-corroborated → Salim sees it in his verification queue, calls the APC road officer → confirms → **Verified 🔴**, cause noted.
3. Downstream, automatically: the shelter finder demotes the shelter behind that segment; Salim's next alert template pre-loads "avoid CW9"; an open water-delivery mission through CW9 pings its Team Leader to re-route.
4. Next day the trees are cleared; the road officer reports open → Salim re-confirms → 🟢 with fresh timestamp. **Resolved state:** segment reopened; the closure's full history remains in the log.

*Edge — conflicting reports:* simultaneous "open" and "blocked" reports on one segment force status to ⚪ Unknown + priority-flag to the coordinator queue. The platform never averages contradictions into false confidence.

### Low-connectivity behavior
Road list per wilaya is small text — cached with age banner ("road data as of 50 min ago"). Reports queue with true timestamps.

### Priority: **Critical**
The information whose absence most directly kills during evacuation.

---

## Safe Routes

### What it is
Guidance built on the segments: the user picks where they are and where they need to go (shelter — usually pre-filled by the alert or shelter finder — or a major town), and NAJDA shows **the recommended route using only 🟢 segments**, as a landmark-based instruction list plus map line:

```
┌──────────────────────────────────────┐
│ To: CEM shelter, commune center      │
│ ✅ Recommended route (all open,      │
│    freshest check 20 min ago):       │
│ 1. Take the Aït Yenni road SOUTH     │
│ 2. At Taguemount crossroads → LEFT   │
│ 3. Enter center via stadium road     │
│ ⚠️ Do NOT take CW9 — closed (trees)  │
│ Conditions change fast. If you see   │
│ fire or smoke ahead: turn back.      │
│ ▶ 🔊 Listen  ▶ Recheck before leaving│
└──────────────────────────────────────┘
```

Design stance: **guidance, not gospel.** Every route carries the freshness of its weakest segment, a recheck button, the turn-back rule, and — when any leg is ⚪ Unknown — a demoted tone: "No fully-confirmed route. Least-risky option shown. Call the emergency center before travelling: [tap-to-call]". The instruction list is written in landmarks (principle 6) and has a 🔊 listen button so a driver or a low-literacy user can follow by ear.

### Why it matters
Closures tell you what *not* to do; a fleeing family needs what *to* do, and they need it phrased the way a neighbor would say it. This is also what the RED alert's "Route to shelter" button opens — the last link in the evacuation chain. Serves goals: **save lives, help affected families**.

### Who uses it
- **Citizens/Affected Persons** evacuating (the family from module 15's flow); relatives guiding by phone from afar reading the same route.
- **Volunteers/NGO drivers** routing deliveries (their completion reports feed segment freshness back — the loop closes).

### How the user interacts
Entry points: RED alert → "Route to shelter"; shelter card → "Route"; home map → "Get me to…". Origin defaults to GPS/last commune; destination from context. One screen out, listen button, recheck button. No turn-by-turn navigation pretensions — it is a checked route sketch, honest about its limits.

### User flow
1. **Entry:** the Aït Yenni father (module 15 flow) taps "Route" on the CEM shelter card.
2. Route computes over 🟢 segments: south road → Taguemount crossroads → stadium road; CW9 explicitly flagged as the trap to avoid. Weakest-leg freshness: 20 min.
3. He taps 🔊 and lets it read aloud while he loads the car; his brother in Algiers opens the same shelter card and sees the identical route — one truth, two screens.
4. Before departing he taps **Recheck** → still green → drives. Passes the Taguemount crossroads where a volunteer flagman (mission-deployed) confirms flow.
5. Arrives; Karim checks the family in. His route screen offers one tap back: "Was your route clear?" → ✅ → both segments' freshness updates. **Resolved state:** family sheltered; the road data is fresher *because* they used it.

*Edge — route goes bad mid-journey:* if a segment on an actively-viewed route flips 🔴, the route screen re-alerts loudly and re-computes; if no alternative exists, it says exactly that plus tap-to-call for the emergency center — the platform never invents a way out that isn't verified.

### Low-connectivity behavior
A computed route caches entirely (it must survive the signal-dead valley). The cached view shows its computed-at age and downgrades its own confidence language as it ages.

### Priority: **High**
Builds directly on Critical closure data; ships one step behind it because a safe-route engine on stale segments is more dangerous than no engine.
