import 'mocha';
import chai, { expect } from 'chai';
import { userRouter } from "../../src/user/userRouter";
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const server = require('../../index');

describe('User API', () => {
    describe('POST user/', () => {
        it('should fail when no contact field is included', async() => {
            const res = await chai.request(server).post('/users');
            console.log(res.body)
        });
    });
});