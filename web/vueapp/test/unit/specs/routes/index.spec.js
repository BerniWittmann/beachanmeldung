import routes from '@/routes';

import sinon from 'sinon';

function findRouteByName(name) {
  return routes.find(route => route.name === name);
}

describe('Routes', () => {
  describe('Home', () => {
    it('should load Tournaments, before route enter', () => {
      const route = findRouteByName('home.index');
      expect(route.beforeEnter).to.be.a('function');
    });
  });
});

