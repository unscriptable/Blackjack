// Player

// Create a plaer data structure from a deck of cards and an identifier.
// The player state is initialized.
export const player =
    (cards, id) => ({ cards, id, state: playStayOrBust(sumCards(cards)) })

// Given a player and a new card, return a new player having the new card in
// her/his deck.
export const hit =
    ({ cards, id }, card) =>
        player(cards.concat(card), id)

const playStayOrBust =
    total => total < 17 ? 'play' : total <= 21 ? 'stay' : 'bust'

// Return a player's current game score.
export const score =
    ({ cards }) => {
        const total = sumCards(cards)
        return total <= 21 ? total : 0
    }

const sumCards =
    cards => cards.reduce((sum, card) => sum + card.value, 0)
