import { AppBaseUrl } from '@/data/static/app'
import { StoreClientPrefix } from '@/data/static/store'
import { env } from '@/env'
import {
  BaseSearchParams,
  List,
  QueryResponse,
  QuerySearchParams,
  SearchCategory,
  SearchCategoryCollectionParams,
  SearchDocument,
  SearchParams,
  SearchQueryResponse,
  TrendPeriodBooks,
} from '@/types/hardcover'
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

    lists: build.query<QueryResponse<List>, undefined>({
      query: () => Services.Lists,
    }),

    search: build.query<
      SearchQueryResponse<SearchDocument<SearchCategory>>,
      QuerySearchParams & {
        category: SearchCategory
      }
    >({
      query: ({
        category,
        ...searchParams
      }: QuerySearchParams & {
        category: SearchCategory
      }) => {
        const endpoint = `${SubEndpoints.Typesense}`
        const request = url({
          endpoint,
          route: Routes.Typesense.Search,
          queryParams: getStringifiedRecord({
            'x-typesense-api-key': env.VITE_PUBLIC_TYPESENSE_KEY,
          }),
        })

        const categoryParams = SearchCategoryCollectionParams[category]
        const allSearchParams: SearchParams = {
          ...BaseSearchParams,
          ...searchParams,
          ...categoryParams,
        }

        const body = {
          searches: [allSearchParams],
        }

        return {
          url: `${endpoint}${request.pathname}${request.search}`,
          method: 'POST',
          body,
        }
      },
    }),

    searchExact: build.query<
      SearchQueryResponse<SearchDocument<SearchCategory>>,
      {
        category: SearchCategory
        q: QuerySearchParams['q']
      }
    >({
      query: ({
        category,
        ...searchParams
      }: {
        category: SearchCategory
        q: QuerySearchParams['q']
      }) => {
        const endpoint = `${SubEndpoints.Typesense}`
        const request = url({
          endpoint,
          route: Routes.Typesense.Search,
          queryParams: getStringifiedRecord({
            'x-typesense-api-key': env.VITE_PUBLIC_TYPESENSE_KEY,
          }),
        })

        const categoryParams = SearchCategoryCollectionParams[category]
        const allSearchParams: SearchParams = {
          ...BaseSearchParams,
          ...searchParams,
          ...categoryParams,

          page: 1,
          per_page: 30,
          prioritize_exact_match: true,
        }

        const body = {
          searches: [allSearchParams],
        }

        return {
          url: `${endpoint}${request.pathname}${request.search}`,
          method: 'POST',
          body,
        }
      },
    }),
  }),
})

export const HardcoverEndpoints = HardcoverClient.endpoints
