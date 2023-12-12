[![Depfu](https://badges.depfu.com/badges/00d6d7706b342f7a9993d0081fa472d8/status.svg)](https://depfu.com)
[![Depfu](https://badges.depfu.com/badges/00d6d7706b342f7a9993d0081fa472d8/overview.svg)](https://depfu.com/github/TheRealOwenRees/chess-pdf-api?project_id=39437)

# Chess PDF API

This is a simple REST API that takes a PGN file and returns a PDF of the game. 

This is not currently available as a public API, but this is currently being worked on.


## API Reference

#### Check health status of API

```http
GET /health
```
```json
{
  "type": "success",
  "message": "API is up and running"
}
```


#### Generate PDF

```http
POST /api/v1/pdf
```

| Parameter      | Type      | Description                                                                                                                                                                                          |
|:---------------|:----------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pgn`          | `string`  | **Required**. A valid PGN of a chess game.                                                                                                                                                           |
| `diagrams`     | `array`   | An array of objects, containing:<br/> - `ply`(integer): The move ply for a chess diagram.<br/> - `fen`(string): A FEN of the board position, for rendering the correct diagram at the ply specified. |
| `diagramClock` | `boolean` | Display move times above and below the chessboard.                                                                                                                                                   |                                                                                                                                                  |

### Example
```json
{
  "pgn": "[Event \"URS-chJ\"]\n[Site \"Kherson\"]\n[Date \"1991.??.??\"]\n[Round \"?\"]\n[White \"Ibragimov, Ildar\"]\n[Black \"Kramnik, Vladimir\"]\n[Result \"0-1\"]\n[ECO \"A88\"]\n[WhiteElo \"2455\"]\n[BlackElo \"2480\"]\n[PlyCount \"110\"]\n[EventDate \"1991.??.??\"]\n[Source \"ChessBase\"]\n\n1. d4 {A88: Dutch Defence: Leningrad System: 5 Nf3 0-0 6 0-0 d6 7 Nc3 c6} 1...\nd6 2. c4 f5 3. Nf3 Nf6 4. g3 g6 0-1\n",
  "diagrams": [
    {
      "ply": 6,
      "fen": "rnbqkb1r/ppp1p1pp/3p1n2/5p2/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4"
    },
    {
      "ply": 10,
      "fen": "rnbqkb1r/pp2p1pp/2pp1n2/5p2/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 6"
    }
  ],
  "diagramClock": false
}
```

A successful response will return a PDF file of the game with the following headers:
```http
'Content-Type': 'application/pdf',
'Content-Disposition': 'inline'
```

In order to deal with this stream in the browser, you can use the following code in your response handler:
```javascript
const fileURL = URL.createObjectURL(blob)
const newTab = window.open(fileURL, '_blank')
if (newTab) newTab.focus()
```
This will open the PDF in a new tab.
