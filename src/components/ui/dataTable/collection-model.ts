export type SortValue = string | number | boolean | Date | null | undefined
export type ListSort<T> = {
  id: string
  label: string
  value: (item: T) => SortValue
}
export type ListFilter<T> = {
  id: string
  label: string
  value: (item: T) => string | string[]
  options: { value: string; label: string }[]
}
export type CollectionConfig<T> = {
  label: string
  searchPlaceholder?: string
  search: (item: T) => unknown[]
  getId: (item: T) => string
  sorts: ListSort<T>[]
  filters?: ListFilter<T>[]
  defaultSort?: string
}
export type CollectionState = {
  query: string
  sort: string
  filters: Record<string, string>
  pageIndex: number
  pageSize: number
}
export function initialCollectionState(sort = ''): CollectionState {
  return { query: '', sort, filters: {}, pageIndex: 0, pageSize: 10 }
}
export type CollectionAction =
  | { type: 'query'; value: string }
  | { type: 'sort'; value: string }
  | { type: 'filter'; id: string; value: string }
  | { type: 'page'; value: number }
  | { type: 'size'; value: number }
  | { type: 'clear' }
export function collectionReducer(
  state: CollectionState,
  action: CollectionAction
): CollectionState {
  switch (action.type) {
    case 'query':
      return { ...state, query: action.value, pageIndex: 0 }
    case 'sort':
      return { ...state, sort: action.value, pageIndex: 0 }
    case 'filter':
      return {
        ...state,
        filters: { ...state.filters, [action.id]: action.value },
        pageIndex: 0,
      }
    case 'page':
      return { ...state, pageIndex: Math.max(0, Math.floor(action.value) || 0) }
    case 'size':
      return {
        ...state,
        pageSize: [10, 25, 50, 100].includes(action.value) ? action.value : 10,
        pageIndex: 0,
      }
    case 'clear':
      return { ...state, query: '', filters: {}, pageIndex: 0 }
  }
}
export function normalizeSearch(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('hu')
    .trim()
}
export function matchesSearch(values: unknown[], query: string): boolean {
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean),
    text = values.map(normalizeSearch)
  return tokens.every((token) =>
    text.some(
      (value) =>
        value.includes(token) ||
        (/^[\d()+.-]+$/.test(token) &&
          value.replace(/[^\d]/g, '').includes(token.replace(/[^\d]/g, '')) &&
          /\d/.test(token))
    )
  )
}
const collator = new Intl.Collator('hu', { numeric: true, sensitivity: 'base' })
export function compareValues(
  a: SortValue,
  b: SortValue,
  descending = false
): number {
  const absent = (value: SortValue) =>
    value === null ||
    value === undefined ||
    value === '' ||
    (value instanceof Date && Number.isNaN(value.getTime()))
  if (absent(a) || absent(b))
    return absent(a) === absent(b) ? 0 : absent(a) ? 1 : -1
  const av = a instanceof Date ? a.getTime() : a,
    bv = b instanceof Date ? b.getTime() : b
  const compared =
    typeof av === 'number' && typeof bv === 'number'
      ? av - bv
      : typeof av === 'boolean' && typeof bv === 'boolean'
        ? Number(av) - Number(bv)
        : collator.compare(String(av), String(bv))
  return descending ? -compared : compared
}
export function buildCollectionView<T>(
  data: T[],
  config: CollectionConfig<T>,
  state: CollectionState,
  paginate = true
) {
  const filtered = data.filter(
    (item) =>
      matchesSearch(config.search(item), state.query) &&
      (config.filters || []).every((filter) => {
        const selected = state.filters[filter.id]
        if (!selected) return true
        const values = filter.value(item)
        return Array.isArray(values)
          ? values.includes(selected)
          : values === selected
      })
  )
  const [sortId, direction] = state.sort.split(':')
  const sort = config.sorts.find((option) => option.id === sortId)
  const allRows = sort
    ? [...filtered].sort((a, b) =>
        compareValues(sort.value(a), sort.value(b), direction === 'desc')
      )
    : filtered
  const pageSize =
    state.pageSize > 0 && Number.isFinite(state.pageSize)
      ? Math.floor(state.pageSize)
      : 10
  const pageCount = Math.max(1, Math.ceil(allRows.length / pageSize))
  const pageIndex = paginate
    ? Math.max(0, Math.min(Math.floor(state.pageIndex) || 0, pageCount - 1))
    : 0
  return {
    allRows,
    rows: paginate
      ? allRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      : allRows,
    pageIndex,
    pageSize,
    pageCount: paginate ? pageCount : 1,
    total: data.length,
    count: allRows.length,
  }
}
export function selectedCollectionRows<T>(
  data: T[],
  getId: (row: T) => string,
  selection: Record<string, boolean>
) {
  return data.filter((row) => selection[getId(row)] === true)
}
export function uniqueOptions(values: { value: string; label: string }[]) {
  return [
    ...new Map(
      values
        .filter((option) => option.value)
        .map((option) => [option.value, option])
    ).values(),
  ].sort((a, b) => collator.compare(a.label, b.label))
}
