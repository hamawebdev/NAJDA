# Module 16 — Resources & Distribution

Five features around one object: the **needs board** — the single national list of open, quantified, located supply needs. Everything requested lives there once; everything donated or distributed traces back to a line on it. This is the design weapon against the two classic disaster-logistics failures: *duplicate asks* (six phone chains request blankets for the same shelter) and *unrequested surplus* (trucks of clothes nobody asked for).

Supply lifecycle, used by every feature below:

```
Open → Claimed → In transit → Delivered → Confirmed (by requester)
                                        ↘ Disputed (didn't arrive / wrong item)
```

---

## Resource Management

### What it is
A simple inventory board kept by each supply-holding node — shelter, local emergency center, NGO warehouse — using **category chips, not spreadsheets**: for each category (💧 water, 🍲 food, 🛏️ blankets/bedding, 🧴 hygiene, 💊 medical basics, ⛽ fuel, 🔦 equipment) the keeper sets one of three levels: **🟢 Enough / 🟠 Low / 🔴 Out**, with an optional rough count. Coordinators see a sector grid: nodes × categories, colored.

### Why it matters
Coordinators today allocate blind — they learn a shelter is out of water when someone drives there. A three-level chip is coarse, but it is *maintainable under stress*, and a maintained coarse signal beats an abandoned precise one. The grid tells Salim and Nadia where to push stock **before** requests turn urgent. Serves goals: **improve resource distribution, improve coordination, increase transparency**.

### Who uses it
- **Shelter Managers / Local Coordinators / NGO Coordinators** keep their own node's chips current (10 seconds after each meal service or truck arrival).
- **Local & NGO Coordinators** read the sector grid to plan pushes and missions.

### How the user interacts
On Karim's "Needs" tile: a category list with three-position sliders. Setting a category to 🔴 prompts — never forces — "post a supply request for this?". The sector grid for coordinators is read-only with tap-through to each node.

### User flow
1. **Entry:** evening meal service ends; Karim slides 🍲 food from 🟢 to 🟠 and 💧 water to 🔴. Ten seconds.
2. The 🔴 prompt suggests a supply request; he accepts → pre-filled request (below) goes to the needs board.
3. Nadia's morning grid shows water 🔴 at one shelter, 🟠 at two more in the same valley → she plans one truck for all three instead of three reactive trips. **Resolved state:** stock pushed ahead of shortage; chips flip back to 🟢 on delivery confirmation.

### Low-connectivity behavior
Chips update offline and sync with age shown on the grid ("as of 2 h ago").

### Priority: **High**

---

## Supply Requests

### What it is
A structured ask posted to the needs board by an authorized role: **category + quantity + urgency (🔴 24 h / 🟠 3 days / 🟢 ongoing) + deliver-to point (shelter/center, landmark cascade) + contact**. Anyone fulfilling — NGO, coordinator, or vetted donor via module 17 — must **Claim** the line first, which locks the quantity (or a partial split) and stamps their name on it. The requester confirms receipt to close the loop.

### Why it matters
"What supplies are urgently required" is a founding pain point. The claim-lock is the single mechanism that prevents both duplication (two NGOs buying the same 80 blankets) and black holes (everyone assuming someone else took it). Confirmation-by-requester is the transparency spine donations hang on. Serves goals: **improve resource distribution, improve coordination, increase transparency**.

