export class Product {
    id: string;
    name: string;
    description: string;
    quantity: number;
    status: 'DISPONIBILE' | 'NON_DISPONIBILE' | 'ESAURITO';
    unitPrice: number;
    category: string;
    imageUrl: string;
    
    // Proprietà opzionali per compatibilità con codice esistente
    title?: string;
    price?: number;
    image?: string;

    constructor(
        id: string,
        name: string,
        description: string,
        quantity: number,
        status: 'DISPONIBILE' | 'NON_DISPONIBILE' | 'ESAURITO',
        unitPrice: number,
        category: string,
        imageUrl: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.status = status;
        this.unitPrice = unitPrice;
        this.category = category;
        this.imageUrl = imageUrl;
        
        // Proprietà per compatibilità
        this.title = name;
        this.price = unitPrice;
        this.image = imageUrl;
    }

    // Getter utili
    get isAvailable(): boolean {
        return this.status === 'DISPONIBILE' && this.quantity > 0;
    }

    get displayName(): string {
        return this.name;
    }

    get displayPrice(): number {
        return this.unitPrice;
    }

    get displayImage(): string {
        return this.imageUrl;
    }
}