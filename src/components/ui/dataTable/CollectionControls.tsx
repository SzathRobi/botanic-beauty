'use client'
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import type { CollectionView } from './useCollectionView'
export function CollectionToolbar<T>({
  view,
  actions,
  hasSearch = true,
  onCriteriaChange,
}: {
  view: CollectionView<T>
  actions?: ReactNode
  hasSearch?: boolean
  onCriteriaChange?: () => void
}) {
  const { config, state, dispatch } = view
  const change = () => onCriteriaChange?.()
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        {hasSearch && (
          <label className="min-w-[180px] flex-1">
            <span className="mb-1.5 block text-xs font-medium">Keresés</span>
            <span className="relative block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
              />
              <Input
                aria-label={
                  config.searchPlaceholder || 'Keresés: ' + config.label
                }
                placeholder={config.searchPlaceholder || 'Keresés…'}
                value={state.query}
                className="pl-9 pr-9"
                onChange={(e) => {
                  change()
                  dispatch({ type: 'query', value: e.target.value })
                }}
              />
              {state.query && (
                <button
                  type="button"
                  aria-label="Keresés törlése"
                  className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground hover:bg-muted focus-visible:outline-2"
                  onClick={() => {
                    change()
                    dispatch({ type: 'query', value: '' })
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </span>
          </label>
        )}
        {(config.filters || []).map((filter) => (
          <label
            key={filter.id}
            className="min-w-[140px] flex-1 sm:max-w-[210px]"
          >
            <span className="mb-1.5 block text-xs font-medium">
              {filter.label}
            </span>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
              aria-label={filter.label}
              value={state.filters[filter.id] || ''}
              onChange={(e) => {
                change()
                dispatch({
                  type: 'filter',
                  id: filter.id,
                  value: e.target.value,
                })
              }}
            >
              <option value="">Mind</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {state.filters[filter.id] &&
                !filter.options.some(
                  (option) => option.value === state.filters[filter.id]
                ) && (
                  <option value={state.filters[filter.id]}>
                    Már nem elérhető szűrő
                  </option>
                )}
            </select>
          </label>
        ))}
        {config.sorts.length > 0 && (
          <label className="min-w-[180px] flex-1 sm:max-w-[240px]">
            <span className="mb-1.5 block text-xs font-medium">Rendezés</span>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
              aria-label={'Rendezés: ' + config.label}
              value={state.sort}
              onChange={(e) =>
                dispatch({ type: 'sort', value: e.target.value })
              }
            >
              <option value="">Alapértelmezett sorrend</option>
              {config.sorts.flatMap((option) => [
                <option key={option.id + ':asc'} value={option.id + ':asc'}>
                  {option.label} · növekvő
                </option>,
                <option key={option.id + ':desc'} value={option.id + ':desc'}>
                  {option.label} · csökkenő
                </option>,
              ])}
            </select>
          </label>
        )}
        {actions && (
          <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span aria-live="polite">
          {view.count.toLocaleString('hu-HU')}{' '}
          {view.hasFilters ? 'találat' : 'elem'}
          {view.hasFilters &&
            ` / ${view.total.toLocaleString('hu-HU')} elemből`}
        </span>
        {view.hasFilters && (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded px-1 py-1 text-foreground underline underline-offset-4"
            onClick={() => {
              change()
              dispatch({ type: 'clear' })
            }}
          >
            <X size={13} />
            Szűrők törlése
          </button>
        )}
      </div>
    </div>
  )
}
export function CollectionPagination<T>({ view }: { view: CollectionView<T> }) {
  const { dispatch, pageIndex, pageCount, pageSize, count } = view
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
        <span>
          {count ? pageIndex * pageSize + 1 : 0}–
          {Math.min((pageIndex + 1) * pageSize, count)} /{' '}
          {count.toLocaleString('hu-HU')} elem
        </span>
        <label className="flex items-center gap-2">
          Oldalanként
          <select
            aria-label={'Oldalankénti elemszám: ' + view.config.label}
            className="h-8 rounded-md border border-input bg-background px-2 text-foreground"
            value={pageSize}
            onChange={(e) =>
              dispatch({ type: 'size', value: Number(e.target.value) })
            }
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="iconSmall"
          className="h-10 w-10 sm:h-8 sm:w-8"
          aria-label="Első oldal"
          disabled={pageIndex === 0}
          onClick={() => dispatch({ type: 'page', value: 0 })}
        >
          <ChevronFirst size={16} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="iconSmall"
          className="h-10 w-10 sm:h-8 sm:w-8"
          aria-label="Előző oldal"
          disabled={pageIndex === 0}
          onClick={() => dispatch({ type: 'page', value: pageIndex - 1 })}
        >
          <ChevronLeft size={16} />
        </Button>
        <label className="mx-1 flex items-center gap-1.5">
          <input
            aria-label={'Oldalszám: ' + view.config.label}
            type="number"
            min={1}
            max={pageCount}
            value={pageIndex + 1}
            className="h-10 w-12 rounded-md border border-input bg-background px-1 text-center sm:h-8"
            onChange={(e) =>
              dispatch({
                type: 'page',
                value:
                  Math.min(
                    pageCount,
                    Math.max(1, Number(e.target.value) || 1)
                  ) - 1,
              })
            }
          />
          <span className="text-muted-foreground">/ {pageCount}</span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="iconSmall"
          className="h-10 w-10 sm:h-8 sm:w-8"
          aria-label="Következő oldal"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => dispatch({ type: 'page', value: pageIndex + 1 })}
        >
          <ChevronRight size={16} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="iconSmall"
          className="h-10 w-10 sm:h-8 sm:w-8"
          aria-label="Utolsó oldal"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => dispatch({ type: 'page', value: pageCount - 1 })}
        >
          <ChevronLast size={16} />
        </Button>
      </div>
    </div>
  )
}
export function CollectionEmpty({ onClear }: { onClear?: () => void }) {
  return (
    <div className="rounded-lg border border-dashed px-5 py-10 text-center">
      <Search size={26} className="mx-auto mb-3 text-muted-foreground" />
      <p className="text-sm font-medium">Nincs találat</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Próbálj más keresést vagy módosítsd a szűrőket.
      </p>
      {onClear && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onClear}
        >
          Szűrők törlése
        </Button>
      )}
    </div>
  )
}
