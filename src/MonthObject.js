export default class MonthObject {

    //month ranges from 1 to 12
    constructor(year, month) {
        let _y = parseInt(+year), _m = parseInt(+month);
        if (isNaN(_y) || isNaN(_m) || _m < 1 || _m > 12) {
            if (process.env.NODE_ENV !== "production") {
                throw new TypeError('MonthObject constructor should receive a valid number!');
            }
        }
        this._year = _y;
        this._month = _m;
        this._isLeap = ((month == 2) && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0));
        this._dayCount = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1][month - 1] + 30 + this._isLeap;
    }

    get month() {
        return this._month;
    }

    get year() {
        return this._year;
    }

    get isLeap() {
        return this._isLeap;
    }

    get dayCount() {
        return this._dayCount;
    }

    prev() {
        return this._month != 1 ? new MonthObject(this._year, this._month - 1) : new MonthObject(this._year - 1, 11);
    }

    next() {
        return this._month != 12 ? new MonthObject(this._year, this._month + 1) : new MonthObject(this._year + 1, 1);
    }

    //C style compare function -1 for less than, 0 for equal, 1 for more than
    compare(monthObject) {
        let y_cmp = this._year - monthObject.year;
        return y_cmp == 0 ? (this._month - monthObject.month) : (y_cmp > 0 ? 1 : -1);
    }

    toDate() {
        let result = new Date();
        result.setFullYear(this._year);
        result.setMonth(this._month - 1);
        result.setDate(1);
        return result;
    }

    static fromDate(dateObject) {
        return new MonthObject(dateObject.getFullYear(), dateObject.getMonth() + 1);
    }
}