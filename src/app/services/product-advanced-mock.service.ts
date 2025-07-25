import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../model/Product';
import { IBasicProductService } from './product-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductAdvancedMockService implements IBasicProductService {

  private mockProducts: Product[] = [
    new Product('1', 'Galaxy S24 Ultra', 'Premium Smartphone con fotocamera avanzata', 10, 'DISPONIBILE', 899.99, 'Electronics', 'assets/img/product01.png'),
    new Product('2', 'ASUS ROG Strix', 'Gaming Laptop per professionisti', 5, 'DISPONIBILE', 1599.99, 'Electronics', 'assets/img/product02.png'),
    new Product('3', 'Levi\'s 501', 'Designer Jeans di alta qualità', 15, 'DISPONIBILE', 129.99, 'Fashion', 'assets/img/product03.png'),
    new Product('4', 'AirPods Pro 2', 'Wireless Earbuds con cancellazione del rumore', 8, 'DISPONIBILE', 179.99, 'Electronics', 'assets/img/product04.png'),
    new Product('5', 'Fitbit Versa 4', 'Fitness Tracker avanzato', 12, 'DISPONIBILE', 249.99, 'Electronics', 'assets/img/product05.png')
  ];

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
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id.toString());
    return of(product).pipe(delay(300));
  }
}