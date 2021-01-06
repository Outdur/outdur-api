import { expect } from 'chai';
const userService = require('../../src/user/userService');

describe('UserService Tests', () => {
    describe('UserService.create', () => {
        it('should fail when no contact field is included', async () => {
            expect(userService.create({})).to.eventually.be.rejectedWith('Contact field must not be empty');
        });

        it('should fail if email is invalid', async () => {
            expect(userService.create({ contact: 'chi@yahoo' })).to.eventually.be.rejectedWith('Contact email is invalid');
        });

        it('should fail if length of phone is less than 6', async () => {
            expect(userService.create({ contact: '5768' })).to.eventually.be.rejectedWith('Contact phone must not be less than 6 or greater than 15 numbers');
        });

        it('should fail if length of phone is more than 15', async () => {
            expect(userService.create({ contact: '57687898759840392' })).to.eventually.be.rejectedWith('Contact phone must not be less than 6 or greater than 15 numbers');
        });

        it('should fail if phone contains a letter', async () => {
            expect(userService.create({ contact: '57687898d' })).to.eventually.be.rejectedWith('Contact email is invalid');
        });
    });
});