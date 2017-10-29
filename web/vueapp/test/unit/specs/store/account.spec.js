import account from '@/store/modules/account';
import { STORE } from '@/store/modules/account/mutation-types';
import utils from '../../utils';

describe('Vuex Modules', () => {
  describe('Account', () => {
    it('should be namespaced', () => {
      expect(account.namespaced).to.equal(true);
    });

    describe('Mutations', () => {
      describe('STORE', () => {
        it('should store account data', () => {
          const state = {};
          account.mutations[STORE](state, {
            email: 'test@byom.de',
            firstName: 'First',
            lastName: 'Name',
            dateJoined: '19.02.1996',
            isVerified: true,
            isStaff: false,
          });

          expect(state).to.deep.equal({
            email: 'test@byom.de',
            firstName: 'First',
            lastName: 'Name',
            dateJoined: '19.02.1996',
            isVerified: true,
            isStaff: false,
          });
        });

        it('should not store unnecessary data', () => {
          const state = {};
          account.mutations[STORE](state, {
            another_attribute: 'foo=bar',
          });

          expect(state).to.deep.equal({
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            dateJoined: undefined,
            isVerified: undefined,
            isStaff: undefined,
          });
        });
      });
    });

    describe('Actions', () => {
      it('Store account data', (done) => {
        const data = {
          email: 'test@byom.de',
          firstName: 'First',
          lastName: 'Name',
          dateJoined: '19.02.1996',
          isVerified: true,
          isStaff: false,
        };
        utils.testAction(account.actions.store, data, {}, [
          { type: 'STORE', payload: data },
        ], done);
      });
    });

    describe.skip('Getters');
  });
});
