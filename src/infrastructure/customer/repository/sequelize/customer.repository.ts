import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
            street: entity?.address?.street,
            number: entity?.address?.number,
            city: entity?.address?.city,
            zipcode: entity?.address?.zipcode
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
            street: entity.address.street,
            number: entity.address.number,
            city: entity.address.city,
            zipcode: entity.address.zipcode
        },
        {
            where: {
                id: entity.id
            }
        });
    }

    async find(id: string): Promise<Customer> {
        let customerModel;

        try {
            customerModel = await CustomerModel.findOne({
                where: {
                    id: id
                },
                rejectOnEmpty: true
            });
        } catch (error) {
            throw new Error("Customer not found");
        }

        return this.rebuildCustomer(customerModel);
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        const customers = customerModels.map(customerModel => {
            return this.rebuildCustomer(customerModel);
        });

        return customers;
    }

    rebuildCustomer(customerModel: CustomerModel): Customer {
        
        const customer = new Customer(customerModel.id, customerModel.name);
            
        customerModel && 
        customerModel.street && 
        customerModel.number && 
        customerModel.city && 
        customerModel.zipcode &&
        customer.changeAddress(new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipcode,
            customerModel.city
        ));
    
        customerModel && customerModel.rewardPoints && customer.addRewardPoints(customerModel.rewardPoints);
        
        if (customerModel.active) {
            customer.activate();
        }

        return customer;
    }

}