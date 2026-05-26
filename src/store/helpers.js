// helpers.js
export const compareids = (p = {}, payload = {}) => {
  return payload.product == p.product
}

export const findproduct = (arr = [], payload = []) => {
  return arr.find(p => compareids(p, payload))
}