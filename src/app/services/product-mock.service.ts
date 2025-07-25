import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../model/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductMockService {

  // Dati mock statici
  private mockProducts: Product[] = [
    new Product('1', 'iPhone 15 Pro', 'Smartphone di ultima generazione con fotocamera avanzata', 10, 'DISPONIBILE', 699.99, 'Electronics', 'assets/img/product01.png'),
    new Product('2', 'MacBook Pro M3', 'Laptop professionale per sviluppatori', 8, 'DISPONIBILE', 1299.99, 'Electronics', 'assets/img/product02.png'),
    new Product('3', 'Nike Air Max', 'Sneakers sportive comode e trendy', 25, 'DISPONIBILE', 149.99, 'Fashion', 'assets/img/product03.png'),
    new Product('4', 'Sony WH-1000XM5', 'Cuffie wireless con cancellazione del rumore', 15, 'DISPONIBILE', 299.99, 'Electronics', 'assets/img/product04.png'),
    new Product('5', 'Apple Watch Series 9', 'Orologio smartwatch con GPS integrato', 12, 'DISPONIBILE', 399.99, 'Electronics', 'assets/img/product05.png'),
    new Product('6', 'North Face Jacket', 'Giacca invernale impermeabile', 20, 'DISPONIBILE', 199.99, 'Fashion', 'assets/img/product06.png'),
    new Product('7', 'iPad Pro 12.9', 'Tablet per creativi e professionisti', 8, 'DISPONIBILE', 599.99, 'Electronics', 'assets/img/product07.png'),
    new Product('8', 'Travel Backpack Pro', 'Zaino da viaggio resistente e capiente', 30, 'DISPONIBILE', 89.99, 'Travel', 'assets/img/product08.png')
  ];

  constructor() { }

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
