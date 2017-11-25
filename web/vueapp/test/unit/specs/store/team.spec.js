import team from '@/store/modules/team';
import { STORE, SET_ACTIVE, ADD, UPDATE } from '@/store/modules/team/mutation-types';
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
            id: 1,
            name: 'Test Team',
            beachname: 'Beach',
          }]);

          expect(state).to.deep.equal({
            teams: [{
              id: 1,
              name: 'Test Team',
              beachname: 'Beach',
            }],
          });
        });

        it('should store an empty array instead of undefined', () => {
          const state = {};
          team.mutations[STORE](state, undefined);

          expect(state).to.deep.equal({ teams: [] });
        });
      });

      describe('SET_ACTIVE', () => {
        it('should set an active team', () => {
          const state = {};
          team.mutations[SET_ACTIVE](state, [{
            id: 1,
            name: 'Test Team',
            beachname: 'Beach',
          }]);

          expect(state).to.deep.equal({
            activeTeam: [{
              id: 1,
              name: 'Test Team',
              beachname: 'Beach',
            }],
          });
        });

        it('should store undefined when no team was given', () => {
          const state = {};
          team.mutations[SET_ACTIVE](state, undefined);

          expect(state).to.deep.equal({ activeTeam: undefined });
        });
      });

      describe('ADD', () => {
        it('should add team data', () => {
          const state = { teams: [] };
          team.mutations[ADD](state, [{
            id: 1,
            name: 'Test Team',
            beachname: 'Beach',
          }]);

          expect(state.teams).to.deep.equal([{
            id: 1,
            name: 'Test Team',
            beachname: 'Beach',
          }]);
        });
      });

      describe('UPDATE', () => {
        it('should update team data', () => {
          const state = {
            teams: [{
              id: 1,
              name: 'Test Team',
              beachname: 'Beach',
            }, {
              id: 2,
              name: 'Test Team 2',
              beachname: 'Beach',
            }],
          };
          team.mutations[UPDATE](state, [{
            id: 1,
            name: 'New  Team',
            beachname: 'Beach',
          }]);

          expect(state.teams).to.deep.equal([{
            id: 1,
            name: 'New  Team',
            beachname: 'Beach',
          }, {
            id: 2,
            name: 'Test Team 2',
            beachname: 'Beach',
          }]);
        });

        it('should add new team data', () => {
          const state = {
            teams: [{
              id: 1,
              name: 'Test Team',
              beachname: 'Beach',
            }, {
              id: 2,
              name: 'Test Team 2',
              beachname: 'Beach',
            }],
          };
          team.mutations[UPDATE](state, [{
            id: 3,
            name: 'New  Team',
            beachname: 'Beach',
          }]);

          expect(state.teams).to.deep.equal([{
            id: 1,
            name: 'Test Team',
            beachname: 'Beach',
          }, {
            id: 2,
            name: 'Test Team 2',
            beachname: 'Beach',
          }, {
            id: 3,
            name: 'New  Team',
            beachname: 'Beach',
          }]);
        });

        it('should update multiple', () => {
          const state = {
            teams: [{
              id: 1,
              name: 'Test Team',
              beachname: 'Beach',
            }, {
              id: 2,
              name: 'Test Team 2',
              beachname: 'Beach',
            }],
          };
          team.mutations[UPDATE](state, [{
            id: 1,
            name: 'Test Team 1',
            beachname: 'New Beach',
          }, {
            id: 2,
            name: 'New Name Team',
            beachname: 'Beach',
          }]);

          expect(state.teams).to.deep.equal([{
            id: 1,
            name: 'Test Team 1',
            beachname: 'New Beach',
          }, {
            id: 2,
            name: 'New Name Team',
            beachname: 'Beach',
          }]);
        });
      });
    });

    describe('Actions', () => {
      it('Store team data', (done) => {
        const data = [{
          id: 1,
          name: 'Test Team',
          beachname: 'Beach',
        }];
        utils.testAction(team.actions.store, data, {}, [
          { type: 'STORE', payload: data },
        ], done);
      });

      it('Set Active Team', (done) => {
        const data = [{
          id: 1,
          name: 'Test Team',
          beachname: 'Beach',
        }];
        utils.testAction(team.actions.setActive, data, {}, [
          { type: 'SET_ACTIVE', payload: data },
        ], done);
      });

      it('Add Team', (done) => {
        const data = [{
          id: 1,
          name: 'Test Team',
          beachname: 'Beach',
        }];
        utils.testAction(team.actions.add, data, { teams: [] }, [
          { type: 'ADD', payload: data },
        ], done);
      });

      it('Add Single Team', (done) => {
        const data = {
          id: 1,
          name: 'Test Team',
          beachname: 'Beach',
        };
        utils.testAction(team.actions.addSingle, data, { teams: [] }, [
          { type: 'ADD', payload: [data] },
        ], done);
      });

      it('Update Team', (done) => {
        const data = [{
          id: 1,
          name: 'Test Team',
          beachname: 'Beach',
        }];
        utils.testAction(team.actions.update, data, {
          teams: [{
            id: 1,
            name: 'Test Old Team',
            beachname: 'Beach',
          }],
        }, [
          { type: 'UPDATE', payload: data },
        ], done);
      });

      it('Update Single Team', (done) => {
        const data = {
          id: 1,
          name: 'Test Team',
          beachname: 'Beach',
        };
        utils.testAction(team.actions.updateSingle, data, {
          teams: [{
            id: 1,
            name: 'Test Old Team',
            beachname: 'Beach',
          }],
        }, [
          { type: 'UPDATE', payload: [data] },
        ], done);
      });
    });

    describe('Getters', () => {
      it('get Teams By Tournament', () => {
        const state = {
          teams: [{
            id: 1,
            name: 'Test Team',
            beachname: 'Beach',
            tournament: {
              id: 1,
            },
          }, {
            id: 2,
            name: 'Test Team 2',
            beachname: 'Beach',
            tournament: {
              id: 2,
            },
          }],
        };
        expect(team.getters.teamsByTournament(state)(1)).to.deep.equal([{
          id: 1,
          name: 'Test Team',
          beachname: 'Beach',
          tournament: {
            id: 1,
          },
        }]);
      });
    });
  });
});
