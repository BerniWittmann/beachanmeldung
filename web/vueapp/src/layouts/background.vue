<template>
    <el-container class="full-size-background">
        <el-header>
            <v-navigation></v-navigation>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="24">
                    <div class="page">
                        <!-- Content will be placed here -->
                        <slot></slot>
                    </div>
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
   * Background Layout
   * ============
   *
   * Used for the login and register pages. Has a big background image
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
