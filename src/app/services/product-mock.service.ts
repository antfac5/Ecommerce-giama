import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductMapper } from '../model';
import { EXAMPLE_API_RESPONSE } from '../model/examples';
import { IBasicProductService } from './product-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductMockService implements IBasicProductService {

  // Dati mock dal file examples.ts
  private mockProducts: Product[] = [];

  constructor() { 
    // Carica i dati dall'esempio API e convertili in Product[]
    this.loadMockDataFromExample();
  }

  private loadMockDataFromExample(): void {
    // Converte la risposta API dell'esempio in modelli tipizzati
    const pagedResponse = ProductMapper.fromApiPagedResponse(EXAMPLE_API_RESPONSE);
    this.mockProducts = pagedResponse.entities;
    
    // Aggiungi alcuni prodotti extra per avere più varietà nei mock
    this.mockProducts.push(
      new Product('2', 'TypeScript Handbook', 'Guida completa a TypeScript', 15, 'DISPONIBILE', 45.99, 'Libri', 'assets/img/product01.png'),
      new Product('3', 'Angular Pro Guide', 'Manuale avanzato di Angular', 12, 'DISPONIBILE', 65.00, 'Libri', 'assets/img/product02.png'),
      new Product('4', 'React Cookbook', 'Ricette pratiche per React', 8, 'DISPONIBILE', 55.50, 'Libri', 'assets/img/product03.png'),
      new Product('5', 'Vue.js Essentials', 'Fondamenti di Vue.js', 20, 'DISPONIBILE', 40.00, 'Libri', 'assets/img/product04.png')
    );
    
    console.log('📚 ProductMockService: Caricati', this.mockProducts.length, 'prodotti dai dati di esempio');
  }

  /**
   * Restituisce tutti i prodotti con un delay simulato
   */
  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(
      delay(500) // Simula un delay di 500ms come una vera API
    );
  }

  /**
   * Restituisce un singolo prodotto per ID
   */
  getProductById(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id.toString());
    return of(product).pipe(delay(300));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.mockProducts.filter(p => p.category === category);
    return of(filteredProducts).pipe(delay(500));
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredProducts = this.mockProducts.filter(p => 
      p.name.toLowerCase().includes(searchTermLower) || 
      p.description.toLowerCase().includes(searchTermLower)
    );
    return of(filteredProducts).pipe(delay(500));
  }
}
