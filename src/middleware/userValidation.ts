const { body, check, oneOf } = require('express-validator');
import { validate } from "./validate";

module.exports = {
    userValidationRules: () => {
        return [
            body('contact').exists().trim().withMessage('Contact field must not be empty'),
            oneOf([
                check('contact').normalizeEmail().isEmail().withMessage('Specified email is not a valid email'),
                check('contact').isNumeric().withMessage('Specified contact is invalid')
            ])
        ];
    },

    validate
}