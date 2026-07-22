# Module 14 — Volunteer Management

Three features: the volunteer registry (who can help, with what), assignments (matching help to need), and the safety layer (bringing every volunteer home). One hard rule frames all three, stated in the UI itself:

> **NAJDA never sends volunteers to fight fire.** Firefighting is Protection Civile's job. NAJDA missions are support roles: evacuation assistance, supply transport, shelter staffing, cooking, care, cleanup. Volunteers died in the 2021 fires doing jobs that were never theirs; this platform will not repeat that.

---

## Volunteer Management (registry & verification)

### What it is
A registry where a Citizen becomes a **Verified Volunteer**: profile with skills picked from a fixed icon list (🚗 driver / 🛻 4x4 owner / ⛑️ first aid / 🍲 cooking / 💪 physical work / 🗣️ languages / 🩺 medical professional / 🪚 chainsaw-certified), availability (communes they can reach, days/times), and verification status. Verification = ID photo + phone confirmation + an in-person or video approval by a Local Coordinator or accredited NGO. Registration works in Calm mode (the right time) and Crisis mode (the real time — a surge-simplified version).

### Why it matters
In 2021, thousands of Yacines self-deployed on rumor: some saved lives, some clogged roads, some entered fire zones. The bottleneck was never willingness — it was knowing who is available, what they can do, and whether they can be trusted with a mission. Serves goals: **improve volunteer organization, improve coordination, reduce response time**.

### Who uses it
- **Citizens → Verified Volunteers** (Yacine): register, maintain profile.
- **Local Coordinators** (Salim) & **NGO Coordinators** (Nadia): verify volunteers, browse the registry filtered by skill/commune when planning.
- **Admins:** accredit the NGOs allowed to verify.

### How the user interacts
"Become a volunteer" → one-screen profile (skills = tap icons, communes = tap map, phone verify) → ID photo → status "Pending verification" with a clear explanation of who will contact them → after approval, badge + they start receiving mission notifications matching their skills/area. Profile has a big **Available / Not available** toggle — respected absolutely (no shaming, no streaks; an exhausted volunteer is a danger).

### User flow
1. **Entry:** Yacine sees the fires on the news, opens NAJDA → "Become a volunteer".
2. Picks 🚗 driver + 💪 physical work, taps his three reachable communes, verifies his phone, snaps his ID card.
3. Status: Pending. The queue routes him to the Croissant-Rouge committee (Nadia) as the nearest accredited verifier; she video-calls him same day, approves.
4. Badge granted. He toggles **Available**. **Resolved state:** Yacine is a dispatchable, trusted unit in the registry — before any mission exists.

*Crisis-surge variant:* during an active crisis, registration collapses to skills + phone + communes; ID verification happens at first mission muster, in person, by the Team Leader ("show your ID when you show up"). Surge volunteers get a provisional badge valid for supervised missions only.

### Low-connectivity behavior
Registration queues offline. The registry browse for coordinators is text-first.

### Priority: **High**
The registry must exist before the first assignment can be made; it is Phase 2's foundation stone.

---

## Volunteer Assignments

### What it is
Coordinators publish **missions**: a card with task icon, what/where/when, people needed by skill, muster point (landmark cascade), Team Leader, and safety notes. Volunteers see only missions matching their skills and communes; they tap **Accept** and the slot count decrements. A mission is a case: **Draft → Published → Staffed → In progress → Completed**.

```
┌────────────────────────────────────┐
│ 💧 Water distribution — Aït Yenni  │
│ Tomorrow 08:00 · meet: APC hall    │
│ Need: 4× 💪  2× 🚗  (3/6 filled)   │
│ Team Leader: Farid · ⛑️ on site    │
│ ⚠️ Support role — no fire contact  │
│         [ ACCEPT MISSION ]         │
└────────────────────────────────────┘
```

### Why it matters
"Where are volunteers needed" is one of the founding pain points. Missions convert coordinator intent into staffed, located, time-boxed work — and they are the mechanism that keeps willing people *out* of improvised danger by giving them a legitimate alternative. Serves goals: **improve volunteer organization, reduce response time, improve resource distribution**.

