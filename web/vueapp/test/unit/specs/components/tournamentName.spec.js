import TournamentName from '@/components/tournamentName';
import utils from '../../utils';
import moment from 'moment';

describe('Components', () => {
  describe('TournamentName', () => {
    let tournament;

    beforeEach(() => {
      tournament = {
        id: 1,
        name: 'Test Turnier',
        gender: 'mixed',
        startDate: moment(),
        endDate: moment(),
        startSignup: moment(),
        deadlineSignup: moment(),
        signupOpen: true,
        startingFee: '60.00',
      };
    });

    describe('the tournament is gender type mixed', () => {
      let vm;
      beforeEach(() => {
        vm = utils.mountComponent(TournamentName, { propsData: { tournament } });
      });

      it('should display the name', () => {
        expect(vm.text()).to.contain(tournament.name);
      });

      it('should not display the gender', () => {
        expect(vm.text()).not.to.contain(`general.gender.${tournament.gender}`);
      });
    });

    describe('the tournament is gender type male', () => {
      let vm;
      beforeEach(() => {
        tournament.gender = 'male';
        vm = utils.mountComponent(TournamentName, { propsData: { tournament } });
      });

      it('should display the name', () => {
        expect(vm.text()).to.contain(tournament.name);
      });

      it('should not display the gender', () => {
        expect(vm.text()).to.contain(`general.gender.${tournament.gender}`);
      });
    });

    describe('the tournament is gender type female', () => {
      let vm;
      beforeEach(() => {
        tournament.gender = 'female';
        vm = utils.mountComponent(TournamentName, { propsData: { tournament } });
      });

      it('should display the name', () => {
        expect(vm.text()).to.contain(tournament.name);
      });

      it('should not display the gender', () => {
        expect(vm.text()).to.contain(`general.gender.${tournament.gender}`);
      });
    });
  });
});
