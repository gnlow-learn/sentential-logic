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
} as const

const tokenize =
(str: string) =>
    str
        .replaceAll("<->", char.IFF)
        .replaceAll("->",  char.IF)
        .replaceAll("|",   char.OR)
        .replaceAll("&",   char.AND)
        .replaceAll("~",   char.NOT)

const lex =
(tokens: string) =>
    tokens == "" ? []
    : /\(/.test(tokens) ? [
        ...lex(/^(.*?)\(/.exec(tokens)?.[1] || ""),
        ...lex(/\((.*)\)/.exec(tokens)?.[1] || ""),
        ...lex(/\)([^)]*?)$/.exec(tokens)?.[1] || "",)
    ]
    : tokens[0] == char.NOT ? ["NOT", tokens.substring(1)]
    : [
        Object.entries(char).find(([k, v]) => v == tokens[1]),
        tokens[0],
        tokens[2],
    ]

console.log(lex(tokenize("(p<->q)->r")))