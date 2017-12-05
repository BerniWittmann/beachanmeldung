/* ============
 * Step Layout Direction Mixin
 * ============
 *
 * Mixins are used to easily expand Vue components.
 * This mixin, will add properties to compute, wether steps should be vertical or horizontal
 */

export default {
  data() {
    return {
      currentStepLayoutDirection: 'horizontal',
    };
  },

  methods: {
    handleWindowResize() {
      this.currentStepLayoutDirection = document.documentElement.clientWidth <= 1000 ? 'vertical' : 'horizontal';
    },
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize);

      this.handleWindowResize();
    });
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
};
