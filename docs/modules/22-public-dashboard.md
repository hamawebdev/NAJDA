# Module 22 — Public Statistics Dashboard

## Public Statistics Dashboard

### What it is
A public, no-account page of live counts drawn automatically from the platform's own case data — never hand-entered, never estimated:

```
┌────────────────────────────────────────────┐
│ NAJDA — National picture  ·  updated 12:05 │
│                                            │
│ 🔥 Fires:  14 active · 9 contained ·       │
│            31 extinguished this season     │
│ 🏠 Shelters: 23 open · 4,120 people        │
│ 🆘 Requests: 118 open · 1,904 resolved     │
│ 🙋 Volunteers: 640 on missions today       │
│ 📦 Supplies: 212 needs met this week ·     │
│              37 open (9 urgent 🔴)         │
│                                            │
│ [ By wilaya ▾ ]  [ Season archive ]        │
└────────────────────────────────────────────┘
```

Per-wilaya drill-down shows the same tiles scoped locally. Every number is a **link into the thing it counts** (open urgent needs → the public needs view; open shelters → the finder). A one-line methodology note under each tile says exactly what is counted ("people currently checked into NAJDA-registered shelters — actual totals may be higher").

Companion piece, lower priority: a **Season Archive** — after each fire season, the platform's own record (fires timeline, response times, needs met, where gaps were) published as a browsable after-action view.

### Why it matters
Transparency is a stated platform goal with three concrete customers: the **public**, whose trust in the whole system grows when the numbers are visible and honest; the **media and diaspora** (Lynda), who today amplify whatever number circulates — giving them a citable, linkable source displaces invented figures; and **institutions and donors**, who see where the gaps are (9 urgent unmet needs is an actionable headline). The archive matters differently: it turns each season's suffering into next season's planning data. Serves goals: **increase transparency, reduce misinformation**.

### Who uses it
- **Citizens, media, diaspora** — the national and wilaya views.
- **NGO Coordinators & donors** — the open-needs figures as a to-do list.
- **Admins & authorities** — the archive for after-action review and pre-season planning.

### How the user interacts
"Situation" tab from the home screen (Calm and Crisis modes) or a public web link that needs no app — this page is deliberately shareable as a URL so it can be cited in news articles and WhatsApp forwards, carrying its verification pedigree with it. No interaction beyond drill-down taps; it is a read-only pane of glass.

### User flow
1. **Entry:** a journalist covering the fires needs numbers by 18:00. Instead of calling three officials and averaging rumors, she opens the NAJDA situation page.
2. National view: 14 active fires, 4,120 sheltered. Drills into Tizi Ouzou: 6 active, 2 shelters near capacity, 5 urgent open needs.
3. She cites "according to the NAJDA platform, as of 12:05…" with the link; readers tap through to the same live page. **Resolved state:** the circulating public number is the platform's honest one, timestamped — not a screenshot of a screenshot.

*Second flow (donor):* a company CSR manager opens the dashboard Friday → sees 9 urgent open needs, taps through → the public needs view → routes into the donation flow (module 17) against two of them. The dashboard is the top of the donations funnel.

*Edge — numbers look wrong:* every tile's methodology note links to "report a data problem" → Moderator queue. A public dashboard that can't be questioned publicly isn't transparent, it's decorative.

### Low-connectivity behavior
One tiny text payload; caches with its "updated at" stamp shown large. The shareable URL renders as plain HTML for the cheapest phones and embeds cleanly in articles.

### Priority: **Medium** — the Season Archive component: **Low**
Real value, but it consumes data the Critical/High modules must generate first; it ships when there are numbers worth showing. The archive waits for a completed season by definition.
