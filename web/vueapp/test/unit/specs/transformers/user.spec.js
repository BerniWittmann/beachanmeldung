import userTransformer from '@/transformers/user';

describe('Transformers', () => {
  describe('User', () => {
    describe('should fetch a single user', () => {
      it('should resolve the email correctly', () => {
        const original = { email: 'test@byom.de' };
        const transformed = original;
        expect(userTransformer.fetch(original)).to.deep.equal(transformed);
      });

      it('should resolve the first name correctly', () => {
        const original = { first_name: 'Test' };
        const transformed = original;
        expect(userTransformer.fetch(original)).to.deep.equal(transformed);
      });

      it('should resolve the last name correctly', () => {
        const original = { last_name: 'User' };
        const transformed = original;
        expect(userTransformer.fetch(original)).to.deep.equal(transformed);
      });

      it('should resolve all given attributes correctly', () => {
        const original = { email: 'test@byom.de', first_name: 'Test', last_name: 'User' };
        const transformed = original;
        expect(userTransformer.fetch(original)).to.deep.equal(transformed);
      });

      /* it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = { email: undefined, firstName: undefined, lastName: undefined };
        expect(userTransformer.fetch(original)).to.deep.equal(transformed);
      }); */
    });

    describe('should send a single user', () => {
      it('should resolve the email correctly', () => {
        const original = { email: 'test@byom.de' };
        const transformed = { email: 'test@byom.de', first_name: undefined, last_name: undefined, password: undefined, phone: undefined };
        expect(userTransformer.send(original)).to.deep.equal(transformed);
      });

      it('should resolve the first name correctly', () => {
        const original = { firstName: 'Test' };
        const transformed = { email: undefined, first_name: 'Test', last_name: undefined, password: undefined, phone: undefined };
        expect(userTransformer.send(original)).to.deep.equal(transformed);
      });

      it('should resolve the last name correctly', () => {
        const original = { lastName: 'User' };
        const transformed = { email: undefined, first_name: undefined, last_name: 'User', password: undefined, phone: undefined };
        expect(userTransformer.send(original)).to.deep.equal(transformed);
      });

      it('should resolve the password correctly', () => {
        const original = { password: 'test1234' };
        const transformed = { email: undefined, first_name: undefined, last_name: undefined, password: 'test1234', phone: undefined };
        expect(userTransformer.send(original)).to.deep.equal(transformed);
      });

      it('should resolve all given attributes correctly', () => {
        const original = { email: 'test@byom.de', firstName: 'Test', lastName: 'User', password: 'test1234', phone: '+49123456789' };
        const transformed = { email: 'test@byom.de', first_name: 'Test', last_name: 'User', password: 'test1234', phone: '+49123456789' };
        expect(userTransformer.send(original)).to.deep.equal(transformed);
      });

      it('should not resolve other attributes', () => {
        const original = { anotherAttribute: 'test@byom.de' };
        const transformed = {
          email: undefined,
          first_name: undefined,
          last_name: undefined,
          password: undefined,
          phone: undefined,
        };
        expect(userTransformer.send(original)).to.deep.equal(transformed);
      });
    });

    describe('should fetch a collection of users', () => {
      it('should resolve the email correctly', () => {
        const original = [{ email: 'test@byom.de' }, { email: 'test2@byom.de' }];
        const transformed = original;
        expect(userTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });

      it('should resolve the first name correctly', () => {
        const original = [{ first_name: 'Test' }, { first_name: 'Other' }];
        const transformed = original;
        expect(userTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });

      it('should resolve the last name correctly', () => {
        const original = [{ last_name: 'User' }, { last_name: 'Account' }];
        const transformed = original;
        expect(userTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });

      it('should resolve all given attributes correctly', () => {
        const original = [
          { email: 'test@byom.de', first_name: 'Test', last_name: 'User' },
          { email: 'test@byom.de', first_name: 'Test', last_name: 'User' },
        ];
        const transformed = original;
        expect(userTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });

      /* it('should not resolve other attributes', () => {
        const original = [
          { another_attribute: 'test@byom.de' },
          { yet_another_attribute: 'aha' },
        ];
        const transformed = [
          { email: undefined, firstName: undefined, lastName: undefined },
          { email: undefined, firstName: undefined, lastName: undefined },
        ];
        expect(userTransformer.fetchCollection(original)).to.deep.equal(transformed);
      }); */
    });

    describe('should send a collection of users', () => {
      it('should resolve the email correctly', () => {
        const original = [{ email: 'test@byom.de' }, { email: 'test2@byom.de' }];
        const transformed = [
          { email: 'test@byom.de', first_name: undefined, last_name: undefined, password: undefined, phone: undefined },
          { email: 'test2@byom.de', first_name: undefined, last_name: undefined, password: undefined, phone: undefined },
        ];
        expect(userTransformer.sendCollection(original)).to.deep.equal(transformed);
      });

      it('should resolve the first name correctly', () => {
        const original = [{ firstName: 'Test' }, { firstName: 'Other' }];
        const transformed = [
          { email: undefined, first_name: 'Test', last_name: undefined, password: undefined, phone: undefined },
          { email: undefined, first_name: 'Other', last_name: undefined, password: undefined, phone: undefined },
        ];
        expect(userTransformer.sendCollection(original)).to.deep.equal(transformed);
      });

      it('should resolve the last name correctly', () => {
        const original = [{ lastName: 'User' }, { lastName: 'Account' }];
        const transformed = [
          { email: undefined, first_name: undefined, last_name: 'User', password: undefined, phone: undefined },
          { email: undefined, first_name: undefined, last_name: 'Account', password: undefined, phone: undefined },
        ];
        expect(userTransformer.sendCollection(original)).to.deep.equal(transformed);
      });

      it('should resolve all given attributes correctly', () => {
        const original = [
          { email: 'test@byom.de', firstName: 'Test', lastName: 'User', password: 'test1234', phone: '+49123456789' },
          { email: 'test@byom.de', firstName: 'Test', lastName: 'User', password: 'P4s5W0rD', phone: '+49123456789' },
        ];
        const transformed = [
          { email: 'test@byom.de', first_name: 'Test', last_name: 'User', password: 'test1234', phone: '+49123456789' },
          { email: 'test@byom.de', first_name: 'Test', last_name: 'User', password: 'P4s5W0rD', phone: '+49123456789' },
        ];
        expect(userTransformer.sendCollection(original)).to.deep.equal(transformed);
      });

      it('should not resolve other attributes', () => {
        const original = [
          { another_attribute: 'test@byom.de' },
          { yet_another_attribute: 'aha' },
        ];
        const transformed = [
          { email: undefined, first_name: undefined, last_name: undefined, password: undefined, phone: undefined },
          { email: undefined, first_name: undefined, last_name: undefined, password: undefined, phone: undefined },
        ];
        expect(userTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
    });
  });
});
