import OrderInterface from "./order.interface";
import OrdemItem from "./order_item";

export default class Order {
    private _id: string;
    private _customerId: string;
    private _items: OrdemItem[] = [];
    private _total: number;

    // constructor(id: string, customerId: string, items: OrdemItem[]) {
    constructor(props: OrderInterface) {
        const { id, customerId, items } = props;

        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this.validate();
        this._total = this.total();
        
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrdemItem[] {
        return this._items;
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error('Id is required');
        }

        if (this._customerId.length === 0) {
            throw new Error('CustomerId is required');
        }

        if(this._items.length === 0) {
            throw new Error('Order needs to have almost one item');
        }

        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error('Quantity must be greater than zero');
        }
        
        return true;
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
    }
}