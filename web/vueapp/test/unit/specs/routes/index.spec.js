import routes from '@/routes';

// noinspection ES6UnusedImports
// eslint-disable-next-line no-unused-vars
import sinon from 'sinon';

// eslint-disable-next-line no-unused-vars
function findRouteByName(name) {
  return routes.find(route => route.name === name);
}

describe('Routes', () => {
});

