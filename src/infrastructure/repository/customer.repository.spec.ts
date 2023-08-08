import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import { createFakeCustomer, newFakeAddressEntity } from "./_generator-fake-data";

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
        const customer = createFakeCustomer();
        const address = newFakeAddressEntity();

        customer.changeAddress(address);

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({
            where: {
                id: customer.id
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

    it("should create a customer without address", async () => {
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer();

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({
            where: {
                id: customer.id
            }
        });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: null,
            number: null,
            city: null,
            zipcode: null
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer();
        await customerRepository.create(customer);

        const address = newFakeAddressEntity();
        customer.changeName("Customer 2");
        customer.changeAddress(address);
        customer.addRewardPoints(10);
        customer.activate();

        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({
            where: {
                id: customer.id
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

    it("should find a customer without address", async () => {
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer({rewards: 10});
        await customerRepository.create(customer);

        const customerFound = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerFound);
    });

    it("should find an active customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer({rewards: 10, withAddress: true, withActive: true});
        await customerRepository.create(customer);

        const customerFound = await customerRepository.find(customer.id);

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
        const customer1 = createFakeCustomer({withAddress: true, rewards: 10, withActive: true});
        await customerRepository.create(customer1);
        const customer2 = createFakeCustomer({rewards: 20});
        await customerRepository.create(customer2);
        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
       
        expect(customers.map(a => { 
            return  {
                id: a.id,
                name: a.name,
                active: a.isActive(),
                rewardPoints: a.rewardPoints,
                address: a.address
            }
        })).toEqual([
            {
                id: customer1.id,
                name: customer1.name,
                active: customer1.isActive(),
                rewardPoints: customer1.rewardPoints,
                address: customer1.address
            },
            {
                id: customer2.id,
                name: customer2.name,
                active: customer2.isActive(),
                rewardPoints: customer2.rewardPoints,
                address: customer2.address
            }

        ])
    });
});
