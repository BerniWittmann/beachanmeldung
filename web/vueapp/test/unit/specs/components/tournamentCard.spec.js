import TournamentCard from '@/components/tournamentCard';
import utils from '../../utils';
import moment from 'moment';

describe('Components', () => {
  describe('TournamentCard', () => {
    let tournament;

    beforeEach(() => {
      tournament = {
        id: 1,
        name: 'Test Turnier',
        gender: 'male',
        startDate: moment(),
        endDate: moment(),
        startSignup: moment(),
        deadlineSignup: moment(),
        signupOpen: true,
        startingFee: '60.00',
      };
    });

    describe('the tournament has an open signup', () => {
      let vm;
      beforeEach(() => {
        vm = utils.mountComponent(TournamentCard, { propsData: { tournament } });
      });

      it('should contain a register Button', () => {
        expect(vm.contains('button')).to.be.true;
        expect(vm.first('button').text()).to.equal('tournament.register_team');
      });
      it('should contain the name', () => {
        expect(vm.contains('.tournament-name')).to.be.true;
        expect(vm.first('.tournament-name').text()).to.equal(`${tournament.name}  - general.gender.male`);
      });
      it('should display the date', () => {
        expect(vm.first('.body').text()).to.contain(tournament.startDate.format('DD.MM.YYYY'));
      });
      it('should display the starting fee', () => {
        expect(vm.first('.body').text()).to.contain(tournament.startingFee);
      });
      it('should not display the signup popup', () => {
        const button = vm.first('button');
        button.trigger('mouseenter');
        const popover = vm.first('.el-popover');
        expect(popover.hasStyle('display', 'none')).to.be.true;
      });
    });

    describe('the tournament signup has not yet started', () => {
      let vm;
      beforeEach(() => {
        tournament.startSignup = moment().add(1, 'days');
        tournament.deadlineSignup = moment().add(2, 'days');
        tournament.signupOpen = false;

        vm = utils.mountComponent(TournamentCard, { propsData: { tournament } });
      });

      it('should display the signup popup', () => {
        expect(vm.contains('.el-popover')).to.be.true;
      });

      it('the popover display the correct text', () => {
        const popover = vm.first('.el-popover');
        const first = popover.find('span')[0];
        const second = popover.find('span')[1];
        expect(first.hasStyle('display', 'none')).to.be.false;
        expect(second.hasStyle('display', 'none')).to.be.true;
        expect(first.text()).to.equal('tournament.signup_not_open.before_signup');
      });
    });

    describe('the tournament signup is already over', () => {
      let vm;
      beforeEach(() => {
        tournament.startSignup = moment().subtract(2, 'days');
        tournament.deadlineSignup = moment().subtract(1, 'days');
        tournament.signupOpen = false;
        vm = utils.mountComponent(TournamentCard, { propsData: { tournament } });
      });

      it('should display the signup popup', () => {
        expect(vm.contains('.el-popover')).to.be.true;
      });

      it('the popover display the correct text', () => {
        const popover = vm.first('.el-popover');
        const first = popover.find('span')[0];
        const second = popover.find('span')[1];
        expect(first.hasStyle('display', 'none')).to.be.true;
        expect(second.hasStyle('display', 'none')).to.be.false;
        expect(second.text()).to.equal('tournament.signup_not_open.after_signup');
      });
    });

    describe('the tournament is for mixed', () => {
      let vm;
      beforeEach(() => {
        tournament.gender = 'mixed';
        vm = utils.mountComponent(TournamentCard, { propsData: { tournament } });
      });

      it('should show the correct gender', () => {
        expect(vm.contains('.tournament-name')).to.be.true;
        expect(vm.first('.tournament-name').text()).to.equal(`${tournament.name} `);
      });
    });

    describe('the tournament is longer than 1 day', () => {
      let vm;
      beforeEach(() => {
        tournament.startDate = moment();
        tournament.endDate = moment().add(2, 'days');
        vm = utils.mountComponent(TournamentCard, { propsData: { tournament } });
      });

      it('should show the startDate', () => {
        expect(vm.first('.body').text()).to.contain(tournament.startDate.format('DD.MM.YYYY'));
      });
      it('should show the endDate', () => {
        expect(vm.first('.body').text()).to.contain(tournament.endDate.format('DD.MM.YYYY'));
      });
    });
  });
});
