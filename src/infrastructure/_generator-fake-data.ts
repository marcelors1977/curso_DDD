import Customer from "../domain/customer/entity/customer";
import { v4 as uuid } from "uuid"
import { faker } from "@faker-js/faker";
import Address from "../domain/customer/value-object/address";
import OrderItem from "../domain/checkout/entity/order_item";
import Order from "../domain/checkout/entity/order";
import Product from "../domain/product/entity/product";
import ProductRepository from "./product/repository/sequelize/product.repository";

const createFakeCustomer =  (
    options?: {
        rewards?: number, 
        withAddress?: boolean, 
        withActive?: boolean
    }): Customer => 
{
    const customer = new Customer({id: uuid(), name: faker.name.lastName() + ", " + faker.name.firstName()});

    if (options && options.withAddress) {
        const address = newFakeAddressEntity();
        customer.changeAddress(address);
    }
    options && options.rewards ? customer.addRewardPoints(options.rewards) : null;
    options && options.withActive ? customer.activate() : null;

    return customer;
}

const newFakeAddressEntity = (): Address =>{
    return new Address({
        street: faker.address.streetName(), 
        number: Math.trunc(Math.random() * 1000 + 1), 
        zip: faker.address.zipCode(),
        city: faker.address.city()
});
}

const createFakeOrder = async (customer_id: string): Promise<Order> => {
    const quantityItens = Math.trunc(Math.random() * 5 + 1);
    let orderItems: OrderItem[] = [];

    for (let index = 0; index < quantityItens; index++) {
        orderItems[index] = await createFakeOrderItem();
    }

    return new Order({id: uuid(),customerId: customer_id, items: orderItems});
}

// const createFakeOrderItem = async (): Promise<OrderItem> => {
const createFakeOrderItem = async (): Promise<OrderItem> => {
    const product = createFakeProduct();
    const productRepository = new ProductRepository();
    await productRepository.create(product);
    const quantity = Math.trunc(Math.random() * 10 + 1);

    return new OrderItem({
        id: uuid(),
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: quantity
    });
}

const createFakeProduct = (): Product => {
    const product = new Product({
        id: uuid(),
        name: faker.commerce.product(),
        price: parseInt(faker.commerce.price(10, 100))
    })

    return product;
}

export { createFakeCustomer, newFakeAddressEntity, createFakeOrder, createFakeOrderItem, createFakeProduct }