export interface SearchFilters {
    name?: string;
    description?: string;
    category?: string;
    status?: 'DISPONIBILE' | 'NON_DISPONIBILE' | 'ESAURITO';
    minPrice?: number;
    maxPrice?: number;
    minQuantity?: number;
    maxQuantity?: number;
}

export interface SortOptions {
    sortBy?: 'name' | 'unitPrice' | 'quantity' | 'status' | 'category';
    sortOrder?: 'asc' | 'desc';
}

export interface PageRequest {
    pageNumber: number;
    pageSize: number;
    filters?: SearchFilters;
    sort?: SortOptions;
}

export class PageRequestImpl implements PageRequest {
    pageNumber: number;
    pageSize: number;
    filters?: SearchFilters;
    sort?: SortOptions;

    constructor(
        pageNumber: number = 0,
        pageSize: number = 10,
        filters?: SearchFilters,
        sort?: SortOptions
    ) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.filters = filters;
        this.sort = sort;
    }

    // Metodi utili
    static of(pageNumber: number, pageSize: number): PageRequestImpl {
        return new PageRequestImpl(pageNumber, pageSize);
    }

    static withFilters(
        pageNumber: number, 
        pageSize: number, 
        filters: SearchFilters
    ): PageRequestImpl {
        return new PageRequestImpl(pageNumber, pageSize, filters);
    }

    static withSort(
        pageNumber: number, 
        pageSize: number, 
        sort: SortOptions
    ): PageRequestImpl {
        return new PageRequestImpl(pageNumber, pageSize, undefined, sort);
    }

    static withFiltersAndSort(
        pageNumber: number, 
        pageSize: number, 
        filters: SearchFilters, 
        sort: SortOptions
    ): PageRequestImpl {
        return new PageRequestImpl(pageNumber, pageSize, filters, sort);
    }

    withFilters(filters: SearchFilters): PageRequestImpl {
        return new PageRequestImpl(this.pageNumber, this.pageSize, filters, this.sort);
    }

    withSort(sort: SortOptions): PageRequestImpl {
        return new PageRequestImpl(this.pageNumber, this.pageSize, this.filters, sort);
    }

    next(): PageRequestImpl {
        return new PageRequestImpl(this.pageNumber + 1, this.pageSize, this.filters, this.sort);
    }

    previous(): PageRequestImpl {
        const prevPage = Math.max(0, this.pageNumber - 1);
        return new PageRequestImpl(prevPage, this.pageSize, this.filters, this.sort);
    }

    first(): PageRequestImpl {
        return new PageRequestImpl(0, this.pageSize, this.filters, this.sort);
    }
}
