import { validatePassword, validatePasswordConfirm } from '@/utils/validators';
import sinon from 'sinon';

describe('Utils', () => {
  describe('Validators', () => {
    let vueinstance;
    let callback;

    beforeEach(() => {
      vueinstance = {
        $t: key => key,
        user: {
          passwordConfirm: '',
          password: 'test',
        },
        $refs: {
          testForm: {
            validateField: sinon.stub(),
          },
        },
      };
      callback = sinon.stub();
    });
    afterEach(() => {
      callback.reset();
    });
    describe('Password Validator', () => {
      it('the password should be required', () => {
        validatePassword(null, undefined, callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.deep.equal(new Error('validation.password.required'));
      });

      it('an empty password should be invalid', () => {
        validatePassword(null, '', callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.deep.equal(new Error('validation.password.required'));
      });
      it('if the confirm password is not empty, it should trigger validation the confirm password', () => {
        vueinstance.user.passwordConfirm = 'password';
        validatePassword(null, 'password', callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.equal(undefined);
        expect(vueinstance.$refs.testForm.validateField.called).to.equal(true);
        expect(vueinstance.$refs.testForm.validateField.getCall(0).args[0]).to.equal('passwordConfirm');
      });
      it('if password is valid, it should not throw an error', () => {
        validatePassword(null, 'password', callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.equal(undefined);
      });
    });

    describe('Password Confirm Validator', () => {
      it('the password should be required', () => {
        validatePasswordConfirm(null, undefined, callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.deep.equal(new Error('validation.password_confirm.required'));
      });

      it('an empty password should be invalid', () => {
        validatePasswordConfirm(null, '', callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.deep.equal(new Error('validation.password_confirm.required'));
      });
      it('the confirm password must match', () => {
        validatePasswordConfirm(null, 'wrong', callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.deep.equal(new Error('validation.password_confirm.match'));
      });
      it('if password is valid, it should not throw an error', () => {
        validatePasswordConfirm(null, 'test', callback, vueinstance, 'testForm');

        expect(callback.called).to.equal(true);
        expect(callback.getCall(0).args[0]).to.equal(undefined);
      });
    });
  });
});
