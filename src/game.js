// Game

// Create a game data structure from a deck of cards and an array of players.
export const game =
    (deck, players) => ({ deck, players, round: 0, winner: null })

// Given a function that draws a card from a deck and a function that adds
// a card to a player, create a function that deals a card to a player.
// TODO: give this function a better name.  "dealer" sounds like a contructor.
export const dealer =
    (draw, hit) => (deck, player) => {
        let card
        [ card, deck ] = draw(deck)
        return [ deck, hit(player, card) ]
    }

// Given a function that deals a card (see `dealer` function),
// create a function that performs the state transition for a single player.
// In other words, it runs one player's "turn" in the game.
// Each round has a turn where dealer deals and player plays.
export const turn =
    deal => (deck, player) =>
        player.state === 'play'
            ? deal(deck, player)
            : [ deck, player ]

// Given a function that performs the state transition for one player (`aTurn`)
// and a function that computes a player's score, create a function that
// performs the state transition for the entire game.
// In other words, it runs one round wherein each player takes a turn.
// TODO: this function is a bit unweildy.  It needs a refactor!
export const round =
    (aTurn, score) => game => {
        // let each player take a turn
        // Note: localized mutation of `deck` and `players`
        let { deck, players } = game
        for (const i in players) {
            let player = players[i]
            ;[ deck, player ] = aTurn(deck, players[i]) // darn you, ASI
            players[i] = player
        }

        // compute winner, if any
        // TODO: consider calculating score when dealing card instead of here?
        let highScore = 0
        let winner = null
        let gameover = true
        for (const player of players) {
            if (player.state === 'play' || player.state === 'stay') {
                gameover = false
            }
            if (player.state === 'stay') {
                const total = score(player)
                if (highScore < total) {
                    highScore = total
                    winner = player
                }
            }
        }

        const nobodyWins = gameover

        return { deck, players, round: game.round + 1, winner, nobodyWins }
    }

// Return a boolean to determine when a game is over.
export const gameIsOver =
    ({ winner, nobodyWins }) => winner != null || nobodyWins
