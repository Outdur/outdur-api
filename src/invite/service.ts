import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { inviteModel } from './model';
import { handleError } from "../helpers/handleError";
import { generateCode } from "../helpers/utility"
import { circleModel } from '../circle/model';
import { eventModel } from '../event/model';
import { IInvites } from "./interface";
import { userModel } from "../user/userModel";
const userService = require("../user/userService");
const eventService = require("../event/service");
const circleService = require("../circle/service");

const MUUID = require('uuid-mongodb');

const create = async (inviteData: any) => {
    const validationResult = await validateInvite(inviteData);
    if (typeof validationResult === 'string') throw new handleError(422, validationResult);

    const { validContacts, invalidContacts } = validationResult;

    if (!validContacts.length) {
        throw new handleError(422, 'No valid contact was provided', invalidContacts);
    }

    const newInvites: any = [];
    const userInvites: any = [];
    
    const invitesPromises = validContacts.map(async (contact: string) => {
        const data: any = {};
        let field: { user: string, id: string } = { user: '', id: '' };
        if (inviteData.event_id) {
            data.event_id = inviteData.event_id;
            field = { user: 'invitee', id: 'attend_id' };
        }
        if (inviteData.circle_id) {
            data.circle_id = inviteData.circle_id;
            field = { user: 'member', id: 'member_id' };
        }

        const key = isNumeric(contact) ? 'phone' : 'email';
        const user = await userModel.findOne({ [key]: contact });
        if (user) {
            return { ...data, [field.user]: user.id, inviter: inviteData.user.id, [field.id]: MUUID.v4() };
        } else {
            return { ...data, [key]: contact, code: generateCode(), user: inviteData.user.id };
        }
    });

    return Promise.all(invitesPromises).then(async invites => {
        invites.forEach((invite: any) => {
            if (invite.code) newInvites.push(invite);
            else userInvites.push(invite);
        });

        let insertedInvites = [];
        if (newInvites.length) insertedInvites = await inviteModel.insertMany(newInvites, { ordered: false });

        if (inviteData.event_id) {
            // invite old users
            eventService.sendInvites(userInvites);

            // invite non-users
            eventService.sendInvites(insertedInvites.map((invite: any) => {
                const { event_id, user } = inviteData;
                return { invite: invite.id, event_id, inviter: user.id };
            }));
        }
        if (inviteData.circle_id) {
            // invite old users
            circleService.sendInvites(userInvites.map((invite:any) => ({ circle_id: invite.circle_id, member: invite.member, member_id: invite.member_id })));

            // invite non-users
            circleService.sendInvites(insertedInvites.map((invite: any) => ({ circle_id: inviteData.circle_id, invite: invite.id })));
        }
        return invalidContacts || [];
    });
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