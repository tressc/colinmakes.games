# colinmakes.games

[colinmakes.games](https://www.colinmakes.games) is a web based multiplayer card game platform. Users can create or join matches and play against other users in real time.

## Local Development

Clone this repository, install dependencies:

```bash
npm install
```

Create a `.env.development` file in the root directory and add the following:

```txt
NEXT_PUBLIC_URL=http://localhost:8000
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

A separate server is used facilitate multiplayer. Access that repository [here](https://github.com/tressc/colinmakes.games-server) and follow the instructions in the accompanying readme to run locally.

## Project Structure

Currently, there are three routes, all found in the `src/app` directory.

- The landing page, where users sign in.
- Lobby, where they can create or join matches.
- Match, where games are played.

The latter two routes are protected by a function found in `src/utils/withProtectedRoute.jsx`, which will redirect users to the landing page if they are not signed in.

Because the current user's data is used in almost every component, it is stored in a React context, the provider for which wraps the entire application in `src/app/layout.tsx`.

This project leverages the [boardgame.io](https://boardgame.io/) library to define gameplay and facilitate multiplayer functionality.

The `src/games` directory contains files which define game behavior, such as legal moves, endgame conditions, and state.

The `src/boards` directory determine how these games should be presented on the client.

A [separate node server](https://github.com/tressc/asobi-server) hosts REST endpoints for lobby actions such as creating and joining matches, and [socket.io](https://socket.io/) connections for updating matches between multiple users in real time.

## Features

- [x] Real time multiplayer
- [x] Mobile friendly
- [ ] User authentication
- [ ] Match history

## Technologies

- Next.js
- Boardgame.io
- Tailwind CSS
- TypeScript

## Credits

- [Dicier Font](speakthesky.itch.io/typeface-dicier), Speak the Sky, [CC BY4.0 Licence](creativecommons.org/licenses/by/4.0/)
- Images from [https://livinginjapan.net/](https://livinginjapan.net/)
- Setto inspired by [Okiya](https://boardgamegeek.com/boardgame/125311/okiya)
