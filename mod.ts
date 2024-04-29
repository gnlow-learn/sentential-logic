const not = (p: boolean) => !p
const and = (p: boolean, q: boolean) => p && q
const or = (p: boolean, q: boolean) => p || q
const if_ = (p: boolean, q: boolean) => !p || q
const iff = (p: boolean, q: boolean) => p == q