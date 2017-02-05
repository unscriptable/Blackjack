import { suits, ranks, deck, shuffler, draw, drawN, rankName } from './card'
import { player, hit, score } from './player'
import { game, dealer, decide, turn, round, gameIsOver }
    from './game'
import { before } from './fn'
import { displayDeal, displayStatus, displayFinal } from './display'

// The main entry point of the app.
// This is just a simple game, but in more configurable apps, this function
// might accept command-line arguments, etc.
export const main =
    () => {
        // In most apps, we'd gather and validate the config as well as any
        // OS-level I/O and pass them to run.  But this app only needs output.
        run(console.log)
    }

// This is the application's composition plan.  A larger app might have more
// than one plan (but ideally, microservices will be small enough to only
// require one).  The application is handed it's configuration and it's
// representation of the outside world (I/O).  If we wanted to add command-
// line arguments to this app, we could pass those in here.  Some candidate
// configuration params include: number of players, number of time to shuffle.
const run =
    (out) => {
        out('Let\'s play Blackjack!\n')

        // Compose game functions, adding output side effects (`before` advice)
        const randomInt = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min
        const shuffle = shuffler(randomInt)
        const deal = before(dealer(draw, hit), displayDeal(out, rankName))
        const doTurn = turn(deal)
        const doRound = before(round(doTurn, score), displayStatus(out))

        // Set up game data
        let myDeck, cards, myGame
        myDeck = shuffle(deck(suits(), ranks()), 200)
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
