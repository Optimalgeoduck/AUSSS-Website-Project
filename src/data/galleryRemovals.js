// Soft-delete list for gallery photos. Any photo whose `full` path appears
// here is hidden from every visitor (album grids, covers, counts). Nothing
// is deleted from disk, so removals are fully reversible — just delete the
// line. Photos can be marked visually in admin mode (visit /gallery?admin=1),
// then exported here with the "Copy removal list" button.
//
// NOTE: the photos marked on 2026-05-21 were baked out at the source level
// (the pipeline excludes them AND their visual twins, then backfills), so this
// list is empty again. Use it for takedown requests between pipeline runs.

export const removed = [
  '/assets/gallery/aswan-nga/009-full.jpg',
  '/assets/gallery/aswan-nga/016-full.jpg',
]
