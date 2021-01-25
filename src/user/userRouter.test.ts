import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(chaiHttp);

const server = require('../../index');

describe('User API', () => {
    let jwtToken: string;
    before(() => {
        jwtToken = global.fixtures.jwtToken;
    });

    describe('PUT /users', async () => {

        it('should fail if attempt is made to change unpermitted fields', async () => {
            const res = await chai.request(server).put('/users').set('Authorization', `bearer ${jwtToken}`).send({ email: 'chi@yahoo' });
            expect(res.body.status).to.eql(true);
            expect(res.body.error).to.exist;
            expect(res.body.error.code).to.eql(422);
            expect(res.body.error.message).to.equal('The field email is not allowed');
        });

        it('should fail if unknown field is sent', async () => {
            const res = await chai.request(server).put('/users').set('Authorization', `bearer ${jwtToken}`).send({ unkn: '7433' });
            expect(res.body.error.message).to.equal('The field unkn is not allowed');
        });

        it('should update user successfully', async () => {
            const res = await chai.request(server).put('/users').set('Authorization', `bearer ${jwtToken}`).send({ firstname: 'Akpan', lastname: 'Oluwagbemi' });
            expect(res.body.status).to.eql(true);
            expect(res.status).to.eql(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data.firstname).to.eql('Akpan');
            expect(res.body.data.lastname).to.eql('Oluwagbemi');
        });
    });
});