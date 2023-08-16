import OrderItem from "./order_item";

export default interface OrderInterface {
    id: string;
    customerId: string;
    items: OrderItem[];
}