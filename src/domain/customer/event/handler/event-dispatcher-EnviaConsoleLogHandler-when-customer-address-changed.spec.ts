
import EventDispatcher from "../../../_shared/event/event-dispatcher";
import CustomerChangedAddressEvent from "../customer-change-address.event";
import EnviaConsoleLogHandler from "./envia-consoleLog-when-customer-address-changed.event";

describe("Domain customer address changed events tests", () => {
   it("should register a change address event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLogHandler();

       eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);
       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);
   }); 

   it("should unregister a change address event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLogHandler();

       eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregister("CustomerChangedAddressEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(0);       
   });

   it("should unregister all change address event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLogHandler();

       eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregisterAll();

       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeUndefined(); 
   });

   it("should notify all change address event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLogHandler();
       const spyEventHandler = jest.spyOn(eventHandler, "handle");

       eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

       const customerAddressChangedEvent = new CustomerChangedAddressEvent({
           id: "123",
           name: "John",
           address: {street: "Rua itupava", number: 7000, city: "City"},
       });

       eventDispatcher.notify(customerAddressChangedEvent);

       expect(spyEventHandler).toHaveBeenCalled();
   });
});