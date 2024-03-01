import { StoreClientPrefix } from '@/data/static/store'
import { List, ListType } from '@/types/shelvd'
import { logger } from '@/utils/debug'
import { getStringifiedRecord } from '@/utils/helpers'
import { url } from '@/utils/http'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/** @deprecated for scaffold purposes only */
const getEndpoint = (
  options: {
    isAbsolute?: boolean
  } = {
    isAbsolute: false,
  },
) => {
  if (!options.isAbsolute && typeof window !== 'undefined') return '' // Browser should use relative URL
  if (import.meta.env.VITE_VERCEL_URL)
    return `https://${import.meta.env.VITE_VERCEL_URL}` // SSR should use Vercel URL
  return `http://localhost:${import.meta.env.VITE_SHELVD_PORT ?? 3000}` // Development SSR should use localhost
}

const Endpoint = getEndpoint({ isAbsolute: true })
const TagType = `${StoreClientPrefix}shelvd`

const Services: Record<string, string> = {
  Lists: '/lists',
}

export const ShelvdClient = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: Endpoint }),
  reducerPath: TagType,
  tagTypes: [TagType],
  endpoints: (build) => ({
    getLists: build.query<Record<ListType, List[]>, void>({
      query: () => {
        const request = url({
          endpoint: `${Endpoint}${Services.Lists}`,
          route: '',
        })

        return {
          url: `${request.pathname}${request.search}`,
          method: 'GET',
        }
      },
      providesTags: [TagType],
    }),

    createList: build.mutation<List, List>({
      query: (list: List) => {
        const request = url({
          endpoint: `${Endpoint}${Services.Lists}`,
          route: '',
        })

        logger(
          { breakpoint: '[shelvd.api.ts:57]/createList' },
          {
            list,
          },
        )

        return {
          url: `${request.pathname}${request.search}`,
          method: 'POST',
          body: getStringifiedRecord(list),
        }
      },
      invalidatesTags: [TagType],
    }),
  }),
})

export const ShelvdEndpoints = ShelvdClient.endpoints
export const { useCreateListMutation } = ShelvdClient
