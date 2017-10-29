import routes from '@/routes';
import sinon from 'sinon';

function findRouteByName(name) {
  return routes.find(route => route.name === name);
}

describe('Routes', () => {
  describe('Team', () => {
    it('should load Team members, before route enter', () => {
      const route = findRouteByName('etc.team');
      const spy = sinon.stub();
      expect(route.beforeEnter).to.be.a('function');
      route.beforeEnter({}, {}, spy);
      expect(spy.called).to.equal(true);
    });
  });
});

