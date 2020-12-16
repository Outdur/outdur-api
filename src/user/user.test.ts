import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(chaiHttp);
const server = require('../../index');
import { userModel } from '../../src/user/userModel';
const userService = require('../../src/user/userService');
// const userService = require('../../src/user/userService');
import { IUser } from '../../src/user/userInterface';

describe('User API', () => {
    describe('UserService: Create()', () => {
        it('should fail when no contact field is included', async() => {
            expect(userService.create({})).to.eventually.be.rejectedWith('Contact field must not be empty');
        });

        it('should fail if email is invalid', async () => {
            expect(userService.create({ contact: 'chi@yahoo' })).to.eventually.be.rejectedWith('Contact email is invalid');
        });

        it('should fail if length of phone is less than 6', async() => {
            expect(userService.create({ contact: '5768' })).to.eventually.be.rejectedWith('Contact phone must not be less than 6 or greater than 15 numbers');
        });

        it('should fail if length of phone is more than 15', async () => {
            expect(userService.create({ contact: '57687898759840392' })).to.eventually.be.rejectedWith('Contact phone must not be less than 6 or greater than 15 numbers');
        });

        it('should fail if phone contains a letter', async () => {
            expect(userService.create({ contact: '57687898d' })).to.eventually.be.rejectedWith('Contact email is invalid');
        });
    });

    describe('PUT users/:user_id', () => {
        let user: IUser;
        before(async() => {
            user = await userModel.create({ contact: 'test@email.com' });
        })

        after(async () => {
            await userModel.findByIdAndRemove(user.id);
        });

        it('should fail if invalid email is sent', async () => {
            const res = await chai.request(server).put(`/users/${user.id}`).send({ email: 'chi@yahoo' });
            expect(res.body.status).to.eql(false);
            expect(res.body.error.code).to.eql(422);
            expect(res.body.error.message).to.equal('Contact email is invalid');
        });

        it('should fail if invalid phone is sent', async () => {
            const res = await chai.request(server).put(`/users/${user.id}`).send({ phone: '7433' });
            expect(res.body.error.message).to.equal('Phone must not be less than 6 or greater than 15 numbers');
        });

        it('should fail if phone contains a letter', async () => {
            const res = await chai.request(server).put(`/users/${user.id}`).send({ phone: '7433l' });
            expect(res.body.error.message).to.equal('Phone must be numeric');
        });

        it('should fail if unknown field is sent', async () => {
            const res = await chai.request(server).put(`/users/${user.id}`).send({ unkn: '7433' });
            expect(res.body.error.message).to.equal('The field unkn is not allowed');
        });

        it('should update user successfully', async () => {
            const res = await chai.request(server).put(`/users/${user.user_id}`).send({ firstname: 'Akpan', lastname: 'Oluwagbemi' });
            expect(res.body.status).to.eql(true);
            expect(res.status).to.eql(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data.firstname).to.eql('Akpan');
            expect(res.body.data.lastname).to.eql('Oluwagbemi');
        });
    });

    describe('GET /users/:user_id', async () => {
        let user: IUser;
        before(async () => {
            user = await userModel.create({ email: 'test@email.com' });
        });

        after(async () => {
            await userModel.findByIdAndRemove(user.id);
        });

        it('should return a 404 if user_id is not found', async () => {
            const res = await chai.request(server).get('/users/00000');
            expect(res.body.status).to.eql(false);
            expect(res.status).to.eql(404);
            expect(res.body.error.message).to.equal('User not found')
        });

        it('should return user with the specified user_id', async () => {
            const res = await chai.request(server).get(`/users/${user.user_id}`);
            expect(res.body.status).to.eql(true);
            expect(res.status).to.eql(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data.email).to.eql('test@email.com');
        });
    });
});