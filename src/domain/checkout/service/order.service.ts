import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import { v4 as uuid } from "uuid";

export default class OrderService { 

    static total(order: Order[]): number {
        return order.reduce((acc, order) => acc + order.total(), 0);
    }

    static placeOrder(customer: Customer, items: OrderItem[]): Order {
            
        if(items.length === 0) {
            throw new Error('Order needs to have almost one item');
        }

        const order = new Order({id: uuid(), customerId: customer.id, items: items});
        customer.addRewardPoints(order.total()/2);
        return order
    }

}