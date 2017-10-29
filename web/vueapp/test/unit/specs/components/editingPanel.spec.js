import editingPanel from '@/components/editingPanel';
import utils from '../../utils';
import sinon from 'sinon';
import loading from '@/store/modules/loading';
import Vuex from 'vuex';

describe('Components', () => {
  const methods = {
    onSave: sinon.stub(),
    onAbort: sinon.stub(),
  };
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        loading,
      },
    });
    store.dispatch('loading/unset');
  });

  describe('Editing Panel', () => {
    describe('Normal Panel Functionality', () => {
      describe('should fill the slots', () => {
        it('should fill the header slot', () => {
          const vm = utils.mountComponent(editingPanel, {
            slots: { header: utils.getTestComponent() },
            propsData: {
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          const textContent = vm.first('.panel-heading').text();
          expect(textContent).to.contain('test_component');
        });
        it('should also show the header if none is given', () => {
          const vm = utils.mountComponent(editingPanel, {
            propsData: {
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          expect(vm.contains('.panel-heading')).to.equal(true);
        });
        it('should fill the body slot', () => {
          const vm = utils.mountComponent(editingPanel, {
            slots: { body: utils.getTestComponent() },
            propsData: {
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          const textContent = vm.first('.panel-body').text();
          expect(textContent).to.contain('test_component');
        });
        it('should fill the footer slot', () => {
          const vm = utils.mountComponent(editingPanel, {
            slots: { footer: utils.getTestComponent() },
            propsData: {
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          const textContent = vm.first('.panel-footer').text();
          expect(textContent).to.contain('test_component');
        });
        it('should hide the footer if none is given', () => {
          const vm = utils.mountComponent(editingPanel, {
            propsData: {
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          expect(vm.contains('.panel-footer')).to.equal(false);
        });
        it('should fill all slots at once', () => {
          const vm = utils.mountComponent(editingPanel, {
            slots: {
              header: utils.getTestComponent(),
              body: utils.getTestComponent(),
              footer: utils.getTestComponent(),
            },
            propsData: {
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          expect(vm.contains('.panel-heading')).to.equal(true);
          expect(vm.contains('.panel-body')).to.equal(true);
          expect(vm.contains('.panel-footer')).to.equal(true);
        });
      });

      describe('has contextual styles', () => {
        it('should have a default style', () => {
          const vm = utils.mountComponent(editingPanel, {
            propsData: {
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          expect(vm.hasClass('panel-default')).to.equal(true);
        });

        it('should be able to receive contextual styles', () => {
          const vm = utils.mountComponent(editingPanel, {
            propsData: {
              contextualStyle: 'warning',
              onSave: methods.onSave,
              onAbort: methods.onAbort,
            },
            store,
          });
          expect(vm.hasClass('panel-warning')).to.equal(true);
          expect(vm.hasClass('panel-default')).to.equal(false);
        });
      });
    });

    it('should have an edit method', () => {
      const vm = utils.mountComponent(editingPanel, {
        propsData: {
          onSave: methods.onSave,
          onAbort: methods.onAbort,
        },
        store,
      });

      vm.vm.edit();

      expect(vm.vm.isEditing).to.equal(true);
    });
    it('should have an abort method', () => {
      const vm = utils.mountComponent(editingPanel, {
        propsData: {
          onSave: methods.onSave,
          onAbort: methods.onAbort,
        },
        store,
      });
      vm.vm.edit();
      expect(vm.vm.isEditing).to.equal(true);

      vm.vm.abort();
      expect(vm.vm.isEditing).to.equal(false);
      expect(methods.onAbort.called).to.equal(true);
    });
    it('should have a save method', () => {
      const vm = utils.mountComponent(editingPanel, {
        propsData: {
          onSave: methods.onSave,
          onAbort: methods.onAbort,
        },
        store,
      });
      vm.vm.edit();
      expect(vm.vm.isEditing).to.equal(true);

      vm.vm.save();
      expect(vm.vm.isEditing).to.equal(false);
      expect(methods.onSave.called).to.equal(true);
    });

    it('should have props for changing the edit button text', () => {
      const vm = utils.mountComponent(editingPanel, {
        propsData: {
          onSave: methods.onSave,
          onAbort: methods.onAbort,
          editTextKey: 'test.edit',
        },
        store,
      });

      const button = vm.first('.panel-title').first('.el-button');
      expect(button).not.to.equal(undefined);
      expect(button.text()).to.contain('test.edit');
    });
    it('should have props for changing the abort button text', () => {
      const vm = utils.mountComponent(editingPanel, {
        propsData: {
          onSave: methods.onSave,
          onAbort: methods.onAbort,
          abortTextKey: 'test.abort',
        },
        store,
      });
      vm.vm.edit();

      vm.vm.$nextTick(() => {
        const button = vm.first('.panel-title').first('.el-button');
        expect(button).not.to.equal(undefined);
        expect(button.text()).to.contain('test.abort');
      });
    });
    it('should have props for changing the save button text', (done) => {
      const vm = utils.mountComponent(editingPanel, {
        propsData: {
          onSave: methods.onSave,
          onAbort: methods.onAbort,
          saveTextKey: 'test.save',
        },
        store,
      });
      vm.vm.edit();
      vm.vm.$nextTick(() => {
        const button = vm.first('.panel-title').find('.el-button')[1];
        expect(button).not.to.equal(undefined);
        expect(button.text()).to.contain('test.save');
        done();
      });
    });

    describe('is currrently not editing', () => {
      it('should have a button for editing', () => {
        const vm = utils.mountComponent(editingPanel, {
          propsData: {
            onSave: methods.onSave,
            onAbort: methods.onAbort,
          },
          store,
        });

        const button = vm.first('.panel-title').first('.el-button');
        expect(button).not.to.equal(undefined);
        expect(button.text()).to.contain('general.edit');
      });
      it('should show the normal body', () => {
        const vm = utils.mountComponent(editingPanel, {
          slots: {
            body: utils.getTestComponent(),
          },
          propsData: {
            onSave: methods.onSave,
            onAbort: methods.onAbort,
          },
          store,
        });
        const textContent = vm.first('.panel-body').text();
        expect(textContent).to.contain('test_component');
      });
    });

    describe('is currently editing', () => {
      it('should have button for abort', () => {
        const vm = utils.mountComponent(editingPanel, {
          propsData: {
            onSave: methods.onSave,
            onAbort: methods.onAbort,
          },
          store,
        });
        vm.vm.edit();

        vm.vm.$nextTick(() => {
          const button = vm.first('.panel-title').first('.el-button');
          expect(button).not.to.equal(undefined);
          expect(button.text()).to.contain('general.abort');
        });
      });

      it('should have a save button', () => {
        const vm = utils.mountComponent(editingPanel, {
          propsData: {
            onSave: methods.onSave,
            onAbort: methods.onAbort,
          },
          store,
        });
        vm.vm.edit();

        vm.vm.$nextTick(() => {
          const button = vm.first('.panel-title').find('.el-button')[1];
          expect(button).not.to.equal(undefined);
          expect(button.text()).to.contain('general.save');
        });
      });

      it('should show the editing body', () => {
        const vm = utils.mountComponent(editingPanel, {
          slots: {
            bodyEditing: utils.getTestComponent(),
          },
          propsData: {
            onSave: methods.onSave,
            onAbort: methods.onAbort,
          },
          store,
        });
        vm.vm.edit();

        vm.vm.$nextTick(() => {
          const textContent = vm.first('.panel-body').text();
          expect(textContent).to.contain('test_component');
        });
      });
    });
  });
});
