// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/author/:slug?`
  | `/author/:slug?/*`
  | `/book/:slug?`
  | `/book/:slug?/*`
  | `/collections`
  | `/collections/:slug`
  | `/search`
  | `/search/:category`
  | `/trending`
  | `/trending/:period`

export type Params = {
  '/author/:slug?': { slug?: string }
  '/author/:slug?/*': { slug?: string; '*': string }
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
