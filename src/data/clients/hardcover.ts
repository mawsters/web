import { AppBaseUrl } from '@/data/static/app'
import { StoreClientPrefix } from '@/data/static/store'
import { env } from '@/env'
import { BookList, QueryResponse, TrendPeriodBooks } from '@/types/hardcover'
import { getStringifiedRecord } from '@/utils/helpers'
import { url } from '@/utils/http'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const Endpoint = `${AppBaseUrl()}/assets`
const TagType = `${StoreClientPrefix}hc`

const SubEndpoints: Record<string, string> = {
  Typesense: env.VITE_PUBLIC_TYPESENSE_HOST,
}
const Services: Record<string, string> = {
  Trending: '/book-trending.json',
  Lists: '/book-list.json',
}

const Routes: Record<string, Record<string, string>> = {
  Typesense: {
    Search: '/multi_search',
  },
}

export const HardcoverClient = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: Endpoint }),
  reducerPath: TagType,
  tagTypes: [TagType],
  endpoints: (build) => ({
    trending: build.query<QueryResponse<TrendPeriodBooks>, undefined>({
      query: () => Services.Trending,
    }),

    lists: build.query<QueryResponse<BookList>, undefined>({
      query: () => Services.Lists,
    }),

    search: build.mutation<
      unknown,
      {
        q: string
      }
    >({
      query: (bodyParams: { q: string }) => {
        const request = url({
          endpoint: `${SubEndpoints.Typesense}`,
          route: Routes.Typesense.Search,
          queryParams: getStringifiedRecord({
            'x-typesense-api-key': env.VITE_PUBLIC_TYPESENSE_KEY,
          }),
        })

        const body = {
          searches: [
            {
              per_page: 30,
              prioritize_exact_match: false,
              // num_typos: 3,
              query_by:
                'title,isbns,series_names,author_names,alternative_titles',
              sort_by: 'users_count:desc,_text_match:desc',
              query_by_weights: '5,5,3,1,1',
              collection: 'Book_production',
              q: bodyParams.q,
              page: 1,
            },
          ],
        }

        return {
          url: `${request.pathname}${request.search}`,
          method: 'POST',
          body,
        }
      },
    }),
  }),
})

export const HardcoverEndpoints = HardcoverClient.endpoints
