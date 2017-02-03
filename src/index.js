import { suits, ranks, deck, shuffler, draw, drawN, rankName } from './card'
import { player, hit, score } from './player'
import { game, dealer, decide, turn, round, gameIsOver }
    from './game'
import { before } from './fn'
import { displayDeal, displayStatus, displayFinal } from './display'

export const main =
    () => {
        // In most apps, we'd gather and validate the config as well as any
        // OS-level I/O and pass them to run.  But this app only needs output.
        run(console.log)
    }

const run =
    (out) => {
        out('Let\'s play Blackjack!\n')

        // Compose game functions, adding output side effects
        const randomInt = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min
        const shuffle = shuffler(randomInt)
        const deal = before(dealer(draw, hit), displayDeal(out, rankName))
        const doTurn = turn(deal)
        const doRound = before(round(doTurn, score), displayStatus(out))

        // Set up game data
        let myDeck, cards, myGame
        myDeck = shuffle(deck(suits(), ranks()))
        ;[ cards, myDeck ] = drawN(myDeck, 2) // ugh, ASI fail!
        const player1 = player(cards, 1)
        ;[ cards, myDeck ] = drawN(myDeck, 2) // ugh, ASI fail!
        const player2 = player(cards, 2)
        myGame = game(myDeck, [ player1, player2 ])

        // Run game
        do {
            myGame = doRound(myGame)
        } while (!gameIsOver(myGame))

        displayFinal(out)(myGame)
    }
