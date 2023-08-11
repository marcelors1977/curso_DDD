import SendEmailWhenProductIsCreatedHandler from "./send-email-when-product-is-created.event";
import ProductCreatedEvent from "../product-created.event";
import EventDispatcher from "../../../_shared/event/event-dispatcher";

describe("Domain product events tests", () => {
   it("should register a product event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new SendEmailWhenProductIsCreatedHandler();

       eventDispatcher.register("ProductCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
   }); 

   it("should unregister a product event handler", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new SendEmailWhenProductIsCreatedHandler();

       eventDispatcher.register("ProductCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);       
   });

   it("should unregister all product event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new SendEmailWhenProductIsCreatedHandler();

       eventDispatcher.register("ProductCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

       eventDispatcher.unregisterAll();

       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined(); 
   });

   it("should notify all product event handlers", () => {
       const eventDispatcher = new EventDispatcher();
       const eventHandler = new SendEmailWhenProductIsCreatedHandler();
       const spyEventHandler = jest.spyOn(eventHandler, "handle");

       eventDispatcher.register("ProductCreatedEvent", eventHandler);

       expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

       const productCreatedEvent = new ProductCreatedEvent({
           name: "Product 1",
           description: "Product 1 description",
           price: 10
       });

       eventDispatcher.notify(productCreatedEvent);

       expect(spyEventHandler).toHaveBeenCalled();
   });
});