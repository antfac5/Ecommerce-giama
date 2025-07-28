import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [NgFor],
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.scss'
})
export class CategorySelectorComponent {

  @Output() categorySelected = new EventEmitter<string>();

  categories: string[] = [
    'Manuali',
    'Spinning',
    'Bolognese',
    'Traina',
    'Bolentino',
    'Jigging',
    'Esche',
    'Vestiario',
    'Altri Articoli']

  selectCategory(category: string): void {
    this.categorySelected.emit(category);
  }

}
