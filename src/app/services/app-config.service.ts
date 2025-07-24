import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * Configurazione globale per l'applicazione
 * Permette di switchare facilmente tra servizi reali e mock
 */
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  
  // Impostazioni per l'ambiente di sviluppo
  private config = {
    // Modalità di sviluppo
    development: {
      useMockServices: true,
      apiBaseUrl: 'http://localhost:3000/api',
      enableLogging: true,
      mockDelay: 500,
      simulateErrors: false
    },
    
    // Modalità di staging/test
    staging: {
      useMockServices: false,
      apiBaseUrl: 'https://staging-api.example.com/api',
      enableLogging: true,
      mockDelay: 0,
      simulateErrors: false
    },
    
    // Modalità di produzione
    production: {
      useMockServices: false,
      apiBaseUrl: 'https://api.example.com/api',
      enableLogging: false,
      mockDelay: 0,
      simulateErrors: false
    }
  };

  private currentEnvironment: keyof typeof this.config = 'development';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Determina l'ambiente automaticamente
    this.detectEnvironment();
  }

  /**
   * Determina automaticamente l'ambiente
   */
  private detectEnvironment(): void {
    if (isPlatformBrowser(this.platformId)) {
      const hostname = window.location.hostname;

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        this.currentEnvironment = 'development';
      } else if (hostname.includes('staging')) {
        this.currentEnvironment = 'staging';
      } else {
        this.currentEnvironment = 'production';
      }
    } else {
      // Fallback se esegui in server-side: decidi un valore predefinito
      this.currentEnvironment = 'production'; // oppure usa una variabile d'ambiente Node
    }
  }

  /**
   * Ottiene la configurazione corrente
   */
  getConfig() {
    return this.config[this.currentEnvironment];
  }

  /**
   * Verifica se usare i servizi mock
   */
  shouldUseMockServices(): boolean {
    return this.getConfig().useMockServices;
  }

  /**
   * Ottiene l'URL base dell'API
   */
  getApiBaseUrl(): string {
    return this.getConfig().apiBaseUrl;
  }

  /**
   * Verifica se il logging è abilitato
   */
  isLoggingEnabled(): boolean {
    return this.getConfig().enableLogging;
  }

  /**
   * Ottiene il delay per i mock
   */
  getMockDelay(): number {
    return this.getConfig().mockDelay;
  }

  /**
   * Verifica se simulare gli errori
   */
  shouldSimulateErrors(): boolean {
    return this.getConfig().simulateErrors;
  }

  /**
   * Forza un ambiente specifico (utile per test)
   */
  setEnvironment(env: keyof typeof this.config): void {
    this.currentEnvironment = env;
  }

  /**
   * Override manuale delle impostazioni
   */
  overrideConfig(overrides: Partial<typeof this.config.development>): void {
    this.config[this.currentEnvironment] = {
      ...this.config[this.currentEnvironment],
      ...overrides
    };
  }

  /**
   * Reset alla configurazione predefinita
   */
  resetConfig(): void {
    this.detectEnvironment();
  }
}
