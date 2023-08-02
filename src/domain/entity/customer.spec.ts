import Address from "./address";
import Customer from "./customer";

describe("Customer unit test", () => {

    it("should throw an error when id is empty", () => {
        expect(() => {
            const customer = new Customer("", "John");
        }).toThrowError("Id is required");
    });

    it("should throw an error when name is empty", () => {
        expect(() => {
            const customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        const customer = new Customer("123", "John");
        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    });

    it("should activate customer", () => {
        const customer = new Customer("123", "John");
        const address = new Address("Street", 1, "Zip", "City");
        customer.changeAddress(address);
        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("should change address", () => {
        const customer = new Customer("123", "John");
        const address = new Address("Street", 1, "Zip", "City");
        customer.changeAddress(address);

        expect(customer.address).toBe(address);

        const address2 = new Address("Street", 2, "Zip", "City");
        customer.changeAddress(address2);

        expect(customer.address).toBe(address2);
    });

    it("should deactivate customer", () => {
        const customer = new Customer("123", "John");
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });


    it("should throw an error when address is undefined when activate a customer", () => {
        expect(() => {
            const customer = new Customer("123", "John");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");
    });

    it("should add reward points", () => {
        const customer = new Customer("123", "John");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);

    });

});