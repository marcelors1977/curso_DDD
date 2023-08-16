import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit test", () => {

    it("should place an order", () => {
        
        const customer = new Customer({id: "c1", name: "Customer 1"});
        const item1 = new OrderItem({id: "i1", name: "Item 1", price: 10, productId: "p1", quantity: 1});

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it("should get total of all orders", () => {
        const item1 = new OrderItem({id: "i1", name: "Item 1", price: 100, productId: "p1", quantity: 1});
        const item2 = new OrderItem({id: "i2", name: "Item 2", price: 200, productId: "p2", quantity: 2});


        const order = new Order({id: "o1", customerId: "c1", items: [item1]});
        const order2 = new Order({id: "o2", customerId: "c2", items: [item2]});

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500);
    });
});