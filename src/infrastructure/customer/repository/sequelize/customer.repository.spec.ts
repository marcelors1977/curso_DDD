import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import { createFakeCustomer, newFakeAddressEntity } from "../../../_generator-fake-data";
import CustomerMapper from "../../mapper/customer.mapper";

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

        const customerMappedToModel = new CustomerMapper().domainToModel(customer);

        expect(customerModel.toJSON()).toStrictEqual(customerMappedToModel);
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

        const customerMappedToModel = new CustomerMapper().domainToModel(customer);

        expect(customerModel.toJSON()).toStrictEqual(customerMappedToModel);
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
                address: typeof a.address === "undefined" ? null : {
                    street: a.address.street,
                    number: a.address.number,
                    city: a.address.city,
                    zipcode: a.address.zipcode
                }
            }
        })).toEqual([
            {
                id: customer1.id,
                name: customer1.name,
                active: customer1.isActive(),
                rewardPoints: customer1.rewardPoints,
                address: {
                    street: customer1.address.street,
                    number: customer1.address.number,
                    city: customer1.address.city,
                    zipcode: customer1.address.zipcode
                }
            },
            {
                id: customer2.id,
                name: customer2.name,
                active: customer2.isActive(),
                rewardPoints: customer2.rewardPoints,
                address: null
            }

        ])
    });
});
