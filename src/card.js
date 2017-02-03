// Card

export const suits =
    () => [ 'club', 'diamond', 'heart', 'spade' ]

export const ranks =
    () => new Array(13).fill(1).map((_, i) => i + 1)

export const card =
    (suit, rank) => ({ suit, rank, value: Math.min(10, rank) })

// A deck is defined the cards created from the cross-product of suits x ranks
export const deck =
    (suits, ranks) =>
        // I'm using reduce in lieu of concatMap.
        suits.reduce(
            (cards, suit) => {
                const wholeSuit = ranks.map(cardOfSuit(suit))
                return cards.concat(wholeSuit)
            },
            []
        )

const cardOfSuit =
    suit => rank => card(suit, rank)

// This shuffle algorithm isn't very efficient, but I had fun writing it. :)
// In a real node app, I'd likely use and algorithm that uses localized
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

export const draw =
    deck => [ deck[0], deck.slice(1) ]

export const drawN =
    (deck, n=1) => [ deck.slice(0, n), deck.slice(n) ]
