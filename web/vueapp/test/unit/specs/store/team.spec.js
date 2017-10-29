import team from '@/store/modules/team';
import { STORE } from '@/store/modules/team/mutation-types';
import utils from '../../utils';

describe('Vuex Modules', () => {
  describe('Team', () => {
    it('should be namespaced', () => {
      expect(team.namespaced).to.equal(true);
    });

    describe('Mutations', () => {
      describe('STORE', () => {
        it('should store team data', () => {
          const state = {};
          team.mutations[STORE](state, [{
            email: 'test@byom.de',
            firstName: 'First',
            lastName: 'Name',
          }]);

          expect(state).to.deep.equal({
            members: [{
              email: 'test@byom.de',
              firstName: 'First',
              lastName: 'Name',
            }],
          });
        });

        it('should store an empty array instead of undefined', () => {
          const state = {};
          team.mutations[STORE](state, undefined);

          expect(state).to.deep.equal({ members: [] });
        });
      });
    });

    describe('Actions', () => {
      it('Store team data', (done) => {
        const data = [{
          email: 'test@byom.de',
          firstName: 'First',
          lastName: 'Name',
        }];
        utils.testAction(team.actions.store, data, {}, [
          { type: 'STORE', payload: data },
        ], done);
      });
    });

    describe.skip('Getters');
  });
});
