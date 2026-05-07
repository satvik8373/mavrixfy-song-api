# mavrixfy-song-api

Unofficial JioSaavn API powering the **Mavrixfy** music app.

Built on top of [sumitkolhe/jiosaavn-api](https://github.com/sumitkolhe/jiosaavn-api).

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/search/songs?query=&limit= | Search songs |
| GET | /api/search/playlists?query=&limit= | Search playlists |
| GET | /api/playlists?id=&limit=&page= | Get playlist details |
| GET | /api/songs?id= | Get song by ID |
| GET | /api/artists?id= | Get artist by ID |

Full docs at /swagger after deployment.

## Local Dev

bun install
bun run dev
# http://localhost:3000

## Deploy to Vercel

vercel login
vercel --prod

## Credits
Original: https://github.com/sumitkolhe/jiosaavn-api
