// Soft-delete list for gallery photos. Any photo whose `full` path appears
// here is hidden from every visitor (album grids, covers, counts). Nothing
// is deleted from disk, so removals are fully reversible, just delete the
// line. Photos can be marked visually in admin mode (visit /gallery?admin=1),
// then exported here with the "Copy removal list" button.
//
// NOTE: cleared 2026-05-22 for the full re-index off the "New Photos" source
// batch. Output paths are renumbered every run, and the old source files these
// referenced no longer exist on disk, so the two prior aswan-nga takedowns
// (009/016) would now hide arbitrary new photos. After reviewing the new aswan
// album, re-mark via /gallery/admin if those individuals reappear. Use this
// file for takedown requests between pipeline runs.

export const removed = []