### Who uses it
- **Posters:** Shelter Managers, Local Coordinators, Medical Coordinators (medical lines auto-tag to module 18), NGO Coordinators.
- **Fulfillers:** NGO Coordinators primarily; Local Coordinators; donors via the donation flow (module 17).
- **Citizens** see an aggregated public view (what's needed where — feeding donations) but cannot claim directly without the module 17 flow.

### How the user interacts
Posting is a one-screen form, usually pre-filled (from a 🔴 chip, or from a shelter's Needs tile). The board for fulfillers is filterable by sector/category/urgency, sorted urgency-first; each line shows its lifecycle state and holder. **Split-claim** lets two fulfillers take 50/30 of an 80 line.

### User flow
1. **Entry:** Karim's water request: 💧, 500 L/day, 🔴 24 h, deliver CEM Ibn Khaldoun. Board line: **Open**.
2. Nadia claims it (full quantity) → **Claimed — Croissant-Rouge Bouira** → invisible to other fulfillers' "open" filter; Karim sees who's coming.
3. Truck loads → she taps **In transit** (Karim sees ETA note).
4. Arrival → she marks **Delivered** → Karim's app prompts him → he taps **Confirm** → line closes; his 💧 chip flips 🟢. **Resolved state:** need met, publicly traceable end to end.
5. *Dispute branch:* if nothing arrives by the urgency deadline, the line auto-flags → both parties pinged → Karim can tap **Not received** → line reopens at top priority with its history attached (no silent starvation, no quiet blame).

*Edge — stale requests:* lines unclaimed past their urgency window escalate to the wilaya-level coordinator view and are highlighted in the public donations view (module 17): unmet urgent needs are the loudest thing on the board.

### Low-connectivity behavior
Posts and state changes queue; board views cache with age. A claim made offline is provisional ("pending sync — may conflict") and confirmed on sync, first-writer-wins with instant notify to the loser.

### Priority: **High**
The needs board is the heart of the logistics half of NAJDA.

---

## Water Distribution

### What it is
A public layer (map 💧 + list) of **water distribution points**: where, when, what form (tanker truck stop / bottled handout / refill station), operated by whom. Points are created by Local Coordinators or NGO Coordinators; recurring schedules supported ("tanker at the mosque square, daily 15:00"). Citizens see points near them and get an optional "water point today" reminder for points they star.

### Why it matters
Fires cut village water networks (burned pipes, dead pumps, contaminated sources) and summer heat makes water the first survival supply. Today tanker schedules travel mouth-to-mouth and people miss them. Serves goals: **help affected families, improve resource distribution, save lives**.

### Who uses it
- **Citizens** find points; **Relay Captains** announce them verbally (doc 30).
- **Local/NGO Coordinators** create and update points; often staffed via volunteer missions (module 14).

### How the user interacts
Map layer 💧 or home tile "Water & food today" (Crisis mode): a plain list — "💧 Mosque square, today 15:00, tanker (Croissant-Rouge)". Tap → detail with landmark, schedule, "was it there?" feedback thumb (miss-reports flag the point to its operator — self-healing data).

### User flow
1. **Entry:** Aïn El Hammam's pump station burned. Salim creates a point: tanker, mosque square, daily 15:00, source: ADE truck + NGO bottles.
2. Point appears on map/list; the Relay Captain of Taourirt Mokrane gets the priority notification and announces it at the café and the mosque.
3. Aïcha's neighbor stars the point → daily 14:30 reminder.
4. One day the tanker breaks down → Salim edits the point ("today cancelled — tomorrow 10:00") → starred users notified, Relay Captain re-announces. **Resolved state (per day):** water collected; **(per crisis):** network repaired → Salim archives the point.

### Low-connectivity behavior
Points and schedules cache aggressively (they change slowly); reminders fire from the cached schedule.

### Priority: **High**

---

## Food Distribution

### What it is
The same distribution-point machinery as water, category 🍲: hot-meal services, dry-ration handouts, bakery coordination — plus a **shelter-kitchen view** in which shelters serving meals publish times so nearby non-sheltered affected families (people sleeping at relatives', guarding their homes) know they can come eat.

### Why it matters
Food aid in past seasons was the most duplicated *and* most gapped resource: five grill teams in one village, none in the next. Putting meal points on the same board as needs lets coordinators see coverage geographically. The non-sheltered are the invisible hungry — the shelter-kitchen view is for them. Serves goals: **help affected families, improve resource distribution**.

### Who uses it
- **Citizens** (sheltered and not) find meals; **Shelter Managers** publish kitchen times; **NGO/Local Coordinators** run points and see the coverage map.

### How the user interacts
Identical to water (same tile, 🍲 filter). Coordinators get a coverage view: meal points vs. affected-population areas, gaps highlighted.

### User flow
1. **Entry:** a charity kitchen wants to serve in the valley. Their NGO Coordinator proposes a point; Salim activates it where the coverage view shows a gap (Aït Yenni — nothing) instead of the already-served center.
2. Point published: "🍲 Hot meals, Aït Yenni school yard, 12:30 daily".
3. Families guarding undamaged homes nearby see it and come. Thumb-feedback confirms it ran. **Resolved state:** meals land where the gap was, not where the cameras are.

### Low-connectivity behavior
Same as water.

### Priority: **High**

---

## Fuel Distribution

### What it is
Coordinator-managed allocation of fuel (diesel/petrol/butane) in cut-off areas: a **restricted layer**, not a public free-for-all — points visible publicly only when a public point exists (rare); mostly it is a needs-board category where generators (shelter power, water pumps, clinics) and response vehicles get priority, allocated by the Local Coordinator.

### Why it matters
When roads close, stations run dry; generators at shelters and clinics die first. Public "free fuel here" announcements cause dangerous crowds — hence the restricted design: fuel is coordinated as a resource line, not advertised as a distribution point. Serves goals: **improve resource distribution, improve coordination**.

### Who uses it
- **Shelter/Medical/Local/NGO Coordinators** post fuel lines on the needs board (always with purpose: "diesel 200 L — shelter generator").
- **Local Coordinators** approve allocations; volunteer driver missions (module 14) move it.
- **Citizens:** see public butane-bottle points when coordinators open one; otherwise fuel needs route through an emergency request.

### How the user interacts
Needs-board category ⛽ with an extra required field: purpose. Allocation approval sits with the coordinator (a second-look rule, like RED alerts, because fuel is the most divertable resource).

### User flow
1. **Entry:** Karim's shelter generator has 6 hours of diesel. Needs tile → ⛽ 200 L, purpose "generator — 230 people sheltered", urgency 🔴.
2. Salim approves the allocation from the commune's coordinated stock; a driver mission moves two barrels; lifecycle to **Confirmed** as usual. **Resolved state:** generator running; allocation publicly logged (transparency against diversion suspicions).

### Low-connectivity behavior
Standard needs-board behavior.

### Priority: **Medium**
Vital when it matters, but narrower than water/food and deliberately coordinator-gated; ships on the same needs-board rails, so its marginal cost is low.
