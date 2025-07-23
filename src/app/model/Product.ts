export class Product {
    description: string;
    price: number;
    category?: string;
    title?: string;
    image?: string;

    constructor(
        description: string,
        price: number,
        category?: string,
        title?: string,
        image?: string
    ) {
        this.description = description;
        this.price = price;
        this.category = category;
        this.title = title;
        this.image = image;
    }
}