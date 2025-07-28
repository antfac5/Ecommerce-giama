import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../model/Product';
import { Observable, map } from 'rxjs';
import { IBasicProductService } from './product-service.interface';
import { PagedResponse, ProductMapper } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements IBasicProductService {

  private apiUrl = 'http://192.168.188.147:8081/api/items';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', 0)
      .set('pageSize', 10);
    return this.http.get<PagedResponse<any>>(this.apiUrl, { params }).pipe(
      map(response => {
        return response.entities.map(
          p => ProductMapper.fromApiResponse(p)
        );
      })
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => {
        if (product) {
          return ProductMapper.fromApiResponse(product);
        }
        return undefined;
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', 0)
      .set('pageSize', 10);
    return this.http.get<PagedResponse<any>>(`${this.apiUrl}/${category}`, { params }).pipe(
      map(response => {
        return response.entities.map(
          p => ProductMapper.fromApiResponse(p)
        );
      })
    );
  }
}