import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import AddressInterface from "../../../domain/customer/value-object/address.interface";
import MapperInterface from "../../_shared/mapper/mapper-interface";
import CustomerModel from "../repository/sequelize/customer.model";

type addressType = AddressInterface;

export default class CustomerMapper implements MapperInterface<Customer, CustomerModel> {
     modelToDomain(customerModel: CustomerModel): Customer {
        const {
            id,
            name, 
            street, 
            number, 
            city, 
            zipcode: zip, 
            rewardPoints, 
            active
        } = customerModel;
        
        const addressValue : addressType = {
            street,
            number,
            city,
            zip
        }
        
        const customer = new Customer({id, name});
                
        if (Address.isValidRequiredFields(addressValue)) {
            const address = new Address(addressValue);
            customer.changeAddress(address);
        }

        customer.addRewardPoints(rewardPoints);
        
        if (active) {
            customer.activate();
        }

        return customer;
    }

    domainToModel(customer: Customer): any {
        return {
            id: customer.id,
            name: customer.name,
            street: customer?.address?.street,
            number: customer?.address?.number,
            city: customer?.address?.city,
            zipcode: customer?.address?.zipcode,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        };
    }
}
