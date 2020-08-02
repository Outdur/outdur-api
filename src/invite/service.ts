import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { inviteModel } from './model';
import { handleError } from "../helpers/handleError";
import { generateCode } from "../helpers/utility"
import { circleModel } from '../circle/model';
import { eventModel } from '../event/model';
import { IInvites } from "./interface";

const create = async (inviteData: any) => {
    const validationResult = await validateInvite(inviteData);
    if (typeof validationResult === 'string') throw new handleError(422, validationResult);

    const { validContacts, invalidContacts } = validationResult;

    if (!validContacts.length) {
        throw new handleError(422, 'No valid contact was provided', invalidContacts);
    }

    const invites = validContacts.map((contact: string) => {
        const key = isNumeric(contact) ? 'phone' : 'email';
        const invite = {
            [key]: contact,
            code: generateCode(),
            user: '1'
        };
        if (inviteData.event_id) invite.event_id = inviteData.event_id;
        if (inviteData.circle_id) invite.circle_id = inviteData.circle_id;
        return invite;
    });
    
    await inviteModel.insertMany(invites, { ordered: false });

    return invalidContacts || [];
}


const find = async (): Promise<IInvites | null> => {
    return inviteModel.find();
}

const validateInvite = async (invite: any): Promise<any> => {
    if ((Array.isArray(invite.contact) && !invite.contact.length) || !invite.contact) return 'Contact field must not be empty';
    if (invite.circle_id) if (!await circleModel.findOne({ circle_id: invite.circle_id })) return 'Invalid circle_id';
    if (invite.event_id) if (!await eventModel.findOne({ event_id: invite.event_id })) return 'Invalid event_id';

    const contacts = !Array.isArray(invite.contact) ? [invite.contact] : [...invite.contact];

    const validContacts = [];
    const invalidContacts = [];
    for (let i = 0; i < contacts.length; i++) {
        if (isNumeric(contacts[i])) {
            if (!isLength(contacts[i], { min: 6, max: 15 })) {
                invalidContacts.push({
                    message: 'Contact phone must not be less than 6 or greater than 15 numbers',
                    contact: contacts[i]
                });
            } else {
                validContacts.push(contacts[i]);
            }
        } else {
            if (!isEmail(contacts[i])) {
                invalidContacts.push({
                    message: 'Contact email is invalid',
                    contact: contacts[i]
                });
            } else {
                validContacts.push(contacts[i]);
            }
        }
    }
    return { validContacts, invalidContacts };
};

module.exports = {
    create,
    find
}