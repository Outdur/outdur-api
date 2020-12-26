import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(chaiHttp);
const server = require('../../test/index');
import { userModel } from '../../src/user/userModel';
const inviteService = require('../../src/invite/Service');
const userService = require('../../src/user/userService');
import { IUser } from '../../src/user/userInterface';

let userData: any;
let jwtToken: string;

describe('Invite API', () => {
    before(() => {
        const { users } = global.fixtures;
        userData = users;
    });

    describe('POST invite/send', () => {
        let user: IUser;

        before(async () => {
            user = await userModel.create(userData[0]);
            jwtToken = userService.generateUserToken(user);
        });

        after(async () => {
            await userModel.deleteOne({ user_id: "1" });
        });

        it('should fail if email is invalid', async () => {
            const res = await chai.request(server).post('/invites/send').set('Authorization', `bearer ${jwtToken}`).send({ contact: 'chi@yahoo' });
            expect(res.body.error.message).to.equal('No valid contact was provided');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('invalidContacts');
            expect(res.body.data.invalidContacts[0].message).to.eql('Contact email is invalid');
            expect(res.body.data.invalidContacts[0].contact).to.eql('chi@yahoo');
        });

        it('should fail if length of phone is less than 6', async() => {
            const contact = '57687';
            const res = await chai.request(server).post('/invites/send').set('Authorization', `bearer ${jwtToken}`).send({ contact });
            expect(res.body.error.message).to.equal('No valid contact was provided');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('invalidContacts');
            expect(res.body.data.invalidContacts[0].message).to.eql('Contact phone must not be less than 6 or greater than 15 numbers');
            expect(res.body.data.invalidContacts[0].contact).to.eql(contact);
        });

        it('should fail if length of phone is more than 15', async () => {
            const contact = '57687898759840392';
            const res = await chai.request(server).post('/invites/send').set('Authorization', `bearer ${jwtToken}`).send({ contact });
            expect(res.body.error.message).to.equal('No valid contact was provided');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('invalidContacts');
            expect(res.body.data.invalidContacts[0].message).to.eql('Contact phone must not be less than 6 or greater than 15 numbers');
            expect(res.body.data.invalidContacts[0].contact).to.eql(contact);
        });

        it('should fail if phone contains a letter', async () => {
            const contact = '57687898d';
            const res = await chai.request(server).post('/invites/send').set('Authorization', `bearer ${jwtToken}`).send({ contact });
            expect(res.body.error.message).to.equal('No valid contact was provided');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('invalidContacts');
            expect(res.body.data.invalidContacts[0].message).to.eql('Contact email is invalid');
            expect(res.body.data.invalidContacts[0].contact).to.eql(contact);
        });
    });
});

describe('Invite Service Tests', () => {
    describe('inviteService.create', () => {
        it('should fail when no contact field is included', async () => {
            expect(inviteService.create({})).to.eventually.be.rejectedWith('Contact field must not be empty');
        });
    });
});