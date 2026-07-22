# Module 18 — Medical Coordination

## Medical Coordination

### What it is
The medical lane of the platform — four connected surfaces, all owned by **Medical Coordinators** (Dr. Meriem's role):

1. **Medical request queue.** Every emergency request tagged 🚑 (module 12) lands here *simultaneously* with the local coordinator's queue. Typed sub-tags: 🔥 burn, 🌫️ smoke inhalation, 💉 chronic-care interruption (dialysis, oxygen, insulin), 🤰 obstetric, 🧠 psychological distress.
2. **Facility status board.** Each participating hospital/clinic/polyclinic posts what it can take *right now*: "🔥 burns: 2 beds · 🌫️ smoke: yes · ⚗️ dialysis: full — send to CHU Tizi Ouzou". Only Medical Coordinators at each facility update their own row; every row shows age.
3. **Medical needs queue.** Medication and equipment needs (insulin at a shelter, oxygen concentrator, burn dressings) — needs-board lines (module 16) auto-tagged 💊, visible to medical fulfillers (pharmacies, PCH-connected NGOs) with an extra rule: medication lines are claimable **only by medically accredited fulfillers**.
4. **Medical volunteer roster.** Verified Volunteers with the 🩺 professional tag (physician/nurse/pharmacist — credential checked at verification) visible to Medical Coordinators for shelter rounds, distribution-point stations, and evacuation support missions.

**The platform does not carry clinical records.** Case notes are minimal-operational ("dialysis patient, 3 sessions/week, last session Monday"); the platform routes people to care, it doesn't chart them.

### Why it matters
Fire medicine is two waves: the acute wave (burns, smoke) that needs *routing to the right facility* — a burn patient driven to a clinic with no burn capacity loses hours that cost skin and lives — and the silent wave (interrupted chronic care) that kills quietly days later: the dialysis patient behind a closed road, the insulin that outlived its cold chain, the oxygen concentrator with no electricity. Today both waves are handled by personal phone networks of doctors like Meriem. Serves goals: **save lives, reduce response time, improve coordination**.

### Who uses it
- **Medical Coordinators** (Dr. Meriem): the whole surface — triage the queue, keep their facility's row fresh, claim/route medical needs, deploy medical volunteers.
- **Citizens:** only ever see the 🚑 button (module 12) — the medical machinery is invisible to them, by design.
- **Shelter Managers** (Karim): flag medical needs from the shelter (one button on the check-in registry line: "⚕️ needs medical attention").
- **Verified Volunteers (🩺)**: receive medical missions.
- **Local Coordinators** (Salim): see that medical cases are owned (case ownership rule), coordinate transport for medical evacuations.

### How the user interacts
Meriem's screen is three tabs: **Queue** (medical requests, severity-sorted, each with callback button and "route to facility" action fed by the status board), **Facilities** (the board — her own row editable, big toggles per capability), **Needs & people** (medical needs lines + the 🩺 roster). Karim interacts through one button per registry line. Citizens interact through module 12 only.

### User flow
*Acute — burn routing:*
1. **Entry:** a man burned on forearms while defending his house; his cousin taps 🆘 → 🚑 → sub-tag 🔥 burn → location → send. (Three taps + one.)
2. The case lands in Salim's queue *and* Meriem's medical queue. Meriem acknowledges → owns the medical decision (ownership handoff logged; Salim's row shows "medical: owned by Dr. M.").
3. She checks the facility board: local polyclinic 🔥 burns: no → CHU row: burns 2 beds ✓ (updated 15 min ago). Calls the cousin: "Go directly to CHU, emergency entrance, they're expecting you" — and marks the routing on the case.
4. Salim's side arranges transport (volunteer 🚗 mission with a 🩺 nurse volunteer aboard, since the road passes a checkpoint).
5. Arrival → CHU coordinator decrements their burn-bed row → case **Resolved**. **Resolved state:** patient at the *right* door, both queues closed, bed count true.

*Silent wave — chronic care:*
1. **Entry:** Karim's registry — an evacuee's line gets the ⚕️ flag: "diabetic, insulin left at home, none since yesterday."
2. Flag creates a 💉 chronic case in Meriem's queue + auto-drafts a 💊 needs line (insulin, cold chain, deliver: CEM shelter).
3. An accredited pharmacy NGO claims the line; a 🩺 volunteer nurse on shelter rounds administers and checks the other 230 evacuees' chronic needs while there — Meriem converts her findings into three more needs lines. **Resolved state:** the silent wave surfaced and supplied before it became ambulances.

*Edge — no Medical Coordinator active in a wilaya:* medical-tagged cases fall back to the Local Coordinator's queue with a visible "no medical owner" warning, and the national Moderator desk is pinged to recruit/activate one. The lane degrades to the general lane, never to a void.

### Low-connectivity behavior
The facility board is tiny text — cached with age prominently displayed ("bed counts as of 40 min ago — call before dispatching"). Queue actions sync like all cases. The 🚑 request itself inherits module 12's queue-first offline behavior.

### Priority: **High**
Rides on Critical rails (module 12) and turns them into correct medical outcomes; the facility status board is the piece with no existing substitute anywhere in the current ecosystem.
