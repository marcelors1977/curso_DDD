import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        try {
            await OrderModel.create({
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    product_id: item.productId
                }))
            },
                {
                    include: [{ model: OrderItemModel }]
                });

        } catch (error) {
            console.log(error);
        }
    }

    async update(entity: Order): Promise<void> {
        const orderModelFound = await this.find(entity.id);
        
        const orderItemsToBeDeleted = orderModelFound.items.filter(item => !entity.items.includes(item));
        const orderItemsToBeAdded = entity.items.filter(item => !orderModelFound.items.includes(item));

        try {
            await OrderItemModel.destroy({
                where: {
                    id: orderItemsToBeDeleted.map(item => item.id)
                }
            });

            await OrderItemModel.bulkCreate(
                orderItemsToBeAdded.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    product_id: item.productId,
                    order_id: entity.id
                }))
            );

            await OrderModel.update(
                {
                    id: entity.id,
                    customer_id: entity.customerId,
                    total: entity.total(),
                },
                {
                    where: {
                        id: entity.id
                    }
                }
            );
            
        } catch (error) {
            console.log(error);
        }
    }

    async find(id: string): Promise<Order> {
        let orderModel;

        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id: id
                },
                include: [{ model: OrderItemModel }],
                rejectOnEmpty: true
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        return new Order(
            orderModel.id, 
            orderModel.customer_id, 
            orderModel.items.map(item => (new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            )))
        );
    }

    async findAll(): Promise<Order[]> {
        let orderModels;
        try {
            orderModels = await OrderModel.findAll({
                include: [{ model: OrderItemModel }]
            });
        } catch (error) {
            console.log(error);
        }

        return orderModels.map(orderModel => {
            const ordemItems = orderModel.items.map(item => (new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            )));

            return new Order(orderModel.id, orderModel.customer_id, ordemItems);
        });
    }
}