# Blackjack

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
