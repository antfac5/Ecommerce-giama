import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  isSearching: boolean = false;
  
  private destroy$ = new Subject<void>();
  private searchTermsSubject = new Subject<string>();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // Ricerca automatica con debounce
    this.searchTermsSubject.pipe(
      debounceTime(500), // Aspetta 500ms dopo l'ultimo input
      distinctUntilChanged(), // Solo se il termine è diverso
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.performSearch(term);
    });
    
    // Ripristina l'ultimo termine di ricerca
    this.searchService.lastSearch$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(lastTerm => {
      if (lastTerm !== this.searchTerm) {
        this.searchTerm = lastTerm;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Gestisce l'input di ricerca con debounce
   */
  onSearchInput(): void {
    this.searchTermsSubject.next(this.searchTerm);
  }

  /**
   * Gestisce la ricerca immediata (Enter o click)
   */
  onSearch(): void {
    this.performSearch(this.searchTerm);
  }

  /**
   * Esegue la ricerca
   */
  private performSearch(term: string): void {
    if (term.trim().length >= 2) { // Minimo 2 caratteri
      this.isSearching = true;
      this.searchService.performSearch(term);
      
      // Reset dopo 1 secondo
      setTimeout(() => {
        this.isSearching = false;
      }, 1000);
    } else if (term.trim().length === 0) {
      this.searchService.clearSearch();
    }
  }
}