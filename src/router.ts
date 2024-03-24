// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/:username`
  | `/:username/collections`
  | `/:username/collections/:slug`
  | `/:username/collections/:slug/edit`
  | `/:username/list/:slug`
  | `/:username/lists`
  | `/author`
  | `/author/:slug`
  | `/author/:slug/:category`
  | `/book`
  | `/book/:slug`
  | `/book/:slug/:category`
  | `/collections`
  | `/collections/:slug`
  | `/lists`
  | `/lists/:category`
  | `/lists/:slug`
  | `/search`
  | `/search/:category`
  | `/trending`
  | `/trending/:period`

export type Params = {
  '/:username': { username: string }
  '/:username/collections': { username: string }
  '/:username/collections/:slug': { username: string; slug: string }
  '/:username/collections/:slug/edit': { username: string; slug: string }
  '/:username/list/:slug': { username: string; slug: string }
  '/:username/lists': { username: string }
  '/author/:slug': { slug: string }
  '/author/:slug/:category': { slug: string; category: string }
  '/book/:slug': { slug: string }
  '/book/:slug/:category': { slug: string; category: string }
  '/collections/:slug': { slug: string }
  '/lists/:category': { category: string }
  '/lists/:slug': { slug: string }
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
