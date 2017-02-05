// Card

// Create an array of card suit names
export const suits =
    () => [ 'club', 'diamond', 'heart', 'spade' ]

// Create an array of card ranks.
// When is JavaScript going to support array comprehensions? :)
export const ranks =
    () => new Array(13).fill(1).map((_, i) => i + 1)

// Create a new card data structure from a suit name and a rank.
// The value of cards over rank===13 is 10.
export const card =
    (suit, rank) => ({ suit, rank, value: Math.min(10, rank) })

// Create a deck from an array of suit names and an array of ranks.
// A deck is the cross-product of suits x ranks.
export const deck =
    (suits, ranks) =>
        // I'm using reduce in lieu of concatMap. :)
        suits.reduce(
            (cards, suit) => {
                const wholeSuit = ranks.map(cardOfSuit(suit))
                return cards.concat(wholeSuit)
            },
            []
        )

const cardOfSuit =
    suit => rank => card(suit, rank)

// Given a function that produces random integers and a number of times
// to shuffle, create a shuffle function. The shuffle function takes a deck
// and returns a shuffled deck.
// This shuffle algorithm isn't very efficient, but I had fun writing it. :)
// In a real node app, I'd likely use an algorithm that uses localized
// mutation for best performance.
export const shuffler =
    (randomInt, count=100) => deck => {
        const random =
            () => randomInt(1, deck.length - 1)
        const shuffle =
            (deck, i) =>
                i === 0 ? deck : shuffle(cutDeck(deck, random()), i - 1)
        return shuffle(deck, count)
    }

const cutDeck =
    (deck, pos) => deck.slice(pos).concat(deck.slice(0, pos).reverse())

// Given a deck, return a tuple of the first card and the rest of the deck.
export const draw =
    deck => [ deck[0], deck.slice(1) ]

// Given a deck, return a tuple of the first N cards and the rest of the deck.
export const drawN =
    (deck, n=1) => [ deck.slice(0, n), deck.slice(n) ]
