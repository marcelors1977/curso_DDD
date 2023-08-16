import Product from "../entity/product";
import ProductInterface from "../entity/product.interface";
import ProductB from "../entity/product-b";
import ProductFactoryInterface from "./product-factory.interface";

export default class ProductFactory {
    static create(props: ProductFactoryInterface): ProductInterface {
        const {id, name, price, type } = props;
        switch (type) {
            case "a":
                return new Product({id, name, price});
            case "b":
                return new ProductB({id, name, price});
            default:
                throw new Error("Product type not supported");
        }
    }
}