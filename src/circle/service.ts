import { handleError } from "../helpers/handleError";
import { circleModel, circleMemberModel } from './model';
import { ICircle, ICircles } from './interface';
import { upload } from '../helpers/imageHelper';
import { cloudinary } from '../helpers/cloudinary';

const MUUID = require('uuid-mongodb');

const eventFields = '-_id title description venue event_date event_time picture_url event_id createdAt';
const circleFields = '-_id name description circle_id type photo_url userId events';
const userFields = '-_id firstname lastname thumb';
const inviteFields = '-_id code email phone status createdAt';

const create = async (circleData: any): Promise<ICircle> => {
    const validationError = await validateCircle(circleData);
    if (validationError) throw new handleError(422, validationError);

    const newCircle = await circleModel.create({ ...circleData, circle_id: MUUID.v4() });

    if (circleData.circle_photo) {
        await uploadPicture(circleData.circle_photo, newCircle);
    }
    const circle = await circleModel.findById(newCircle.id).select(circleFields).lean();
    return { ...circle, member_count: 0 };
}

const findOne = async (circle_id: String): Promise<ICircle> => {
    const circle = await circleModel.findOne({ circle_id, deleted: false }).populate({ path: 'events', select: eventFields }).select(circleFields).lean();
    //const circle = rawCircle.sanitize();
    if (!circle) throw new handleError(404, 'Circle not found');

    const members = await findMembers(circle_id);
    return { ...circle, members: members.members, member_count: members.member_count }
}

const findAll = async (user_id: String | null): Promise<any> => {
    const criteria: any = { deleted: false };
    if (user_id) criteria.user_id = user_id;
    const rawCircles = await circleModel.find(criteria).select(circleFields).lean();
    const allCircles = rawCircles.map(async (circle: ICircle) => {
        // const circle = circleObj.sanitize();
        const { members, member_count } = await findMembers(circle.circle_id);
        return { ...circle, members, member_count: member_count };
    });
    return Promise.all(allCircles).then(circles => circles);
}

const fetchUserCirclesNames = async (user_id: String): Promise<[String]> => {
    const criteria = { deleted: false, user_id };
    return circleModel.find(criteria).select('-_id activity_title').lean();
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

const changeInviteStatus = async ({ member_id, status }: any) => {
    if (!member_id || typeof member_id !== 'string') throw new handleError(422, 'Invalid member_id. Must be a string');
    if (!['accepted', 'rejected'].includes(status)) throw new handleError(422, 'Invalid status. Must be either "acceptd" or "rejected"');
    return circleMemberModel.findOneAndUpdate({ member_id }, { status });
}

const findMembers = async (circle_id: String): Promise<any> => {
    const members = await circleMemberModel.find({ circle_id, deleted: false }).sort('-status')
        .populate({ path: 'member', select: userFields })
        .populate({ path: 'invite', select: inviteFields })
        .select('-_id member_id status createdAt');

    return { members, member_count: members.filter((member: any) => member.member && member.status === 'accepted').length };
}

const removeMember = async (circle_admin: string, circle_id: String, member_id: String): Promise<any> => {
    return await circleMemberModel.findOneAndUpdate({ user: circle_admin, circle_id, member_id }, { deleted: true });
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

const uploadPicture = async (picture: any, circle: any) => {
    const pic_name = circle.name.split(' ').join('-') + `_${circle.id}`;
    
    const { public_id, format, secure_url } = await upload({ file: picture.picture.data, filename: pic_name, folder: 'circle-photos/' });
    const img_url = `${public_id}.${format}`;
    const photo_url = {
        url: secure_url,
        mobile: cloudinary.url(img_url, { width: 400, height: 350, crop: "fill", secure: true }),
    };
    await circleModel.findByIdAndUpdate(circle.id, { photo_url });
    return photo_url;
}


module.exports = {
    create,
    findOne,
    findAll,
    fetchUserCirclesNames,
    update,
    sendInvites,
    findMembers,
    changeInviteStatus,
    removeMember
};