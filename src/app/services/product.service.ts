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
    return this.http.get<PagedResponse<any>>(this.apiUrl).pipe(
      map(response => {
        return response.entities.map(
          p => ProductMapper.fromApiResponse(p)
        );
      })
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