import AddressInterface from "./address.interface";

export default class Address {
    _street: string = "";
    _number: number = 0;
    _zip: string = "";
    _city: string = "";

    constructor(props: AddressInterface) {
        const { street, number, zip, city } = props;
        this._street = street;
        this._number = number;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get city(): string {
        return this._city;
    }

    get zipcode(): string {
        return this._zip;
    }

    validate() {
        if (this._street.length === 0) {
            throw new Error('Street is required');
        }
        if (this._number === 0) {
            throw new Error('Number is required');
        }
        if (this._zip.length === 0) {
            throw new Error('Zip is required');
        }
        if (this._city.length === 0) {
            throw new Error('City is required');
        }
    };

    static isValidRequiredFields(address: AddressInterface): boolean {
        return address.street && address.number && address.zip && address.city && true
    }
}