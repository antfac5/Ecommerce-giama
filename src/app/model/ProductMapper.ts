import { Product } from './Product';
import { PagedResponse } from './PagedResponse';
import { PageMetaData } from './PageMetaData';

// Interfaccia per il JSON di risposta dell'API come ricevuto dal server
export interface ProductApiResponse {
    id: string;
    name: string;
    description: string;
    quantity: number;
    status: 'DISPONIBILE' | 'NON_DISPONIBILE' | 'ESAURITO';
    unitPrice: number;
    category: string;
    imageUrl: string;
}

// Interfaccia per la risposta paginata dell'API
export interface ApiPagedResponse {
    entities: ProductApiResponse[];
    pageMetaData: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
    };
}

// Classe helper per convertire le risposte API nei nostri modelli
export class ProductMapper {
    
    static fromApiResponse(apiProduct: ProductApiResponse): Product {
        return new Product(
            apiProduct.id,
            apiProduct.name,
            apiProduct.description,
            apiProduct.quantity,
            apiProduct.status,
            apiProduct.unitPrice,
            apiProduct.category,
            apiProduct.imageUrl
        );
    }

    static toApiRequest(product: Product): Omit<ProductApiResponse, 'id'> {
        return {
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            status: product.status,
            unitPrice: product.unitPrice,
            category: product.category,
            imageUrl: product.imageUrl
        };
    }

    static fromApiPagedResponse(apiResponse: ApiPagedResponse): PagedResponse<Product> {
        const products = apiResponse.entities.map(entity => this.fromApiResponse(entity));
        
        return {
            entities: products,
            pageMetaData: {
                pageNumber: apiResponse.pageMetaData.pageNumber,
                pageSize: apiResponse.pageMetaData.pageSize,
                totalElements: apiResponse.pageMetaData.totalElements,
                totalPages: apiResponse.pageMetaData.totalPages,
                get isFirstPage(): boolean {
                    return this.pageNumber === 0;
                },
                get isLastPage(): boolean {
                    return this.pageNumber >= this.totalPages - 1;
                },
                get hasNextPage(): boolean {
                    return this.pageNumber < this.totalPages - 1;
                },
                get hasPreviousPage(): boolean {
                    return this.pageNumber > 0;
                },
                get startElement(): number {
                    return this.pageNumber * this.pageSize + 1;
                },
                get endElement(): number {
                    const end = (this.pageNumber + 1) * this.pageSize;
                    return Math.min(end, this.totalElements);
                }
            }
        };
    }
}
