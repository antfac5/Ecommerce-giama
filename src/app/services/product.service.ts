import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/Product';
import { Observable, map } from 'rxjs';
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
        p.id.toString(),
        p.title,
        p.description,
        1, // quantità di default
        'DISPONIBILE', // status di default
        p.price,
        p.category,
        p.image
      )))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => p ? new Product(
        p.id.toString(),
        p.title,
        p.description,
        1, // quantità di default
        'DISPONIBILE', // status di default
        p.price,
        p.category,
        p.image
      ) : undefined)
    );
  }
}