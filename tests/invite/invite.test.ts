import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const server = require('../../index');

describe('Invite API', () => {
    describe('POST invite/', () => {
        // it('should fail when no contact field is included', async() => {
        //     const res = await chai.request(server).post('/users').send({});
        //     expect(res.body).to.have.property('status').to.equal(false);
        //     expect(res.body).to.have.property('error').to.be.an('object');
        //     expect(res.body.error.message).to.equal('Contact field must not be empty');
        // });

        // it('should fail if email is invalid', async () => {
        //     const res = await chai.request(server).post('/users').send({ contact: 'chi@yahoo' });
        //     expect(res.body.error.message).to.equal('Contact email is invalid');
        // });

        // it('should fail if length of phone is less than 10', async() => {
        //     const res = await chai.request(server).post('/users').send({ contact: '57687898' });
        //     expect(res.body.error.message).to.equal('Contact phone must not be less than 6 or greater than 15 numbers');
        // });

        // it('should fail if length of phone is more than 15', async () => {
        //     const res = await chai.request(server).post('/users').send({ contact: '57687898759840392' });
        //     expect(res.body.error.message).to.equal('Contact phone must not be less than 6 or greater than 15 numbers');
        // });

        // it('should fail if phone contains a letter', async () => {
        //     const res = await chai.request(server).post('/users').send({ contact: '57687898d' });
        //     expect(res.body.error.message).to.equal('Contact email is invalid');
        // });
    });
});