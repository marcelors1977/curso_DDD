import { v4 as uuid } from "uuid";
import ProductFactoryInterface from "./product-factory.interface";
import ProductFactory from "./product.factory";

type productFactoryType = ProductFactoryInterface;

describe("Product factory unit test", () => {
    it("should create a product type a", () => {
        const productVar: productFactoryType = {
            type: "a",
            id: uuid(),
            name: "Product A",
            price: 1
        }

        const product = ProductFactory.create(productVar);

        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product A");
        expect(product.price).toBe(1);
        expect(product.constructor.name).toBe("Product");
    });

    it("should create a product type b", () => {
        const productVar: productFactoryType = {
            type: "b",
            id: uuid(),
            name: "Product B",
            price: 1
        }
        const product = ProductFactory.create(productVar);

        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product B");
        expect(product.price).toBe(2);
        expect(product.constructor.name).toBe("ProductB");
    });

    it("should throw an error when type is not supported", () => {
        const productVar: productFactoryType = {
            type: "c",
            id: uuid(),
            name: "Product C",
            price: 3
        }
        expect(() => {
            ProductFactory.create(productVar);
        }).toThrowError("Product type not supported");
    })
})