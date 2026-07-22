# New Feature Proposals

Seven features not in the original brief, each earning its place against the platform goals. Two ("I Am Safe", Volunteer Safety) were important enough to be specced in full inside their host modules; they are summarized here with pointers. The other five are specced in full below.

---

## 1. "I Am Safe" Check-in — *full spec in [modules/13](modules/13-missing-persons-and-reunification.md)*

One tap marks the phone's owner safe; anyone who knows the number sees it; the missing-report form checks it first. **Why it earns its place:** most disaster phone-network collapse is reassurance traffic, and most "missing" people aren't missing — they're unreachable. One check-in seen by many replaces hundreds of calls and prevents cases before they're filed. Goals: help affected families, reduce response time. **Priority: High.**

## 2. Volunteer Safety Check-in & SOS — *full spec in [modules/14](modules/14-volunteer-management.md)*

Interval check-ins during missions, amber/red escalation on the Team Leader's roster, hold-to-activate SOS. **Why it earns its place:** volunteers died in the 2021 Kabylie fires; a platform that mobilizes civilians owes them the discipline professionals get by radio, and "we track that they come back" is the ethical license for volunteer mobilization at all. Goals: save lives, improve volunteer organization. **Priority: High.**

---

## 3. Vulnerable Persons Registry

### What it is
A Calm-mode, opt-in, commune-level register of people who **cannot self-evacuate**: the elderly living alone (Aïcha), people with reduced mobility, dialysis/oxygen/insulin-dependent patients, families without vehicles in remote douars. One entry = who, where (landmark cascade), why they'd need help (icon categories, no medical detail beyond the operational minimum), and who locally to coordinate with (a neighbor, the Relay Captain). **Privacy is the design constraint:** entries are visible *only* to the commune's Local Coordinator and, during an active RED alert covering that area, to the assigned evacuation Team Leader — never browsable, never public, consent recorded at entry, deletable on request.

### Why it matters
The people who die in evacuations are overwhelmingly the ones who couldn't leave unaided — and every village *knows* who they are before the fire comes. Today that knowledge lives in neighbors' heads and works only if the right neighbor is home. Writing it down, with consent, turns a RED alert from a broadcast into a **door-knock list**. This is the platform's single highest lives-saved-per-byte feature. Goals: save lives, reduce response time.

### Who uses it
- **Citizens** register themselves or (flagged, with stated relationship) a relative — Aïcha's son registers her from Algiers.
- **Relay Captains** register neighbors during Calm-mode community drives — the main path, given the population's digital literacy.
- **Local Coordinators** maintain the register; during a RED alert, work it as a checklist.
- **Evacuation Team Leaders** receive the relevant slice during the alert, and only then.

### How the user interacts
Calm mode: "Prepare my commune" → "Register a person who'd need evacuation help" → one screen (who/where/why/local contact/consent). During a RED alert, the coordinator's alert panel grows a tab: the affected area's register as a checklist — each row: **✅ Confirmed out · 🚗 Team en route · ❓ Unreachable** — worked top to bottom.

### User flow
1. **Entry (Calm, months before):** at a mosque-courtyard registration drive, the Relay Captain registers eleven villagers, Aïcha among them ("lives alone, no vehicle, behind the old fountain; local contact: nephew two doors down"). Consent recorded by voice note.
2. **Fire day:** Salim issues the RED alert for Taourirt Mokrane (module 11). His panel shows: *"9 registered vulnerable persons in the alert zone."*
3. The evacuation mission's Team Leader receives the nine as the mission's checklist; pairs of volunteers take three names each, by street.
4. Aïcha's row: her nephew already drove her out → volunteer confirms at the door → ✅. Two rows over, an unreachable entry ❓ escalates to Salim who sends the nearest pair → found, evacuated, ✅.
5. All nine green before the fire reaches the village edge. **Resolved state:** the checklist is complete — *nobody was left because nobody was forgotten*. Register access for the Team Leader expires with the alert.

### Low-connectivity behavior
The alert-zone slice is pushed to the Team Leader's device in full at mission start (it must work door-to-door in dead zones); check-offs queue and merge.

### Priority: **Medium** *(Calm-mode feature — builds before/between seasons; its payoff is Critical-grade on fire day, but it does not gate the crisis MVP)*

---

## 4. Livestock & Agriculture (rescue lane + loss records)

### What it is
Recognition that in Kabylie and the fire-prone interior, the fire's economic kill is **animals and trees**: a 🐄 lane through existing modules rather than a new surface. (a) The 🐄 emergency-request type (module 12) with its own triage lane — never competing with human requests, but never discarded; (b) guidance decks for animals in evacuation (module 21: free the tethered animals, don't load the truck with the herd); (c) livestock/orchard/beehive categories in damage reports (module 23) with photo documentation; (d) a Calm-mode **herd/hive pre-declaration** (optional, lightweight) that gives the coordinator a picture of what's where before fire season.

### Why it matters
Families have died going back into fire zones for animals — the herd *is* the family's savings account, and a platform that ignores that reality will be ignored in return. An explicit lane does three things: gives the impulse a safe channel ("request help for the herd" instead of driving back in), makes the losses countable (undercounted in every past season because forms were house-shaped), and routes agricultural aid programs to documented cases. Goals: save lives (by removing the reason to go back), help affected families, increase transparency.

