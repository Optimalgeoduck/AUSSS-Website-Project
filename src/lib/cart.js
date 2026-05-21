import { useSyncExternalStore } from 'react'
import { productById } from '../data/merchProducts.js'

// ── Cart store ───────────────────────────────────────────────────────────
// Lines are keyed by productId + size + design so the same shirt in two
// sizes shows up as two separate lines (same as any normal storefront).
//
// Persisted to localStorage so a tab reload preserves the cart while
// users wander between /merch and /merch/checkout.

const STORAGE_KEY = 'ausss-cart-v1'

function readInitial() {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] }
    // Drop lines whose product no longer exists (catalogue edits) so a stale
    // cart can never block checkout.
    return {
      items: parsed.items.filter((it) => productById[it.productId]),
    }
  } catch (_) {
    return { items: [] }
  }
}

let state = readInitial()
const listeners = new Set()

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (_) {}
}
function emit() {
  persist()
  listeners.forEach((cb) => cb())
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

const lineKey = (productId, size, design) =>
  `${productId}::${size || ''}::${design || ''}`

export function addToCart({ productId, size = '', design = '', qty = 1 }) {
  if (!productById[productId]) return
  const key = lineKey(productId, size, design)
  const existing = state.items.find(
    (it) => lineKey(it.productId, it.size, it.design) === key,
  )
  if (existing) {
    state = {
      items: state.items.map((it) =>
        it === existing ? { ...it, qty: it.qty + qty } : it,
      ),
    }
  } else {
    state = { items: [...state.items, { productId, size, design, qty }] }
  }
  emit()
}

export function updateQty({ productId, size = '', design = '', qty }) {
  const key = lineKey(productId, size, design)
  state = {
    items: state.items
      .map((it) =>
        lineKey(it.productId, it.size, it.design) === key
          ? { ...it, qty: Math.max(0, qty) }
          : it,
      )
      .filter((it) => it.qty > 0),
  }
  emit()
}

export function removeFromCart({ productId, size = '', design = '' }) {
  const key = lineKey(productId, size, design)
  state = {
    items: state.items.filter(
      (it) => lineKey(it.productId, it.size, it.design) !== key,
    ),
  }
  emit()
}

export function clearCart() {
  state = { items: [] }
  emit()
}

// ── Selectors ────────────────────────────────────────────────────────────

function getState() {
  return state
}

export function useCart() {
  return useSyncExternalStore(subscribe, getState, getState)
}

export function cartCount(s = state) {
  return s.items.reduce((n, it) => n + it.qty, 0)
}

export function cartSubtotal(s = state) {
  return s.items.reduce((sum, it) => {
    const p = productById[it.productId]
    return sum + (p?.price || 0) * it.qty
  }, 0)
}

export function useCartCount() {
  const s = useCart()
  return cartCount(s)
}

export function useCartSubtotal() {
  const s = useCart()
  return cartSubtotal(s)
}

// Tiny formatter — EGP first, no decimals (the catalogue is round numbers).
export function formatEGP(n) {
  return `${Number(n || 0).toLocaleString('en-EG')} EGP`
}

export { lineKey }

// ── Drawer open/close — shared state so any button can toggle it ─────────
let drawerOpen = false
const drawerListeners = new Set()
function drawerSubscribe(cb) {
  drawerListeners.add(cb)
  return () => drawerListeners.delete(cb)
}
function drawerGet() {
  return drawerOpen
}
export function openCartDrawer() {
  if (drawerOpen) return
  drawerOpen = true
  drawerListeners.forEach((cb) => cb())
}
export function closeCartDrawer() {
  if (!drawerOpen) return
  drawerOpen = false
  drawerListeners.forEach((cb) => cb())
}
export function useCartDrawerOpen() {
  return useSyncExternalStore(drawerSubscribe, drawerGet, () => false)
}
