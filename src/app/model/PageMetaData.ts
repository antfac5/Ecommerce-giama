export interface PageMetaData {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    
    // Metodi utili per la paginazione
    readonly isFirstPage: boolean;
    readonly isLastPage: boolean;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
    readonly startElement: number;
    readonly endElement: number;
}

export class PageMetaDataImpl implements PageMetaData {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;

    constructor(
        pageNumber: number = 0,
        pageSize: number = 10,
        totalElements: number = 0,
        totalPages: number = 0
    ) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    // Metodi utili per la paginazione
    get isFirstPage(): boolean {
        return this.pageNumber === 0;
    }

    get isLastPage(): boolean {
        return this.pageNumber >= this.totalPages - 1;
    }

    get hasNextPage(): boolean {
        return this.pageNumber < this.totalPages - 1;
    }

    get hasPreviousPage(): boolean {
        return this.pageNumber > 0;
    }

    get startElement(): number {
        return this.pageNumber * this.pageSize + 1;
    }

    get endElement(): number {
        const end = (this.pageNumber + 1) * this.pageSize;
        return Math.min(end, this.totalElements);
    }
}
