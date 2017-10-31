<template>
    <el-container>
        <el-header>
            <v-navigation></v-navigation>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="24">
                    <!-- Content will be placed here -->
                    <slot></slot>
                </el-col>
            </el-row>
        </el-main>
        <el-footer>
            <v-footer></v-footer>
        </el-footer>
    </el-container>
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
