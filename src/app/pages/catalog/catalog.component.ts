import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductFactoryService } from '../../services/product-factory.service';
import { Product } from '../../model/Product';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  currentServiceType: 'mock' | 'real' = 'mock';
  
  private destroy$ = new Subject<void>();

  constructor(private productFactoryService: ProductFactoryService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.currentServiceType = this.productFactoryService.getCurrentServiceType();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productFactoryService.getProducts()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = `Errore nel caricamento dei prodotti: ${error.message}`;
          console.error('Errore caricamento prodotti:', error);
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(products => {
        this.products = products;
        console.log(`✅ Caricati ${products.length} prodotti usando ${this.currentServiceType} service`);
      });
  }

  getProductDetails(product: Product): void {
    console.log('Dettagli del prodotto:', product);
  }

  // Metodi per demo e testing

  /**
   * Forza l'uso del servizio mock
   */
  useMockService(): void {
    this.productFactoryService.forceMockMode();
    this.currentServiceType = 'mock';
    this.loadProducts();
  }

  /**
   * Forza l'uso del servizio reale
   */
  useRealService(): void {
    this.productFactoryService.forceRealMode();
    this.currentServiceType = 'real';
    this.loadProducts();
  }

  /**
   * Testa le funzionalità avanzate del mock service
   */
  testAdvancedFeatures(): void {
    const advancedService = this.productFactoryService.getAdvancedMockService();
    
    // Test ricerca avanzata
    advancedService.searchProducts({
      category: 'Electronics',
      minPrice: 200,
      maxPrice: 1000,
      sortBy: 'price',
      sortOrder: 'asc'
    }).subscribe(results => {
      console.log('🔍 Risultati ricerca avanzata:', results);
    });

    // Test paginazione
    advancedService.getProductsPaginated(1, 3).subscribe(result => {
      console.log('📄 Prodotti paginati:', result);
    });

    // Test categorie
    advancedService.getCategories().subscribe(categories => {
      console.log('📂 Categorie disponibili:', categories);
    });
  }

  /**
   * Testa entrambi i servizi per confronto
   */
  compareBothServices(): void {
    this.productFactoryService.testBothServices().subscribe(result => {
      console.log('🔄 Confronto servizi:');
      console.log('Mock products:', result.mockProducts.length);
      console.log('Real products:', result.realProducts.length);
    });
  }
}