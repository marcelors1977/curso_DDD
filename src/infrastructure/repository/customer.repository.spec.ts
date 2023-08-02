import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepository from "./customer.repository";

describe("Customer unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    
    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Itupava", 1, "80000-000", "Curitiba");

        customer.changeAddress(address);

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({
            where: {
                id: "1"
            }
        });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            city: address.city,
            zipcode: address.zipcode
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Itupava", 1, "80000-000", "Curitiba");

        customer.changeAddress(address);

        await customerRepository.create(customer);

        const address2 = new Address("Itupava", 1, "80000-000", "Curitiba");

        customer.changeName("Customer 2");
        customer.changeAddress(address2);

        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({
            where: {
                id: "1"
            }
        });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            city: address.city,
            zipcode: address.zipcode
        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Itupava", 1, "80000-000", "Curitiba");

        customer.changeAddress(address);

        await customerRepository.create(customer);

        const customerFound = await customerRepository.find("1");

        expect(customer).toStrictEqual(customerFound);
    });


    it("should trhow an error when customer not found", async () => {
        const customerRepository = new CustomerRepository();

        await expect(
            customerRepository.find("ABCS")
        ).rejects.toThrow("Customer not found");
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("1", "Customer 1");
        const address1 = new Address("Itupava", 1, "80000-000", "Curitiba");
        const customer2 = new Customer("2", "Customer 2");
        const address2 = new Address("Itupava", 1, "80000-000", "Curitiba");

        customer1.changeAddress(address1);
        customer1.addRewardPoints(10);
        customer1.activate();
        customer2.changeAddress(address2);
        customer2.addRewardPoints(20);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);
    });
});