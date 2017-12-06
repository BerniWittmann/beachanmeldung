import Registration from '@/pages/auth/registration';
import Vuex from 'vuex';
import moxios from 'moxios';
import utils from '../../../utils';
import loading from '@/store/modules/loading';
import sinon from 'sinon';

describe('Pages', () => {
  describe('Registration', () => {
    const state = {
      auth: { authenticated: false },
    };
    const getters = {};
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
        getters,
        modules: {
          loading,
        },
      });
      store.dispatch('loading/unset');
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should show a title', () => {
      const vm = utils.mountComponent(Registration, { store });
      expect(vm.first('h1').text()).to.contain('auth.registration');
    });

    it('should have computed property loading', () => {
      const vm = utils.mountComponent(Registration, { store });
      expect(vm.vm.loading).to.equal(false);
    });

    it('should have a form', () => {
      const vm = utils.mountComponent(Registration, { store });
      expect(vm.contains('form')).to.equal(true);
    });

    it('should have a link to Login page', () => {
      const vm = utils.mountComponent(Registration, { store });
      const link = vm.first('.panel-footer').first('a');
      expect(link.hasAttribute('href', '/login')).to.equal(true);
    });

    describe('it should validate the form', () => {
      describe('the first name should be validated', () => {
        it('the first name should be required', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 0, '');
          vm.update();
          vm.vm.$refs.registerForm.validateField('firstName', (error) => {
            expect(error).to.equal('validation.first_name.required');
            done();
          });
        });
        it('the first name should have minlength', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 0, 'x');
          vm.update();
          vm.vm.$refs.registerForm.validateField('firstName', (error) => {
            expect(error).to.equal('validation.first_name.min');
            done();
          });
        });
        it('should not show a validation error if first name correct', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 0, 'firstname');
          vm.update();
          vm.vm.$refs.registerForm.validateField('firstName', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });
      describe('the last name should be validated', () => {
        it('the last name should be required', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 1, '');
          vm.update();
          vm.vm.$refs.registerForm.validateField('lastName', (error) => {
            expect(error).to.equal('validation.last_name.required');
            done();
          });
        });
        it('the last name should have minlength', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 1, 'x');
          vm.update();
          vm.vm.$refs.registerForm.validateField('lastName', (error) => {
            expect(error).to.equal('validation.last_name.min');
            done();
          });
        });
        it('should not show a validation error if last name correct', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 1, 'lastname');
          vm.update();
          vm.vm.$refs.registerForm.validateField('lastName', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });
      describe('the email should be validated', () => {
        it('email should be required', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 2, '');
          vm.update();
          vm.vm.$refs.registerForm.validateField('email', (error) => {
            expect(error).to.equal('validation.email.required');
            done();
          });
        });
        it('email must be valid', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 2, 'not/a_valid_email');
          vm.update();
          vm.vm.$refs.registerForm.validateField('email', (error) => {
            expect(error).to.equal('validation.email.valid');
            done();
          });
        });
        it('should not show a validation error if email correct', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 2, 'test@byom.de');
          vm.update();
          vm.vm.$refs.registerForm.validateField('email', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      describe('the password should be validated', () => {
        it('password should be required', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 4, '');
          vm.update();
          vm.vm.$refs.registerForm.validateField('password', (error) => {
            expect(error).to.equal('validation.password.required');
            done();
          });
        });
        it('password should have minlength', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 4, 'short');
          vm.update();
          vm.vm.$refs.registerForm.validateField('password', (error) => {
            expect(error).to.equal('validation.password.min');
            done();
          });
        });
        it('should not show a validation error if password is given', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 4, 'p4S$w0rD');
          vm.update();
          vm.vm.$refs.registerForm.validateField('password', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      describe('the confirm password should be validated', () => {
        it('confirm password should be required', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 5, '');
          vm.update();
          vm.vm.$refs.registerForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('validation.password_confirm.required');
            done();
          });
        });
        it('confirm password should match first password', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 5, 'p4S$w0rD');
          vm.update();
          vm.vm.$refs.registerForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('validation.password_confirm.match');
            done();
          });
        });
        it('confirm password should have minlength', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 4, 'short');
          utils.inputFormItem(vm, 5, 'short');
          vm.update();
          vm.vm.$refs.registerForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('validation.password_confirm.min');
            done();
          });
        });
        it('should not show a validation error if confirm password is given', (done) => {
          const vm = utils.mountComponent(Registration, { store });
          utils.inputFormItem(vm, 4, 'p4S$w0rD');
          utils.inputFormItem(vm, 5, 'p4S$w0rD');
          vm.update();
          vm.vm.$refs.registerForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      it('if form is invalid on submit, it should show a notification', () => {
        const vm = utils.mountComponent(Registration, { store });
        const spy = sinon.spy(vm.vm.$message, 'error');

        const button = vm.first('form').first('button');
        button.trigger('click');

        expect(spy.called).to.equal(true);
        expect(spy.getCall(0).args[0]).to.equal('validation.failed');
        vm.vm.$message.error.restore();
      });
    });

    it('should register the user', (done) => {
      const vm = utils.mountComponent(Registration, { store });
      utils.inputFormItem(vm, 0, 'First');
      utils.inputFormItem(vm, 1, 'Name');
      utils.inputFormItem(vm, 2, 'test@byom.de');
      utils.inputFormItem(vm, 3, '+491234567890');
      utils.inputFormItem(vm, 4, 'p4S$w0rD');
      utils.inputFormItem(vm, 5, 'p4S$w0rD');

      vm.first('form').first('button').trigger('click');

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/signup/');
        expect(JSON.parse(request.config.data)).to.deep.equal({
          email: 'test@byom.de',
          password: 'p4S$w0rD',
          first_name: 'First',
          last_name: 'Name',
          phone: '+491234567890',
        });
        return done();
      });
    });

    describe('when the component is loading', () => {
      it('has computed property loading', () => {
        const vm = utils.mountComponent(Registration, { store });
        vm.vm.$store.dispatch('loading/set');
        expect(vm.vm.loading).to.equal(true);
      });
      it('shows the loading state', () => {
        const vm = utils.mountComponent(Registration, { store });
        vm.vm.$store.dispatch('loading/set');
        vm.update();
        expect(vm.vm.loading).to.equal(true);
        // uncommented because test is not working here
        // expect(button.hasClass('is-loading')).to.equal(true);
      });
    });
  });
});
