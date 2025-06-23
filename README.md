# Cambio-Website

a website for playing the card game "cambio"

hosted at https://jamie-millsip.github.io/cambio-website/

# READ

this website tracks when a player leaves the site, this is to ensure lobbys only consist of current players, and to ensure the game is not stuck waiting for a player who has left the game to take their turn

ad-blockers prevent this tracking from reaching the backend, and therefore need to be turned off when playing the game

## TODO

- bugs

  - many bugs when an attempted flip interrupts a turn eg

    - allowing the player to take more than one turn
      - a flag exists to prevent users from taking more than one turn (hasActed), this resets at the end of the websocket handler useEffect, therefore after a card is flipped, it is dealt with using the websocket handler, and then the hasActed boolean is set to false, regardless of if the user has acted
      - this issue seems to be fixed, keeping it here in case it occurs again
    - changing card visibility incorrectly -- unknown when this happens, need to try recreating it
    - removing from the draw pile
      - when someone incorrectly flips a card, they are given the top card from the draw pile, if the current user is drawing from the draw pile, they are currently looking at the top card in the pile, therefore if an unsuccessful flip occurs when the current user is drawing, they will know details about the card given to the user that flipped
    - adding to the discard pile
      - when someone correctly flips a card, that card enters the discard pile, becoming the top card in the pile, if the current user is drawing from the discard pile, they are drawing the top card from the pile, therefore if a successful swap happens while the user is drawing from the discard, the card they draw will change and can affect the game (ie drawing a black king instead of red as someone flipped)
    - solution - add a flag to the JSON sent to the backend where:

      - False - if the discard pile is not currently in use (i.e. add / remove from the top of the discard pile)
      - True - if the discard pile is currently in use (i.e. add / remove from the second item in the discard pile)

    - if a card that is selected to be swapped is flipped, the space that card used to occupy is still selected for swap, despite not housing a card

- Gameplay

  - remove players from the game when they flip incorrectly when having 7 cards (currently does nothing)
  - stop abilities from being played if there are not enough cards on the board to play them (<2 cards for swaps, <1 for looks)
  -

- Animations

  - make animations edit zIndex of card-row-container to make the animated card always appear above the other cards

- finish implementing endGame screen

  - sort the players by results, displaying the winner first at the top of the page

- link game to a database

  - save active lobbys and any necessary details in a database
    - ensures that lobbys are not interrupted in the event the backend goes down
    - allows for better scalability as the backend is not storing all variables for all active games

- refactor css to improve the look of the webpage

- research ways of reducing race conditions when calling backend functions (ie when flipping cards)
- allow dynamic scaling of webpage dependent on device type (desktop, tablet, phone)

## HOW TO PLAY

the aim of the game is to have the lowest total in your hand, where:

- each numbered card is worth their number
- for face cards:

  - ace = 1
  - Jack = 11
  - Queen = 12
  - Black King = 13
  - Red King = -2
  - Joker = -1

each player starts off with 4 cards all face down arranged in a 2x2 grid, there is also a draw and discard pile in the center of the game table

- the draw pile is face down, the discard pile is face up
- at the start of the game, the draw pile contains all cards left over after dealing each player 4 cards, and the discard pile is empty

before the game starts each player can look at the bottom two cards in their hand.
the game begins after each player readys up, after this point they can no longer look at their cards

to end the game, a player must call "cambio"

calling cambio takes up that player's entire turn, and therefore must be done at the start of their turn, before they draw a card. after a player calls cambio, all other players are given one more turn before the game ends.

once a player calls "Cambio", their hand is final, cards in their hand cannot be flipped or swapped.

a turn in cambio looks like this:

- firstly, the player draws a card from either the draw or discard pile
- the player then decides to either discard the newly drawn card, or to discard a card from their hand and replace it with the newly drawn card (to discard a card, place it face up on top of the discard pile)

  - some of the cards have special abilities when they are drawn from specifically the draw pile, then immediately discarded:

    - 7 & 8 - allows the player to look at one of their own cards
    - 9 & 10 - allows the player to look at one card belonging to another player
    - Jack - allows the player to swap two cards without looking at them
    - Queen - allows the player to look at two cards and decide whether or not to swap them

- notes for swapping cards:

  - the selected card to swap must currently belong to any player (including the player currently swapping cards)
  - the player can select two cards that belong to the same player
  - the player may choose to not swap any cards

flipping cards:

- players are also able to flip cards (their own or other people's)
- for a card flip to be correct, the flipped card needs to have the same value as the top card in the discard pile
- if the card flip is correct:
  - the flipped card is moved to the discard pile
  - if the flipped card doesn't belong to thee player who flipped it:
    - the player chooses one of their own cards to replace the flipped card
  - no other player can flip a card until the current player discards a new card
- if the card flip is incorrect:
  - the player that flipped is given a new card from the draw pile
  - if the player now has more than 6 cards, they are out of the game

after the game ends:

- each player's score is tallyed up and a winner is decided
- if the player called cambio, they need a score exclusively lower than all other players to win
- if the player did not call cambio, they need a score equal to or lower than all other players to win
- ie in a game with 4 players who all ended with total 2, there would be 3 winners (every player who did not call cambio)
