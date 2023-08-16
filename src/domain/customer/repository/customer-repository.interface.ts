import RepositoryInterface from "../../_shared/repository/repository-interface";
import CustomerInterface from "../entity/customer.interface";

export default interface CustomerRepositoryInterface
    extends RepositoryInterface<CustomerInterface> {}