import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderRepository from "./order.repository";
import { createFakeCustomer, createFakeOrder, createFakeOrderItem } from "../../../_generator-fake-data";
import OrderModel from "./order.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";

describe("Customer unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    
    it("should create an order to a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer({withAddress: true, withActive: true, rewards: 10});
        await customerRepository.create(customer);

        const order = await createFakeOrder(customer.id);
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
    });

    it("should update an order to a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer({withAddress: true, withActive: true, rewards: 10});
        await customerRepository.create(customer);

        const order = await createFakeOrder(customer.id); 
        const orderRepository = new OrderRepository();  
        await orderRepository.create(order);

        const ordemItem2 = await createFakeOrderItem();
        const ordemItem3 = await createFakeOrderItem();
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

        const ordemItem4 = await createFakeOrderItem();

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
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer({withAddress: true, withActive: true, rewards: 10});
        await customerRepository.create(customer);

        const order = await createFakeOrder(customer.id);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderFound = await orderRepository.find(order.id);

        expect(orderFound).toStrictEqual(order);
    });

    it("should find all orders created", async () => {
        const customerRepository = new CustomerRepository();
        const customer = createFakeCustomer({withAddress: true, withActive: true, rewards: 10});
        await customerRepository.create(customer);

        const order1 = await createFakeOrder(customer.id);
        const order2 = await createFakeOrder(customer.id);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const ordersFound = await orderRepository.findAll();   
        
        expect(ordersFound.map(a => {
            return {
                id: a.id,
                customer_id: a.customerId,
                total: a.total(),
                items: a.items.sort((a, b) => a.price - b.price)
            }
        })).toStrictEqual([
            {
                id: order1.id,
                customer_id: order1.customerId,
                total: order1.total(),
                items: order1.items.sort((a, b) => a.price - b.price)
            },
            {
                id: order2.id,
                customer_id: order2.customerId,
                total: order2.total(),
                items: order2.items.sort((a, b) => a.price - b.price)
            }
        ]);

        expect(ordersFound).toHaveLength(2);
    });

    it("should throw an error when find an order to a customer", async () => {
        const orderRepository = new OrderRepository();

        await expect(orderRepository.find("aaaaa")).rejects.toThrow("Order not found");
    });

    it("when no orders found then should returns a empty array", async () => {
        const orderRepository = new OrderRepository();

        const ordersFound = await orderRepository.findAll();

        expect(ordersFound).toStrictEqual([]);
    });

    it("should find all orders to a specific customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = createFakeCustomer();
        await customerRepository.create(customer1);
        const order1 = await createFakeOrder(customer1.id);

        const customer2 = createFakeCustomer({withAddress: true, withActive: true});
        await customerRepository.create(customer2);
        const order2 = await createFakeOrder(customer2.id);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const ordersToCustomerFound = await orderRepository.findAllOrdersByCustomerId(customer1.id);

        expect(ordersToCustomerFound.map(order => {
            return {
                id: order.id,
                customer_id: order.customerId,
            }
        })).toContainEqual({
                id: order1.id,
                customer_id: order1.customerId,
        });

        expect(ordersToCustomerFound.map(order => {
            return {
                id: order.id,
                customer_id: order.customerId,
            }
        })).not.toContainEqual({            
                id: order2.id,
                customer_id: order2.customerId,
        });
    });
});
