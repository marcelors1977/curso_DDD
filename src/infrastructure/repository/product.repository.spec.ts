import {Sequelize} from "sequelize-typescript";
import ProductModel from "../db/sequelize/model/product.model";
import Product from "../../domain/entity/product";
import ProductRepository from "./product.repository";

describe("Product repository unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);

        await productRepository.create(product);
        const productModel = await ProductModel.findOne({
            where: {
                id: "1"
            }
        });

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 10
        });
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);

        await productRepository.create(product);

        product.changeName("Product 2");

        await productRepository.update(product);

        const productModel = await ProductModel.findOne({
            where: {
                id: "1"
            }
        });

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 2",
            price: 10
        });  
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);

        await productRepository.create(product);

        const productFound = await productRepository.find("1");

        expect(product).toStrictEqual(productFound);
    });

    it("should find all products", async () => {
        const productRepository = new ProductRepository();

        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const product2 = new Product("2", "Product 2", 20);
        await productRepository.create(product2);

        const products = [product, product2];

        const productFound = await productRepository.findAll();

        expect(productFound).toEqual(products);
        expect(productFound.length).toBe(2);
    });
});