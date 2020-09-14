import { handleError } from "../helpers/handleError";
import { circleModel } from './model';
import { ICircle, ICircles } from './interface';
import { userModel } from "../user/userModel";



const create = async (circleData: any): Promise<ICircle> => {
    circleData.user_id = circleData.user.id;
    delete circleData.user;
    const validationError = await validateCircle(circleData);
    if (validationError) throw new handleError(422, validationError);

    return await circleModel.create(circleData);
}

const findOne = async (circle_id: number): Promise<ICircle> => {
    const circle = await circleModel.findOne({ circle_id });
    if (!circle) throw new handleError(404, 'Circle not found');
    return circle;
}

const findAll = async (): Promise<ICircles> => {
    return await circleModel.find();
}

const update = async (circle: ICircle): Promise<ICircle> => {
    const circle_id = circle.circle_id;
    const validationError = await validateCircle(circle);
    if (validationError) throw new handleError(422, validationError);

    const updatedEvent = await circleModel.findOneAndUpdate({ circle_id }, circle, { new: true });
    return updatedEvent;
}

const sendInvites = async (invites: any): Promise<any> => {

}

const validateCircle = async (circle: ICircle): Promise<null | string> => {
    if (circle.circle_id) {
        if (!await circleModel.findOne({ circle_id: circle.circle_id })) throw new handleError(404, 'Circle not found');

        if (circle.name !== undefined && !circle.name) return 'Your Circle must have a name';
        if (circle.description !== undefined && !circle.description) return 'Your Circle must have a description';
        
        // we don't want any of these to be edited
        (['user_id', 'circle_id', 'type'] as const).forEach(key => { delete circle[key]; });
    } else {
        if (!await userModel.findById(circle.user_id)) return 'Invalid user_id';
        if (!circle.name) return 'Circle must have a name';
        if (!circle.description) return 'Circle must have a description';
        if (circle.type) if (!['Registered', 'Unregistered'].includes(circle.type)) return 'Invalid circle type. Valid types are Registered and Unregistered';
        if (!circle.user_id) return 'User_id must be specified';
    }
    return null;
};


module.exports = {
    create,
    findOne,
    findAll,
    update,
    sendInvites
};