export class Product {
    description: string;
    price: number;
    category?: string;
    title?: string;
    image?: string;
    id?: number; 

    constructor(
        description: string,
        price: number,
        category?: string,
        title?: string,
        image?: string,
        id?: number
    ) {
        this.description = description;
        this.price = price;
        this.category = category;
        this.title = title;
        this.image = image;
        this.id = id;
    }
}