import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerInterface from "../entity/customer.interface";

export default class CustomerFactory {
    static create(props: CustomerInterface): Customer {
        return new Customer(props);
    }

    static createWithAddress(props: CustomerInterface): Customer {
        const {address, ...otherProps} = props;
        const customer = new Customer(otherProps);
        customer.changeAddress(address);
        return customer;
    }
}