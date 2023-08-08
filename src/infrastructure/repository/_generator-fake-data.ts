import Customer from "../../domain/entity/customer";
import CustomerRepository from "./customer.repository";
import { v4 as uuid } from "uuid"
import { faker } from "@faker-js/faker";
import Address from "../../domain/entity/address";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import ProductRepository from "./product.repository";


const createFakeCustomer =  (
    options?: {
        rewards?: number, 
        withAddress?: boolean, 
        withActive?: boolean
    }): Customer => 
{
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), faker.name.lastName() + ", " + faker.name.firstName());

    if (options && options.withAddress) {
        const address = newFakeAddressEntity();
        customer.changeAddress(address);
    }
    options && options.rewards ? customer.addRewardPoints(options.rewards) : null;
    options && options.withActive ? customer.activate() : null;

    return customer;
}

const newFakeAddressEntity = (): Address =>{
    return new Address(
        faker.address.streetName(), 
        Math.trunc(Math.random() * 1000 + 1), 
        faker.address.zipCode(),
        faker.address.city()
    );
}

const createFakeOrder = async (customer_id: string): Promise<Order> => {
    const quantityItens = Math.trunc(Math.random() * 5 + 1);
    let orderItems = [];

    for (let index = 0; index < quantityItens; index++) {
        orderItems[index] = await createFakeOrderItem();
    }

    return new Order(uuid(), customer_id, orderItems);
}

const createFakeOrderItem = async (): Promise<OrderItem> => {
    const product = createFakeProduct();
    const productRepository = new ProductRepository();
    await productRepository.create(product);
    const quantity = Math.trunc(Math.random() * 10 + 1);

    return new OrderItem(
        uuid(),
        product.name,
        product.price,
        product.id,
        quantity
    );
}

const createFakeProduct = (): Product => {
    const product = new Product(uuid(), faker.commerce.product(), parseInt(faker.commerce.price(10, 100)));

    return product;
}

export { createFakeCustomer, newFakeAddressEntity, createFakeOrder, createFakeOrderItem, createFakeProduct }