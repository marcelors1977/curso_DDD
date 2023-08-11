import EventDispatcher from "../../_shared/event-dispatcher";
import EnviaConsoleLog1Handler from "./envia-consoleLog1-when-customer-created.event";
import CustomerCreatedEvent from "../customer-created.event";

describe("Domain customer ConsoleLog1 events tests", () => {
   it("should register a consoleLog1 event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog1Handler();

       eventDispatcher.register("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
   }); 

   it("should unregister a consoleLog1 event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog1Handler();

       eventDispatcher.register("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);       
   });

   it("should unregister all consoleLog1 event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog1Handler();

       eventDispatcher.register("CustomerCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregisterAll();

       expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined(); 
   });

   it("should notify all consoleLog1 event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new EnviaConsoleLog1Handler();
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