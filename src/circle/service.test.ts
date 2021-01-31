import { expect } from 'chai';
const circleService = require('../../src/circle/service');

describe('CircleService Tests', () => {
    describe('CircleService.create', () => {
        it('should fail if circle Id is invalid', async () => {
            expect(circleService.findOne({circle_id: '2156f5ew'})).to.eventually.be.rejectedWith('Circle not found');
        });

        it('should fail when no name field is included', async () => {
            expect(circleService.create({})).to.eventually.be.rejectedWith('Circle must have a name');
        });

        it('should fail when no description field is included', async () => {
            expect(circleService.create({name: 'my village people'})).to.eventually.be.rejectedWith('Circle must have a description');
        });
    });
});