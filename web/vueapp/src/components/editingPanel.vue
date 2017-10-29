<template>
  <v-panel :contextual-style="contextualStyle">
    <h1 class="panel-title"
        slot="header"
    >
      <slot name="header"></slot>
      <span class="pull-right">
          <el-button type="primary" icon="edit" v-if="!isEditing" @click="edit()">{{ $t(editTextKey) }}</el-button>
          <el-button :plain="true" type="danger" icon="delete" v-if="isEditing" @click="abort()">{{ $t(abortTextKey) }}</el-button>
          <el-button type="success" icon="check" v-if="isEditing" @click="save()">{{ $t(saveTextKey) }}</el-button>
      </span>
    </h1>
    <div slot="body" v-loading.fullscreen.lock="loading">
      <slot name="body" v-if="!isEditing"></slot>
      <slot name="bodyEditing" v-else></slot>
    </div>
    <div slot="footer" v-if="hasSlot('footer')">
      <slot name="footer"></slot>
    </div>
  </v-panel>
</template>

<script>
  /* ============
   * Editing Panel Component
   * ============
   *
   * A panel component that switches between editing and viewing mode.
   *
   */

  import SlotMixin from '@/mixins/slot';

  export default {
    mixins: [
      SlotMixin,
    ],
    components: {
      VPanel: require('@/components/panel.vue'),
    },
    props: {
      contextualStyle: {
        type: String,
        required: false,
      },
      editTextKey: {
        type: String,
        default: 'general.edit',
      },
      saveTextKey: {
        type: String,
        default: 'general.save',
      },
      abortTextKey: {
        type: String,
        default: 'general.abort',
      },
      onSave: {
        type: Function,
        required: true,
      },
      onAbort: {
        type: Function,
        required: true,
      },
    },
    data() {
      return {
        isEditing: false,
      };
    },
    methods: {
      edit() {
        this.isEditing = true;
      },
      save() {
        this.onSave();
        this.isEditing = false;
      },
      abort() {
        this.isEditing = false;
        this.onAbort();
      },
    },
    computed: {
      loading() {
        return this.$store.getters['loading/isLoading'];
      },
    },
  };

</script>
