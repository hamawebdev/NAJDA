# Module 21 — Information Hub

Four features that share one purpose: putting the *boring, load-bearing* information — updates, guides, numbers, places — where a stressed person finds it in seconds. In Crisis mode they live behind two home buttons (📞 Emergency numbers, ℹ️ Info & updates); in Calm mode they are the platform's front page.

---

## Community Updates

### What it is
A **commune-level feed of verified operational updates** — short, factual, local: "Water tanker at the mosque square 15:00", "The school shelter has space", "Electricity back in the lower village", "Road to Aïn El Hammam reopened". Posting is restricted to Local Coordinators, NGO Coordinators (their operations only), Shelter Managers (their shelter only), and Relay Captains (marked "community relay"). **No open posting, no comments, no shares-with-commentary.** WhatsApp is where people talk; this feed is where facts land. Every update carries its author role and timestamp; updates auto-expire when their subject does (a tanker announcement dies at end of day).

### Why it matters
The single most requested thing in a crisis is not drama — it's logistics: when, where, is it back on. Today these facts swim in group chats among rumors, and drown. A read-only verified feed is the rumor-displacement machine: people stop forwarding "someone said" when checking NAJDA is faster and reliably right. Serves goals: **reduce misinformation, help affected families, improve coordination**.

### Who uses it
- **Citizens** read their commune's feed (auto-selected by location; can watch others — Aïcha's son watches hers).
- **Posters:** the restricted roles above.
- **Relay Captains** read it aloud — the feed is written to be *read aloud* (short declaratives, no links-as-content), and every update has the 🔊 listen button.

### How the user interacts
ℹ️ Info & updates → the feed for their commune, newest first, each update one card: icon (matching its module: 💧🍲🏠🛣️⚡), one sentence, author role, age. Starred communes appear as tabs. That's the whole surface.

### User flow
1. **Entry:** power returns to the lower village. The utility crew tells Salim; he posts: "⚡ Electricity restored in lower Taourirt Mokrane. Upper village: crews working, estimate tomorrow." (Template-assisted, 30 seconds.)
2. Every resident and watcher of the commune sees it in-feed (no push — the feed is pull; only alerts push, keeping alert-fatigue at zero).
3. The Relay Captain announces it at the café. Aïcha's son stops calling the APC. **Resolved state:** the update expires when Salim posts the follow-up ("upper village restored") — the feed self-cleans; stale facts don't linger as new-looking cards.

### Low-connectivity behavior
The feed is tiny text, cached with age banner; it is the cheapest screen in the platform by design.

### Priority: **High**

---

## Frequently Needed Information

### What it is
A curated library of **static preparedness and response guides**, each built as an icon-navigated, audio-first card deck (not articles): What to do when evacuation is ordered · The grab-bag: documents & medicines to take · First aid for burns (and what *not* to do) · Smoke: protecting children and elders · Defending your home safely — and when to stop · Livestock and animals in evacuation · After the fire: safe return checklist. Content is written once, reviewed by the relevant authority (medical guides by medical reviewers), translated (AR/Tamazight/FR), and **recorded as audio in Darja and Kabyle**. Fully cached on install — this is the part of NAJDA that works in a cave.

### Why it matters
In the minutes after an alert, families improvise decisions they've never faced: What do we take? Wet cloth on faces — does that work? Do we free the cow or tie her? Bad folk answers to these questions cost lives (burn "remedies" like toothpaste cause real harm in every fire season). One authoritative, audible answer per question, pre-loaded on every phone, is the cheapest life-safety asset in the platform. Serves goals: **save lives, help affected families, reduce misinformation**.

### Who uses it
- **Citizens** — at need (linked contextually: the RED alert links the evacuation guide; a 🔥 burn medical request shows first-aid-while-you-wait; the shelter finder links the grab-bag list).
- **Relay Captains & volunteers** — as teaching material in Calm mode.
- **Admins/Moderators** — maintain and version the content with its reviewers.

### How the user interacts
ℹ️ Info & updates → "Guides" → icon grid of the deck topics → each deck: one instruction per card, big picture, 🔊 listen, swipe. A guide is consumable in under two minutes, by ear, by a user who reads nothing.

### User flow
1. **Entry (contextual, the main path):** the ORANGE alert in Aït Yenni includes "Prepare — see: The grab-bag". The father taps it.
2. Seven cards: papers → medicines → water → phone+charger → cash → keys → one bag per person. His wife listens to the Kabyle audio while packing. Four minutes later the family is packed *right*.
3. Weeks later (Calm mode), the deck he half-remembers is still there; he shows the burn first-aid deck to his mother, who keeps toothpaste on the shelf for burns. The card says, in audio, gently: cool water only, 20 minutes, nothing else. **Resolved state:** knowledge delivered ahead of, during, and after need — the same deck all three times.

