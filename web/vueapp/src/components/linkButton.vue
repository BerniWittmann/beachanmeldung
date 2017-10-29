<template>
    <a v-if="showHref" v-bind:href="routeHref" v-bind:target="target">
        <el-button :type="type" :size="size" :loading="loading" :disabled="disabled" :native-type="nativeType">
            <slot></slot>
        </el-button>
    </a>
    <router-link :to="routeUrl" v-else-if="showRoute">
        <el-button :type="type" :size="size" :loading="loading" :disabled="disabled" :native-type="nativeType">
            <slot></slot>
        </el-button>
    </router-link>
    <span v-else>
        <el-button @click="handleNoRedirect()" :type="type" :size="size" :loading="loading" :disabled="disabled" :native-type="nativeType">
            <slot></slot>
        </el-button>
    </span>
</template>

<script>
  /* ============
   * Link Button Component
   * ============
   *
   * Button that serves as a Link
   */

  export default {
    props: {
      type: {
        type: String,
      },
      size: {
        type: String,
      },
      loading: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
      },
      nativeType: {
        type: String,
      },
      route: {
        type: Object,
      },
      href: {
        type: String,
      },
      target: {
        type: String,
      },
    },

    computed: {
      routeUrl() {
        if (this.disabled || !this.route) return undefined;
        return this.route;
      },

      routeHref() {
        if (this.disabled || !this.href) return undefined;
        return this.href;
      },

      showHref() {
        return this.href && !this.route && !this.disabled;
      },

      showRoute() {
        return this.route && !this.href && !this.disabled;
      },
    },

    methods: {
      handleNoRedirect() {
        this.$router.push({
          name: 'etc.comingSoon',
        });
      },
    },
  };
</script>
