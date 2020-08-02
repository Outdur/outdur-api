import { IInvite, IInvites } from './interface';
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { inviteModel } from './model';
import { handleError } from "../helpers/handleError";
import { generateCode } from "../helpers/utility"
import { circleModel } from '../circle/model';
import { ICircle, ICircles } from '../circle/interface';
import { eventModel } from '../event/model';


const create = async (inviteData: any) => {
    const validationError: any = await validateInvite(inviteData);
    if (validationError) throw new handleError(422, validationError);

    inviteData.code = generateCode();
    const userContact = isNumeric(inviteData.contact) ? { phone: inviteData.contact } : { email: inviteData.contact };
    if(isNumeric(inviteData.contact)) inviteData.phone = inviteData.contact;
    if(!isNumeric(inviteData.contact)) inviteData.email = inviteData.contact;
    // inviteData.user = null;
    
    return await inviteModel.create(inviteData);
}

const validateInvite = async (invite: any): Promise<null | string> => {
    if (!invite.contact) return 'Contact field must not be empty';
    if (isNumeric(invite.contact)) {
        if (!isLength(invite.contact, { min: 6, max: 15 })) return 'Contact phone must not be less than 6 or greater than 15 numbers';
    } else {
        if (!isEmail(invite.contact)) return 'Contact email is invalid';
    }
    if (invite.circle_id) if (!await circleModel.findOne({ circle_id: invite.circle_id })) return 'Invalid circle_id';
    if (invite.event_id) if (!await eventModel.findOne({ event_id: invite.event_id })) return 'Invalid event_id';
    return null;
};

module.exports = {
    create,
}