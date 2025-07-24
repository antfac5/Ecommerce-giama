import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/Product';
import { ProductService } from './product.service';
import { ProductMockService } from './product-mock.service';
import { ProductAdvancedMockService } from './product-advanced-mock.service';
import { AppConfigService } from './app-config.service';
import { IBasicProductService } from './product-service.interface';

/**
 * Factory service che decide automaticamente quale servizio utilizzare
 * Basato sulla configurazione dell'applicazione
 */
@Injectable({
  providedIn: 'root'
})
export class ProductFactoryService implements IBasicProductService {
  
  private configService = inject(AppConfigService);
  private realService = inject(ProductService);
  private mockService = inject(ProductMockService);
  private advancedMockService = inject(ProductAdvancedMockService);

  constructor() {
    // Configura il mock service in base alle impostazioni
    const config = this.configService.getConfig();
    this.advancedMockService.configureMock({
      networkDelay: config.mockDelay,
      simulateErrors: config.simulateErrors,
      enableLogging: config.enableLogging
    });
  }

  /**
   * Ottiene il servizio appropriato basato sulla configurazione
   */
  private getActiveService(): IBasicProductService {
    if (this.configService.shouldUseMockServices()) {
      this.logServiceSelection('Mock Service');
      return this.mockService;
    } else {
      this.logServiceSelection('Real Service');
      return this.realService;
    }
  }

  /**
   * Log della selezione del servizio (solo in development)
   */
  private logServiceSelection(serviceType: string): void {
    if (this.configService.isLoggingEnabled()) {
      console.log(`🔧 ProductFactoryService: Usando ${serviceType}`);
    }
  }

  // Implementazione dell'interfaccia IBasicProductService
  
  getProducts(): Observable<Product[]> {
    return this.getActiveService().getProducts();
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getActiveService().getProductById(id);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getActiveService().getProductsByCategory(category);
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.getActiveService().searchProducts(searchTerm);
  }

  addProduct(product: Product): Observable<Product> {
    return this.getActiveService().addProduct(product);
  }

  updateProduct(id: number, product: Product): Observable<Product | null> {
    return this.getActiveService().updateProduct(id, product);
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.getActiveService().deleteProduct(id);
  }

  // Metodi aggiuntivi specifici per funzionalità avanzate

  /**
   * Ottiene il servizio mock avanzato (sempre mock, utile per demo)
   */
  getAdvancedMockService(): ProductAdvancedMockService {
    return this.advancedMockService;
  }

  /**
   * Forza l'uso del servizio mock per test
   */
  forceMockMode(): void {
    this.configService.overrideConfig({ useMockServices: true });
  }

  /**
   * Forza l'uso del servizio reale
   */
  forceRealMode(): void {
    this.configService.overrideConfig({ useMockServices: false });
  }

  /**
   * Verifica quale servizio è attualmente attivo
   */
  getCurrentServiceType(): 'mock' | 'real' {
    return this.configService.shouldUseMockServices() ? 'mock' : 'real';
  }

  /**
   * Metodo di utilità per testare entrambi i servizi
   */
  testBothServices(): Observable<{
    mockProducts: Product[];
    realProducts: Product[];
  }> {
    return new Observable(observer => {
      const results: any = {};
      
      this.mockService.getProducts().subscribe({
        next: (mockProducts) => {
          results.mockProducts = mockProducts;
          if (results.realProducts) {
            observer.next(results);
            observer.complete();
          }
        },
        error: (error) => observer.error(error)
      });

      this.realService.getProducts().subscribe({
        next: (realProducts) => {
          results.realProducts = realProducts;
          if (results.mockProducts) {
            observer.next(results);
            observer.complete();
          }
        },
        error: (error) => {
          // Se il servizio reale fallisce, restituisci solo i mock
          results.realProducts = [];
          observer.next(results);
          observer.complete();
        }
      });
    });
  }
}
