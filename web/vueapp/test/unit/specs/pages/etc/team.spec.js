import Team from '@/pages/etc/team';
import Vuex from 'vuex';
import utils from '../../../utils';

describe('Pages', () => {
  describe('Team', () => {
    const state = {
      team: {
        members: [{
          email: 'test@byom.de',
          name: 'Test Member',
          role: 'CEO',
          description: 'Just a short description',
          image: 'http://localhost:8000/image.png',
          thumbnail: 'http://localhost:8000/image.png',
        }, {
          email: 'test2@byom.de',
          name: 'Another Member',
          role: 'CTO',
          description: 'Dobedobeduu',
          image: undefined,
          thumbnail: undefined,
        }],
      },
      auth: {
        authenticated: false,
      },
    };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    it('should include a heading', () => {
      const vm = utils.mountComponent(Team, { store });
      const textContent = vm.first('h1').text();
      expect(textContent).to.equal('nav.team');
    });

    it('should have computed property for all members', () => {
      const vm = utils.mountComponent(Team, { store });
      const result = vm.vm.members;
      expect(result).to.have.length(2);
      expect(result[0]).to.deep.equal({
        email: 'test@byom.de',
        name: 'Test Member',
        role: 'CEO',
        description: 'Just a short description',
        image: 'http://localhost:8000/image.png',
        thumbnail: 'http://localhost:8000/image.png',
      });
      expect(result[1]).to.deep.equal({
        email: 'test2@byom.de',
        name: 'Another Member',
        role: 'CTO',
        description: 'Dobedobeduu',
        image: undefined,
        thumbnail: undefined,
      });
    });

    it('should have computed property for span Width of team members', () => {
      const vm = utils.mountComponent(Team, { store });
      expect(vm.vm.spanWidth).to.equal(12);
    });

    it('should have method to check for image of member', () => {
      const vm = utils.mountComponent(Team, { store });
      expect(vm.vm.hasImage({ thumbnail: 'test' })).to.equal(true);
      expect(vm.vm.hasImage({ thumbnail: undefined })).to.equal(false);
    });

    it('should have method to render a mailto link', () => {
      const vm = utils.mountComponent(Team, { store });
      expect(vm.vm.getMailTo({ email: 'test@byom.de' })).to.equal('mailto:test@byom.de');
    });

    describe('should render team members', () => {
      it('should render all members', () => {
        const vm = utils.mountComponent(Team, { store });
        const elements = vm.find('.team-member');
        expect(elements).to.have.length(2);
      });
      it('should render the name', () => {
        const vm = utils.mountComponent(Team, { store });
        const members = vm.find('.team-member');
        expect(members[0].first('.team-member-name').text()).to.equal('Test Member');
        expect(members[1].first('.team-member-name').text()).to.equal('Another Member');
      });
      it('should render the role', () => {
        const vm = utils.mountComponent(Team, { store });
        const members = vm.find('.team-member');
        expect(members[0].first('.team-member-role').text()).to.equal('CEO');
        expect(members[1].first('.team-member-role').text()).to.equal('CTO');
      });
      it('should render the description', () => {
        const vm = utils.mountComponent(Team, { store });
        const members = vm.find('.team-member');
        expect(members[0].first('.team-member-description').text()).to.equal('Just a short description');
        expect(members[1].first('.team-member-description').text()).to.equal('Dobedobeduu');
      });
      it('should render the email', () => {
        const vm = utils.mountComponent(Team, { store });
        const members = vm.find('.team-member');
        expect(members[0].first('a').hasAttribute('href', 'mailto:test@byom.de')).to.equal(true);
        expect(members[1].first('a').hasAttribute('href', 'mailto:test2@byom.de')).to.equal(true);
      });
      it('should render the image', () => {
        const vm = utils.mountComponent(Team, { store });
        const members = vm.find('.team-member');
        expect(members[0].contains('img')).to.equal(true);
        expect(members[1].contains('img')).to.equal(false);
      });
    });
  });
});