### Low-connectivity behavior
The gold standard: everything pre-cached, zero network needed, ever.

### Priority: **High**

---

## Emergency Contacts

### What it is
One screen of **tap-to-call national emergency numbers**, giant buttons, icon + number + name, ordered by fire relevance:

```
┌──────────────────────────────────┐
│ 🚒 Protection Civile      14     │
│ 🚒 Protection Civile     1021    │
│ 🌲 Forest fires (DGF)    1070    │
│ 👮 Gendarmerie           1055    │
│ 👮 Police              17 · 1548 │
│ 🚑 SAMU                   115    │
└──────────────────────────────────┘
```

*(Numbers shown as currently published; the launch checklist re-verifies every number with each authority — a wrong emergency number is the platform's worst possible bug.)* Below the national block: the user's commune's **local** numbers (APC, local Protection Civile unit, health center) pulled from the Local Emergency Centers directory (below).

### Why it matters
Under panic, people forget numbers they've known all their lives, and mis-dialing wastes the minutes that matter most. This screen is also the platform's humility made visible: NAJDA's first answer to "life in danger right now" is *a phone call to professionals*, one tap away, everywhere in the app (the 🆘 flow, the report flow, the medical flow all surface it). Serves goals: **save lives, reduce response time**.

### Who uses it
Everyone, no account: Citizens first; also volunteers and coordinators (the local block doubles as their liaison sheet).

### How the user interacts
📞 button on the home screen (both modes — one of the five Crisis-mode giants). Tap a row → the phone dials. Nothing else on the screen. Works before any onboarding: it is the first screen NAJDA shows a brand-new user during a crisis, even before asking their commune.

### User flow
1. **Entry:** Aïcha's neighbor sees flames crest the ridge behind his orchard. Opens NAJDA → 📞 → taps "Protection Civile 14" → dialer opens with 14 → he calls. Two taps, zero reading (the 🚒 icon and red color carry the meaning).
2. After the call, the app suggests: "Also report it on the map so neighbors see it?" → one tap into module 20's flow. **Resolved state:** professionals called first; the platform informed second — the correct order, by design.

### Low-connectivity behavior
Static screen, fully cached. Voice calls work when data doesn't — this screen is the platform's floor: the feature that still works when everything else is down.

### Priority: **Critical**
Trivial to build, first to save a life. Ships day one, works forever.

---

## Local Emergency Centers

### What it is
A per-commune directory of **physical places where coordination happens**: the APC coordination room, the local Protection Civile unit, health centers/polyclinics, and during crises the activated command posts. Each entry: what it is, where (landmark cascade + map pin), phone(s), hours/status (🟢 staffed now / ⚫ closed), services ("aid registration here", "missing-person desk here"). Entries are maintained by Local Coordinators and verified like everything else; the crisis-activated ones auto-expire when Crisis mode lifts.

### Why it matters
Not everything can or should happen in an app — aid registration wants a desk, some people will always prefer a human at a counter, and every NAJDA dead-end deliberately lands here ("No open shelter nearby — call the commune coordination center"). A platform for low-digital-literacy users must always be able to hand the user to a *physical place with a person in it*. Serves goals: **improve coordination, help affected families, increase transparency**.

### Who uses it
- **Citizens** — find the desk: where to register for aid, where the missing-persons desk is, where to ask what the app couldn't answer.
- **Volunteers/NGOs** — muster points and liaison offices.
- **Local Coordinators** — maintain their commune's entries; activate crisis posts.

### How the user interacts
ℹ️ Info & updates → "Centers near me" (also linked from every dead-end and from the Emergency Contacts screen's local block). List by distance, status chip first, tap → card with call button and map pin.

### User flow
1. **Entry:** three days after the fire, Aïcha's son wants to register her for emergency aid but can't find how in the app (registration is at a desk, by design — module 23 hands off the same way).
2. Opens Centers near me for her commune → "🟢 APC coordination room — aid registration desk, staffed 8:00–17:00, ☎ …" → calls to confirm what papers to bring (the entry lists them), then takes his mother there.
3. At the desk, the clerk files her damage report into module 23. **Resolved state:** the app handed off to the physical world cleanly — address, hours, phone, papers — instead of pretending everything is digital.

### Low-connectivity behavior
The commune's directory caches like the contacts screen; status chips show age.

### Priority: **High**
