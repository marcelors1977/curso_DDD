import EventHandlerInterface from "../../_shared/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-change-address.event";

export default class EnviaConsoleLogHandler 
implements EventHandlerInterface<CustomerChangedAddressEvent> {
    handle(event: CustomerChangedAddressEvent): void {
        console.log(
            `Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address.street}...`
        );
    }
}