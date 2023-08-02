import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";
import { v4 as uuid } from "uuid"

describe("Customer unit test", () => {

    let sequelize: Sequelize;
    let customer: Customer;
    let products: Product[];

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();

        customer = await createCustomerEntity();
        products = await createProductsEntity();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    
    it("should create an order to a customer", async () => {
        const ordemItem = createOrderItemEntity(products[0]);
        const order = new Order(uuid(), customer.id, [ordemItem]);


        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: order.id,
                    product_id: ordemItem.productId
                }
            ]
        });
    });

    it("should update an order to a customer", async () => {

        const ordemItem = createOrderItemEntity(products[0]);
        const order = new Order(uuid(), customer.id, [ordemItem]);
 
        const orderRepository = new OrderRepository();  
        await orderRepository.create(order);

        const ordemItem2 = createOrderItemEntity(products[1]);
        const ordemItem3 = createOrderItemEntity(products[2]);
        order.items.push(ordemItem2, ordemItem3);

        await orderRepository.update(order);

        const orderModelFound = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        const orderWithOrderIdInItems = new Object({ 
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: order.items.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    order_id: order.id,
                    product_id: item.productId
                }
            })
        });
        
        expect(orderModelFound.toJSON()).toStrictEqual(orderWithOrderIdInItems);

        const ordemItem4 = createOrderItemEntity(products[1]);

        order.items.splice(0, 2, ordemItem4);
        
        await orderRepository.update(order);

        const orderModelFound2 = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        const orderWithOrderIdInItems2 = new Object({ 
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: order.items.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    order_id: order.id,
                    product_id: item.productId
                }
            })
        });

        expect(orderModelFound2.toJSON()).toStrictEqual(orderWithOrderIdInItems2);
    });

    it("should find an order to a customer", async () => {
        const ordemItem = createOrderItemEntity(products[0]);
        const order = new Order(uuid(), customer.id, [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderFound = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderFound.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: order.id,
                    product_id: ordemItem.productId
                }
            ]
        });
    });

    it("should find all orders to a customer", async () => {
        const ordemItem1 = createOrderItemEntity(products[0]);
        const order1 = new Order(uuid(), customer.id, [ordemItem1]);

        const ordemItem2 = createOrderItemEntity(products[1]);
        const order2 = new Order(uuid(), customer.id, [ordemItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const ordersFound = await OrderModel.findAll({
            where: { customer_id: customer.id },
            include: ["items"]
        }).then(orders => orders.map(order => order.toJSON()));
    
        expect(ordersFound).toContainEqual(
            expect.objectContaining({
                id: order1.id,
                customer_id: customer.id,
                total: order1.total(),
                items: [
                    {
                        id: ordemItem1.id,
                        name: ordemItem1.name,
                        price: ordemItem1.price,
                        quantity: ordemItem1.quantity,
                        order_id: order1.id,
                        product_id: ordemItem1.productId
                    }
                ]
            })
        );

        expect(ordersFound).toContainEqual(
            expect.objectContaining({
                id: order2.id,
                customer_id: customer.id,
                total: order2.total(),
                items: [
                    {
                        id: ordemItem2.id,
                        name: ordemItem2.name,
                        price: ordemItem2.price,
                        quantity: ordemItem2.quantity,
                        order_id: order2.id,
                        product_id: ordemItem2.productId
                    }
                ]
            })
        );

        expect(ordersFound).toHaveLength(2);
    });

    it("should throw an error when find an order to a customer", async () => {
        const orderRepository = new OrderRepository();

        await expect(orderRepository.find("aaaaa")).rejects.toThrow("Order not found");
    });
});

async function createCustomerEntity(): Promise<Customer> {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street", 1, "Zip", "City");
    customer.changeAddress(address);
    
    await customerRepository.create(customer);
    return customer;
}

async function createProductsEntity(): Promise<Product[]> {
    const productRepository = new ProductRepository();

    const products = [ 
        new Product(uuid(), "Product 1", 10),
        new Product(uuid(), "Product 2", 20),
        new Product(uuid(), "Product 3", 30),
     ];

    products.forEach(async product => {
        await productRepository.create(product);
    });

    return products;
}

function createOrderItemEntity(product: Product): OrderItem {
    return new OrderItem(
        uuid(),
        product.name,
        product.price,
        product.id,
        Math.trunc(Math.random() * 10 + 1) 
    );
}