'use client'
import { useEffect, useMemo, useReducer } from 'react'

import {
  buildCollectionView,
  type CollectionConfig,
  collectionReducer,
  initialCollectionState,
} from './collection-model'
export function useCollectionView<T>(
  data: T[],
  config: CollectionConfig<T>,
  paginate = true
) {
  const [state, dispatch] = useReducer(
    collectionReducer,
    config.defaultSort || '',
    initialCollectionState
  )
  const view = useMemo(
    () => buildCollectionView(data, config, state, paginate),
    [data, config, state, paginate]
  )
  useEffect(() => {
    if (state.pageIndex !== view.pageIndex)
      dispatch({ type: 'page', value: view.pageIndex })
  }, [state.pageIndex, view.pageIndex])
  return {
    ...view,
    state,
    config,
    dispatch,
    hasFilters: !!state.query || Object.values(state.filters).some(Boolean),
  }
}
export type CollectionView<T> = ReturnType<typeof useCollectionView<T>>
