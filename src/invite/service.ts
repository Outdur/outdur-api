// import { IInvite, IInvites } from "./Interface";
import { IInvite, IInvites } from './interface';
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { inviteModel } from './model';
import { handleError } from "../helpers/handleError";
import { generateCode } from "../helpers/utility"


const create = async (inviteData: any) => {
    const validationError = validateInvite(inviteData);
    if (validationError) throw new handleError(422, validationError);

    const code: string = generateCode();
    inviteData.code = code;
    const userContact = isNumeric(inviteData.contact) ? { phone: inviteData.contact } : { email: inviteData.contact };
    let circle_id, event_id;

    if (inviteData.circle_id) { circle_id = inviteData.circle_id };
    if (inviteData.event_id) { event_id = inviteData.event_id };

    const user = inviteData.user; // I need to fetch this data from the token
    
    const invitePayload: any = [code, userContact, circle_id, event_id, user];
    
    try {
        return await inviteModel.create(invitePayload); //this crashes the app :(
    } catch (err) {
        let message = err.code == '11000' ? 'Duplicate contact' : 'Unknown fatal error occurred';
        throw new handleError(500, message);
    }
}

const validateInvite = (invite: any): null | string => {
    if (!invite.contact) return 'Contact field must not be empty';
    if (isNumeric(invite.contact)) {
        if (!isLength(invite.contact, { min: 6, max: 15 })) return 'Contact phone must not be less than 6 or greater than 15 numbers';
    } else {
        if (!isEmail(invite.contact)) return 'Contact email is invalid';
    }
    return null;
}

module.exports = {
    create,
}