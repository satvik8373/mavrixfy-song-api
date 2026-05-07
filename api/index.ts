import { handle } from 'hono/vercel'
import { App } from '../src/app'
import { AlbumController, ArtistController, SearchController, SongController } from '../src/modules/index'
import { PlaylistController } from '../src/modules/playlists/controllers'

export const config = { runtime: 'nodejs' }

const app = new App([
  new SearchController(),
  new SongController(),
  new AlbumController(),
  new ArtistController(),
  new PlaylistController()
]).getApp()

export default handle(app)
