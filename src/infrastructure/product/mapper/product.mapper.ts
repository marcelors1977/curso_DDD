import Product from "../../../domain/product/entity/product";
import MapperInterface from "../../_shared/mapper/mapper-interface";
import ProductModel from "../repository/sequelize/product.model";

export default class ProductMapper implements MapperInterface<Product, ProductModel> {
    modelToDomain(productModel: ProductModel): Product {
        const {
            id,
            name,
            price,
        } = productModel;

        return new Product({
            id,
            name,
            price
        });
    }

    domainToModel(product: Product): any {
        return {
            id: product.id,
            name: product.name,
            price: product.price
        }
    }
}