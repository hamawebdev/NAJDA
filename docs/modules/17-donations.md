# Module 17 — Donations

Two features with one principle: **donations follow needs, never the reverse.** Every donation path starts from the needs board (module 16), so generosity lands as logistics instead of noise. And one bright line: **NAJDA never touches money.** It verifies, points, and reports — funds move directly between donor and accredited organization.

---

## In-Kind Donations

### What it is
The public, donor-facing face of the needs board: "**Donate what's needed, where it's needed.**" Citizens and businesses see real open needs near them (or filtered nationally), pledge against a specific line, and hand goods to the claiming organization's **drop-off point** — donors don't drive into disaster zones; accredited NGOs cover the last kilometer.

```
┌──────────────────────────────────────┐
│ NEEDED NOW — Bouira wilaya           │
│ 🛏️ Blankets ×80 — CEM shelter  🔴    │
│    47 pledged · 33 still needed      │
│    Drop-off: CRA Bouira, until 20:00 │
│         [ I CAN BRING SOME ]         │
├──────────────────────────────────────┤
│ ⚠️ NOT needed: clothes, bread        │
└──────────────────────────────────────┘
```

The **"NOT needed" banner** is a first-class element, set per-sector by coordinators — saying no to surplus is half the value of the feature.

### Why it matters
Algeria's fire seasons produce enormous spontaneous generosity that today arrives blind: mountains of clothes, no baby formula. Aiming existing generosity is worth more than soliciting new generosity. Serves goals: **improve resource distribution, reduce misinformation (about what's needed), increase transparency, help affected families**.

### Who uses it
- **Citizens & local businesses** (donors): browse, pledge, drop off.
- **NGO Coordinators** (Nadia): open needs lines to public pledging, run drop-off points, confirm received pledges.
- **Local Coordinators:** set the NOT-needed banner; open lines to the public when NGO capacity alone won't fill them.

### How the user interacts
Home tile "Donate" → needs list near the donor (urgency-sorted) → tap a line → "I can bring: [quantity stepper]" → pledge card with the drop-off point, hours, and a pledge code. At drop-off, the NGO taps the code → pledge counts toward the line. Unfulfilled pledges expire quietly after the line's urgency window (no shaming — but expired pledges release the quantity back).

### User flow
1. **Entry:** the blankets line (80, CEM shelter) isn't fully claimable by CRA stock; Nadia opens it to public pledging with her office as drop-off.
2. A fabric shop owner in Bouira city sees "Donate" → pledges 30 → gets the pledge card.
3. Drops them at CRA before 20:00; staff taps his code → line shows 77/80 → CRA truck delivers with their own 50 → **Delivered → Confirmed** by Karim (module 16 lifecycle). **Resolved state:** the donor can open the line and see "delivered to CEM shelter, confirmed" — his 30 blankets, traceable.
4. *Surplus branch:* someone arrives with clothes → staff points at the NOT-needed banner, offers the standing textile-recycling line if one exists — refusal has a script, and the platform is the bad guy so the volunteer doesn't have to be.

### Low-connectivity behavior
Donor browsing caches; pledge codes work offline at drop-off (short numeric codes readable over a phone call).

### Priority: **High**
Ships right after the needs board; it is the same rails with a public door.

---

## Financial Donations (verified campaigns directory)

### What it is
A directory of **verified fundraising campaigns** run by accredited organizations. Each campaign card: the organization (accreditation badge + registry number), the goal stated in needs-board terms ("fund 3 water tankers for Tizi Ouzou communes"), the organization's own official payment channels (CCP account, Baridimob RIP, or their site — payment details rendered as **non-editable verified fields** shown exactly as accredited, with a report button, so screenshots of fake accounts can be checked against the platform), and a **transparency feed**: purchases and deliveries the organization posts, cross-linked to confirmed needs-board lines wherever possible.

### Why it matters
After every fire season, fake collection accounts bloom on social media and burn public trust; meanwhile honest associations can't prove their follow-through. A verification directory attacks both: donors check before sending, organizations show receipts→deliveries. Serves goals: **increase transparency, reduce misinformation**.

### Who uses it
- **Citizens & diaspora** (Lynda): find a trustworthy destination for money; verify an account number someone WhatsApped her.
- **NGO Coordinators:** publish campaigns, maintain transparency feeds.
- **Admins:** accredit organizations, review campaign claims, handle reports of impersonation.

### How the user interacts
"Donate" tile → "Give money" tab → campaign cards, filterable by wilaya/purpose. Each card: **Verify** (shows accreditation), **How to give** (the verified channels), **Follow-through** (the feed). A search box: paste an account number → "✅ matches CRA Bouira's verified campaign" or "⚠️ not a verified campaign account — be careful". Lynda's use case from Paris is exactly this.

### User flow
1. **Entry:** Lynda receives a WhatsApp screenshot soliciting donations to a CCP number. Opens NAJDA → Donate → pastes the number → "⚠️ not verified". She doesn't send, and forwards the NAJDA check instead of the screenshot.
2. She picks the CRA water-tanker campaign → gives via Baridimob directly to the verified RIP.
3. Two weeks later, the campaign's feed shows: tankers contracted → water lines on the needs board **Confirmed** at three communes, linked. **Resolved state:** money moved donor→NGO directly; the platform provided verification in and evidence out.

*Edge — organization stops reporting:* campaigns with silent feeds past a set window get a visible "no updates in X weeks" flag; chronic silence risks accreditation review. Transparency is the rent for the badge.

### Low-connectivity behavior
Directory is lightweight text; the verify-a-number check is the one function that must work on the worst diaspora-roaming connection — it's a single text query.

### Priority: **Medium**
High trust value but not life-critical timing; requires the accreditation process to mature first. The *verify-a-number* check alone may ship earlier as part of anti-misinformation.
