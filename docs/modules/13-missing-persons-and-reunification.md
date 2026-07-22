# Module 13 — Missing Persons & Family Reunification

Three features share this module because they are one problem — "where is my family?" — attacked from three directions: report who is missing, register who is found, and let the safe announce themselves.

---

## Missing Persons

### What it is
A structured report — name, approximate age, photo (optional), last known location (landmark cascade), reporter's phone — that becomes a **missing-person case** visible in two forms:
- **Public search card** (limited fields: first name + initial, age range, commune, photo if the reporter consented) searchable by anyone;
- **Full case** (all details) visible only to Local Coordinators, Moderators, and Shelter Managers in the relevant area.

Every report passes a **Moderator privacy/abuse screen** before the public card appears (minors get extra caution: public card only with guardian consent; the full case still circulates to shelters immediately, unscreened delay must not slow the real search).

### Why it matters
After an evacuation, families scatter across shelters, relatives' homes, and hospitals with no phone signal. Today the search is Facebook posts with full names and photos — effective sometimes, but privacy-blind and never closed out (found people stay "missing" online for weeks, wasting search energy). Serves goals: **save lives, help affected families, reduce misinformation**.

### Who uses it
- **Citizens** file and search (Aïcha's son, if she weren't answering her phone).
- **Moderators** screen for privacy/abuse.
- **Shelter Managers** (Karim) receive area missing-lists and match against check-ins.
- **Local Coordinators** confirm matches and close cases.

### How the user interacts
"Find a person" from the home screen → two big choices: **🔍 Search** (name/commune, browse cards) or **📋 Report missing** (one-screen form, photo optional, consent checkbox for public photo). Reporter gets a case screen with status: **Reported → Published → Possible match → Reunited/Closed**.

### User flow
1. **Entry:** after the evacuation, Aïcha's son cannot reach her. Taps "Find a person" → Search → her name + commune → no card yet. One tap converts his search into a **Report missing** (form pre-filled with what he searched).
2. Case created. A Moderator screens it (minutes, not hours; the queue is priority-ordered by case age) → public card published; the full case pushes to every Shelter Manager and Local Coordinator in the commune and its neighbors.
3. Karim's shelter check-in registry (module 15) flags a **possible match**: "Aïcha B., ~65–70, checked in 14:40" — the match is suggested automatically on name + age + commune, but *only humans confirm*.
4. Karim taps the match → sees the full case → asks Aïcha → confirms.
5. Both sides notified: the son gets "Possible match found — Karim, shelter manager at CEM, will call you"; phone numbers are exchanged **only after both sides confirm** (guard against bad-faith searchers).
6. Son and mother speak. Salim (or Karim) marks **Reunited** → the public card disappears from search immediately. **Resolved state:** case closed, card gone, search energy freed.

*Edge — no match for days:* case stays open, auto-re-broadcast to newly opened shelters; after a set period the coordinator is prompted to hand the case to the responder liaison (it may be a casualty case — the platform hands over, it does not conclude).

### Low-connectivity behavior
Search cards are text-first (photos load last). Reports queue offline with the honest "saved, will send" state.

### Priority: **Critical**
The hours after evacuation are the platform's second-most-intense use window, and the current Facebook alternative is what NAJDA must replace most urgently on privacy grounds alone.

---

## Family Reunification

### What it is
The connective tissue between shelter check-ins, missing-person cases, and safe check-ins: a matching layer that continuously compares the three lists and surfaces **possible matches** to the humans allowed to confirm them (Shelter Managers, Local Coordinators). Not a separate screen citizens visit — reunification is an outcome, not a destination.

### Why it matters
Each list alone is passive. A missing report nobody cross-checks and a shelter notebook nobody reads are the same paper, apart. The matcher is what turns three databases into found people. Serves goals: **help affected families, improve coordination**.

### Who uses it
- **Shelter Managers** (Karim): see match suggestions against their own check-in list.
- **Local Coordinators** (Salim): see matches across all shelters and safe check-ins in their sector; confirm and close.
- **Citizens** experience it only as the notification "possible match found".

### How the user interacts
For Karim it is a badge on his shelter dashboard: "2 possible matches". Tap → side-by-side card (check-in entry vs. missing case) → **This is the same person / Not the same** — two buttons. For Salim, the same queue at sector level, including matches from "I am safe" check-ins ("a person marked safe from a phone number that a missing-case reporter listed").

### User flow
1. **Entry:** automatic — a new shelter check-in, safe check-in, or missing report triggers matching.
2. Possible match → surfaced to the closest responsible human (the Shelter Manager if it's their check-in; otherwise the sector coordinator).
3. Human verifies in person or by phone → confirms or rejects (rejects teach the matcher nothing automatically — no silent learning on family data; rejected pairs are simply not re-suggested).
4. On confirm → both parties notified, contact exchanged after mutual consent → case marked **Reunited**. **Resolved state:** missing card unpublished, both lists updated, case archived.

### Low-connectivity behavior
Matching runs platform-side; Karim's match queue is a tiny text list that syncs whenever his shelter tablet has signal.

### Priority: **High**
Depends on modules 13 (reports) and 15 (check-ins) existing first; the moment both exist, the matcher is what makes them worth their cost.

---

## "I Am Safe" Check-in *(new feature — see doc 30 for rationale)*

### What it is
One giant button: **✅ I AM SAFE**. Tapping it records "this phone number's owner marked themselves safe at [time], in [commune if shared]" and optionally a free voice/text note ("with my sister in Fréha"). It generates a shareable message for WhatsApp/SMS, and it answers searches: anyone who types that exact phone number (or is the reporter of a missing case listing it) sees "marked safe at 15:20". Privacy guard: safe check-ins are **not** a browsable list — you must know the phone number to see one, or be matched via a missing case.

### Why it matters
In every disaster, most of the phone network collapse is *reassurance traffic* — hundreds of "are you okay??" calls per person. One check-in seen by many replaces them. It also drains the missing-person queue before it fills: people who marked safe never get reported missing. Serves goals: **help affected families, reduce response time (by freeing networks and search energy)**.

### Who uses it
- **Citizens** in affected areas (one tap, no account).
- **Citizens** searching (enter a phone number → status).
- **The matcher** (above) consumes it.

### How the user interacts
Crisis-mode home screen button ✅ → confirm screen ("Mark yourself safe? Your phone number identifies you to family who search for it") → done. Second screen offers: add note, share via WhatsApp/SMS ("أنا بخير — I am safe — NAJDA, 15:20").

### User flow
1. **Entry:** Aïcha is checked in at the shelter; a volunteer helps her tap ✅ I AM SAFE on her own phone (or Karim marks "safe check-in" from the shelter registry on her behalf, flagged "assisted").
2. In Algiers and Paris, everyone who queries her number sees "marked safe 15:20 — Aïn El Hammam area". The calls stop.
3. Her niece in France was about to file a missing report → the report form checks the number first → "this person marked safe 15:20" → report never created. **Resolved state:** reassurance delivered with zero case load.

### Low-connectivity behavior
The check-in is the smallest payload in the platform — it queues and sends first, even before emergency-request attachments. The share-message works offline (it's just an SMS/WhatsApp handoff).

### Priority: **High**
Cheap to build, massive load-shedding effect on both phone networks and the missing-person system. Ships with module 13.
