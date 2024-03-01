import {
  CollectionQueryParams as CollectionCreateParams,
  CollectionQueryResponse,
} from '@/types/collections'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { StoreClientPrefix } from '../static/store'

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
const TagType = `${StoreClientPrefix}collections`

export const CollectionClient = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: Endpoint }),
  reducerPath: TagType,
  tagTypes: [TagType],
  endpoints: (build) => ({
    getLists: build.query<Record<string, CollectionQueryResponse[]>, void>({
      query: () => {
        return {
          url: `lists`,
          method: 'GET',
        }
      },
      providesTags: [TagType],
    }),
    // to get the hook for this query will be useGetCollections
    getCollections: build.query<CollectionQueryResponse[], void>({
      query: () => {
        return {
          url: `collections`,
          method: 'GET',
        }
      },
      providesTags: [TagType],
    }),
    getCollection: build.query<CollectionQueryResponse, string>({
      query: (id) => {
        return {
          url: `collections/${id}`,
        }
      },
      providesTags: [TagType],
    }),
    createCollection: build.mutation<
      CollectionQueryResponse,
      CollectionCreateParams
    >({
      query: ({ title }) => {
        return {
          url: `collections/`,
          method: 'POST',
          body: {
            title,
            booklist: [],
          },
        }
      },
      invalidatesTags: [TagType],
    }),
    updateCollection: build.mutation<
      CollectionQueryResponse,
      { id: string; params: object }
    >({
      query: ({ id, params }) => {
        return {
          url: `collections/${id}`,
          method: 'PATCH',
          body: params,
        }
      },
      invalidatesTags: [TagType],
    }),
    deleteCollection: build.mutation<CollectionQueryResponse, string>({
      query: (id) => {
        return {
          url: `collections/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: [TagType],
    }),
  }),
})

export const {
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = CollectionClient

export const CollectionEndpoints = CollectionClient.endpoints
