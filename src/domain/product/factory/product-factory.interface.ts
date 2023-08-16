import ProductInterface from "../entity/product.interface";

export default interface ProductFactoryInterface extends ProductInterface {
    type: string;
}