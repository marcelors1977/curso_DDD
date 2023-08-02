import Product from "./product";

describe("Product unit test", () => {
    
    it("should throw an error when id is empty", () => {
        expect(() => {
            const product = new Product("", "John", 10);
        }).toThrowError("Id is required");
    });

    it("should throw an error when name is empty", () => {
        expect(() => {
            const product = new Product("123", "", 10);
        }).toThrowError("Name is required");
    });

    it("should throw an error when price is less than zero", () => {
        expect(() => {
            const product = new Product("123", "John", -1);
        }).toThrowError("Price must be greater than zero");        
    });

    it("should change name", () => {
        const product = new Product("123", "John", 10);
        product.changeName("Jane");

        expect(product.name).toBe("Jane");
    });

    it("should change price", () => {
        const product = new Product("123", "John", 10);
        product.changePrice(20);

        expect(product.price).toBe(20);
    })
})