import EventDispatcher from "./event-dispatcher";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

describe("Domain events tests", () => {
   class MockEvent implements EventInterface {
        dataTimeOccurred: Date;
        eventData: any;
        constructor(eventData: any) {
            this.dataTimeOccurred = new Date();
            this.eventData = eventData;
        }
   }

   class MockHandler implements EventHandlerInterface<MockEvent> {
        handle(event: MockEvent): void {
            console.log(`Send email to ${event.eventData.name}...`);
        }
   }

   it("should register many events handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new MockHandler();

        eventDispatcher.register("MockHandler", eventHandler);

        expect(eventDispatcher.getEventHandlers["MockHandler"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["MockHandler"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["MockHandler"][0]).toMatchObject(eventHandler);
   }); 

   it("should unregister one of the events handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new MockHandler();
        const eventHandler2 = new MockHandler();
        const eventUnnamedHandler = new MockHandler();

        eventDispatcher.register("MockHandler", eventHandler1);
        eventDispatcher.register("MockHandler", eventHandler2);
        eventDispatcher.register("unnamed", eventUnnamedHandler);

        expect(eventDispatcher.getEventHandlers["MockHandler"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["MockHandler"][1]).toMatchObject(eventHandler2);
        expect(eventDispatcher.getEventHandlers["unnamed"][0]).toMatchObject(eventUnnamedHandler);
        expect(eventDispatcher.getEventHandlers["MockHandler"].length).toBe(2); 

        eventDispatcher.unregister("MockHandler", eventHandler1);

        expect(Object.keys(eventDispatcher.getEventHandlers)).toEqual(["MockHandler", "unnamed"]);
        expect(eventDispatcher.getEventHandlers["MockHandler"].length).toBe(1);      
        expect(eventDispatcher.getEventHandlers["MockHandler"][0]).toMatchObject(eventHandler2); 
        expect(eventDispatcher.getEventHandlers["unnamed"][0]).toMatchObject(eventUnnamedHandler);
   });

   it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new MockHandler();
        const eventUnnamedHandler = new MockHandler();

        eventDispatcher.register("MockHandler", eventHandler);
        eventDispatcher.register("unnamed", eventUnnamedHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["MockHandler"]).toBeUndefined();
        expect(eventDispatcher.getEventHandlers["unnamed"]).toBeUndefined();
   });

   it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new MockHandler();
        const spyEventHandlerNotification = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("MockEvent", eventHandler);


        expect(eventDispatcher.getEventHandlers["MockEvent"][0]).toMatchObject(eventHandler);

        const notificationEvent1 = new MockEvent({
            name: "John",
        });

        const notificationEvent2 = new MockEvent({
            name: "Mary",
        });

        eventDispatcher.notify(notificationEvent1);
        eventDispatcher.notify(notificationEvent2);

        expect(spyEventHandlerNotification).toHaveBeenCalled();
        expect(spyEventHandlerNotification).toHaveBeenCalledTimes(2);
        expect(spyEventHandlerNotification).toHaveBeenCalledWith(notificationEvent1);
        expect(spyEventHandlerNotification).toHaveBeenCalledWith(notificationEvent2);
   });
});