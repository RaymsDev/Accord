import { IPhoneNumber } from './IPhoneNumber';

export class PhoneNumber implements IPhoneNumber {
    country: string;
    area: string;
    prefix: string;
    line: string;

    // format phone numbers as E.164
    get e164() {
        const num = this.country + this.area + this.prefix + this.line;
        return `+${num}`;
    }
}
