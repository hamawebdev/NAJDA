# Vision & Design Principles

## Mission

When a wildfire starts in Algeria today, the response works — but it works through fragments: a Facebook group in one wilaya, a WhatsApp chain in one village, a volunteer with a phone list. Information is duplicated, contradicted, and outdated within hours. People die and aid is wasted not because nobody helps, but because helpers cannot see each other.

**NAJDA is the shared operating picture for wildfire response.** One place where:

- a family in a threatened village learns, in their own language, whether to leave and where to go;
- a rescuer sees every open call for help in their sector, deduplicated and triaged;
- a volunteer knows exactly where to show up, when, and with what;
- an NGO sees what is actually needed before loading the truck;
- everyone can tell verified information from rumor at a glance.

## Goals (every feature must serve at least one)

1. Save lives
2. Reduce response time
3. Improve coordination between citizens, responders, volunteers, and NGOs
4. Help affected families
5. Reduce misinformation
6. Improve volunteer organization
7. Improve resource distribution
8. Increase transparency
9. Stay simple enough to use in panic, by users with low digital literacy

Each module spec ends its **Why it matters** section by naming which of these goals it serves.

## The seven design principles

Every feature in this suite is written against these rules. They are not aspirations; a design that violates one must justify it explicitly.

### 1. The three-tap rule
Any life-critical action — request rescue, report a fire, mark yourself safe, find the nearest shelter — completes in **at most three taps from the home screen**. No form longer than one screen for these actions. Optional detail can always be added *after* the request is already sent.

### 2. Icons, color, and voice first — text second
Users include people who read little or no French or Standard Arabic. Every core action is a large pictogram button with a color code. Every alert and guide has a **listen button** (spoken in Darja and Tamazight, not only read). Text labels exist in Arabic, Tamazight (Tifinagh and Latin), and French, but the interface must be operable by someone who reads none of them.

### 3. No account for life-critical actions
Asking a panicking user to register is how platforms kill people. Requesting help, reporting a fire, viewing the map, alerts, shelters, roads, and contacts all work with **zero sign-up**. A phone number typed once (for callback) is the only identity a citizen ever needs. Accounts exist only for coordination roles: volunteers, shelter managers, NGOs, coordinators, moderators.

### 4. Two platform states: Calm mode and Crisis mode
Outside fire season the home screen teaches, prepares, and maintains registries. When a **Local Coordinator or Admin activates Crisis mode for a wilaya**, the home screen for users in or watching that wilaya collapses to five giant buttons:

```
┌─────────────────────────────────┐
│  ⚠️  CRISIS MODE — TIZI OUZOU   │
├─────────────────────────────────┤
│  🆘  I NEED HELP                │
│  🔥  REPORT A FIRE              │
│  🗺️  MAP · SHELTERS · ROADS     │
│  ✅  I AM SAFE                  │
│  📞  EMERGENCY NUMBERS          │
└─────────────────────────────────┘
```

Everything else moves one level down. Crisis mode is per-wilaya: Tizi Ouzou can be in crisis while Oran stays calm.

### 5. The verification ladder — the anti-misinformation backbone
Every piece of live information (fire report, road status, shelter status, community update) carries exactly one of three states, shown as a badge with color and icon, plus a **timestamp phrased as age** ("confirmed 25 min ago", never a raw clock time):

| State | Badge | Meaning | Who sets it |
|---|---|---|---|
| Unverified | ⚪ grey | One citizen report | Automatic on submission |
| Community-corroborated | 🟡 yellow | 3+ independent reports of the same thing, same area | Automatic |
| Verified | 🟢 green (info) / 🔴 red (danger) | Confirmed by a Moderator, Local Coordinator, or official source | Human with a verifier role |

Rules that follow from the ladder:
- Unverified items are visible but visually muted, and are **never pushed** as notifications.
- Only Verified items can trigger alerts or appear in the "official" map layer.
- Every item shows *who* verified it (role, not name) and *when*.
- Stale Verified items automatically decay: a road status not re-confirmed within a set window drops back to "last confirmed X hours ago — treat with caution".

### 6. Landmark-based location, never coordinates
Users think in places, not GPS. Location entry everywhere follows the same cascade: **wilaya → commune → village/douar → free-text landmark** ("behind the CEM", "next to the old fountain"). GPS pre-fills the cascade when available and permission is granted; it never replaces it. Coordinators see both the cascade and the GPS pin when one exists.

### 7. Degrade gracefully
Networks fail exactly when the platform matters most. Every module spec includes a **Low-connectivity behavior** note describing what the user sees on a bad connection: list views instead of map tiles, cached last-known data clearly marked with its age, and outgoing actions queued with an honest message — "Saved. Will send the moment signal returns." The platform never pretends: cached data always shows its age, and a queued request never looks like a sent one.

## Shared vocabulary

- **Wilaya → daïra → commune → village/douar**: the geographic hierarchy used in every picker, filter, and permission scope.
- **Sector**: a coordinator's area of responsibility, usually one commune.
- **Case**: any tracked item with a lifecycle (emergency request, missing person, supply request, damage report). Every case has a status ladder, a visible history, and exactly one owning role at any moment.
- **Needs board**: the single shared list of open supply requests (module 16). All donation and distribution features read from it; nothing is requested twice in two places.
