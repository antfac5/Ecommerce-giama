# Servizi Mock per Angular E-commerce

Questa documentazione spiega come utilizzare e configurare i servizi mock nel progetto Angular per supportare lo sviluppo in attesa che i servizi reali siano disponibili.

## 📁 Struttura dei Servizi

```
src/app/services/
├── product.service.ts                    # Servizio reale (API esterne)
├── product-mock.service.ts               # Servizio mock base
├── product-advanced-mock.service.ts      # Servizio mock avanzato
├── product-factory.service.ts            # Factory per scegliere automaticamente
├── product-service.interface.ts          # Interfacce comuni
├── app-config.service.ts                 # Configurazione ambiente
└── mock-services.spec.ts                 # Test per i servizi mock
```

## 🚀 Come Utilizzare i Servizi Mock

### 1. Servizio Mock Base (`ProductMockService`)

Il servizio mock base fornisce dati statici e operazioni CRUD simulate:

```typescript
// Nel tuo componente
import { ProductMockService } from '../services/product-mock.service';

export class MyComponent {
  constructor(private mockService: ProductMockService) {}

  loadProducts() {
    this.mockService.getProducts().subscribe(products => {
      console.log('Prodotti mock:', products);
    });
  }
}
```

**Funzionalità disponibili:**
- ✅ `getProducts()` - Ottiene tutti i prodotti
- ✅ `getProductById(id)` - Ottiene un singolo prodotto
- ✅ `getProductsByCategory(category)` - Filtra per categoria
- ✅ `searchProducts(term)` - Cerca per nome/descrizione
- ✅ `addProduct(product)` - Aggiunge nuovo prodotto
- ✅ `updateProduct(id, product)` - Aggiorna prodotto
- ✅ `deleteProduct(id)` - Elimina prodotto

### 2. Servizio Mock Avanzato (`ProductAdvancedMockService`)

Include funzionalità avanzate come paginazione, ricerca complessa e simulazione errori:

```typescript
// Ricerca avanzata con filtri
this.advancedMockService.searchProducts({
  category: 'Electronics',
  minPrice: 100,
  maxPrice: 500,
  sortBy: 'price',
  sortOrder: 'asc'
}).subscribe(results => {
  console.log('Risultati filtrati:', results);
});

// Paginazione
this.advancedMockService.getProductsPaginated(1, 10).subscribe(result => {
  console.log('Pagina 1:', result.products);
  console.log('Totale pagine:', result.totalPages);
});
```

**Configurazione del comportamento:**

```typescript
// Configura simulazione errori e delay
this.advancedMockService.configureMock({
  simulateErrors: true,
  errorRate: 0.1,        // 10% di errori
  networkDelay: 1000,    // 1 secondo di delay
  enableLogging: true
});
```

### 3. Factory Service (`ProductFactoryService`) - **RACCOMANDATO**

Il Factory Service sceglie automaticamente tra servizio reale e mock in base alla configurazione:

```typescript
// Nel tuo componente - usa sempre questo!
import { ProductFactoryService } from '../services/product-factory.service';

export class CatalogComponent {
  constructor(private productFactory: ProductFactoryService) {}

  loadProducts() {
    // Automaticamente usa mock in development, reale in production
    this.productFactory.getProducts().subscribe(products => {
      console.log('Prodotti (auto-selected service):', products);
    });
  }

  // Controllo manuale per testing
  forceMockMode() {
    this.productFactory.forceMockMode();
  }

  forceRealMode() {
    this.productFactory.forceRealMode();
  }
}
```

## ⚙️ Configurazione Ambiente

### Configurazione automatica

Il sistema rileva automaticamente l'ambiente:

- **localhost** → Mock Services
- **staging.domain.com** → Real Services  
- **production.domain.com** → Real Services

### Configurazione manuale

```typescript
import { AppConfigService } from '../services/app-config.service';

// Forza un ambiente specifico
this.configService.setEnvironment('development');

// Override configurazione
this.configService.overrideConfig({
  useMockServices: true,
  enableLogging: true,
  mockDelay: 500
});
```

## 🧪 Testing e Debugging

### Controlli nel template

Il componente catalog include controlli per testare i servizi:

