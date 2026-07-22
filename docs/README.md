# NAJDA (نجدة) — Platform Design Documentation

NAJDA is a national wildfire emergency coordination platform for Algeria. It connects citizens, emergency responders, volunteers, and NGOs around a single shared picture of the crisis: where the fires are, who needs help, where to go, and what is needed.

This documentation is a **product and UX specification**. It describes features, users, interactions, complete user flows, and priorities. It deliberately contains no technical architecture.

## How to read this suite

1. Start with [00-vision-and-principles.md](00-vision-and-principles.md) — the goals and the design rules every feature obeys.
2. Then [01-users-and-roles.md](01-users-and-roles.md) — who the users are and what each role can do. All module flows use these role names.
3. Each file in [modules/](modules/) is a self-contained spec. Every feature inside follows the same template: **What it is · Why it matters · Who uses it · How the user interacts · User flow · Priority**.
4. [90-priority-matrix.md](90-priority-matrix.md) collects every feature's priority in one table; [91-mvp-roadmap.md](91-mvp-roadmap.md) turns it into a phased rollout.

## Feature → file map

| Feature | Spec file |
|---|---|
| Live Wildfire Map | [modules/10-live-wildfire-map.md](modules/10-live-wildfire-map.md) |
| Emergency Alerts | [modules/11-emergency-alerts.md](modules/11-emergency-alerts.md) |
| Emergency Requests | [modules/12-emergency-requests.md](modules/12-emergency-requests.md) |
| Missing Persons | [modules/13-missing-persons-and-reunification.md](modules/13-missing-persons-and-reunification.md) |
| Family Reunification | [modules/13-missing-persons-and-reunification.md](modules/13-missing-persons-and-reunification.md) |
| "I Am Safe" Check-in *(new)* | [modules/13-missing-persons-and-reunification.md](modules/13-missing-persons-and-reunification.md) |
| Volunteer Management | [modules/14-volunteer-management.md](modules/14-volunteer-management.md) |
| Volunteer Assignments | [modules/14-volunteer-management.md](modules/14-volunteer-management.md) |
| Volunteer Safety Check-in & SOS *(new)* | [modules/14-volunteer-management.md](modules/14-volunteer-management.md) |
| Shelter Management (public finder + operations) | [modules/15-shelter-management.md](modules/15-shelter-management.md) |
| Resource Management | [modules/16-resources-and-distribution.md](modules/16-resources-and-distribution.md) |
| Supply Requests | [modules/16-resources-and-distribution.md](modules/16-resources-and-distribution.md) |
| Water Distribution | [modules/16-resources-and-distribution.md](modules/16-resources-and-distribution.md) |
| Food Distribution | [modules/16-resources-and-distribution.md](modules/16-resources-and-distribution.md) |
| Fuel Distribution | [modules/16-resources-and-distribution.md](modules/16-resources-and-distribution.md) |
| Donations (in-kind + financial) | [modules/17-donations.md](modules/17-donations.md) |
| Medical Coordination | [modules/18-medical-coordination.md](modules/18-medical-coordination.md) |
| Road Closures | [modules/19-roads-and-safe-routes.md](modules/19-roads-and-safe-routes.md) |
| Safe Routes | [modules/19-roads-and-safe-routes.md](modules/19-roads-and-safe-routes.md) |
| Incident Reporting | [modules/20-incident-reporting.md](modules/20-incident-reporting.md) |
| Community Updates | [modules/21-information-hub.md](modules/21-information-hub.md) |
| Frequently Needed Information | [modules/21-information-hub.md](modules/21-information-hub.md) |
| Emergency Contacts | [modules/21-information-hub.md](modules/21-information-hub.md) |
| Local Emergency Centers | [modules/21-information-hub.md](modules/21-information-hub.md) |
| Public Statistics Dashboard | [modules/22-public-dashboard.md](modules/22-public-dashboard.md) |
| Damage Reports | [modules/23-damage-and-recovery.md](modules/23-damage-and-recovery.md) |
| Recovery Tracking | [modules/23-damage-and-recovery.md](modules/23-damage-and-recovery.md) |
| New feature proposals (7 original ideas) | [30-new-feature-proposals.md](30-new-feature-proposals.md) |

Where several features share a file, the grouping is navigational only — each feature has its own complete spec section inside.

## Document index

| Doc | Contents |
|---|---|
| [00-vision-and-principles.md](00-vision-and-principles.md) | Mission, goals, the seven design principles, platform states, verification ladder, location model |
| [01-users-and-roles.md](01-users-and-roles.md) | Role & permission model, personas used across all flows |
| [modules/10–23](modules/) | Feature specifications |
| [30-new-feature-proposals.md](30-new-feature-proposals.md) | Original features beyond the brief |
| [90-priority-matrix.md](90-priority-matrix.md) | Every feature, priority, one-line rationale |
| [91-mvp-roadmap.md](91-mvp-roadmap.md) | Three-phase rollout plan |
