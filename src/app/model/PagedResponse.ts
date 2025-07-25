import { PageMetaData } from './PageMetaData';

export interface PagedResponse<T> {
    entities: T[];
    pageMetaData: PageMetaData;
}

export class PagedResponseImpl<T> implements PagedResponse<T> {
    entities: T[];
    pageMetaData: PageMetaData;

    constructor(entities: T[] = [], pageMetaData: PageMetaData) {
        this.entities = entities;
        this.pageMetaData = pageMetaData;
    }

    // Metodi utili
    get isEmpty(): boolean {
        return this.entities.length === 0;
    }

    get hasContent(): boolean {
        return this.entities.length > 0;
    }

    get numberOfElements(): number {
        return this.entities.length;
    }

    get isFirst(): boolean {
        return this.pageMetaData.isFirstPage;
    }

    get isLast(): boolean {
        return this.pageMetaData.isLastPage;
    }

    get hasNext(): boolean {
        return this.pageMetaData.hasNextPage;
    }

    get hasPrevious(): boolean {
        return this.pageMetaData.hasPreviousPage;
    }

    // Metodo per ottenere un elemento specifico
    getEntity(index: number): T | undefined {
        return this.entities[index];
    }

    // Metodo per mappare le entities
    map<U>(mapper: (entity: T) => U): PagedResponseImpl<U> {
        const mappedEntities = this.entities.map(mapper);
        return new PagedResponseImpl<U>(mappedEntities, this.pageMetaData);
    }
}
