import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../model/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductMockService {

  // Dati mock statici
  private mockProducts: Product[] = [
    new Product(
      'Smartphone di ultima generazione con fotocamera avanzata',
      699.99,
      'Electronics',
      'iPhone 15 Pro',
      'assets/img/product01.png',
      1
    ),
    new Product(
      'Laptop professionale per sviluppatori',
      1299.99,
      'Electronics',
      'MacBook Pro M3',
      'assets/img/product02.png',
      2
    ),
    new Product(
      'Sneakers sportive comode e trendy',
      149.99,
      'Fashion',
      'Nike Air Max',
      'assets/img/product03.png',
      3
    ),
    new Product(
      'Cuffie wireless con cancellazione del rumore',
      299.99,
      'Electronics',
      'Sony WH-1000XM5',
      'assets/img/product04.png',
      4
    ),
    new Product(
      'Orologio smartwatch con GPS integrato',
      399.99,
      'Electronics',
      'Apple Watch Series 9',
      'assets/img/product05.png',
      5
    ),
    new Product(
      'Giacca invernale impermeabile',
      199.99,
      'Fashion',
      'North Face Jacket',
      'assets/img/product06.png',
      6
    ),
    new Product(
      'Tablet per creativi e professionisti',
      599.99,
      'Electronics',
      'iPad Pro 12.9',
      'assets/img/product07.png',
      7
    ),
    new Product(
      'Zaino da viaggio resistente e capiente',
      89.99,
      'Travel',
      'Travel Backpack Pro',
      'assets/img/product08.png',
      8
    )
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
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(300));
  }

  /**
   * Filtra prodotti per categoria
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.mockProducts.filter(
      p => p.category?.toLowerCase() === category.toLowerCase()
    );
    return of(filteredProducts).pipe(delay(400));
  }

  /**
   * Cerca prodotti per nome
   */
  searchProducts(searchTerm: string): Observable<Product[]> {
    const filteredProducts = this.mockProducts.filter(
      p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filteredProducts).pipe(delay(600));
  }

  /**
   * Aggiunge un nuovo prodotto (simula POST)
   */
  addProduct(product: Product): Observable<Product> {
    const newProduct = new Product(
      product.description,
      product.price,
      product.category,
      product.title,
      product.image,
      this.mockProducts.length + 1
    );
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(800));
  }

  /**
   * Aggiorna un prodotto esistente (simula PUT)
   */
  updateProduct(id: number, updatedProduct: Product): Observable<Product | null> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts[index] = { ...updatedProduct, id };
      return of(this.mockProducts[index]).pipe(delay(700));
    }
    return of(null).pipe(delay(700));
  }

  /**
   * Elimina un prodotto (simula DELETE)
   */
  deleteProduct(id: number): Observable<boolean> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }
}
