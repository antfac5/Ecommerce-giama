import { Observable } from 'rxjs';
import { Product } from '../model/Product';

/**
 * Interfaccia base per servizi prodotto semplici
 */
export interface IBasicProductService {
  getProducts(): Observable<Product[]>;
  getProductById(id: number): Observable<Product | undefined>;
  getProductsByCategory(category: string): Observable<Product[]>;
  searchProducts(searchTerm: string): Observable<Product[]>;
  addProduct(product: Product): Observable<Product>;
  updateProduct(id: number, product: Product): Observable<Product | null>;
  deleteProduct(id: number): Observable<boolean>;
}

/**
 * Interfaccia per servizi con funzionalità avanzate
 */
export interface IAdvancedProductService {
  getProducts(): Observable<Product[]>;
  getProductById(id: number): Observable<Product>;
  getProductsByCategory(category: string): Observable<Product[]>;
  
  getProductsPaginated(page: number, limit: number): Observable<{
    products: Product[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  
  searchProducts(filters: {
    searchTerm?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'title' | 'category';
    sortOrder?: 'asc' | 'desc';
  }): Observable<Product[]>;
  
  getCategories(): Observable<string[]>;
  createProduct(product: Omit<Product, 'id'>): Observable<Product>;
  updateProduct(id: number, updates: Partial<Product>): Observable<Product>;
  deleteProduct(id: number): Observable<{ success: boolean; message: string }>;
}

/**
 * Token di injection per il servizio prodotto
 * Utile per il dependency injection e i test
 */
export const PRODUCT_SERVICE_TOKEN = 'PRODUCT_SERVICE_TOKEN';
