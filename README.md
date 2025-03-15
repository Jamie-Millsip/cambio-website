# Cambio-Website

a website for playing the card game "cambio"

## TODO

- finish implementing card flipping

  - ensure a player can only flip a card if they were not the one to most recently discard
  - ensure only one card can be flipped for each discarded card

- add functionality to "cambio" button

## HOW TO PLAY

- the aim of the game is to have the lowest total in your hand, where:

  - each numbered card is worth their number
  - for face cards:
    - ace = 1
    - Jack = 11
    - Queen = 12
    - Black King = 13
    - Red King = -2
    - Joker = -1

- each player starts off with 4 cards all face down arranged in a 2x2 grid, there is also a draw and discard pile in the center of the game table
  - the draw pile is also face down, however any discarded card is face up, therefore the discard pile is face up
  - at the start of the game, the discard pile is empty
- before the game starts each player can look at the bottom two cards in their hand
- the game begins after each player readys up, after this point they can no longer look at their cards

- to end the game, one of the players needs to call cambio at the start of their turn, until that point, players will take turns playing the game

- a turn in cambio looks like this:
  - firstly, the player draws a card from either the draw or discard pile
  - the player then decides to either discard the newly drawn card, or to discard a card from their hand and replace it with the newly drawn card
  - if the player draws specifically from the draw pile