### Who uses it
- **Farmers/herders** (Citizens): 🐄 requests, damage filings, pre-declaration.
- **Local Coordinators:** triage the lane; pair 🐄 requests with volunteer missions (open the pens, move the herd to the fallback pasture) when human needs allow.
- **NGO/agricultural programs:** read the loss register for aid targeting (as in module 23's flow).

### How the user interacts
No new screens — the 🐄 icon appears in the request grid, the damage categories, and the guides. Pre-declaration is one Calm-mode card: species, rough count, where penned (landmark).

### User flow
1. **Entry:** the ORANGE alert reaches a herder above Aït Yenni. The evacuation guide's animal card (🔊, in Kabyle) says: untie everything, open the pens, do **not** stay to herd.
2. He complies but files 🐄 "herd loose above Tala spring, ~30 sheep" as he leaves.
3. Salim's queue shows it in the low-priority lane; that evening, with human requests cleared, a two-volunteer mission with the herder (returning *with* a team, safely, not alone) recovers 26 sheep to the school's back lot.
4. Post-crisis he files 🐄 damage: 4 lost, photos of the burned pen → Assessed → matched to the livestock-aid program. **Resolved state:** the man never re-entered the fire alone, the loss is on the record, and the aid found him.

### Low-connectivity behavior
Inherits each host module's behavior; the pre-declaration card syncs whenever.

### Priority: **Medium** *(the 🐄 request type and guide cards ship with their Critical/High hosts at near-zero cost; the pre-declaration and aid-matching layers are genuinely Medium)*

---

## 5. Relay Captains (the human last-kilometer)

### What it is
A lightweight platform role that turns NAJDA's hardest problem — users who will never comfortably use *any* app — into a designed feature. A Relay Captain is a trusted, known local (the café owner, the imam's assistant, the retired teacher, the pharmacy clerk) who: receives **priority notifications** for their village (alerts, water/food points, updates), confirms **"relayed"** after announcing them by voice where people actually are; and **files reports on behalf of others** (fires, requests, missing persons, damage) flagged "assisted". Appointed by the Local Coordinator, one or two per village/douar; a short Calm-mode training deck (module 21 machinery) certifies them.

### Why it matters
The brief's hardest constraint is low digital literacy. Every other feature bends toward it (icons, audio, three taps) — but bending isn't enough for the many Aïchas who will never open an app unprompted. The honest design answer is a **human bridge**: one smartphone-comfortable person relaying to fifty neighbors beats fifty failed onboardings. It also formalizes what actually happened in 2021 — informal village relays — and gives them verified information to relay instead of rumor. Goals: save lives, reduce misinformation, be usable under stress by everyone (via someone).

### Who uses it
- **Relay Captains** — the role's whole surface: priority inbox, "relayed ✅" button, assisted-report shortcuts.
- **Local Coordinators** — appoint captains, see relay coverage ("Taourirt Mokrane: relayed 12 min after alert") on their panel.
- **Villagers** — never "use" it; they *experience* it as the café announcement and the man who can file your paper for you.

### How the user interacts
A captain's app gains one tab: their village's priority feed, each item with 🔊 (to play aloud, phone-as-megaphone), a "relayed ✅" button, and shortcuts to file on behalf of someone (pre-flagged assisted, two fields shorter than the citizen flow because the captain's identity is known).

### User flow
1. **Entry:** RED alert hits Taourirt Mokrane at 13:10. The café owner's phone (captain) alarms with priority tone.
2. He plays the Kabyle audio over the café speaker, walks the two streets the alert mentions knocking on doors, taps **relayed ✅** at 13:22.
3. Salim's alert panel shows: delivered 61% of phones, *relayed* both douars — he knows the words reached the people the phones didn't.
4. An elderly couple tells the captain their son in Oran must be told → captain uses the assisted "I am safe" shortcut with their phone number after they reach the shelter. **Resolved state:** the alert reached 100% of ears at 60% phone penetration; the assisted actions filed cleanly with their provenance marked.

### Low-connectivity behavior
Captains' devices pre-cache their village's alert audio and guides; the "relayed" confirmation queues. When even the captain has no signal, he still has the cached audio and the printed fallback list — the role degrades to a well-informed neighbor, which is the point.

### Priority: **Medium** *(organizationally cheap, no new heavy surfaces; its value scales with exactly the population the rest of the platform serves worst)*

---

## 6. Misinformation Flagging & Verified Badges

### What it is
The citizen-facing edge of the verification ladder (principle 5): (a) every public item — map objects, updates, shelter statuses, road segments, donation campaigns — wears its badge (⚪🟡🟢) *and* a **🚩 flag button** ("this is wrong / outdated / fake") feeding a Moderator queue with the flagged item and reason chips; (b) a public **"Check a claim"** box: paste a forwarded text, account number, or claim keyword → NAJDA answers from its verified data ("No verified fire in Bouzeguène as of 14:20", "⚠️ that account is not a verified campaign" — the module 17 check generalized); (c) a small permanent explainer teaching the three badges (also a Relay Captain training card).

### Why it matters
"Reduce misinformation" is a founding goal, and the ladder alone only cleans *inside* the platform — the rumors live in WhatsApp. Two levers reach outward: making checking faster than forwarding (the check box), and making the platform's own data self-correcting at citizen scale (the flags — a shelter marked open that a family found closed gets flagged within the hour, which no moderator team could match). Goals: reduce misinformation, increase transparency, save lives (bad information kills in evacuations).

### Who uses it
- **Citizens** — flag what's wrong in front of them; check what lands in their group chats (Lynda's Paris use case as much as the village one).
- **Moderators** — the flag queue, prioritized by item criticality (a flagged road segment outranks a flagged update) and flag count.
- **Relay Captains** — the designated rumor-checkers of their villages.

