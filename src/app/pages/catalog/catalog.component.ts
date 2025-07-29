import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductFactoryService } from '../../services/product-factory.service';
import { Product } from '../../model/Product';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CategorySelectorComponent } from '../../components/category-selector/category-selector.component';
import { SearchService, SearchEvent } from '../../services/search.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, CategorySelectorComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  currentServiceType: 'mock' | 'real' = 'mock';
  category: string = '';
  currentSearchTerm: string = '';
  isSearchMode: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private productFactoryService: ProductFactoryService,
    private router: Router,
    private searchService: SearchService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.currentServiceType = this.productFactoryService.getCurrentServiceType();
    this.searchService.searchEvent$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((event: SearchEvent) => {
      this.handleSearchEvent(event);
    });
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
    this.router.navigate(['/product', product.id]);
  }

  onCategorySelected(category: string): void {
    this.category = category;
    this.productFactoryService.getProductsByCategory(category)
      .subscribe(products => {
        this.products = products;
        console.log(`✅ Caricati ${products.length} prodotti per la categoria: ${category}`);
      }, error => {
        this.error = `Errore nel caricamento dei prodotti per la categoria ${category}: ${error.message}`;
        console.error('Errore caricamento prodotti per categoria:', error);
      }
      );
  }

      /**
   * ✅ Gestisce eventi di ricerca
   */
  private handleSearchEvent(searchEvent: SearchEvent): void {
    this.currentSearchTerm = searchEvent.searchTerm;
    
    if (searchEvent.searchTerm.trim()) {
      this.isSearchMode = true;
      this.searchProducts(searchEvent.searchTerm);
    } else {
      this.isSearchMode = false;
    }
  }

    /**
   * ✅ Ricerca prodotti
   */
  private searchProducts(searchTerm: string): void {
    this.loading = true;
    this.error = null;
    
    console.log(`🔍 Ricerca nel catalogo: "${searchTerm}"`);

    this.productFactoryService.searchProducts(searchTerm)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = `Errore nella ricerca "${searchTerm}": ${error.message}`;
          console.error('Errore ricerca:', error);
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(products => {
        this.products = products;
        console.log(`✅ Trovati ${products.length} prodotti per "${searchTerm}"`);
      });
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
}