import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/Product';
import { Observable, map, of } from 'rxjs';
import { IBasicProductService } from './product-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements IBasicProductService {

  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(products => products.map(p => new Product(
        p.description,
        p.price,
        p.category,
        p.title,
        p.image,
        p.id
      )))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => p ? new Product(
        p.description,
        p.price,
        p.category,
        p.title,
        p.image,
        p.id
      ) : undefined)
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}`).pipe(
      map(products => products.map(p => new Product(
        p.description,
        p.price,
        p.category,
        p.title,
        p.image,
        p.id
      )))
    );
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      map(p => new Product(
        p.description,
        p.price,
        p.category,
        p.title,
        p.image,
        p.id
      ))
    );
  }

  updateProduct(id: number, product: Product): Observable<Product | null> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product).pipe(
      map(p => p ? new Product(
        p.description,
        p.price,
        p.category,
        p.title,
        p.image,
        p.id
      ) : null)
    );
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true)
    );
  }
}

