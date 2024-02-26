// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/books`
  | `/books/:slug`
  | `/search/:category`
  | `/search/old//`
  | `/trending/:period`

export type Params = {
  '/books/:slug': { slug: string }
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
