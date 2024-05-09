type Unary = (p: boolean) => boolean
type Binary = (p: boolean, q: boolean) => boolean

const fn: Record<string, Unary | Binary> = {
    AND: (p, q) => p && q,
    OR: (p, q) => p || q,
    IF: (p, q) => !p || q,
    IFF: (p, q) => p == q,
    NOT: (p => !p) as Unary,
}

const char = {
    AND: "&",
    OR:  "|",
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
        .replaceAll("!",   char.NOT)

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

    const flush = () => {
        while (ops.length != 0) {
            if (ops[ops.length-1] == "(") {
                ops.pop()
                while (ops[ops.length-1] == char.NOT) {
                    vars.push([ops.pop()!, vars.pop()!])
                }
                break
            }
            if (ops[ops.length-1] == char.NOT) {
                vars.push([ops.pop()!, vars.pop()!])
            } else {
                vars.push([ops.pop()!, ...vars.splice(-2) as [Expr, Expr]])
            }
        }
    }

    ;[...tokens].forEach(token => {
        // console.log(token, ops, vars)
        if (isOp(token) || token == "(") ops.push(token)
        else if (/[a-zA-Z]/.test(token)) {
            ops.push("(")
            vars.push(token)
            flush()
        }
        else if (token == ")") {
            flush()
        }
    })
    flush()
    return vars[0]
}

const getOpName =
(op: string) =>
    Object.entries(char).find(([k, v]) => v == op)![0]

const strify =
(expr: Expr): string => {
    if (typeof expr == "string")
        return expr
    const [op, ...exprs] = expr
    return `${getOpName(op)}(${exprs.map(strify).join(",")})`
}

import { makeContainer } from "https://deno.land/x/futil@0.1.1/mod.ts"

const $ = makeContainer({})

const fnify =
(expr: Expr): (val: Record<string, boolean>) => boolean => {
    if (typeof expr == "string")
        return val => val[expr]
    const [op, ...exprs] = expr
    return val => $(val)
        .pipe(val => fn[getOpName(op)](
            ...<[boolean, boolean]>exprs.map(expr => fnify(expr)(val))
        ))
        .bypass(tf => console.log(
            strify(expr), "=", tf,
        ))
        .get()
}

{
    const $ = makeContainer({
        strify,
        fnify,
        lex,
        tokenize,
    })

    console.log(
        $("(~a|b)")
        .tokenize()
        .lex()
        .strify()
        .get()
    )
    console.log(
        $("(~a|b)")
        .tokenize()
        .lex()
        .fnify()
        .get()
        ({
            a: true,
            b: true,
            c: true,
            d: true,
        })
    )
}