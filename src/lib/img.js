// Make a Google Drive image URL render reliably inside an <img>.
//
// Drive's `uc?export=view` links are served inconsistently when hotlinked,
// while `lh3.googleusercontent.com/d/<id>` is dependable. We normalise any
// Drive/googleusercontent URL to that form. Non-Drive values (data: URIs,
// /assets paths, other hosts) pass through unchanged, so it's safe to wrap
// every photo src with this.
export function driveImg(url) {
  if (typeof url !== 'string') return url
  if (!/drive\.google\.com|googleusercontent\.com/.test(url)) return url
  const m = url.match(/(?:\/d\/|[?&]id=|\/file\/d\/)([A-Za-z0-9_-]{20,})/)
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}=w1000` : url
}
