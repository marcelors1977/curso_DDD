import { v4 as uuid } from "uuid";
import OrderFactory from "./order.factory";
import OrderItem from "../entity/order_item";

describe("Order factory unit test", () => {
    it("should create an order", () => {
        const orderProps = {
            id: uuid(),
            customerId: uuid(),
            items: [new OrderItem(
                {
                    id: uuid(),
                    name: "Product 1",
                    productId: uuid(),
                    quantity: 1,
                    price: 100
                }
            )]
        }

        const order = OrderFactory.create(orderProps);

        expect(order.id).toBeDefined();
        expect(order.customerId).toBeDefined();
        expect(order.items.length).toBe(1);
        expect(order.total()).toBe(100);
    });
});