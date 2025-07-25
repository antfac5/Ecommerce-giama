// Modelli principali
export { Product } from './Product';
export type { PageMetaData } from './PageMetaData';
export { PageMetaDataImpl } from './PageMetaData';
export type { PagedResponse } from './PagedResponse';
export { PagedResponseImpl } from './PagedResponse';
export type { SearchFilters, SortOptions, PageRequest } from './SearchRequest';
export { PageRequestImpl } from './SearchRequest';

// Mapper e interfacce API
export type { 
    ProductApiResponse, 
    ApiPagedResponse
} from './ProductMapper';
export { ProductMapper } from './ProductMapper';

// Tipi di utilità
export type ProductStatus = 'DISPONIBILE' | 'NON_DISPONIBILE' | 'ESAURITO';
export type SortField = 'name' | 'unitPrice' | 'quantity' | 'status' | 'category';
export type SortDirection = 'asc' | 'desc';

// Costanti utili
export const PRODUCT_STATUS = {
    AVAILABLE: 'DISPONIBILE' as ProductStatus,
    UNAVAILABLE: 'NON_DISPONIBILE' as ProductStatus,
    OUT_OF_STOCK: 'ESAURITO' as ProductStatus
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 0;
