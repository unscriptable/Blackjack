// A fast compose function that works on a reasonably finite list of functions.
export default
    (f, g, ...rest) =>
        rest.length === 0
            ? composeTwo(f, g)
            : composeMany(f, g, ...rest)

export const composeTwo =
    (f, g, ...rest) => (...x) =>
        f(g(...x))

export const composeMany =
    (f, ...rest) => (...x) => {
        const g = composeMany(...rest)
        return f(g(...x))
    }
