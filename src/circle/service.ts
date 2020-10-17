import { handleError } from "../helpers/handleError";
import { circleModel, circleMemberModel } from './model';
import { ICircle, ICircles } from './interface';
import { userModel } from "../user/userModel";

const MUUID = require('uuid-mongodb');

const circleFields = '-_id name description type photo_url user';
const eventFields = '-_id title description venue event_date event_time picture_url event_id createdAt';
const userFields = '-_id firstname lastname photo_url thumb';
const inviteFields = '-_id code email phone status createdAt';

const create = async (circleData: any): Promise<ICircle> => {
    const validationError = await validateCircle(circleData);
    if (validationError) throw new handleError(422, validationError);

    const newCircle = await circleModel.create({ ...circleData, circle_id: MUUID.v4() });
    return newCircle.sanitize();
}

const findOne = async (circle_id: String): Promise<ICircle> => {
    const rawCircle = await circleModel.findOne({ circle_id }).populate({ path: 'events', select: eventFields });
    const circle = rawCircle.sanitize();
    if (!circle) throw new handleError(404, 'Circle not found');

    const members = await findMembers(circle_id);
    return { ...circle, members: members.members, member_count: members.member_count }
}

const findAll = async (): Promise<any> => {
    const rawCircles = await circleModel.find();
    const allCircles = rawCircles.map(async (circleObj: ICircle) => {
        const circle = circleObj.sanitize();
        const members = await findMembers(circle.circle_id);
        return { ...circle, member_count: members.member_count };
    });
    return Promise.all(allCircles).then(circles => circles);
}

const update = async (circle: ICircle): Promise<ICircle> => {
    const circle_id = circle.circle_id;
    const validationError = await validateCircle(circle);
    if (validationError) throw new handleError(422, validationError);

    const updatedEvent = await circleModel.findOneAndUpdate({ circle_id }, circle, { new: true });
    return updatedEvent.sanitize();
}

const sendInvites = async (invites: any): Promise<any> => {
    return circleMemberModel.insertMany(invites, { ordered: false });
}

const findMembers = async (circle_id: String): Promise<any> => {
    const members = await circleMemberModel.find({ circle_id }).sort('+member')
        .populate({ path: 'member', select: userFields })
        .populate({ path: 'invite', select: inviteFields })
        .select('-_id status createdAt');

    return { members, member_count: members.filter((member: any) => member.member && member.member).length };    
}

const changeInviteStatus = async (circle_member_id: String, attending: boolean) => {
    return circleMemberModel.findByIdAndUpdate(circle_member_id, { status: attending });
}

const validateCircle = async (circle: ICircle): Promise<null | string> => {
    if (circle.circle_id) {
        if (!await circleModel.findOne({ circle_id: circle.circle_id })) throw new handleError(404, 'Circle not found');

        if (circle.name !== undefined && !circle.name) return 'Your Circle must have a name';
        if (circle.description !== undefined && !circle.description) return 'Your Circle must have a description';
        
        // we don't want any of these to be edited
        (['user', 'circle_id', 'type'] as const).forEach(key => { delete circle[key]; });
    } else {
        if (!circle.name) return 'Circle must have a name';
        if (!circle.description) return 'Circle must have a description';
        if (circle.type) if (!['Registered', 'Unregistered'].includes(circle.type)) return 'Invalid circle type. Valid types are Registered and Unregistered';
    }
    return null;
};


module.exports = {
    create,
    findOne,
    findAll,
    update,
    sendInvites,
    findMembers,
    changeInviteStatus
};