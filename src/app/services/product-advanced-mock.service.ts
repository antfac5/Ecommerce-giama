import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay, switchMap } from 'rxjs';
import { Product } from '../model/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductAdvancedMockService {

  private mockProducts: Product[] = [
    new Product('Premium Smartphone', 899.99, 'Electronics', 'Galaxy S24 Ultra', 'assets/img/product01.png', 1),
    new Product('Gaming Laptop', 1599.99, 'Electronics', 'ASUS ROG Strix', 'assets/img/product02.png', 2),
    new Product('Designer Jeans', 129.99, 'Fashion', 'Levi\'s 501', 'assets/img/product03.png', 3),
    new Product('Wireless Earbuds', 179.99, 'Electronics', 'AirPods Pro 2', 'assets/img/product04.png', 4),
    new Product('Fitness Tracker', 249.99, 'Electronics', 'Fitbit Versa 4', 'assets/img/product05.png', 5)
  ];

  // Configurazione per simulare diversi scenari
  private mockConfig = {
    simulateErrors: false,
    errorRate: 0.1, // 10% di possibilità di errore
    networkDelay: 500,
    enableLogging: true
  };

  constructor() { }

  /**
   * Configura il comportamento del mock
   */
  configureMock(config: Partial<typeof this.mockConfig>): void {
    this.mockConfig = { ...this.mockConfig, ...config };
  }

  /**
   * Simula una richiesta di rete con possibili errori
   */
  private simulateNetworkRequest<T>(data: T, customDelay?: number): Observable<T> {
    const delay_ms = customDelay || this.mockConfig.networkDelay;
    
    if (this.mockConfig.enableLogging) {
      console.log(`🔄 Mock API: Simulando richiesta con delay di ${delay_ms}ms`);
    }

    return of(null).pipe(
      delay(delay_ms),
      switchMap(() => {
        // Simula errori casuali se abilitati
        if (this.mockConfig.simulateErrors && Math.random() < this.mockConfig.errorRate) {
          const errorMessages = [
            'Errore di connessione al server',
            'Timeout della richiesta',
            'Servizio temporaneamente non disponibile',
            'Errore interno del server'
          ];
          const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
          
          if (this.mockConfig.enableLogging) {
            console.error(`❌ Mock API: Simulando errore - ${randomError}`);
          }
          
          return throwError(() => new Error(randomError));
        }

        if (this.mockConfig.enableLogging) {
          console.log(`✅ Mock API: Richiesta completata con successo`);
        }

        return of(data);
      })
    );
  }

  /**
   * Ottiene tutti i prodotti
   */
  getProducts(): Observable<Product[]> {
    return this.simulateNetworkRequest(this.mockProducts);
  }

  /**
   * Ottiene prodotti con paginazione
   */
  getProductsPaginated(page: number = 1, limit: number = 10): Observable<{
    products: Product[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = this.mockProducts.slice(startIndex, endIndex);
    
    const result = {
      products: paginatedProducts,
      totalCount: this.mockProducts.length,
      currentPage: page,
      totalPages: Math.ceil(this.mockProducts.length / limit)
    };

    return this.simulateNetworkRequest(result, 800);
  }

  /**
   * Ottiene un prodotto per ID con gestione errori
   */
  getProductById(id: number): Observable<Product> {
    const product = this.mockProducts.find(p => p.id === id);
    
    if (!product) {
      return throwError(() => new Error(`Prodotto con ID ${id} non trovato`));
    }

    return this.simulateNetworkRequest(product, 300);
  }

  /**
   * Cerca prodotti con filtri avanzati
   */
  searchProducts(filters: {
    searchTerm?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'title' | 'category';
    sortOrder?: 'asc' | 'desc';
  }): Observable<Product[]> {
    let filteredProducts = [...this.mockProducts];

    // Applica filtri
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title?.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category?.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }

    // Applica ordinamento
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'title':
            aValue = a.title?.toLowerCase() || '';
            bValue = b.title?.toLowerCase() || '';
            break;
          case 'category':
            aValue = a.category?.toLowerCase() || '';
            bValue = b.category?.toLowerCase() || '';
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }

    return this.simulateNetworkRequest(filteredProducts, 600);
  }

  /**
   * Simula operazioni CRUD con validazione
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    // Validazione semplice
    if (!product.title || !product.description || product.price <= 0) {
      return throwError(() => new Error('Dati prodotto non validi'));
    }

    const newProduct = new Product(
      product.description,
      product.price,
      product.category,
      product.title,
      product.image,
      Math.max(...this.mockProducts.map(p => p.id || 0)) + 1
    );

    this.mockProducts.push(newProduct);
    return this.simulateNetworkRequest(newProduct, 1000);
  }

  /**
   * Aggiorna un prodotto
   */
  updateProduct(id: number, updates: Partial<Product>): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Prodotto con ID ${id} non trovato`));
    }

    this.mockProducts[index] = { ...this.mockProducts[index], ...updates, id };
    return this.simulateNetworkRequest(this.mockProducts[index], 800);
  }

  /**
   * Elimina un prodotto
   */
  deleteProduct(id: number): Observable<{ success: boolean; message: string }> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Prodotto con ID ${id} non trovato`));
    }

    this.mockProducts.splice(index, 1);
    return this.simulateNetworkRequest(
      { success: true, message: 'Prodotto eliminato con successo' },
      700
    );
  }

  /**
   * Ottiene le categorie disponibili
   */
  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockProducts.map(p => p.category).filter(Boolean))] as string[];
    return this.simulateNetworkRequest(categories, 200);
  }

  /**
   * Simula uno stato di caricamento prolungato
   */
  getProductsWithLongDelay(): Observable<Product[]> {
    return this.simulateNetworkRequest(this.mockProducts, 3000);
  }
}
