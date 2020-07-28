import { IInvite } from "./inviteInterface";
import { IInvites } from "./invitesInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { inviteModel } from './inviteModel';
import { handleError } from "../helpers/handleError";
import { generateCode } from "../helpers/generateCode";


const create = async (inviteData: any) => {
    const validationError = validateInvite(inviteData);
    if (validationError) throw new handleError(422, validationError);
   
    //generate invite code
    const code: number = generateCode(3.1536e+10, 9.1536e+10);
  
    const userContact = isNumeric(inviteData.contact) ? { phone: inviteData.contact } : { email: inviteData.contact };
    let circle_id, event_id;

    if (inviteData.circle_id) { circle_id = inviteData.circle_id };
    if (inviteData.event_id) { event_id = inviteData.event_id };
    
    const user = inviteData.user; // I need to fetch this data from the token
    
    const invitePayload: any = [code, userContact, circle_id, event_id, user];
    
    try {
        return await inviteModel.create(invitePayload);
    } catch (err) {
        let message = err.code == '11000' ? 'Duplicate contact' : 'Unknown fatal error occurred';
        throw new handleError(500, message);
    }
}

// const findOne = async (user_id: number): Promise<IInvite | any> => {
//     const user =  await inviteModel.findOne({ user_id });
//     if (!user) throw new handleError(404, 'User not found');
//     return user;
// }

// const findAll = async (): Promise<IInvites | any[]> => {
//     return await inviteModel.find();
// }

// const update = async (inviteData: IInvite): Promise<IInvite | any> => {
//     const validationError = validateUpdateUser(inviteData);
//     if (validationError) throw new handleError(422, validationError);
    
//     const user_id = inviteData.user_id;
//     delete inviteData.user_id;
//     const updatedUser = await inviteModel.findOneAndUpdate({ user_id }, inviteData, { new: true });
//     return updatedUser;
// }

const validateInvite = (invite: any): null | string => {
    if (!invite.contact) return 'Contact field must not be empty';
    if (isNumeric(invite.contact)) {
        if (!isLength(invite.contact, { min: 6, max: 15 })) return 'Contact phone must not be less than 6 or greater than 15 numbers';
    } else {
        if (!isEmail(invite.contact)) return 'Contact email is invalid';
    }
    return null;
}

// const validateUpdateUser = (user: any): null | string => {
//     Object.keys(user).forEach(key => {
//         if (!['email', 'phone', 'firstname', 'lastname', 'user_id'].includes(key)) throw new Error(`The field ${key} is not allowed`);
//     });
    
//     if (user.phone && isNumeric(user.phone)) {
//         if (!isLength(user.phone, { min: 6, max: 15 })) return 'Phone must not be less than 6 or greater than 15 numbers';
//     } else if (user.phone && !isNumeric(user.phone)) return 'Phone must be numeric';
//     if (user.email && !isEmail(user.phone)) return 'Contact email is invalid';
//     return null;
// }

module.exports = {
    create,
    // findOne,
    // findAll,
    // update
}