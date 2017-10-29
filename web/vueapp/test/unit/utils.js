import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import { i18n, router } from '@/bootstrap';
import { mount } from 'avoriaz';
import TestComponent from './testComponent';

i18n.silentTranslationWarn = true;
i18n.missing = () => {};

function mountComponent(comp, additionalData) {
  additionalData = additionalData || {
    propsData: {},
  };
  comp.i18n = i18n;
  comp.router = router;

  Vue.use(VueRouter);
  Vue.use(VueI18n);
  additionalData.i18n = i18n;
  const wrapper = mount(comp, additionalData);
  wrapper.vm.$t = key => key;
  wrapper.instance().$t = key => key;
  return wrapper;
}

function inputFormItem(vm, index, value) {
  const input = vm.first('form').find('.el-form-item')[index].first('input');
  input.element.value = value;
  input.trigger('input');
  input.trigger('blur');
}

function translate(key) {
  return i18n.t(key);
}

function getTestComponent() {
  return TestComponent;
}

// helper for testing action with expected mutations
function testAction(action, payload, state, expectedMutations, done) {
  let count = 0;

  // mock commit
  const commit = (type, pld) => {
    const mutation = expectedMutations[count];

    try {
      expect(mutation.type).to.equal(type);
      if (pld) {
        expect(mutation.payload).to.deep.equal(pld);
      }
    } catch (error) {
      done(error);
    }

    count += 1;
    if (count >= expectedMutations.length) {
      done();
    }
  };

  // call the action with mocked store and arguments
  action({ commit, state }, payload);

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0);
    done();
  }
}

export default { mountComponent, translate, getTestComponent, inputFormItem, testAction };