```html
<!-- Pulsanti per switchare tra servizi -->
<button (click)="useMockService()">Mock Service</button>
<button (click)="useRealService()">Real Service</button>
<button (click)="testAdvancedFeatures()">Test Advanced</button>
```

### Logging automatico

Quando il logging è abilitato, vedrai messaggi come:

```
🔧 ProductFactoryService: Usando Mock Service
🔄 Mock API: Simulando richiesta con delay di 500ms  
✅ Mock API: Richiesta completata con successo
✅ Caricati 8 prodotti usando mock service
```

### Esecuzione test

```bash
ng test

# Per testare solo i servizi mock
ng test --include="**/mock-services.spec.ts"
```

## 📊 Dati Mock Disponibili

I servizi mock includono prodotti di esempio per le categorie:

- **Electronics**: Smartphone, Laptop, Cuffie, Smartwatch, Tablet
- **Fashion**: Sneakers, Giacche
- **Travel**: Zaini da viaggio

Ogni prodotto include:
- ID univoco
- Titolo e descrizione
- Prezzo
- Categoria  
- Immagine (path locale)

## 🔄 Migrazione a Servizi Reali

Quando i servizi reali sono pronti:

1. **Aggiorna configurazione**: Cambia `useMockServices: false` in `AppConfigService`
2. **Implementa endpoints**: Aggiorna `ProductService` con URL reali
3. **Test graduale**: Usa `ProductFactoryService.testBothServices()` per confrontare

```typescript
// Confronto servizi reali vs mock
this.productFactory.testBothServices().subscribe(result => {
  console.log('Mock products:', result.mockProducts.length);
  console.log('Real products:', result.realProducts.length);
});
```

## ⚡ Best Practices

### 1. Usa sempre il Factory Service
```typescript
// ✅ Corretto
constructor(private productFactory: ProductFactoryService) {}

// ❌ Evita l'uso diretto  
constructor(private productService: ProductService) {}
```

### 2. Gestisci loading e errori
```typescript
loadProducts() {
  this.loading = true;
  this.error = null;

  this.productFactory.getProducts()
    .pipe(
      catchError(error => {
        this.error = error.message;
        return of([]);
      }),
      finalize(() => this.loading = false)
    )
    .subscribe(products => {
      this.products = products;
    });
}
```

### 3. Configura delay realistici
```typescript
// Simula latenza di rete realistica
this.advancedMockService.configureMock({
  networkDelay: 800,  // 800ms come una vera API
  errorRate: 0.05     // 5% di errori occasionali
});
```

### 4. Usa interfacce comuni
```typescript
// Implementa sempre le interfacce per consistenza
export class MyProductService implements IBasicProductService {
  // Garantisce compatibilità con mock e real services
}
```

## 🛠️ Risoluzione Problemi

### Problema: Servizio non switch automaticamente
**Soluzione**: Verifica configurazione environment in `AppConfigService`

### Problema: Errori TypeScript con interfacce
**Soluzione**: Assicurati che tutti i servizi implementino le interfacce comuni

### Problema: Mock troppo lenti/veloci
**Soluzione**: Configura `networkDelay` appropriato per i test

### Problema: Dati mock non realistici
**Soluzione**: Aggiorna array `mockProducts` con dati più rappresentativi

## 📝 Esempi Pratici

### Esempio 1: Caricamento prodotti con gestione errori
```typescript
async loadProductsWithErrorHandling() {
  try {
    this.loading = true;
    const products = await this.productFactory.getProducts().toPromise();
    this.products = products || [];
  } catch (error) {
    this.showError('Errore caricamento prodotti');
    console.error(error);
  } finally {
    this.loading = false;
  }
}
```

### Esempio 2: Ricerca real-time
```typescript
setupSearch() {
  this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => 
        this.productFactory.searchProducts(term || '')
      )
    )
    .subscribe(results => {
      this.searchResults = results;
    });
}
```

### Esempio 3: Paginazione
```typescript
loadPage(page: number) {
  const advancedService = this.productFactory.getAdvancedMockService();
  
  advancedService.getProductsPaginated(page, this.pageSize)
    .subscribe(result => {
      this.products = result.products;
      this.totalPages = result.totalPages;
      this.currentPage = result.currentPage;
    });
}
```

---

**💡 Tip**: Mantieni sempre i servizi mock aggiornati con le stesse interfacce dei servizi reali per una transizione senza problemi!
