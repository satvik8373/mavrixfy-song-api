import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { createPlaylistPayload } from '#modules/playlists/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '#common/types'
import type { PlaylistAPIResponseModel, PlaylistModel } from '#modules/playlists/models'
import type { z } from 'zod'

export interface GetPlaylistByLinkArgs {
  token: string
  limit: number
  page: number
}

export class GetPlaylistByLinkUseCase implements IUseCase<GetPlaylistByLinkArgs, z.infer<typeof PlaylistModel>> {
  constructor() {}

  async execute({ token, limit, page }: GetPlaylistByLinkArgs) {
    const { data } = await useFetch<z.infer<typeof PlaylistAPIResponseModel>>({
      endpoint: Endpoints.albums.link,
      params: {
        token,
        n: limit,
        p: page + 1,
        type: 'playlist'
      }
    })

    if (!data) throw new HTTPException(404, { message: 'playlist not found' })

    const playlist = createPlaylistPayload(data)
    return {
      ...playlist,
      songs: playlist.songs || []
    }
  }
}
