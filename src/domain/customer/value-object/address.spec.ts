import Address from "./address";

describe("Address unit test", () => {
    it("should throw an error when street is empty", () => {
        expect(() => {
            const address = new Address({street: "", number: 1, zip: "Zip", city: "City"});
        }).toThrowError("Street is required");
    });

    it("should throw an error when number is empty", () => {
        expect(() => {
            const address = new Address({street: "Street", number: 0, zip: "Zip", city: "City"});
        }).toThrowError("Number is required");
    });

    it("should throw an error when zip is empty", () => {
        expect(() => {
            const address = new Address({street: "Street", number: 1, zip: "", city: "City"});
        }).toThrowError("Zip is required");
    });

    it("should throw an error when city is empty", () => {
        expect(() => {
            const address = new Address({street: "Street", number: 1, zip: "Zip", city: ""});
        }).toThrowError("City is required");
    });
});