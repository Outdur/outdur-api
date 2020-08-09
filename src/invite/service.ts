import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { inviteModel } from './model';
import { handleError } from "../helpers/handleError";
import { generateCode } from "../helpers/utility"
import { circleModel } from '../circle/model';
import { eventModel } from '../event/model';
import { IInvites } from "./interface";
const userService = require("../user/userService");

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
            user: inviteData.user.id
        };
        if (inviteData.event_id) invite.event_id = inviteData.event_id;
        if (inviteData.circle_id) invite.circle_id = inviteData.circle_id;
        return invite;
    });
    
    await inviteModel.insertMany(invites, { ordered: false });

    // send email/sms

    return invalidContacts || [];
}


const acceptInvite = async (inviteData: any) => {
    if (!inviteData.device_platform || !inviteData.device_id) throw new handleError(400, 'Device ID and Platform must be specified');

    const { contact, code, device_id, device_platform } = inviteData;
    const contactKey = isNumeric(contact) ? 'phone' : 'email';
    const criteria = {
        [contactKey]: contact,
        code
    };
    const invite = await inviteModel.find(criteria);
    if (!invite.length) throw new handleError(404, 'Invite not found');

    // create new user
    const user = await userService.create({ contact, device_id, device_platform });

    const data: any = {};

    if (invite.circle_id) {
        data.circle_id = inviteData.circle_id;
    }

    if (invite.event_id) {
        data.event_id = inviteData.event_id;
    }

    data.token = userService.generateUserToken(user);

    return data;
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
    acceptInvite,
    find
}