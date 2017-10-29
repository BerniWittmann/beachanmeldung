import navigationGuards from '@/utils/navigationGuards';
import sinon from 'sinon';

describe('Utils', () => {
  describe('Navigation Guards', () => {
    let store;
    let to;
    describe('beforeAll', () => {
      describe('when unauthorized user tries to access protected site', () => {
        beforeEach(() => {
          store = {
            state: {
              auth: {
                authenticated: false,
              },
            },
          };
          to = {
            matched: {
              some: fn => fn({
                meta: {
                  auth: true,
                },
              }),
            },
          };
        });

        it('should redirect to login', () => {
          const guard = navigationGuards.getBeforeAll(store);
          const next = sinon.stub();
          guard(to, null, next);

          expect(next.called).to.equal(true);
          expect(next.getCall(0).args[0]).to.deep.equal({
            name: 'auth.login',
          });
        });
      });

      describe('when authorized user tries to access a site only for guests', () => {
        beforeEach(() => {
          store = {
            state: {
              auth: {
                authenticated: true,
              },
            },
          };
          to = {
            matched: {
              some: fn => fn({
                meta: {
                  guest: true,
                },
              }),
            },
          };
        });

        it('should redirect to home', () => {
          const guard = navigationGuards.getBeforeAll(store);
          const next = sinon.stub();
          guard(to, null, next);

          expect(next.called).to.equal(true);
          expect(next.getCall(0).args[0]).to.deep.equal({
            name: 'home.index',
          });
        });
      });

      describe('when user tries to access a normal site', () => {
        beforeEach(() => {
          store = {
            state: {
              auth: {
                authenticated: false,
              },
            },
          };
          to = {
            matched: {
              some: fn => fn({
                meta: {},
              }),
            },
          };
        });

        it('should not redirect', () => {
          const guard = navigationGuards.getBeforeAll(store);
          const next = sinon.stub();
          guard(to, null, next);

          expect(next.called).to.equal(true);
          expect(next.getCall(0).args[0]).to.equal(undefined);
        });
      });
    });
  });
});
