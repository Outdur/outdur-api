import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(chaiHttp);
const server = require('../../index');
// import { userModel } from '../../src/user/userModel';
const inviteService = require('../../src/user/inviteService');
// import { IUser } from '../../src/user/userInterface';

describe('Invite API', () => {
    describe('POST invite/', () => {

        it('should fail when no contact field is included', async() => {
            expect(inviteService.create({})).to.eventually.be.rejectedWith('Contact field must not be empty');
        });

        it('should fail if email is invalid', async () => {
            const res = await chai.request(server).post('/invite').send({ email: 'chi@yahoo' });
            expect(res.body.error.message).to.equal('Contact email is invalid');
        });

        it('should fail if length of phone is less than 10', async() => {
            const res = await chai.request(server).post('/invite').send({ phone: '57687898' });
            expect(res.body.error.message).to.equal('Contact phone must not be less than 6 or greater than 15 numbers');
        });

        it('should fail if length of phone is more than 15', async () => {
            const res = await chai.request(server).post('/invite').send({ phone: '57687898759840392' });
            expect(res.body.error.message).to.equal('Contact phone must not be less than 6 or greater than 15 numbers');
        });

        it('should fail if phone contains a letter', async () => {
            const res = await chai.request(server).post('/invite').send({ phone: '57687898d' });
            expect(res.body.error.message).to.equal('Contact email is invalid');
        });
    });
});