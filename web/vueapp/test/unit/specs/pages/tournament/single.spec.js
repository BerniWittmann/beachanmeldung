import TournamentSingle from '@/pages/tournament/single';
import Vuex from 'vuex';
import utils from '../../../utils';
import moment from 'moment';
import { teamStates } from "@/utils/constants";

describe('Pages', () => {
  describe('Tournament Single', () => {
    const state = {
      auth: { authenticated: false },
      account: { isStaff: true },
      tournament: {
        activeTournament: {
          id: 1,
          name: 'Test Turnier',
          gender: 'male',
          startDate: moment(),
          endDate: moment(),
          startSignup: moment(),
          deadlineSignup: moment().add(1, 'year'),
          signupOpen: true,
          startingFee: '60.00',
          advertisementUrl: 'http://www.google.de',
          contactEmail: 'test@byom.de',
          isBeforeSignup: false,
          isAfterSignup: false,
        }
      },
    };
    const getters = {
      ['team/teamsByTournament']: (state) => ((id) => {
        if (id !== 1) return [];
        return [{
          id: 12,
          name: 'TSV Ismaning',
          beachname: 'THC Eh Drin!',
          completeName: 'THC Eh Drin! (TSV Ismaning)',
          state: teamStates.signedUp,
        }, {
          id: 13,
          name: 'TSV Ismaning',
          beachname: 'Anderes Team',
          completeName: 'Anderes Team (TSV Ismaning)',
          state: teamStates.waiting,
        }];
      }),
    };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
        getters,
      });
    });

    it('should resolve the footer', () => {
      const vm = utils.mountComponent(TournamentSingle, { store });
      expect(vm.contains('.footer')).to.equal(true);
    });

    it('should contain the name', () => {
      const vm = utils.mountComponent(TournamentSingle, { store });
      expect(vm.text()).to.contain(store.state.tournament.activeTournament.name);
    });

    it('should contain a register button', () => {
      const vm = utils.mountComponent(TournamentSingle, { store });
      expect(vm.first('.tournament-header').contains('button')).to.be.true;
    });

    it('should contain a link to the advertisement', () => {
      const vm = utils.mountComponent(TournamentSingle, { store });
      expect(vm.first('.tournament-body').find('a')[0].hasAttribute('href', store.state.tournament.activeTournament.advertisementUrl)).to.be.true;
    });

    it('should contain a link to the contact Email', () => {
      const vm = utils.mountComponent(TournamentSingle, { store });
      expect(vm.first('.tournament-body').find('a')[1].hasAttribute('href', `mailto:${store.state.tournament.activeTournament.contactEmail}`)).to.be.true;
    });

    it('should contain a computed property for signed up teams', () => {
      const vm = utils.mountComponent(TournamentSingle, { store });
      expect(vm.vm.signedUpTeams.length).to.equal(1);
      expect(vm.vm.signedUpTeams[0].id).to.equal(12);
    });

    it('should contain a computed property for waiting teams', () => {
      const vm = utils.mountComponent(TournamentSingle, { store });
      expect(vm.vm.waitingTeams.length).to.equal(1);
      expect(vm.vm.waitingTeams[0].id).to.equal(13);
    });
  });
});
