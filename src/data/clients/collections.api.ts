import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { StoreClientPrefix } from '../static/store'
import {
  CollectionQueryResponse,
  CollectionQueryParams as CollectionCreateParams,
} from '@/types/collections'

const Endpoint = 'http://localhost:4000/'
//
const TagType = `${StoreClientPrefix}collections`

export const CollectionClient = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: Endpoint }),
  reducerPath: TagType,
  tagTypes: [TagType],
  endpoints: (build) => ({
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
