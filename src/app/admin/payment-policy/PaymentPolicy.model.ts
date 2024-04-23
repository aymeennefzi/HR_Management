export enum LeaveType {
    SickLeave = 'Sick Leave',
    PaidLeave = 'paid leave',
    Unpaidleave = 'Unpaid leave',
    Bereavement = 'Bereavement',
    PersonalReasons = 'Personal Reasons',
    Maternity = 'Maternity',
    Paternity = 'Paternity',
    RTT = 'RTT',
    Other = 'Other',
}

export class PaymentPolicy {
    _id!:string;
    taxRate: number;
    socialSecurityRate: number;
    otherDeductions: number;
    paymentDay?: number;
    allowedDays: Map<LeaveType, number>;
    exessDayPay?: number;

    constructor(
        _id:string,
        taxRate: number,
        socialSecurityRate: number,
        otherDeductions: number,
        allowedDays: Map<LeaveType, number>,
        paymentDay?: number,
        exessDayPay?: number
    ) {this._id=_id;
        this.taxRate = taxRate;
        this.socialSecurityRate = socialSecurityRate;
        this.otherDeductions = otherDeductions;
        this.allowedDays = allowedDays;
        this.paymentDay = paymentDay;
        this.exessDayPay = exessDayPay;
    }
}
