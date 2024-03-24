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
  | `/author/:slug`
  | `/author/:slug/*`
  | `/book/:slug`
  | `/book/:slug/*`
  | `/collections`
  | `/collections/:slug`
  | `/lists`
  | `/lists/:category`
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
  '/author/:slug': { slug: string }
  '/author/:slug/*': { slug: string; '*': string }
  '/book/:slug': { slug: string }
  '/book/:slug/*': { slug: string; '*': string }
  '/collections/:slug': { slug: string }
  '/lists/:category': { category: string }
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
