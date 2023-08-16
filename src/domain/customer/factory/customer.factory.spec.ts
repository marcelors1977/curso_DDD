import { newFakeAddressEntity } from "../../../infrastructure/_generator-fake-data";
import CustomerFactory from "./customer.factory";
import { v4 as uuid } from "uuid";

describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        const customer = CustomerFactory.create({id: uuid(), name: "John"});

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer with address", () => {
        const address = newFakeAddressEntity();
        const customer = CustomerFactory.createWithAddress({id: uuid(), name: "John", address: address});

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBeDefined();
        expect(customer.address).toStrictEqual(address);
    });
});