import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product service unit test", () => {

    it("should change prices os all products", () => {
        const product1 = new Product({id: "product1", name: "Product 1", price: 10});
        const product2 = new Product({id: "product2", name: "Product 2", price: 20});
        const products = [product1, product2];

        ProductService.increasePrice(products, 100);

        expect(product1.price).toBe(20);
        expect(product2.price).toBe(40);
    });


});