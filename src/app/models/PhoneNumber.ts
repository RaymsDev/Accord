import { IPhoneNumber } from './IPhoneNumber';

export class PhoneNumber implements IPhoneNumber {

    number: string;

    // format phone numbers as E.164
    get e164() {
        const num = this.number;
        return `+${num}`;
    }
}
