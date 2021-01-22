export const isEmail = (value: string): boolean => {
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(value);
};

export const isLength = (value: any, option: any): boolean => {
    const opts = Object.keys(option);
    let response;
    for (let i = 0; i < opts.length; i++) {
        if (!['is', 'min', 'max'].includes(opts[i])) {
            throw new Error('Invalid option key. Valid keys are (is, min and max)');
        }
        if (opts[i] === 'is') {
            response = value.length === option[opts[i]];
            break;
        }
        if (opts[i] === 'min') {
            response = !(value.length < option[opts[i]]);
            if (!response) break;
        }
        if (opts[i] === 'max') response = !(value.length > option[opts[i]]);
    }
    return response === true;
};

export const isNumeric = (value: string|number): boolean => {
    return !isNaN(Number(value));
}

export const isValidUUIDV4 = (value: string): boolean => {
    return new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$').test(value);
}