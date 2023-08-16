import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import CustomerMapper from "../../mapper/customer.mapper";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        const customerMapper = new CustomerMapper();
        await CustomerModel.create(customerMapper.domainToModel(entity));
    }

    async update(entity: Customer): Promise<void> {
        const customerMapper = new CustomerMapper();
        const {id, ...customerModel} = customerMapper.domainToModel(entity);

        await CustomerModel.update(customerModel,
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

        const customerMapper = new CustomerMapper();

        return customerMapper.modelToDomain(customerModel);

    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        const customerMapper = new CustomerMapper();

        const customers = customerModels.map(customerModel => {            
            return customerMapper.modelToDomain(customerModel);
        });

        return customers;
    }
}