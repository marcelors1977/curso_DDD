import OrderItemInterface from "./order-item.interface";

export default class OrderItem {
    private _id: string;
    private _productId: string;
    private _name: string;
    private _price: number;
    private _quantity: number = 0;
    
    // constructor(id: string, name: string, price: number, productId: string, quantity: number) {
    constructor(props: OrderItemInterface) {
        const { id, name, price, productId, quantity } = props;
        
        this._id = id;
        this._name = name;
        this._price = price;
        this._productId = productId;
        this._quantity = quantity;
    }
    
    get quantity(): number {
        return this._quantity;
    }

    get productId(): string {
        return this._productId;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }
    
    orderItemTotal(): number {
        return this._price * this._quantity;
    }
}