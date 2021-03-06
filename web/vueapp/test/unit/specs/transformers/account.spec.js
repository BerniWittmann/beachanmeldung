import accountTransformer from '@/transformers/account';
import moment from 'moment';

describe('Transformers', () => {
  describe('Account', () => {
    describe('should fetch a single account', () => {
      it('should resolve the date joined correctly', () => {
        const original = { date_joined: '19.02.1996' };
        const transformed = {
          email: undefined,
          firstName: undefined,
          lastName: undefined,
          isVerified: undefined,
          isStaff: false,
          dateJoined: moment('19.02.1996', 'DD.MM.YYYY'),
          phone: undefined,
        };
        expect(accountTransformer.fetch(original).dateJoined.isSame(transformed.dateJoined))
          .to.equal(true);
        expect(accountTransformer.fetch(original).dateJoined.format('DD.MM.YYYY')).to.equal('19.02.1996');
      });
      it('should resolve all given attributes correctly', () => {
        const original = {
          email: 'test@byom.de',
          first_name: 'Test',
          last_name: 'User',
          is_verified: true,
          is_staff: true,
          date_joined: undefined,
          phone: '+49123456789',
        };
        const transformed = {
          email: 'test@byom.de',
          firstName: 'Test',
          lastName: 'User',
          isVerified: true,
          isStaff: true,
          dateJoined: undefined,
          phone: '+49123456789',
        };
        expect(accountTransformer.fetch(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { another_attribute: 'test@byom.de' };
        const transformed = {
          email: undefined,
          firstName: undefined,
          lastName: undefined,
          isVerified: undefined,
          isStaff: false,
          dateJoined: undefined,
          phone: undefined,
        };
        expect(accountTransformer.fetch(original)).to.deep.equal(transformed);
      });
    });

    describe('should send a single account', () => {
      it('should resolve all given attributes correctly', () => {
        const original = { email: 'test@byom.de', firstName: 'Test', lastName: 'User', phone: '+49123456789' };
        const transformed = { email: 'test@byom.de', first_name: 'Test', last_name: 'User', phone: '+49123456789' };
        expect(accountTransformer.send(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = { anotherAttribute: 'test@byom.de', isStaff: true };
        const transformed = { email: undefined, first_name: undefined, last_name: undefined, phone: undefined };
        expect(accountTransformer.send(original)).to.deep.equal(transformed);
      });
    });

    describe('should fetch a collection of accounts', () => {
      it('should resolve the date joined correctly', () => {
        const original = [{ date_joined: undefined }, { date_joined: '19.02.1996' }];
        const transformed = [
          {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            isVerified: undefined,
            isStaff: false,
            dateJoined: undefined,
            phone: undefined,
          },
          {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            isVerified: undefined,
            isStaff: false,
            dateJoined: moment('19.02.1996', 'DD.MM.YYYY'),
            phone: undefined,
          },
        ];
        expect(accountTransformer.fetchCollection(original)[0].dateJoined)
          .to.equal(transformed[0].dateJoined);
        expect(accountTransformer.fetchCollection(original)[1].dateJoined
          .isSame(transformed[1].dateJoined)).to.equal(true);
      });
      it('should resolve all given attributes correctly', () => {
        const original = [
          {
            email: 'test@byom.de',
            first_name: 'Test',
            last_name: 'User',
            is_verified: true,
            is_staff: false,
            date_joined: undefined,
            phone: '+49123456789',
          },
          {
            email: 'test2@byom.de',
            first_name: 'Test2',
            last_name: 'User2',
            is_verified: false,
            is_staff: false,
            date_joined: undefined,
            phone: '+491234567890',
          },
        ];
        const transformed = [
          {
            email: 'test@byom.de',
            firstName: 'Test',
            lastName: 'User',
            isVerified: true,
            isStaff: false,
            dateJoined: undefined,
            phone: '+49123456789',
          },
          {
            email: 'test2@byom.de',
            firstName: 'Test2',
            lastName: 'User2',
            isVerified: false,
            isStaff: false,
            dateJoined: undefined,
            phone: '+491234567890',
          },
        ];
        expect(accountTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = [
          { another_attribute: 'test@byom.de' },
          { yet_another_attribute: 'aha' },
        ];
        const transformed = [
          {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            isVerified: undefined,
            isStaff: false,
            dateJoined: undefined,
            phone: undefined,
          },
          {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            isVerified: undefined,
            isStaff: false,
            dateJoined: undefined,
            phone: undefined,
          },
        ];
        expect(accountTransformer.fetchCollection(original)).to.deep.equal(transformed);
      });
    });

    describe('should send a collection of accounts', () => {
      it('should resolve all given attributes correctly', () => {
        const original = [
          { email: 'test@byom.de', firstName: 'Test', lastName: 'User', phone: '+49123456789' },
          { email: 'test@byom.de', firstName: 'Test', lastName: 'User', phone: '+49123456789'},
        ];
        const transformed = [
          { email: 'test@byom.de', first_name: 'Test', last_name: 'User', phone: '+49123456789' },
          { email: 'test@byom.de', first_name: 'Test', last_name: 'User', phone: '+49123456789' },
        ];
        expect(accountTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
      it('should not resolve other attributes', () => {
        const original = [
          { another_attribute: 'test@byom.de' },
          { yet_another_attribute: 'aha' },
        ];
        const transformed = [
          { email: undefined, first_name: undefined, last_name: undefined, phone: undefined },
          { email: undefined, first_name: undefined, last_name: undefined, phone: undefined },
        ];
        expect(accountTransformer.sendCollection(original)).to.deep.equal(transformed);
      });
    });
  });
});
