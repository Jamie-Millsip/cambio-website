# TODO

[Back](../README.md)

## general additions / improvements

- link game to a database

  - save active lobbys and any necessary details in a database
    - ensures that lobbys are not interrupted in the event the backend goes down
    - allows for better scalability as the backend is not storing all variables for all active games
  - allows for easier implementation of future potential additions:
    - login system - stores user's username and password and general gameplay statistics, and remember's their nickname

## Gameplay

- remove players from the game when they flip incorrectly when having 7 cards (currently just prevents them from flipping cards)
- prevent users from using abilities on a player if they have called "cambio"

## CSS

- make animations edit zIndex of card-row-container to make the animated card always appear above the other cards
- refactor gamepage css to:
  - allow for better scaling on a range of devices
  - have improved readability (currently some cards are displayed upside down)

[Back](../README.md)
