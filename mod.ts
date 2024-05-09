type Unary = (p: boolean) => boolean
type Binary = (p: boolean, q: boolean) => boolean

const not: Unary = p => !p

const { and, or, if_, iff }: Record<string, Binary> = {
    and: (p, q) => p && q,
    or: (p, q) => p || q,
    if_: (p, q) => !p || q,
    iff: (p, q) => p == q,
}
