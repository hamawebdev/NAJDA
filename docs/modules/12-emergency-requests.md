# Module 12 — Emergency Requests

## Emergency Requests ("I Need Help")

### What it is
The red button. A Citizen in danger or in need presses **🆘 I NEED HELP**, picks what kind from an icon grid, confirms where, and the request is live in a coordinator's triage queue — no account, no form, under 30 seconds. Request types:

| Icon | Type | Routed to |
|---|---|---|
| 🚨 | Trapped / evacuation needed | Local Coordinator, flagged for responder liaison |
| 🚑 | Medical emergency | Local Coordinator **and** Medical Coordinator queue (module 18) |
| 🧓 | Vulnerable person needs evacuation help | Local Coordinator (cross-checks vulnerable registry, doc 30) |
| 💧 | Urgent water / food | Local Coordinator → needs board (module 16) if systemic |
| 🐄 | Livestock in danger | Local Coordinator, low-priority lane (never outranks people) |

Every request becomes a **case** with a visible status ladder: **New → Acknowledged → Assigned → In progress → Resolved / Closed (with reason)**. The requester sees the same ladder — the platform never swallows a call for help silently.

**NAJDA is not a replacement for calling Protection Civile (14).** The request screen says so, shows the number as a tap-to-call button, and positions NAJDA requests as the coordination layer — especially for the flood of non-life-threatening needs that today jam the 14 line.

### Why it matters
Today "who needs help" lives in phone calls that reach one person and die there. Requests get lost, duplicated, or answered twice while the next village gets nothing. A single triaged queue per commune is the difference between coordination and heroic chaos. Serves goals: **save lives, reduce response time, improve coordination, help affected families**.

### Who uses it
- **Citizens / Affected Persons** (Aïcha) — file and track requests.
- **Local Coordinators** (Salim) — own the triage queue for their sector.
- **Team Leaders / Verified Volunteers** — receive requests converted into assignments (module 14).
- **Medical Coordinators** (Dr. Meriem) — medical-tagged requests appear in their queue simultaneously.

### How the user interacts
*Citizen:* 🆘 button (home screen, tap 1) → icon grid of the five types (tap 2) → location screen pre-filled by GPS or last-used commune, one landmark line, phone number field remembered from any previous use (tap 3 = send). After sending: a case screen with the status ladder, "someone will call you back", and the option to add a photo/detail/voice note *after* the request is already in the queue (principle 1: detail is post-hoc, never a precondition).

*Coordinator triage queue:* one screen, newest and most severe on top, color-coded by type, each row: type icon, age, village, landmark, phone. Row actions: **Acknowledge** (requester's screen updates instantly), **Call** (tap-to-dial), **Assign** (pick a Team Leader/volunteer mission or hand to responder liaison), **Merge** (duplicate of an existing case), **Close** (with reason picker: resolved / could not reach / withdrawn / invalid).

### User flow
*Primary flow:*
1. **Entry:** Aïcha hears the RED alert, cannot leave (no car). Taps 🆘 → 🧓 "Cannot evacuate alone" → screen shows her commune already picked (GPS), she speaks a voice note instead of typing the landmark ("house behind the old fountain, Taourirt Mokrane") → Send. Three taps plus a voice note.
2. Her case appears at the top of Salim's queue (RED-zone origin auto-boosts severity). Status: **New**.
3. Salim taps **Acknowledge** → Aïcha's screen: "Salim's team has seen your request" — with the callback promise. He taps **Call**, confirms details in Kabyle.
4. Salim taps **Assign** → attaches the case to an evacuation-assistance mission; a Team Leader with a neighbor's car accepts (module 14). Status: **Assigned → In progress**.
5. Volunteer picks Aïcha up, drops her at the CEM shelter; Shelter Manager Karim checks her in (module 15) — the check-in auto-suggests resolving her case.
6. Salim confirms → **Resolved**. Aïcha's son, watching the commune, can find her via reunification (module 13).

*Duplicate flow:* three neighbors file for the same trapped family → queue groups them by proximity + landmark similarity → Salim taps **Merge** → one case, three reporter phone numbers attached, all three see the same status.

*Abuse/prank mitigation:* callback-first culture (a request that can't be reached by phone is deprioritized, not deleted); repeat numbers filing invalid requests get flagged to the coordinator; no public visibility of requests (only coordinators see the queue), so there is no audience for pranks.

*Edge — no coordinator active in a commune:* queue escalates: unacknowledged requests above a severity threshold auto-notify the neighboring communes' coordinators and the national Moderator desk after a short timer. A request must never sit in an unwatched queue.

### Low-connectivity behavior
The request payload is tiny and sends first, before any photo/voice attachments. If there is no signal at all: "Saved — will send the moment signal returns", with the honest queued-state icon, plus the tap-to-call 14 button right there (a queued request must never feel like dispatched help).

### Priority: **Critical**
This is the "who needs help" half of the platform's reason to exist; the map is the other half.
