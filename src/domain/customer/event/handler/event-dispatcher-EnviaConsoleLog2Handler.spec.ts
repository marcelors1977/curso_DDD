
import EventDispatcher from "../../../_shared/event/event-dispatcher";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog2Handler from "./envia-consoleLog2-when-customer-created.event";

describe("Domain customer ConsoleLog2 events tests", () => {
   it("should register a consoleLog2 event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog2Handler();

       eventDispatcher.register("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
   }); 

   it("should unregister a consoleLog2 event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog2Handler();

       eventDispatcher.register("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);       
   });

   it("should unregister all consoleLog2 event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog2Handler();

       eventDispatcher.register("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregisterAll();

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined(); 
   });

   it("should notify all consoleLog2 event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog2Handler();
       const spyEventHandler = jest.spyOn(eventHandler, "handle");

       eventDispatcher.register("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

       const customerCreatedEvent = new CustomerCreatedEvent({
           mensagem: "Customer created",
       });

       eventDispatcher.notify(customerCreatedEvent);

       expect(spyEventHandler).toHaveBeenCalled();
   });
});