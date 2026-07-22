# Module 20 — Incident Reporting

## Incident Reporting ("Report a Fire")

### What it is
The platform's eyes: any Citizen reports a fire — or another hazard — in three taps, no account. Report types:

| Icon | Type | Feeds |
|---|---|---|
| 🔥 | Fire / smoke | The live map (module 10) via the verification ladder |
| 🛣️ | Blocked road | Road segments (module 19) |
| ⚡ | Downed power line / pylon | Coordinator queue → utility liaison |
| 🏚️ | Dangerous structure | Coordinator queue |

The fire report asks exactly three things, all tappable: **size** (icon scale: 💨 smoke only / 🔥 small — one tree or bush / 🔥🔥 large — treeline or approaching houses), **location** (GPS pre-fill + landmark cascade), **photo** (optional, sent after). Every report enters as ⚪ Unverified and climbs the ladder (principle 5): 3+ independent reports in the same area auto-raise to 🟡 community-corroborated; a Moderator or Local Coordinator confirmation makes it 🟢/🔴 Verified and it becomes a first-class fire object on the map, linked to alerts.

**The report screen's first line is a tap-to-call button for Protection Civile (14/1021), with:** "Call first if the fire threatens lives. Then report here so everyone can see it." NAJDA augments the emergency call, never competes with it.

### Why it matters
Early detection is the cheapest firefighting there is — a fire reported at 💨 smoke-only size is a shovel job; the same fire an hour later is an airtanker job. Today early sightings die in phone calls and Facebook posts that responders never aggregate. Citizen reports are also the raw feed that keeps the map honest, and the corroboration ladder is what turns unreliable individual reports into reliable collective knowledge without waiting for officialdom. Serves goals: **save lives, reduce response time, reduce misinformation**.

### Who uses it
- **Citizens** (anyone with eyes and a phone — shepherds, drivers, farmers are the real early-warning network).
- **Moderators & Local Coordinators:** work the verification queue; their confirmation gates map/alert promotion.
- **Relay Captains** (doc 30): report on behalf of neighbors who call them.
- **Coordinators downstream:** verified reports seed fire objects, alert drafts, and mission planning.

### How the user interacts
Crisis-mode home button **🔥 REPORT A FIRE** (Calm mode: same button, one level down). Tap → size icons → location screen (GPS dot on a mini-map + "wrong? fix it" cascade) → **Send**. Photo prompt appears *after* sending. Reporter's screen shows their report's ladder state and — the retention hook — what happened: "Your report was confirmed. Fire crews were informed." People who see their report *matter* report again.

The Moderator/Coordinator queue view clusters reports by proximity + time ("4 reports, same ridge, 25 min") with photos side by side, one-tap actions: **Confirm as new fire** (creates the map object) / **Attach to existing fire** (it's the known one, seen from another village) / **Reject** (with reason: duplicate / not a fire / test).

### User flow
1. **Entry:** a shepherd above Aït Yenni sees smoke on the ridge at 11:40. Taps 🔥 REPORT A FIRE → 💨 smoke only → GPS is right, adds landmark "above the Tala spring" → Send. Total: ~20 seconds. Also calls 14 — the button was right there.
2. Report enters ⚪. Salim's queue shows it muted. 11:52: two more reports, same ridge — a driver (🔥 small) and a farmer with a photo → auto-cluster → 🟡 community-corroborated → queue row turns loud.
3. Salim calls the Protection Civile liaison — they have the shepherd's call too, a truck is rolling. Salim taps **Confirm as new fire** → 🔴 Verified fire object appears on the national map: "Active — small, Tala ridge, verified 12:02".
4. The shepherd's screen: "Confirmed. Crews informed." The village sees a verified marker instead of six contradictory WhatsApp voice notes.
5. The fire is doused by 14:00; the liaison confirms → Salim flips the object to ⚪ Extinguished. **Resolved state:** fire lifecycle closed on the map; all source reports archived against it; three reporters got closure screens.

*Duplicate storm (big visible fire):* hundreds of reports of an already-Verified fire auto-attach to the existing object by proximity — the queue shows "212 reports attached" as a signal of public attention, not 212 rows of noise.

*False/prank reports:* photo-less reports that contradict a fresh Verified "no fire" check are rejected with reason; numbers with repeated rejected reports get shadow-deprioritized in clustering (their reports still enter, weighted less — never silently blocked, because today's prankster is tomorrow's genuine witness).

### Low-connectivity behavior
The report core (type, size, location) is a tiny payload that queues and sends first; the photo follows whenever it can. A queued report shows the honest "saved — will send" state with the tap-to-call 14 button prominent (the call network often survives where data dies).

### Priority: **Critical**
The map (Critical) is downstream of this feature; without citizen reports NAJDA sees only what officials publish, which is exactly the status quo the platform exists to fix.
