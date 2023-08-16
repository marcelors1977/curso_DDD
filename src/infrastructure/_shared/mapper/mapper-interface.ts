export default interface MapperInterface<T,U> {
    modelToDomain(data: U): T;
    domainToModel(data: T): any;
}