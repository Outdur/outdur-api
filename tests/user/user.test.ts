import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const server = require('../../index');

describe('User API', () => {
    describe('POST user/', () => {
        it('should fail when no contact field is included', async() => {
            const res = await chai.request(server).post('/users').send({});
            expect(res.body).to.have.property('status').to.equal(false);
            expect(res.body).to.have.property('error').to.be.an('object');
            expect(res.body.error.message).to.equal('Email or phone must be specified');
        });

        it('should fail if email is invalid', async() => {
            const res = await chai.request(server).post('/users').send({ email: 'chi@yahoo' });
            expect(res.body.error.message).to.equal('Email specified is invalid');
        });

        it('should fail if phone is invalid', async () => {
            const res = await chai.request(server).post('/users').send({ phone: '759384' });
            expect(res.body.error.message).to.equal('Phone number specified is invalid');
        });
    });
});