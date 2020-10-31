# Welcome to the 2020 Atomic Games Challenge

Thanks very much for taking on the Connect Four challenge. We hope you have a lot of fun with it.

The ao-game-server.jar application provides a playing field for competing Connect Four AI implementations.

It accepts options to run two AIs against each other, or to host AIs remotely for a game (this is used during the tournament).

## Getting Started

The first thing you'll want to do is install the [Docker](https://www.docker.com/get-started) container manager.

You'll also want to have a command-line terminal application installed, such as Terminal.app or iTerm on Mac and PowerShell on Windows.

Once you have Docker installed, from within your terminal app in the directory where you unzipped these files, run this command:

`docker build -t ao-game-server .`

Once the container has finished building, you can test that the server runs by running the command:

`docker run -it --rm -p 127.0.0.1:8080:8080 ao-game-server`

You should see the message "Started game UI http server on port: 8080" at which point you can visit this url in your browser:
http://localhost:8080/

## Running the game server

You can run the game with the -h option to view the optional program parameters:

`docker run -it --rm ao-game-server -h`

### Options

You can specify that the server should invoke your player, use a "robot" player with a predetermined set of moves, or use a random player for one or both players.

The player can be one of three types:

- remote - the game will listen for a player to connect to the server
- random - the game will make a random valid move for the player
- robot - the game use moves specified in the --p1-moves or --p2-moves argument

The game will log moves to the console and run a webserver on port 8080 for a UI.

Use the `--ui-port` to specify a different UI port.

Pass the `--wait-for-ui` (or just `-w`) option in order to have the server wait for a UI connection before starting the game.

The game will by default time out if a player has not responeded within 15 seconds. You can change this with the `--max-turn-time` arg (`--max-turn-time 20000` for 20 seconds).

Options:
```
      --p1-type TYPE          remote     Player one's type - remote, random, or robot
      --p2-type TYPE          random     Player two's type - remote, random, or robot
      --p1-name NAME          Player One  Player one's team name
      --p2-name NAME          Player Two  Player two's team name
      --p1-moves MOVES        ()          Moves for a P1 robot player, format: "({:column 0} {:column 4})"
      --p2-moves MOVES        ()          Moves for a P2 robot player, format: "({:column 2} {:column 6})"
      --p1-port PORT          1337        Port number for the P1 client
      --p2-port PORT          1338        Port number for the P2 client
      --ui-port PORT          8080        Port number for UI clients
  -w, --wait-for-ui                       Wait for a UI client to connect before starting game
  -m, --min-turn-time MILLIS  1000        Minimum amount of time to wait between turns.
  -x, --max-turn-time MILLIS  15000       Maximum amount of time to allow an AI for a turn.
  -h, --help
```

### Usage

Most of the time during your AI development, you'll probably want to run the default random AI versus your AI executable. You can do this by passing:

`docker run -it --rm -p 1337:1337 ao-game-server --p1-type random --p2-type remote --p2-port 1337`

### Using Docker effectively

For running the game server, you'll always want to use the command `docker run -it --rm ao-game-server` followed by whatever optional parameters you want to pass. This will at the very least give you a text output of the game.

In order to connect your remote player, or to view the game board in your browser, you need to expose the appropriate ports. You can do this using the `-p` command to map specific ports. For example, to map the UI server on port 8080 and the remote player on port 1337:

`docker run -it --rm -p 8080:8080 -p 1337:1337 ao-game-server --p1-type random --p2-type remote --p2-port 1337`

By default, the Docker container exposes ports 8080 (web UI), 1337 and 1338 (remote players). You can use the `-P` command to let Docker automatically map ports for you. For example:

`docker run -it --rm -d -P ao-game-server --p1-type random --p2-type remote` -> Prints container id

(Note: the `-d` flag runs the container in the background)

`docker port <container id>` -> Prints the port mappings, e.g.
```
1337/tcp -> 0.0.0.0:32793
1338/tcp -> 0.0.0.0:32792
8080/tcp -> 0.0.0.0:32791
```

Now you can open the web server at http://localhost:32791, and run your remote client with port 32792.

Stop the running container with:

`docker stop <container id>`

## Implementing an AI

When the game server starts, it will wait for players to connect, then begin executing moves until it determines a winner.

When the game server needs a move from your client it will send the game state as JSON, followed by a newline. For example:

{"board":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],"maxTurnTime":15000,"player":1}\n

Note the "player" field - read this field to determine if you are player one or player two. Your client may be invoked as either player at the start of the game (once a game is in progress your player value shouldn't change).

The "board" data structure is a list of game board rows, from the top to the bottom of the game board. A `0` indicates an open cell and a `1` or `2` represents a piece played by player 1 or player 2.

So at the start of the game, the board might look like:

`[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]`

 After four turns, it could look like:

`[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[2,2,0,0,0,0,0],[1,1,0,0,0,0,0]]`

The AI is expected to return its move as a JSON object with a key of `column` and an integer index from 0-6 representing the column you'd like to drop a piece into, followed by a newline. For example:

`"{'column': 3}\n"`

Remember than an invalid move will result in losing the game. It's also expected that your AI will return within the amount of time allowed. Exceeding the timeout will result in losing the game.

### Starter Kits

Look in the provided "sdks" directory to find starter kits for C#, Java, Javascript, and Python. If you'd rather use a different language, feel free to do so and you can use the starter kits as a reference. Your client just needs to be able to make a websocket connection to a given host and port, to receive data on that websocket, and to send responses in the expected JSON format.

The starter kit implementations are already setup to connect to the game server, read a board state, and then send a response. Your task is to modify them to analyze the game state and return an optimal move.

Good luck!

### AI programming resources

- Focus first on simply picking a language and tools you and your teammate will be productive with, and planning how you'll approach the day.
- We strongly suggest using some form of version control so that you can roll back to a working version if you need to at the end of the day.
- This type of problem lends itself very well to automated tests. Tests may save you a lot of time throughout the day.
- Start by parsing the arguments passed to your executable, and returning a random valid move.
- Once you've created a "random" player, you can look for winning moves, block your opponent's winning moves, or build in other optimizations.
- Advanced solutions will likely use some form of minimax, minimax with alpha-beta pruning, or a monte carlo tree search solution.

Here are some links to algorithms that may or may not be useful:

- Minimax:
http://neverstopbuilding.com/minimax
https://en.wikipedia.org/wiki/Minimax
https://www.youtube.com/watch?v=6ELUvkSkCts

- Minimax with alpha-beta pruning:
https://en.wikipedia.org/wiki/Alpha–beta_pruning
http://web.cs.ucla.edu/~rosen/161/notes/alphabeta.html

- Monte Carlo tree search:
https://en.wikipedia.org/wiki/Monte_Carlo_tree_search
http://sander.landofsand.com/publications/Monte-Carlo_Tree_Search_-_A_New_Framework_for_Game_AI.pdf

- Principal Variation Search:
https://en.wikipedia.org/wiki/Principal_variation_search
http://chessprogramming.wikispaces.com/Principal+Variation+Search

- MTD-f
https://askeplaat.wordpress.com/534-2/mtdf-algorithm/
https://en.wikipedia.org/wiki/MTD-f
