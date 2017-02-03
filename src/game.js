// Game

export const game =
    (deck, players) => ({ deck, players, round: 0, winner: null })

export const dealer =
    (draw, hit) => (deck, player) => {
        let card
        [ card, deck ] = draw(deck)
        return [ deck, hit(player, card) ]
    }

// Each round has a turn where dealer deals and player plays.
export const turn =
    deal => (deck, player) =>
        // TODO: hide details of player states
        player.state === 'play'
            ? deal(deck, player)
            : [ deck, player ]

export const round =
    (oneTurn, score) => game => {
        // let each player take a turn
        // Note: localized mutation of `deck` and `players`
        let { deck, players } = game
        for (const i in players) {
            let player = players[i]
            ;[ deck, player ] = oneTurn(deck, players[i]) // darn you, ASI
            players[i] = player
        }

        // compute winner, if any
        // TODO: consider calculating score when dealing card instead of here
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

export const gameIsOver =
    ({ winner, nobodyWins }) => winner != null || nobodyWins
