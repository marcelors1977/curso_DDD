import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit test", () => {
    it("should throw an error when id is empty", () => {
        expect(() => {
            const order = new Order({id: "", customerId: "123", items: [] as any });
        }).toThrowError("Id is required");
    });

    it("should throw an error when customerId is empty", () => {
        expect(() => {
            const order = new Order({id: "123", customerId: "", items: [] as any});
        }).toThrowError("CustomerId is required");
    });

    it("should throw an error when items is empty", () => {
        expect(() => {
            const order = new Order({id: "123", customerId: "123", items: [] as any});
        }).toThrowError("Order needs to have almost one item");
    });

    it("should calculate total", () => {
        const item = new OrderItem({id: "i1", name: "Item 1", price: 100, productId: "p1", quantity: 2});
        const item2 = new OrderItem({id: "i2", name: "Item 2", price: 200, productId: "p2", quantity: 2});
        const order = new Order({id: "o1", customerId: "c1", items: [item]});

        let total = order.total();
        expect(total).toBe(200);

        const order2 = new Order({id: "o2", customerId: "c2", items: [item, item2]});
        total = order2.total();
        expect(total).toBe(600);
    });  
    
    it("should throw error if the quantity is greater than zero", () => {
        expect(() => {
            const item = new OrderItem({id: "i1", name: "Item 1", price: 100, productId: "p1", quantity: 0});
            const order = new Order({id: "o1", customerId: "c1", items: [item]});            
        }).toThrowError("Quantity must be greater than zero");
    });
});