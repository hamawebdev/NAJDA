# Module 11 — Emergency Alerts

## Emergency Alerts

### What it is
Geo-targeted, human-issued notifications that tell the people of a specific commune (or set of communes) what to do **now**. Four levels, always icon + color + spoken audio:

| Level | Meaning | Example |
|---|---|---|
| 🔴 **RED — Evacuate now** | Leave immediately, here's where to go | "Fire approaching Taourirt Mokrane from the west. Evacuate now toward the CEM shelter in the commune center. Do not take the RN15." |
| 🟠 **ORANGE — Prepare** | Pack, warn neighbors, be ready to move | "Fire active 6 km from your commune, wind turning. Prepare documents, medication, water." |
| 🟡 **YELLOW — Be aware** | Fire in the area, no action needed yet | — |
| 🟢 **GREEN — All clear** | Danger over for this area | "The fire threatening your commune is contained. Roads reopening — see map." |

Alerts are always **written from templates** (pre-translated into Arabic, Tamazight, French, with recorded audio patterns) so a coordinator under stress fills in blanks instead of composing prose. Only Verified information can trigger an alert (principle 5).

### Why it matters
In 2021 and 2023, evacuation news traveled by shouting, phone chains, and Facebook — some villages moved too late, others fled into danger. A trusted, targeted, audible alert is the single highest-leverage life-saving feature after the map. The all-clear matters too: it stops premature returns into active fire zones. Serves goals: **save lives, reduce response time, reduce misinformation**.

### Who uses it
- **Receives:** every Citizen located in or watching the targeted communes (no account needed — location subscription only). Aïcha receives it as sound; Relay Captains receive it with a "relay to neighborhood" duty (doc 30).
- **Issues:** Local Coordinator (Salim) for their sector. **RED alerts require a second approval** from a Moderator or Admin — a two-person rule on the most consequential action in the platform.
- **Moderator/Admin:** co-approve RED, audit all alerts.

### How the user interacts
*Citizen:* nothing to set up beyond location (or "watched" communes from the map). YELLOW/GREEN arrive as normal notifications. ORANGE and RED arrive as a **full-screen takeover** with alarm sound that repeats until acknowledged:

```
┌─────────────────────────────────┐
│      🔴 EVACUATE NOW            │
│   Taourirt Mokrane village      │
│                                 │
│   Go to: CEM shelter, center    │
│   Avoid: RN15 westbound         │
│                                 │
│  ▶ 🔊 LISTEN (Kabyle / Darja)   │
│  ▶ 🗺️ ROUTE TO SHELTER          │
│  ▶ 🆘 I CANNOT LEAVE            │
└─────────────────────────────────┘
```

"I cannot leave" files a pre-tagged emergency request (module 12) in two taps — the alert itself anticipates the person who can't comply.

*Coordinator:* "Issue alert" → pick level → pick communes on a tap-map of their sector → fill template blanks (fire location, shelter, road to avoid) → preview in all three languages → send (RED: sends to co-approver first).

### User flow
*Issuing a RED alert:*
1. **Entry:** Salim (Local Coordinator) gets confirmation from the Protection Civile officer on site that the fire will reach Taourirt Mokrane within the hour.
2. Opens "Issue alert" → RED → taps the village + two neighboring douars on his sector map.
3. Template: fills "fire from the **west**", shelter picker → "CEM commune center" (auto-checks it's Open in module 15 — warns him if it's Full), road picker → "avoid RN15 westbound" (syncs to module 19).
4. Preview shows the alert in AR/Tamazight/FR with audio. Sends for co-approval.
5. Moderator on national duty gets a priority ping, sees the verified fire report backing it (module 20 linkage), approves. **Elapsed target: under 2 minutes.**
6. Every phone located in/watching those douars takes over with the alarm. Relay Captains confirm "relayed".
7. Salim's alert panel shows reach: delivered / acknowledged counts, and a list of "I cannot leave" requests spawning in his queue.
8. **Resolved state:** fire contained → Salim issues GREEN all-clear to the same polygon → the alert case closes, archived in the public log.

*Receiving flow (Aïcha):* phone alarms → she taps the big 🔊 button → hears the instruction in Kabyle → taps "I cannot leave" (she has no car) → her request lands in Salim's queue tagged *evacuation assistance, from RED zone* — top of triage. A neighbor with a car is dispatched via a volunteer assignment. She never typed a word.

*Edge — false or stale alarm:* if the situation changes, the coordinator **updates** the alert (new instruction pushes to the same recipients) rather than issuing a contradicting second alert; the old version is visibly struck through in the alert log. Contradiction is how official channels lose trust.

### Low-connectivity behavior
Alerts are tiny text payloads — highest delivery priority, retried aggressively. If audio can't load, the phone's own text-to-speech reads the text. Acknowledgments queue.

### Priority: **Critical**
The most direct life-saving feature in the platform. Paired with the two-person RED rule because its failure mode (false or missed evacuation) is the most dangerous.
