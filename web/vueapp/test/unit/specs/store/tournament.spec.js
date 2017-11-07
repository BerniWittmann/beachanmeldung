import tournament from '@/store/modules/tournament';
import { STORE } from '@/store/modules/tournament/mutation-types';
import utils from '../../utils';

describe('Vuex Modules', () => {
  describe('Tournament', () => {
    it('should be namespaced', () => {
      expect(tournament.namespaced).to.equal(true);
    });

    describe('Mutations', () => {
      describe('STORE', () => {
        it('should store tournament data', () => {
          const state = {};
          tournament.mutations[STORE](state, [{
            id: 1,
            name: 'Test Turnier',
            gender: 'male',
            signupOpen: true,
            startingFee: '60.00',
          }]);

          expect(state).to.deep.equal({
            tournaments: [{
              id: 1,
              name: 'Test Turnier',
              gender: 'male',
              signupOpen: true,
              startingFee: '60.00',
            }],
          });
        });

        it('should store an empty array instead of undefined', () => {
          const state = {};
          tournament.mutations[STORE](state, undefined);

          expect(state).to.deep.equal({ tournaments: [] });
        });
      });
    });

    describe('Actions', () => {
      it('Store tournament data', (done) => {
        const data = [{
          id: 1,
          name: 'Test Turnier',
          gender: 'male',
          signupOpen: true,
          startingFee: '60.00',
        }];
        utils.testAction(tournament.actions.store, data, {}, [
          { type: 'STORE', payload: data },
        ], done);
      });
    });

    describe.skip('Getters');
  });
});
