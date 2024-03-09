// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/book/:slug?`
  | `/book/:slug?/*`
  | `/collections`
  | `/collections/:slug`
  | `/search/:category`
  | `/trending`
  | `/trending/:period`

export type Params = {
  '/book/:slug?': { slug?: string }
  '/book/:slug?/*': { slug?: string; '*': string }
  '/collections/:slug': { slug: string }
  '/search/:category': { category: string }
  '/trending/:period': { period: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>()
export const { redirect } = utils<Path, Params>()
