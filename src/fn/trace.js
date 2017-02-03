// Simple trace advice (params and result) for functions.
// The error handler will be called when advice throws.

export const after =
    (f, advice) => {
        const callAdvice = squelched(advice)
        return (...x) => {
            const result = f(...x)
            callAdvice(...x, result)
            return result
        }
    }

export const before =
    (f, advice) => {
        const callAdvice = squelched(advice)
        return (...x) => {
            callAdvice(...x)
            return f(...x)
        }
    }

export const full =
    (f, before, after) => {
        const callBefore = squelched(before)
        const callAfter = squelched(after)
        return (...x) => {
            callBefore(x)
            const result = f(...x)
            callAfter(x, result)
            return result
        }
    }

export const errorHandler =
    handle => f => (...x) => {
        try {
            return f(...x)
        }
        catch (err) {
            handle(err)
        }
    }

const squelched =
    advice => (...x) => {
        try { advice(...x) }
        catch (err) {}
    }
