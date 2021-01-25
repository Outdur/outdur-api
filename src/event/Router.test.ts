import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(chaiHttp);

const server = require('../../index');

describe('Event API', () => {
    let jwtToken: string;
    let events: any;
    before(() => {
        jwtToken = global.fixtures.jwtToken;
        events = global.fixtures.events;
    });

    describe('POST /events', () => {
        it('should fail if event scope is not set', async () => {
            const res = await chai.request(server).post('/events').set('Authorization', `bearer ${jwtToken}`).send(events[0]);
            expect(res.body.status).to.eql(true);
            expect(res.body.error).to.exist;
            expect(res.body.error.code).to.eql(422);
            expect(res.body.error.message).to.eql('Event must have a scope and the scope must be an array');
        });

        it('should fail if event scope is set, but it\'s not an array', async () => {
            const event = { ...events[0], event_scope: 'all' };
            const res = await chai.request(server).post('/events').set('Authorization', `bearer ${jwtToken}`).send(event);
            expect(res.body.status).to.eql(true);
            expect(res.body.error).to.exist;
            expect(res.body.error.code).to.eql(422);
            expect(res.body.error.message).to.eql('Event must have a scope and the scope must be an array');
        });

        it('should fail if all event scope(s) is/are invalid', async () => {
            const event = { ...events[0], event_scope: [{ scope: 'invalidscope', values: ['996c17ef-affd-4639-9b2d-adbd15753df5'] }] };
            const res = await chai.request(server).post('/events').set('Authorization', `bearer ${jwtToken}`).send(event);
            expect(res.body.status).to.eql(true);
            expect(res.body.error).to.exist;
            expect(res.body.error.code).to.eql(422);
            expect(res.body.error.message).to.eql('No valid event scope found');
            expect(res.body.metadata).to.exist;
            expect(res.body.metadata[0].error_type).to.eql('Invalid scope');
            expect(res.body.metadata[0].message).to.eql(`'${event.event_scope[0].scope}' is not an acceptable scope`);
        });

        it('should fail if event scope(s) are valid, but the values are invalid', async () => {
            const event = { ...events[0], event_scope: [{ scope: 'users', value: '' }] };
            const res = await chai.request(server).post('/events').set('Authorization', `bearer ${jwtToken}`).send(event);
            expect(res.body.status).to.eql(true);
            expect(res.body.error).to.exist;
            expect(res.body.error.code).to.eql(422);
            expect(res.body.error.message).to.eql('No valid event scope found');
            expect(res.body.metadata).to.exist;
            expect(res.body.metadata[0].error_type).to.eql('Invalid scope value');
            expect(res.body.metadata[0].message).to.eql(`Scope 'values' not specified or not an array`);
        });

        it('should fail if event scope is not a valid UUID v4 string', async () => {
            const event = { ...events[0], event_scope: [{ scope: 'users', values: ['996c17ef-affd-0639-9b2d-adbd1573df5'] }] };
            const res = await chai.request(server).post('/events').set('Authorization', `bearer ${jwtToken}`).send(event);
            expect(res.body.status).to.eql(true);
            expect(res.body.error).to.exist;
            expect(res.body.error.code).to.eql(422);
            expect(res.body.error.message).to.eql('No valid event scope found');
            expect(res.body.metadata).to.exist;
            expect(res.body.metadata[0].error_type).to.eql('Invalid scope value');
            expect(res.body.metadata[0].message).to.eql(`Invalid value. Value must be of type UUID v4`);
        });
    });
});