import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/Product';
import { NgFor, CurrencyPipe  } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})

export class CatalogComponent {
  products: Product[] = [];

  constructor(private productService: ProductService) {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}