# Priority Matrix

Every feature in the suite, with its priority as stated in its module spec and a one-line rationale tied to the platform goals (doc 00). Priorities answer one question: *how directly does this feature stand between a person and harm, and what must exist before it can work?*

## Critical — the platform's reason to exist; ships first or nothing else matters

| Feature | Spec | Rationale |
|---|---|---|
| Emergency Contacts | [21](modules/21-information-hub.md) | Two taps to professional help; works when everything else is down; trivial to build |
| Live Wildfire Map | [10](modules/10-live-wildfire-map.md) | The shared operating picture every stakeholder and module hangs off |
| Incident Reporting | [20](modules/20-incident-reporting.md) | The map's raw feed; early detection is the cheapest firefighting there is |
| Emergency Alerts | [11](modules/11-emergency-alerts.md) | The most direct life-saving push: evacuate now, here's where, avoid that road |
| Emergency Requests | [12](modules/12-emergency-requests.md) | "Who needs help" turned from lost phone calls into a triaged queue |
| Road Closures | [19](modules/19-roads-and-safe-routes.md) | The information whose absence most directly kills during evacuation |
| Shelter Finder (public) | [15](modules/15-shelter-management.md) | Alerts without a working "where to go" are half an evacuation |
| Missing Persons | [13](modules/13-missing-persons-and-reunification.md) | The post-evacuation crisis; replaces the privacy-blind Facebook search |

## High — makes the Critical core coordinated, safe, and true; ships in the same season

| Feature | Spec | Rationale |
|---|---|---|
| "I Am Safe" Check-in *(new)* | [13](modules/13-missing-persons-and-reunification.md) | Cheapest load-shedder: prevents missing cases and reassurance-call floods |
| Family Reunification | [13](modules/13-missing-persons-and-reunification.md) | The matcher that turns check-in lists and missing reports into found people |
| Volunteer Management | [14](modules/14-volunteer-management.md) | Who can help, with what, verified — the registry assignments stand on |
| Volunteer Assignments | [14](modules/14-volunteer-management.md) | Converts willingness into staffed, located, time-boxed, safe work |
| Volunteer Safety Check-in & SOS *(new)* | [14](modules/14-volunteer-management.md) | Non-negotiable companion to assignments; volunteers come back |
| Shelter Operations | [15](modules/15-shelter-management.md) | Makes shelter data self-sustaining; where five modules converge |
| Resource Management | [16](modules/16-resources-and-distribution.md) | Coarse-but-maintained stock signal; lets coordinators push before shortage |
| Supply Requests (needs board) | [16](modules/16-resources-and-distribution.md) | The claim-lock kills duplicate asks and black holes; heart of logistics |
| Water Distribution | [16](modules/16-resources-and-distribution.md) | First survival supply when networks burn; schedules people can catch |
| Food Distribution | [16](modules/16-resources-and-distribution.md) | Most duplicated *and* most gapped aid; coverage view fixes both |
| In-Kind Donations | [17](modules/17-donations.md) | Aims existing generosity at real needs; "NOT needed" is half the value |
| Medical Coordination | [18](modules/18-medical-coordination.md) | Routes burns to the right door; surfaces the silent chronic-care wave |
| Safe Routes | [19](modules/19-roads-and-safe-routes.md) | The last link in the evacuation chain; one step behind closure data by design |
| Community Updates | [21](modules/21-information-hub.md) | The rumor-displacement machine: verified local facts, read-only |
| Frequently Needed Information | [21](modules/21-information-hub.md) | Pre-cached, audible answers to the questions panic improvises badly |
| Local Emergency Centers | [21](modules/21-information-hub.md) | Every digital dead-end lands at a physical desk with a person |
| Misinformation Flagging & Badges *(new)* | [30](30-new-feature-proposals.md) | Keeps the verification ladder true at citizen scale; reaches into WhatsApp |

## Medium — real value, but consumes data or calm time the earlier tiers must create

| Feature | Spec | Rationale |
|---|---|---|
| Fuel Distribution | [16](modules/16-resources-and-distribution.md) | Vital but narrow; deliberately coordinator-gated; cheap on needs-board rails |
| Financial Donations directory | [17](modules/17-donations.md) | High trust value, not life-critical timing; needs accreditation to mature |
| Public Statistics Dashboard | [22](modules/22-public-dashboard.md) | Transparency needs numbers worth showing first |
| Damage Reports | [23](modules/23-damage-and-recovery.md) | Post-crisis by nature — but must be *ready* before the first season ends |
| Recovery Tracking | [23](modules/23-damage-and-recovery.md) | The long-tail accountability board; follows the damage register |
| Vulnerable Persons Registry *(new)* | [30](30-new-feature-proposals.md) | Critical-grade payoff on fire day; built in calm time, so doesn't gate MVP |
| Livestock & Agriculture lane *(new)* | [30](30-new-feature-proposals.md) | Request type and guides ride hosts at near-zero cost; aid layers are the Medium part |
| Relay Captains *(new)* | [30](30-new-feature-proposals.md) | The human last-kilometer; organizationally cheap, scales with the hardest users |
| Pre-Season Preparedness Mode *(new)* | [30](30-new-feature-proposals.md) | Season two's difference between a platform that decays and one that compounds |

## Low

| Feature | Spec | Rationale |
|---|---|---|
| Season Archive (after-action view) | [22](modules/22-public-dashboard.md) | Waits for a completed season by definition; planning gold thereafter |
