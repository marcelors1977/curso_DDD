import {Sequelize} from "sequelize-typescript";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import { createFakeProduct } from "./_generator-fake-data";

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
        const product = createFakeProduct();
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({
            where: {
                id: product.id
            }
        });

        expect(productModel.toJSON()).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price
        });
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = createFakeProduct();
        await productRepository.create(product);

        product.changeName("Product 2");
        await productRepository.update(product);

        const productModel = await ProductModel.findOne({
            where: {
                id: product.id
            }
        });

        expect(productModel.toJSON()).toStrictEqual({
            id: product.id,
            name: "Product 2",
            price: product.price
        });  
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = createFakeProduct();

        await productRepository.create(product);

        const productFound = await productRepository.find(product.id);

        expect(product).toStrictEqual(productFound);
    });

    it("should find all products", async () => {
        const productRepository = new ProductRepository();

        const product = createFakeProduct();
        await productRepository.create(product);

        const product2 = createFakeProduct();
        await productRepository.create(product2);

        const products = [product, product2];

        const productFound = await productRepository.findAll();

        expect(productFound).toEqual(products);
        expect(productFound.length).toBe(2);
    });
});