import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private productService: ProductService,
    private router: Router) {}

  filterByCategory(cat: string): void {
    this.productService.getProductsByCategory(cat);
  }

}
