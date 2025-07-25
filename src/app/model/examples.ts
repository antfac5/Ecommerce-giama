import { 
    Product, 
    PagedResponse, 
    SearchFilters, 
    PageRequest,
    ProductMapper,
    ApiPagedResponse 
} from './index';

/**
 * ESEMPI DI UTILIZZO DEI MODELLI
 * 
 * Questo file contiene esempi di come utilizzare i modelli creati
 * per gestire il JSON dell'API fornito.
 */

// Esempio del JSON di risposta dell'API
export const EXAMPLE_API_RESPONSE: ApiPagedResponse = {
    "entities": [
        {
            "id": "e1d50daf-bdac-4324-994d-d343a1c959cf",
            "name": "Java",
            "description": "Manuale completo di java",
            "quantity": 8,
            "status": "DISPONIBILE",
            "unitPrice": 50.00,
            "category": "Libri",
            "imageUrl": "https://example.com/java-book.jpg"
        }
    ],
    "pageMetaData": {
        "pageNumber": 0,
        "pageSize": 1,
        "totalElements": 3,
        "totalPages": 3
    }
};

// Esempio di come convertire la risposta API in modelli tipizzati
export function exampleUsage() {
    // 1. Convertire la risposta API in PagedResponse<Product>
    const pagedProducts: PagedResponse<Product> = ProductMapper.fromApiPagedResponse(EXAMPLE_API_RESPONSE);
    
    // 2. Accedere ai prodotti
    const products: Product[] = pagedProducts.entities;
    const firstProduct: Product = products[0];
    
    // 3. Utilizzare i metodi del prodotto
    console.log('Nome prodotto:', firstProduct.displayName);
    console.log('Prezzo:', firstProduct.displayPrice);
    console.log('È disponibile?', firstProduct.isAvailable);
    
    // 4. Utilizzare i metodi di paginazione
    console.log('È la prima pagina?', pagedProducts.pageMetaData.isFirstPage);
    console.log('Ha pagina successiva?', pagedProducts.pageMetaData.hasNextPage);
    console.log('Elementi da-a:', 
        pagedProducts.pageMetaData.startElement, 
        'a', 
        pagedProducts.pageMetaData.endElement
    );
    
    // 5. Esempio di filtri di ricerca
    const searchFilters: SearchFilters = {
        name: 'Java',
        category: 'Libri',
        status: 'DISPONIBILE',
        minPrice: 30,
        maxPrice: 100
    };
    
    // 6. Esempio di richiesta paginata con filtri
    const pageRequest: PageRequest = {
        pageNumber: 0,
        pageSize: 10,
        filters: searchFilters,
        sort: {
            sortBy: 'name',
            sortOrder: 'asc'
        }
    };
    
    return {
        pagedProducts,
        firstProduct,
        searchFilters,
        pageRequest
    };
}

// Esempio di come creare un nuovo prodotto
export function createNewProduct(): Product {
    return new Product(
        'new-id-123',
        'TypeScript Handbook',
        'Guida completa a TypeScript',
        15,
        'DISPONIBILE',
        45.99,
        'Libri',
        'https://example.com/typescript-book.jpg'
    );
}

// Esempio di URL query parameters per l'API
export function buildApiUrl(baseUrl: string, pageRequest: PageRequest): string {
    const params = new URLSearchParams();
    
    // Parametri di paginazione
    params.append('pageNumber', pageRequest.pageNumber.toString());
    params.append('pageSize', pageRequest.pageSize.toString());
    
    // Filtri opzionali
    if (pageRequest.filters) {
        const { filters } = pageRequest;
        if (filters.name) params.append('name', filters.name);
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    }
    
    // Ordinamento opzionale
    if (pageRequest.sort) {
        if (pageRequest.sort.sortBy) params.append('sortBy', pageRequest.sort.sortBy);
        if (pageRequest.sort.sortOrder) params.append('sortOrder', pageRequest.sort.sortOrder);
    }
    
    return `${baseUrl}?${params.toString()}`;
}
