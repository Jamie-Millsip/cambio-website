# Cambio-Website

a website for playing the card game "cambio"

hosted at https://jamie-millsip.github.io/cambio-website/

# IMPORTANT

this website tracks when a player leaves the site, this is to ensure lobbys only consist of current players, and to ensure the game is not stuck waiting for a player who has left the game to take their turn

ad-blockers prevent this tracking from reaching the backend, and therefore need to be turned off when playing the game

## Links and Documents

[How to Play](./documents/how-to-play.md)

[Planned Improvements](./documents/todo.md)

[Known Bugs / Issues](./documents/known-bugs.md)

## Tech Stack

- Frontend:
  - built using React as website responsiveness was a priority
  - hosted on github pages
  - for communication with backend:
    - axios for standard HTTP requests (fetching / sending game data)
    - stomp for websocket communications (live updates to game state to all users in a lobby)
    - navigator.sendbeacon used for sending page closure information (allows absent players to be removed from the lobby)
- backend:
  - server built using Spring Boot Framework
  - packaged into a docker container to be hosted by a third party service
  - database hosted on Supabase for integrated authentication & high security
