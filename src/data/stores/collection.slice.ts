/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, createSlice } from '@reduxjs/toolkit'
import collectionAPI from '@/data/services/collections-service'
import { Collection } from '@/types/collection'
import { CollectionsState } from '@/types/collections'

const initialState: CollectionsState = {
  data: [],
  popup: false,
}

export const collectionSlice = createSlice({
  name: 'collections',
  initialState: initialState,
  reducers: {
    appendCollection(state, action) {
      return { ...state, data: state.data.concat(action.payload) }
    },
    setCollection(state, action) {
      return { ...state, data: action.payload }
    },
    showPopup(state, action) {
      return { ...state, popup: action.payload }
    },
  },
})

export const { appendCollection, setCollection, showPopup } =
  collectionSlice.actions

// get all collections
export const initializeCollections = () => {
  return async (dispatch: Dispatch) => {
    const collections = await collectionAPI.getAll()
    dispatch(setCollection(collections))
  }
}

export const addToCollections = (collectionTitle: string) => {
  return async (dispatch: Dispatch, getState: () => any) => {
    // Access the current state
    const currentState = getState()
    // Get the current length of the collections data array
    const currentLength = currentState.collections.data.length

    const collection: Collection = {
      collectionId: currentLength + 1,
      collectionTitle: collectionTitle,
      booklist: [],
    }
    const collections = await collectionAPI.create(collection)
    dispatch(setCollection(collections))
  }
}

export const updateCollection = (id: number, updatedField: object) => {
  return async (dispatch: Dispatch) => {
    // Access the current state
    // Get the current length of the collections data array
    const collections = await collectionAPI.update({
      id,
      updatedField: updatedField,
    })
    dispatch(setCollection(collections))
  }
}

export const deleteCollectionInStore = (id: number) => {
  return async (dispatch: Dispatch) => {
    // Access the current state
    const collections = await collectionAPI.deleteCollection(id)

    dispatch(setCollection(collections))
  }
}
