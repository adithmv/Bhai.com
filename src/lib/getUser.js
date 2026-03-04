export function getUserFromStorage() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    if (keys.length === 0) return null
    const session = JSON.parse(localStorage.getItem(keys[0]))
    if (!session?.user) return null
    // Check if token is expired
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) return null
    return session.user
  } catch {
    return null
  }
}