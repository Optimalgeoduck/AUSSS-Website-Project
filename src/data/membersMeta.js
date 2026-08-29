// Tiny standalone copy of the membership roll-up the Hero needs (just the
// count + freshness), so the Home page never has to pull in the full ~130 KB
// members.generated.js hash table just to print one number.
//
// Keep these values in sync with MEMBERS_META at the top of
// src/data/members.generated.js whenever the roster is regenerated.
export const MEMBERS_META = {
  count: 581,
  asOf: 'As of 20/05/2026',
  generatedAt: '2026-05-22',
}
