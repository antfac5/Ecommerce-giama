import { Observable } from 'rxjs';
import { Product } from '../model/Product';

/**
 * Interfaccia base per servizi prodotto semplici
 */
export interface IBasicProductService {
  getProducts(): Observable<Product[]>;
  getProductById(id: string): Observable<Product | undefined>;
  getProductsByCategory(category: string): Observable<Product[]>;
}

/**
 * Token di injection per il servizio prodotto
 * Utile per il dependency injection e i test
 */
export const PRODUCT_SERVICE_TOKEN = 'PRODUCT_SERVICE_TOKEN';
