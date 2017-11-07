import routes from '@/routes';

import sinon from 'sinon';

function findRouteByName(name) {
  return routes.find(route => route.name === name);
}

describe('Routes', () => {
  describe('Home', () => {
    it('should load Tournaments, before route enter', () => {
      const route = findRouteByName('home.index');
      const spy = sinon.stub();
      expect(route.beforeEnter).to.be.a('function');
      route.beforeEnter({}, {}, spy);
      expect(spy.called).to.equal(true);
    });
  });

  describe('Tournament', () => {
    it('should load Tournament, before route enter', () => {
      const route = findRouteByName('tournament.single');
      const spy = sinon.stub();
      expect(route.beforeEnter).to.be.a('function');
      route.beforeEnter({ params: { tournamentID: 1} }, {}, spy);
    });
  });
});

