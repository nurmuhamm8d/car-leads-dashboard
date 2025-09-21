let state = { data: [], updatedAt: null }
export function getCache() { return state }
export function setCache(data) { state = { data, updatedAt: new Date().toISOString() } }
