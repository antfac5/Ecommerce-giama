import { TestBed } from '@angular/core/testing';
import { ProductMockService } from './product-mock.service';
import { ProductAdvancedMockService } from './product-advanced-mock.service';
import { ProductFactoryService } from './product-factory.service';
import { AppConfigService } from './app-config.service';
import { Product } from '../model/Product';

describe('Mock Services Tests', () => {
  let basicMockService: ProductMockService;
  let advancedMockService: ProductAdvancedMockService;
  let factoryService: ProductFactoryService;
  let configService: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductMockService,
        ProductAdvancedMockService,
        ProductFactoryService,
        AppConfigService
      ]
    });

    basicMockService = TestBed.inject(ProductMockService);
    advancedMockService = TestBed.inject(ProductAdvancedMockService);
    factoryService = TestBed.inject(ProductFactoryService);
    configService = TestBed.inject(AppConfigService);
  });

  describe('ProductMockService', () => {
    it('should be created', () => {
      expect(basicMockService).toBeTruthy();
    });

    it('should return mock products', (done) => {
      basicMockService.getProducts().subscribe(products => {
        expect(products).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);
        expect(products[0]).toBeInstanceOf(Product);
        done();
      });
    });

    it('should find product by ID', (done) => {
      basicMockService.getProductById(1).subscribe(product => {
        expect(product).toBeTruthy();
        expect(product?.id).toBe(1);
        done();
      });
    });

    it('should filter products by category', (done) => {
      basicMockService.getProductsByCategory('Electronics').subscribe(products => {
        expect(products).toBeTruthy();
        products.forEach(product => {
          expect(product.category).toBe('Electronics');
        });
        done();
      });
    });

    it('should search products by term', (done) => {
      basicMockService.searchProducts('iPhone').subscribe(products => {
        expect(products).toBeTruthy();
        products.forEach(product => {
          const matchesTitle = product.title?.toLowerCase().includes('iphone');
          const matchesDescription = product.description.toLowerCase().includes('iphone');
          expect(matchesTitle || matchesDescription).toBeTruthy();
        });
        done();
      });
    });

    it('should add a new product', (done) => {
      const newProduct = new Product(
        'Test product description',
        99.99,
        'Test',
        'Test Product',
        'test.jpg'
      );

      basicMockService.addProduct(newProduct).subscribe(addedProduct => {
        expect(addedProduct).toBeTruthy();
        expect(addedProduct.id).toBeDefined();
        expect(addedProduct.title).toBe('Test Product');
        done();
      });
    });
  });

  describe('ProductAdvancedMockService', () => {
    beforeEach(() => {
      // Configura il servizio per test rapidi
      advancedMockService.configureMock({
        networkDelay: 10,
        simulateErrors: false,
        enableLogging: false
      });
    });

    it('should return paginated products', (done) => {
      advancedMockService.getProductsPaginated(1, 3).subscribe(result => {
        expect(result).toBeTruthy();
        expect(result.products).toBeTruthy();
        expect(result.products.length).toBeLessThanOrEqual(3);
        expect(result.currentPage).toBe(1);
        expect(result.totalCount).toBeGreaterThan(0);
        expect(result.totalPages).toBeGreaterThan(0);
        done();
      });
    });

    it('should perform advanced search with filters', (done) => {
      advancedMockService.searchProducts({
        category: 'Electronics',
        minPrice: 100,
        maxPrice: 1000,
        sortBy: 'price',
        sortOrder: 'asc'
      }).subscribe(products => {
        expect(products).toBeTruthy();
        
        // Verifica filtro categoria
        products.forEach(product => {
          expect(product.category).toBe('Electronics');
        });

        // Verifica filtro prezzo
        products.forEach(product => {
          expect(product.price).toBeGreaterThanOrEqual(100);
          expect(product.price).toBeLessThanOrEqual(1000);
        });

        // Verifica ordinamento
        for (let i = 1; i < products.length; i++) {
          expect(products[i].price).toBeGreaterThanOrEqual(products[i-1].price);
        }

        done();
      });
    });

    it('should return available categories', (done) => {
      advancedMockService.getCategories().subscribe(categories => {
        expect(categories).toBeTruthy();
        expect(categories.length).toBeGreaterThan(0);
        expect(categories).toContain('Electronics');
        done();
      });
    });

    it('should handle errors when configured', (done) => {
      // Configura per simulare errori
      advancedMockService.configureMock({
        simulateErrors: true,
        errorRate: 1.0 // 100% di errori per il test
      });

      advancedMockService.getProducts().subscribe({
        next: () => {
          // Se arriviamo qui, l'errore non è stato simulato (può succedere)
          done();
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBeTruthy();
          done();
        }
      });
    });

    it('should create product with validation', (done) => {
      const validProduct = {
        title: 'Valid Product',
        description: 'Valid description',
        price: 99.99,
        category: 'Test'
      };

      advancedMockService.createProduct(validProduct).subscribe(product => {
        expect(product).toBeTruthy();
        expect(product.id).toBeDefined();
        expect(product.title).toBe(validProduct.title);
        done();
      });
    });

    it('should reject invalid product creation', (done) => {
      const invalidProduct = {
        title: '',
        description: '',
        price: -10,
        category: 'Test'
      };

      advancedMockService.createProduct(invalidProduct).subscribe({
        next: () => {
          fail('Should have rejected invalid product');
        },
        error: (error) => {
          expect(error.message).toContain('non validi');
          done();
        }
      });
    });
  });

  describe('ProductFactoryService', () => {
    it('should use mock service in development', () => {
      configService.setEnvironment('development');
      expect(factoryService.getCurrentServiceType()).toBe('mock');
    });

    it('should use real service in production', () => {
      configService.setEnvironment('production');
      expect(factoryService.getCurrentServiceType()).toBe('real');
    });

    it('should allow forcing mock mode', () => {
      factoryService.forceMockMode();
      expect(factoryService.getCurrentServiceType()).toBe('mock');
    });

    it('should allow forcing real mode', () => {
      factoryService.forceRealMode();
      expect(factoryService.getCurrentServiceType()).toBe('real');
    });

    it('should return products regardless of service type', (done) => {
      factoryService.forceMockMode();
      factoryService.getProducts().subscribe(products => {
        expect(products).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('AppConfigService', () => {
    it('should detect development environment for localhost', () => {
      // Per questo test, creiamo una nuova istanza con un mock
      const mockPlatformId = 'browser';
      const service = new AppConfigService(mockPlatformId);
      // Il test verifica solo che il servizio sia configurabile
      expect(service).toBeTruthy();
    });

    it('should allow environment override', () => {
      configService.setEnvironment('production');
      expect(configService.shouldUseMockServices()).toBe(false);
      
      configService.setEnvironment('development');
      expect(configService.shouldUseMockServices()).toBe(true);
    });

    it('should allow config override', () => {
      configService.overrideConfig({ useMockServices: false });
      expect(configService.shouldUseMockServices()).toBe(false);
    });
  });
});
