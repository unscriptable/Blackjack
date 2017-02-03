// Display functions

export const displayStatus =
    display => {
        const displayRound = game => display(showRound(game))
        const displayPlayer = player => display(showPlayer(player))
        return game => {
            displayRound(game)
            game.players.forEach(displayPlayer)
            display('') // blank line
        }
    }

export const displayDeal =
    display => (_, { id }) =>
        display(`Player ${id} takes a hit...`)

export const displayFinal =
    display => {
        const displayPlayer = player => display(showPlayer(player))
        return game => {
            display('\nGame over.')
            game.players.forEach(displayPlayer)
            display(showWinner(game))
        }
    }

const showCard =
    ({ suit, rank, value }) => `${showRank(rank)} of ${suit}s (${value});`

const showPlayer =
    ({ cards, id, state }) =>
        `Player ${id}: ${cards.map(showCard).join(' ')}` // + ` ${state}`

const showRound =
    ({ round }) => `Round ${round + 1}`

const showWinner =
    ({ winner }) =>
        winner ? `Winner is ${winner.id}!` : `Nobody wins. :(`

const showRank =
    rank => {
        switch (rank) {
            case 1: return 'ace'
            case 11: return 'jack'
            case 12: return 'queen'
            case 13: return 'king'
            default: return rank
        }
    }
