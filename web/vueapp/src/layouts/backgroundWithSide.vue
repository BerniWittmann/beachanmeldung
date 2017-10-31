<template>
    <el-container class="full-size-background">
        <el-header>
            <v-navigation></v-navigation>
        </el-header>
        <el-main>
            <el-row>
                <el-col :lg="{span: 5, offset: 1}" :md="{span: 5, offset: 1}" :sm="{span: 5, offset: 1}"
                        :xs="{span: 22, offset: 1}" v-if="hasSlot('side')">
                    <slot name="side"></slot>
                </el-col>
                <el-col :lg="{span: 15, offset: 2}" :md="{span: 15, offset: 2}" :sm="{span: 15, offset: 2}"
                        :xs="{span: 22, offset: 1}">
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

  import SlotMixin from '@/mixins/slot';

  export default {
    mixins: [
      SlotMixin,
    ],
    components: {
      VNavigation: require('@/components/navigation.vue'),
      VFooter: require('@/components/footer.vue'),
    },
  };

</script>
