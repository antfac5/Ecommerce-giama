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
    // Il mock service è già configurato con i valori di default
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

  // Metodi aggiuntivi specifici per funzionalità di configurazione

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
}
