# Blackjack – FP in JS without LC

This project was inspired by an interview question in which I was asked to
write some code for a Blackjack-like game in object-oriented JavaScript. At
the end of the interview, I mentioned that I preferred functional programming
patterns over OO patterns when writing JavaScript.  My interviewer suggested
that applications such as games may be better written using OO since they model
real-world objects.  I had heard the same reasoning several times.  

I was intrigued, so this repo contains my attempt to write a game using FP.

But since this is JavaScript, it's not your traditional FP…

## Functional programming in JavaScript without Lambda Calculus

### What?

The minimum requirement for a Functional Programming language is higher-order
functions.  JavaScript qualifies since it allows functions to be passed as
arguments to other functions and allows functions to be returned as
function results.

The latest version of JavaScript, ES2016, offers even more FP concepts,
such as lambdas (via arrow syntax) and generators.

That said, ES2016 doesn't come close to languages that are based on
Lambda Calculus, such as Haskell or OCaml.  In fact, it's missing quite a
few basics, such as operators for function composition or partial function
application.  

And since JavaScript functions are variadic (indefinite number of arguments),
currying is problematic.  Instead, we can write "manually curried" functions:

```js
const cardOfSuit =
    suit => rank => card(suit, rank)
```

There are third-party libs, such as ramda, that introduce advanced FP concepts,
but these libs are often bloated and slow.  More importantly, your code is
now entirely dependent on a third-party lib.  (Note: there's a subtle, but
critical difference between the following scenarios: (a) your _project_ relies
on a third-party lib, (b) your _code_ relies on a third-party lib.  If you
were forced to abandon the third-party lib, which one would likely result in a
refactor?  Which one would force a total rewrite?)

This code attempts to use pure JavaScript.  Guess what.  It's not awful!

### Why?

Why write code like this?

Ultimately, I prefer this style because it increases codebase scalability,
increases team scalability, and increases team velocity.  These being
a direct result of dramatic decreases in cognitive load and app complexity
combined with increases in code quality and separation of concerns.

While all of those topics might take a series of blog posts to fully explain,
I'll continue to highlight some things that come to mind atm…

#### A. Discourage shared mutable state

As you look through the code, you'll see a few patterns that look a lot like
OOP patterns.  There are functions that look like constructors…

```js
export const player =
    (cards, id) => ({ cards, id, state: playStayOrBust(sumCards(cards)) })
```

… and functions that construct new objects by composing other objects together…

```js
export const suits =
    () => [ 'club', 'diamond', 'heart', 'spade' ]

export const ranks =
    () => new Array(13).fill(1).map((_, i) => i + 1)

export const card =
    (suit, rank) => ({ suit, rank, value: Math.min(10, rank) })
```

