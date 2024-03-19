import {
  CreateCollectionBodyParams,
  CollectionQueryResponse,
  UpdateCollectionNameBodyParams,
  deleteMultipleCollectionsBodyParams,
  addBookToMultipleCollectionsBodyParams,
} from '@/types/collections'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { StoreClientPrefix } from '../static/store'
import { logger } from '@/utils/debug'
import { url } from '@/utils/http'
import { getStringifiedRecord } from '@/utils/helpers'

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
// const Endpoint = `https://bookshelf-backend-git-main-hyunsunryu2020s-projects.vercel.app/api/users/Test1/`
const TagType = `${StoreClientPrefix}collections`

/**
router.route("/api/users/:username/collections").get(getCollections);

router.route("/api/users/:username/collections/:collectionType(core|user)").get(getTypeCollections);

router.route("/api/users/:username/collections").post(createCollection);

router.route("/api/users/:username/collections/:collection_key").get(getBooksInCollection);

router.route("/api/users/:username/collections/:collection_key").put(updateCollectionName);

router.route("/api/users/:username/collections/:collection_key").delete(deleteCollection);

router.route("/api/users/:username/collections/:collection_key/books/:book_key").post(addBookToCollection); --> This takes the book_key, username and collection key specified in the url.

router.route("/api/users/:username/collections/:collection_key/books/:book_key").delete(removeBookFromCollection);

router.route("/api/users/:username/collections").delete(deleteMultipleCollections);

router.route("/api/users/:username/collectionsBatch").post(addBookToMultipleCollections);
 */

const Routes: Record<string, Record<string, string>> = {
  Api: {
    collections: '/api/users/:username/collections',
    collection: '/api/users/:username/collections/:collection_key',
    collectionsBatch: '/api/users/:username/collectionsBatch',
    collectionsCore: '/api/users/:username/collections/core',
    collectionsUser: '/api/users/:username/collections/user',
    bookToCollection: '/api/users/:username/collections/:collection_key/books/:book_key',
  },
}

export const CollectionClient = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${Endpoint}` }),
  reducerPath: TagType,
  tagTypes: [TagType],
  endpoints: (build) => ({
    /**@description Get all the collections of the user */
    getCollections: build.query<CollectionQueryResponse[], {username: string}>({
      query: (routeParams) => {
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.collections}`,
          routeParams: getStringifiedRecord(routeParams),
        })

        logger(
          { breakpoint: '[collections.api.ts:79]/collections' },
          {
            request,
          },
        )
        return `${request.pathname}`
      },
      providesTags: [TagType],
    }),
    /**@description Get a specific collection, including the books it contains */
    getCollection: build.query<
      CollectionQueryResponse,
      { username: string, collection_key: string }
    >({
      query: (routeParams) => {
        const request = url({
          endpoint: `${Endpoint}`,
          route: Routes.Api.collection,
          routeParams: getStringifiedRecord(routeParams),
        })

        logger(
          { breakpoint: '[collections.api.ts:98]/collections/:collection_key' },
          {
            routeParams,
            request,
          },
        )
        return `${request.pathname}${request.search}`
      },
      providesTags: [TagType],
    }),
    /**@description Create a new Collection*/
    createCollection: build.mutation<
      CollectionQueryResponse,
      CreateCollectionBodyParams
    >({
      query: (newCollectionBody: CreateCollectionBodyParams) => {
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.collections}`,
          routeParams: getStringifiedRecord({ username: newCollectionBody.username }),
        })

        logger(
          { breakpoint: `[collections.api.ts:121] POST /collections` },
          newCollectionBody,
        )
        return {
          url: `${request.pathname}`,
          method: 'POST',
          body: newCollectionBody,
        }
      },
      invalidatesTags: [TagType],
    }),
    /**@description Update a Collection Name */
    updateCollection: build.mutation<
      CollectionQueryResponse,
      UpdateCollectionNameBodyParams
    >({
      query: (body: UpdateCollectionNameBodyParams) => {
        logger({ breakpoint: '[collections.api.ts:138]' }, body)
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.collection}`,
          routeParams: getStringifiedRecord({
            username: body.username,
            collection_key: body.collection_key,
          }),
        })
        return {
          url: `${request.pathname}`,
          method: 'PUT',
          body: body,
        }
      },
      invalidatesTags: [TagType],
    }),
    /**@description Add a Book to a Collection */
    addBookToCollection: build.mutation<
      CollectionQueryResponse,
      { username: string, collection_key: string; book_key: string }
    >({
      query: (params) => {
        logger({ breakpoint: '[collections.api.ts:158]' }, params)
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.bookToCollection}`,
          routeParams: getStringifiedRecord(params),
        })
        return {
          url: `${request.pathname}`,
          method: 'POST',
        }
      },
      invalidatesTags: [TagType],
    }),
    /**@description Add a Book to Multiple Collection */
    addBookToMultipleCollection: build.mutation<
      CollectionQueryResponse,
      addBookToMultipleCollectionsBodyParams
    >({
      query: (body) => {
        logger({ breakpoint: '[collections.api.ts:177]' }, body)
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.collectionsBatch}`,
          routeParams: getStringifiedRecord({ username: body.username }),
        })
        return {
          url: `${request.pathname}`,
          method: 'POST',
          body: body,
        }
      },
      invalidatesTags: [TagType],
    }),
    /**@description Delete book from collection */
    deleteBookFromCollection: build.mutation<
      CollectionQueryResponse,
      { username: string, collection_key: string, book_key: string }
    >({
      query: (params) => {
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.bookToCollection}`,
          routeParams: getStringifiedRecord(params),
        })
        logger({ breakpoint: '[collections.api.ts:205]' }, params)

        return {
          url: `${request.pathname}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: [TagType],
    }),
    /**@description Delete a single collection */
    deleteCollection: build.mutation<
      CollectionQueryResponse,
      { username: string, collection_key: string }
    >({
      query: (params) => {
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.collection}`,
          routeParams: getStringifiedRecord(params),
        })
        return {
          url: `${request.pathname}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: [TagType],
    }),
    /**@description Delete Multiple collections */
    deleteMultipleCollection: build.mutation<
      CollectionQueryResponse,
      deleteMultipleCollectionsBodyParams
    >({
      query: (body) => {
        const request = url({
          endpoint: `${Endpoint}`,
          route: `${Routes.Api.collections}`,
          routeParams: getStringifiedRecord({ username: body.username }),
        })
        return {
          url: `${request.pathname}`,
          method: 'DELETE',
          body: body,
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
  useAddBookToCollectionMutation,
  useAddBookToMultipleCollectionMutation,  
  useDeleteBookFromCollectionMutation,
  useDeleteCollectionMutation,
  useDeleteMultipleCollectionMutation
} = CollectionClient

export const CollectionEndpoints = CollectionClient.endpoints
