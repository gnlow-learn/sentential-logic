type Unary = (p: boolean) => boolean
type Binary = (p: boolean, q: boolean) => boolean

const not: Unary = p => !p

const { and, or, if_, iff }: Record<string, Binary> = {
    and: (p, q) => p && q,
    or: (p, q) => p || q,
    if_: (p, q) => !p || q,
    iff: (p, q) => p == q,
}

const char = {
    AND: "&",
    OR:  "v",
    IF:  "→",
    IFF: "↔",
    NOT: "~",
}

const tokenize =
(str: string) =>
    str
        .replaceAll("<->", char.IFF)
        .replaceAll("->",  char.IF)
        .replaceAll("|",   char.OR)
        .replaceAll("&",   char.AND)
        .replaceAll("~",   char.NOT)

const isOp =
(c: string) =>
    Object.values(char).includes(c)

type Expr =
    | string
    | [string, Expr]
    | [string, Expr, Expr]

const lex =
(tokens: string) => {
    const ops: string[] = []
    const vars: Expr[] = []
    ;[...tokens].forEach(token => {
        if (isOp(token)) ops.push(token)
        else if (/[a-zA-Z]/.test(token)) vars.push(token)
        else if (token == ")") {
            if (ops[ops.length-1] == char.NOT) {
                vars.push([ops.pop()!, vars.pop()!])
            } else {
                vars.push([ops.pop()!, ...vars.splice(-2) as [Expr, Expr]])
            }
        }
    })
    if (ops.length != 0) {
        if (ops[ops.length-1] == char.NOT) {
            vars.push([ops.pop()!, vars.pop()!])
        } else {
            vars.push([ops.pop()!, ...vars.splice(-2) as [Expr, Expr]])
        }
    }
    return vars[0]
}

console.log(lex(tokenize("(p<->q)->r")))