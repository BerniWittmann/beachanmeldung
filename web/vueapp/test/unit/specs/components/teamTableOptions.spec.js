import TeamTableOptions from '@/components/TeamTableOptions.vue';
import utils from '../../utils';
import { teamStates } from "@/utils/constants";

describe('Components', () => {
  describe('TeamTableOptions', () => {
    let team = {
      id: 12,
      name: 'TSV Ismaning',
      beachname: 'THC Eh Drin!',
      completeName: 'THC Eh Drin! (TSV Ismaning)',
      state: teamStates.signedUp,
      paid: true,
    };

    it('if team is not given, don\'t display anything', () => {
      const vm = utils.mountComponent(TeamTableOptions, { propsData: { team: undefined } });
      expect(vm.html()).to.equal('<!---->');
    });
    it('show team edit button', () => {
      const vm = utils.mountComponent(TeamTableOptions, { propsData: { team: team } });
      const button = vm.find('button')[0];
      expect(button).to.exist;
      expect(button.text()).to.equal('team.edit');
    });

    it('if the team is signed up, show move to waitlist button', () => {
      team.state = teamStates.signedUp;
      const vm = utils.mountComponent(TeamTableOptions, { propsData: { team: team } });
      const button = vm.find('button')[1];
      expect(button).to.exist;
      expect(button.text()).to.equal('team.actions.move_to_waitlist');
    });
    it('if the team is waiting, show signup button', () => {
      team.state = teamStates.waiting;
      const vm = utils.mountComponent(TeamTableOptions, { propsData: { team: team } });
      const button = vm.find('button')[1];
      expect(button).to.exist;
      expect(button.text()).to.equal('team.actions.confirm_signup');
    });
    it('if the team needs approval, show approve button', () => {
      team.state = teamStates.needsApproval;
      const vm = utils.mountComponent(TeamTableOptions, { propsData: { team: team } });
      const button = vm.find('button')[1];
      expect(button).to.exist;
      expect(button.text()).to.equal('team.actions.confirm_signup');
      const secondButton = vm.find('button')[2];
      expect(secondButton).to.exist;
      expect(secondButton.text()).to.equal('team.actions.move_to_waitlist');
    });

    it('if the team has not paid, show a mark as paid button', () => {
      team.paid = false;
      const vm = utils.mountComponent(TeamTableOptions, { propsData: { team: team } });
      const button = vm.find('button')[3];
      expect(button).to.exist;
      expect(button.text()).to.equal('team.actions.mark_paid');
    });
    it('if the team has paid, show a mark as not paid button', () => {
      team.paid = true;
      const vm = utils.mountComponent(TeamTableOptions, { propsData: { team: team } });
      const button = vm.find('button')[3];
      expect(button).to.exist;
      expect(button.text()).to.equal('team.actions.mark_unpaid');
    });
  });
});
