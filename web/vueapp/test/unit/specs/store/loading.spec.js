import loading from '@/store/modules/loading';
import { SET, UNSET } from '@/store/modules/loading/mutation-types';
import utils from '../../utils';

describe('Vuex Modules', () => {
  describe('Loading', () => {
    it('should be namespaced', () => {
      expect(loading.namespaced).to.equal(true);
    });

    describe('Mutations', () => {
      describe('SET', () => {
        it('should set loading loading State', () => {
          const state = {};
          loading.mutations[SET](state);

          expect(state).to.deep.equal({
            loading: true,
          });
        });
      });

      describe('UNSET', () => {
        it('should unset loading loading State', () => {
          const state = {};
          loading.mutations[UNSET](state);

          expect(state).to.deep.equal({
            loading: false,
          });
        });
      });
    });

    describe('Actions', () => {
      it('Set Loading State', (done) => {
        utils.testAction(loading.actions.set, null, {}, [
          { type: 'SET' },
        ], done);
      });

      it('Unset Loading State', (done) => {
        utils.testAction(loading.actions.unset, null, {}, [
          { type: 'UNSET' },
        ], done);
      });
    });

    describe('Getters', () => {
      it('get Loading State', () => {
        const state = {
          loading: true,
        };
        expect(loading.getters.isLoading(state)).to.equal(true);
      });
    });
  });
});
