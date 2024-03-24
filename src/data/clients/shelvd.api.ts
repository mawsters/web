import { StoreClientPrefix } from '@/data/static/store'
import { env } from '@/env'
import { List, ListType, User } from '@/types/shelvd'
import { logger } from '@/utils/debug'
import { getStringifiedRecord } from '@/utils/helpers'
import { url } from '@/utils/http'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { z } from 'zod'

//#endregion  //*======== TYPES ===========
const GetUsernameParam = z.object({
  username: z.string().min(1).trim(),
})
type GetUsernameParam = z.infer<typeof GetUsernameParam>

const GetListsParams = GetUsernameParam.extend({
  type: ListType.default('core'),
})
type GetListsParams = z.infer<typeof GetListsParams>

const GetListParam = GetUsernameParam.extend({
  key: z.string().min(1).trim(),
  type: ListType.default('created'),
})
type GetListParam = z.infer<typeof GetListParam>

//#endregion  //*======== TYPES ===========

// /** @deprecated for scaffold purposes only */
// const getEndpoint = (
//   options: {
//     isAbsolute?: boolean
//   } = {
//     isAbsolute: false,
//   },
// ) => {
//   if (!options.isAbsolute && typeof window !== 'undefined') return '' // Browser should use relative URL
//   if (import.meta.env.VITE_VERCEL_URL)
//     return `https://${import.meta.env.VITE_VERCEL_URL}` // SSR should use Vercel URL
//   return `http://localhost:${import.meta.env.VITE_SHELVD_PORT ?? 3000}` // Development SSR should use localhost
// }

// const Endpoint = getEndpoint({ isAbsolute: true })
const Endpoint = `${env.VITE_SHELVD_HOST}`
const TagType = `${StoreClientPrefix}shelvd`

const Services = {
  List: '/list',
  User: '/clerk/user',
}

const Routes = {
  Typesense: {
    Search: '/multi_search',
  },
  List: {
    CreateList: '/create',
    GetListKeys: '/slugs',
    GetList: '/:type',
    GetListsByType: '/:type/all',
  },
}

export const ShelvdClient = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: Endpoint }),
  reducerPath: TagType,
  tagTypes: [TagType],
  endpoints: (build) => ({
    //#endregion  //*======== CONFIRMED ===========
    //#endregion  //*======== USER ===========
    getUserByUsername: build.query<User, GetUsernameParam>({
      query: (param: GetUsernameParam) => {
        // check & remove @ prefix iff exists
        const username = param.username.replace('@', '')

        const request = url({
          endpoint: `${Endpoint}${Services.User}`,
          route: '',
          queryParams: getStringifiedRecord({
            username,
          }),
        })

        return {
          url: `${request.href}`,
          method: 'GET',
        }
      },
      providesTags: [TagType],
    }),
    //#endregion  //*======== USER ===========
    //#endregion  //*======== LIST ===========

    getListKeys: build.query<unknown, GetUsernameParam>({
      query: (param: GetUsernameParam) => {
        // check & remove @ prefix iff exists
        const username = param.username.replace('@', '')
        logger(
          { breakpoint: '[shelvd.api.ts:67]/getListKeys' },
          { param, username },
        )

        const request = url({
          endpoint: `${Endpoint}${Services.List}`,
          route: Routes.List.GetListKeys,
          queryParams: getStringifiedRecord({
            username,
          }),
        })

        return {
          url: `${request.href}`,
          method: 'GET',
        }
      },
      providesTags: [TagType],
    }),

    getList: build.query<List, GetListParam>({
      query: (param: GetListParam) => {
        // check & remove @ prefix iff exists
        const username = param.username.replace('@', '')
        logger(
          { breakpoint: '[shelvd.api.ts:67]/getList' },
          { param, username },
        )

        const request = url({
          endpoint: `${Endpoint}${Services.List}`,
          route: Routes.List.GetList,
          queryParams: getStringifiedRecord({
            ...param,
            username,
          }),
        })

        return {
          url: `${request.href}`,
          method: 'GET',
        }
      },
      providesTags: [TagType],
    }),

    getListsByType: build.query<unknown[], GetListsParams>({
      query: ({ type, username }: GetListsParams) => {
        // check & remove @ prefix iff exists
        username = username.replace('@', '')

        const request = url({
          endpoint: `${Endpoint}${Services.List}`,
          route: Routes.List.GetListsByType,
          routeParams: getStringifiedRecord({ type }),
          queryParams: getStringifiedRecord({
            username,
          }),
        })

        return {
          url: `${request.href}`,
          method: 'GET',
        }
      },
      providesTags: [TagType],
    }),
    //#endregion  //*======== LIST ===========
    //#endregion  //*======== CONFIRMED ===========

    createList: build.mutation<List, List>({
      query: (list: List) => {
        const request = url({
          endpoint: `${Endpoint}${Services.List}`,
          route: Routes.List.CreateList,
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
