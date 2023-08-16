import Product from "../../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../../domain/product/repository/product-repository.interface";
import ProductMapper from "../../mapper/product.mapper";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductRepositoryInterface {
    async create(entity: Product): Promise<void> {
        
        await  ProductModel.create(new ProductMapper().domainToModel(entity));
    }

    async update(entity: Product): Promise<void> {
        const entityProductMapped = new ProductMapper().domainToModel(entity);
        await ProductModel.update(
            {
                name: entityProductMapped.name,
                price: entityProductMapped.price
            },
            {
                where: {
                    id: entityProductMapped.id
            }
        });
    }

    async find(id: string): Promise<Product> {
        const productModel = await  ProductModel.findOne({
            where: {
                id: id
            }
        });

        const productMapper = new ProductMapper();

        return productMapper.modelToDomain(productModel);
    }

    async findAll(): Promise<Product[]> {
        const productModels = await ProductModel.findAll();

        const productMapper = new ProductMapper();

        return productModels.map(productModel => {
            return productMapper.modelToDomain(productModel);
        });
    }
}