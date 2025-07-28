import { Component } from '@angular/core';
import { Product } from '../../model/Product';
import { ProductFactoryService } from '../../services/product-factory.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-product-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgIf],
  templateUrl: './single-product-page.component.html',
  styleUrl: './single-product-page.component.scss'
})
export class SingleProductPageComponent {

  product$: Observable<Product | undefined> | undefined;
  productId: string | undefined;

  constructor(
    private productFactoryService: ProductFactoryService,
    private route: ActivatedRoute) {
    this.loadProduct();
  }

  loadProduct(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.productId) {
      this.product$ = this.productFactoryService.getProductById(this.productId);
    }
  }

  addToCart(product: Product, qty: number): void {
    console.log(`Aggiunto al carrello: ${product.title} con id ${product.id} in quantità ${qty}`);
  }

}
