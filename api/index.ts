import { AlbumController, ArtistController, SearchController, SongController } from '../src/modules/index'
import { PlaylistController } from '../src/modules/playlists/controllers'
import { App } from '../src/app'
import { handle } from 'hono/vercel'

export const config = { runtime: 'edge' }

const app = new App([
  new SearchController(),
  new SongController(),
  new AlbumController(),
  new ArtistController(),
  new PlaylistController()
]).getApp()

export default handle(app)
