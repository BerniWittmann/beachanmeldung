<template>
  <div class="container">
    <v-navigation></v-navigation>

    <el-row>
      <el-col :span="24">
        <!-- Content will be placed here -->
        <slot></slot>
      </el-col>
    </el-row>

    <v-footer></v-footer>
  </div>
</template>

<script>
  /* ============
   * Default Layout
   * ============
   *
   * Used for the home and account pages.
   *
   * Layouts are used to store a lot of shared code.
   * This way the app stays clean.
   */

  export default {
    components: {
      VNavigation: require('@/components/navigation.vue'),
      VFooter: require('@/components/footer.vue'),
    },
  };

</script>