### How the user interacts
The 🚩 sits quietly on every item's detail card → two taps (reason chip, send). The check box lives on the ℹ️ hub and the Donate screen. Flag outcomes close the loop like incident reports do: "You flagged the CEM shelter status — it has been corrected. Thank you." (Flagging that visibly *works* is the habit-former.)

### User flow
1. **Entry:** a family drives to a shelter the app says is 🟢 Open — finds it locked (manager's phone died mid-crisis; status went stale). Father taps 🚩 on the shelter card → "outdated" chip → send — and the finder immediately shows him the alternative (flagging never dead-ends the flagger).
2. Two more flags land within 20 min → the item auto-demotes to ⚪ "status under review — call before going" *pending* moderator action (criticality rule: for life-safety items, doubt shows immediately).
3. The Moderator reaches Salim; Salim reaches the exhausted manager, gets truth, fixes the status (🔴 Full, alternative linked), reactivates it Verified.
4. All three flaggers get the correction notice. **Resolved state:** the map healed itself in under an hour, and three families learned their flags matter.

### Low-connectivity behavior
Flags are tiny payloads that queue; the check box degrades to cached verified data with its age shown ("as of 40 min ago, no verified fire in…").

### Priority: **High** *(the ladder is Critical-infrastructure already; this citizen edge is what keeps its data true at scale, and the check box is the platform's only weapon inside WhatsApp itself)*

---

## 7. Pre-Season Preparedness Mode

### What it is
The answer to the question that kills disaster apps: *what is it between disasters?* Calm mode (principle 4) with an annual rhythm rather than a dead home screen: a **pre-season checklist campaign** each late spring — refresh the vulnerable registry (proposal 3), re-verify shelters and their capacities, re-confirm Relay Captains, volunteer refresher missions (a real drill: one village, one simulated alert, timed), grab-bag week (the module 21 deck pushed as a gentle campaign), and herd pre-declarations (proposal 4). Each commune gets a visible **readiness card**: registry fresh? shelters verified? captains active? drill done?

### Why it matters
Every crisis-only platform is uninstalled by November and forgotten by July — then the first fire of the season meets empty registries, stale shelter data, and expired volunteer rosters. Preparedness mode is the platform's heartbeat between seasons: it keeps the data alive (the registries are only as good as their last refresh), keeps the humans practiced (a coordinator who issued his last alert eleven months ago is a beginner again), and keeps the app installed (a yearly rhythm of small useful asks). It converts NAJDA from an emergency app into national infrastructure. Goals: reduce response time (season one starts pre-loaded), improve coordination, save lives.

### Who uses it
- **Local Coordinators** — own their commune's readiness card; run the drill.
- **Relay Captains & volunteers** — the refresh work and the drill.
- **Citizens** — receive one gentle campaign per year (grab-bag week), not a nagging app.
- **Admins** — the national readiness view: which wilayas go into summer with red cards.

### How the user interacts
Calm-mode home shows the readiness card to role-holders only (citizens just see the normal calm home: guides, contacts, map). Checklist items link straight into the thing to refresh. The drill is a scheduled fake-flagged alert to opted-in participants with a stopwatch on every step (alert → relay → muster → checklist complete).

### User flow
1. **Entry:** May. Salim's readiness card: registry 🟠 (8 months old), shelters 🟠 (CEM capacity unconfirmed), captains 🟢, drill ⚪.
2. He schedules the registration drive (proposal 3's flow) and pings Karim, who re-verifies the CEM in five minutes (capacity 250 → 230; the gym floor was re-tiled).
3. June drill in Taourirt Mokrane: simulated ORANGE, clearly badged "DRILL" on every screen; the captain relays in 9 minutes; the vulnerable-registry checklist is walked; two registry addresses turn out wrong and get fixed — *the entire point*.
4. Card goes 🟢 across. July: the first real fire of the season meets a commune whose data is 6 weeks old, not 11 months. **Resolved state (annual):** readiness card green before the season, every season; the Admin view shows which wilayas need help getting there.

### Low-connectivity behavior
Calm-mode work is patient by nature — everything syncs eventually; drills are scheduled for connectivity, since their lessons transfer.

### Priority: **Medium** *(nothing here gates the first crisis MVP — but by season two it is the difference between a platform that decays and one that compounds)*
