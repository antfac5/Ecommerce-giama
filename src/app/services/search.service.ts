import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface SearchEvent {
  searchTerm: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  // Evento di ricerca
  private searchEventSource = new Subject<SearchEvent>();
  searchEvent$ = this.searchEventSource.asObservable();
  
  // Ultimo termine di ricerca
  private lastSearchSource = new BehaviorSubject<string>('');
  lastSearch$ = this.lastSearchSource.asObservable();
  
  /**
   * Esegue una ricerca
   */
  performSearch(searchTerm: string): void {
    const searchEvent: SearchEvent = {
      searchTerm: searchTerm.trim(),
      timestamp: new Date()
    };
    
    console.log(`🔍 SearchService: Ricerca "${searchEvent.searchTerm}"`);
    
    this.lastSearchSource.next(searchEvent.searchTerm);
    this.searchEventSource.next(searchEvent);

    this.clearSearch(); // Pulisce la ricerca dopo l'invio dell'evento
  }
  
  /**
   * Pulisce la ricerca
   */
  clearSearch(): void {
    this.lastSearchSource.next('');
    this.searchEventSource.next({
      searchTerm: '',
      timestamp: new Date()
    });
  }
  
  /**
   * Ottiene l'ultimo termine di ricerca
   */
  getLastSearchTerm(): string {
    return this.lastSearchSource.value;
  }
}