… etc.  However, you won't see _methods_ on these objects.  In my mind, methods
fall into two broad categories: data mutation and behavior.  Since data objects
are typically created to be shared, then methods strongly encourage coders
to create patterns having Shared Mutable State, which is _always_ a
[bad idea](http://henrikeichenhardt.blogspot.com/2013/06/why-shared-mutable-state-is-root-of-all.html).

Not only does shared mutable state limit parallel processing (including in
async event-based environments like JavaScript), but it also drastically
increases cognitive load by forcing engineers to have a mental map of a very
large part of the application in their heads in order to do anything.

Shared mutable state kills team scalability by forcing all developers to
learn the entire mental map of the application.

Of course, we can't _prevent_ shared mutable state in JavaScript.  However,
we can still write code as if we could.  The resulting code is just as scalable
and can be nearly as robust with sufficient tests and/or types (such as Flow).  

#### B. Ease testing

In FP, behavior is encoded into functions, not methods.  These functions
are typically colocated with the constructors, so it's a similar
pattern to OOP where methods are colocated with their constructor.  

So, why is FP better, then?  It's due to purity and simplicity.

In FP, these functions should be pure, meaning they have no side effects,
and they'd also typically do only one thing at a time.  OOP patterns
encourage side-effects (e.g. `this.myProperty = myArg; return myArg`)
and are almost always written in an imperative style (e.g. "do this,
then do that, then return this other thing").  

To illustrate why purity + simplicity is better, let's look at testing.

If you've used a comprehensive testing library, it included stubs and mocks.
I've seen lots of definitions for these, but for this discussion, let's
say that stubs are idempotent and mocks encode behavior.  Sure, I left
some gray area between those definition, but it won't matter as you'll see.

Most of this repo's functions are simple.  They take some data as arguments
and return some data as a result.  Take this `score` function:

```js
export const score =
    ({ cards }) => {
        const total = sumCards(cards)
        return total <= 21 ? total : 0
    }
```

How easy is this function to test?  Not too tough: create some variations
of the input objects, run them through the function, and compare against some
expected outputs.  You'd basically have a set of simple assertions:

```js
assert.strictEqual(score(anInput), anExpectedOutput)
```

In fact, we could use property-based testing, which could virtually _prove_
that our `score` function is correct with just a few lines of code.  

If the inputs were mutable, method-laden objects, then we'd have to either:
(a) test our `score` function using instances of the _actual_ object classes, or
(b) mock the objects, carefully recreating their behavior.  (Essentially,
we're rewriting our code again!)  

I'd argue that the former is impure testing since we're not isolating the
function.  Instead, we're testing the _combination_ of function plus input
object.  For our simple example, this isn't a big deal.  However, in the
large, we're not writing unit tests any more.  We're writing integration tests.

Speaking of pure tests, we can't create pure tests for our `score` function,
as it's written because it implicitly uses the `sumCards` function.  I made
this design decision while writing the code.  By implicitly using
`sumCards`, the API is simpler and meets the application's requirements,
but loses a bit of flexibility.  

Here's a more flexible variant where `sumCards` is injected:

```js
export const score =
    sumCards => ({ cards }) => {
        const total = sumCards(cards)
        return total <= 21 ? total : 0
    }
```

What's beautiful about this variant is it's simplicity.  It _almost_ only does
one thing: it computes a boolean from a number.  The summing behavior is
delegated to the injected function.

So, how would you test this?  Now that we've eliminated the implicit behavior
of `sumCards`, we're back to a basic input-ouput comparison. In fact, we've
also serendipitously eliminated the need to supply `cards`:

```js
const sumCardsMocker = x => () => x // can a stub get any simpler?
assert(score(sumCardsMocker(17))({}), 17)
assert(score(sumCardsMocker(32))({}), 0)
assert(score(sumCardsMocker(21))({}), 21)
assert(score(sumCardsMocker(22))({}), 0)
```

An ultra-simple stub is all that's needed.  As above, we could use
property-based testing to prove all cases, including edge cases.

You could argue this example could be shown using OOP with DI.  Yep, that's
true.  DI is a powerful architectural IoC pattern in OO, too.  OK, so you're
going to write a class that sums the cards.  Seriously?  I doubt it:

```js
class CardSummer {
    constructor () {}
    sum (cards) {
        return cards.reduce((total, card) => total + card.value)
    }
}
const cardSummer = new CardSummer()
const player = new Player(cards, cardSummer)
player.score()
```

Seems like more cognitive load and maintenance.  I'm guessing you'd be much
less likely to add flexibility or increase testability when it requires
writing a whole new class.

Since functions are far simpler than classes, IoC and compositional patterns
are simpler, so flexible code is more feasible, more maintainable, and
more scalable.

#### C. Separate concerns

TODO ?????????

### Function composition

### Inversion of Control

### Aspect-oriented Programming

TODO: simpler than abstractions using generators.
TODO: declarative patterns eliminate some sources of error over imperative

### Other notes

#### Types

// TODO: suggest Flow

#### ASI

// TODO: I had never hit an ASI problem before! why did it happen here?

#### Side-effects and asynchrony

mention most.js

#### Performance

### Whole functions

// TODO: we could come close if we layered on types

## Run it

// TODO

## Application requirements

(These were originally written as instructions to write code using OOP.)

Implement a simplified version of the blackjack game. You should have a class that represents a card, a class that represents a deck of cards, a class that represents a hand of cards, and game simulator that uses these classes.

- Only need to support 2 players
- Both players play by dealer's rule
    - Must draw new card if value of hand is less than 17
    - Must stop drawing new card otherwise
- Tiebreaker: Player 2 wins when both have equal hands
- Only need to implement stand and hit
    - Don't worry about split, insurance, etc
- You can simply treat ace as a card with value 1
- Your game simulator should print logs similar to this

> Round 1
> Player 1: 11 of diamond (10);10 of spade (10);
> Player 2: 5 of club (5);6 of club (6);
> Player 2 draws new card...
> Round 2
> Player 1: 11 of diamond (10);10 of spade (10);
> Player 2: 5 of club (5);6 of club (6);6 of diamond (6);
> Winner is player 1!
> Winner's hand: 11 of diamond (10);10 of spade (10);
