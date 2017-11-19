import TeamTable from '@/components/teamTable.vue';
import utils from '../../utils';
import { teamStates } from "@/utils/constants";
import Vuex from "vuex";

describe('Components', () => {
  describe('TeamTable', () => {
    let teams = [{
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
    }, {
      id: 14,
      name: 'TSV Ismaning',
      beachname: 'Drittes Team',
      completeName: 'Drittes Team (TSV Ismaning)',
      state: teamStates.needsApproval,
    }];
    let store;
    const state = {
      account: { isStaff: false },
    };
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    describe('It has more Places than teams', () => {
      let vm;

      beforeEach(() => {
        vm = utils.mountComponent(TeamTable, { store, propsData: { teams: teams, maxCount: 10 } });
      });

      it('should render the table', () => {
        expect(vm.contains('table')).to.be.true;
      });
      it('should render the correct amount of rows', () => {
        expect(vm.find('tr').length).to.equal(10);
      });

      describe('It has as much places as teams', () => {
        let vm;

        beforeEach(() => {
          vm = utils.mountComponent(TeamTable, { store, propsData: { teams: teams } });
        });

        it('should render the table', () => {
          expect(vm.contains('table')).to.be.true;
        });
        it('should render the correct amount of rows', () => {
          expect(vm.find('tr').length).to.equal(teams.length);
        });
      });
    });
  });
});