### Who uses it
- **Local Coordinators / NGO Coordinators** create missions (often directly from a case: an emergency request or supply request converts into a mission with one tap, pre-filled).
- **Verified Volunteers** browse/accept; **Team Leaders** run them.

### How the user interacts
Volunteers: notification "mission matches your profile" → mission card → Accept → mission appears in "My missions" with muster point on the map and the Team Leader's contact. On site: Team Leader taps the roster to check each volunteer in (this starts the safety clock, below). After completion: hours auto-logged to the profile.

### User flow
1. **Entry:** Salim has five water-distribution requests from Aït Yenni on the needs board (module 16). He taps "Create mission from request" → the card pre-fills; he sets tomorrow 08:00, APC hall muster, needs 4 physical + 2 drivers, assigns Farid as Team Leader.
2. Publish → every Available volunteer within the commune set with matching skills is notified. Yacine accepts a 🚗 slot. Card shows 6/6 → **Staffed**.
3. 08:00: Farid checks in the roster at the APC hall (Yacine shows his ID — his surge verification completes here). Mission → **In progress**.
4. Water delivered to the three distribution points; the linked supply requests update to Delivered (module 16).
5. Farid marks **Completed**, confirms all six volunteers checked out. Hours logged. **Resolved state:** mission archived, linked cases updated, volunteers released.

*Edge — understaffed mission:* if slots don't fill by a coordinator-set deadline, the notification radius widens one commune ring at a time, and the coordinator is prompted to split or reschedule. No mission launches below its safety-minimum staffing.

### Low-connectivity behavior
Accepted missions are cached in full (muster point, contacts, notes) — a volunteer driving into the mountains must not depend on signal to know where to go.

### Priority: **High**
Ships together with the registry; each is inert without the other.

---

## Volunteer Safety Check-in & SOS *(new feature — see doc 30 for rationale)*

### What it is
A safety layer that runs during every **In progress** mission: the Team Leader's roster check-in starts a check-in clock; at coordinator-set intervals (default 60 min for field missions) each volunteer's app prompts one tap — **"All good ✅"**. A missed check-in turns the volunteer amber on the Team Leader's roster; two missed turns them red and pings the coordinator. Every volunteer also has a **hold-to-activate SOS** button during missions: sends GPS + profile to Team Leader and coordinator simultaneously.

### Why it matters
Volunteers died in the 2021 Kabylie fires. A platform that mobilizes civilians into a disaster zone owes them the discipline professional teams get by radio. This feature is also the honest answer to "should we mobilize volunteers at all": yes, *because* we can track that they come back. Serves goals: **save lives (volunteers' lives), improve volunteer organization**.

### Who uses it
- **Verified Volunteers** (one tap per interval; SOS if in trouble).
- **Team Leaders** (roster board: green/amber/red per person).
- **Local Coordinators** (escalation target; can see all active mission boards in their sector).

### How the user interacts
Passive until a mission is In progress. Then: a scheduled buzz → giant ✅ button → done. SOS is on the mission screen, hold 3 seconds (prevents pocket triggers), then confirms loudly it was sent.

### User flow
1. **Entry:** automatic — Farid checks the roster in at muster; clocks start.
2. 60 min: everyone's phone buzzes; five green ✅ arrive; Yacine, driving a dead-signal valley, misses his → amber on Farid's board.
3. Farid tries calling — no signal. Policy on his screen: "amber = attempt contact; red = stop work, physically locate". Yacine's queued check-in fires the moment he regains signal → green again, incident self-resolves. (Queued check-ins carry their real timestamp — the board shows "checked in 12:03, delivered 12:20".)
4. Alternative branch: a volunteer twists an ankle upslope → holds SOS → Farid and Salim both get the pin → nearest teammates walk to the pin → resolved; SOS event logged on the mission.
5. Mission completes only when every roster member is checked **out**. **Resolved state:** zero unaccounted volunteers, safety log archived with the mission.

### Low-connectivity behavior
This is the feature designed *for* low connectivity: check-ins queue with true timestamps, the roster shows delivery lag explicitly, and mission areas known to be signal-dead get longer intervals plus a printed fallback (muster-point paper roster — the Team Leader's screen shows what to write down).

### Priority: **High**
Non-negotiable companion to assignments: the platform does not send people into a disaster zone without it.
