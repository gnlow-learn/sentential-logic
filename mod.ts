type Unary = (p: boolean) => boolean
type Binary = (p: boolean, q: boolean) => boolean

const not: Unary = p => !p

const { and, or, if_, iff }: Record<string, Binary> = {
    and: (p, q) => p && q,
    or: (p, q) => p || q,
    if_: (p, q) => !p || q,
    iff: (p, q) => p == q,
}

type Parser<A> = (str: string) => [A, string][]

const bind =
<A>(p: Parser<A>) =>
<B>(f: (a: A) => Parser<B>): Parser<B> =>
(str: string) => p(str).flatMap(([a, rest]) => f(a)(rest))

const char =
(type: string, cond: (char: string) => boolean) =>
(result: string): Parser<string> =>
    ([head, ...tail]) =>
        cond(head)
            ? [[`${result} ${type}(${head})`, tail.join("")]]
            : []

const option =
<A>
(p: Parser<A>) =>
(q: Parser<A>): Parser<A> =>
(str: string) => [
    ...p(str),
    ...q(str),
]

const p: Record<string, (result: string) => Parser<string>> = {
    upperChar: char("upper", char => "A" <= char  && char <= "Z"),
    lowerChar: char("lower", char => "a" <= char  && char <= "z"),
}

const anyChar = (result: string) => option(p.upperChar(result))(p.lowerChar(result))

console.log(bind(anyChar(""))(anyChar)("Ab"))