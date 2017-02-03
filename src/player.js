// Player

export const player =
    (cards, id) => ({ cards, id, state: playStayOrBust(sumCards(cards)) })

export const hit =
    ({ cards, id }, card) =>
        player(cards.concat(card), id)

const playStayOrBust =
    total => total < 17 ? 'play' : total <= 21 ? 'stay' : 'bust'

export const score =
    ({ cards, state }) => {
        const total = sumCards(cards)
        return total <= 21 ? total : 0
    }

const sumCards =
    cards => cards.reduce((sum, card) => sum + card.value, 0)
