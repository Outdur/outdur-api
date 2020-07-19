export const isEmail = (value: string) => {
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(value);
};

export const isLength = (value: any, option: any) => {
    const opts = Object.keys(option);
    let response;
    for (let i = 0; i < opts.length; i++) {
        if (!['is', 'min', 'max'].includes(opts[i])) {
            response = "Invalid option key. Valid keys are (is, min and max)";
            break;
        }
        if (opts[i] === 'is') {
            response = value === option[opts[i]];
            break;
        }
        if (opts[i] === 'min') response = value >= option[opts[i]];
        if (opts[i] === 'max') response = value <= option[opts[i]];
    }
    return response === true ? null : response;
};

export const isNumeric = (value: string|number) => {
    return !isNaN(Number(value));
}