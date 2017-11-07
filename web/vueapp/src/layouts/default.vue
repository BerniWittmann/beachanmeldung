<template>
    <el-container>
        <el-header>
            <v-navigation></v-navigation>
        </el-header>
        <el-main>
            <el-row>
                <el-col>
                    <div class="main">
                        <el-row>
                            <el-col :span="16" :offset="4">
                                <el-card class="tournament-card">
                                    <div slot="header" class="header" v-if="hasSlot('header')">
                                        <slot name="header"></slot>
                                    </div>
                                    <div class="body">
                                        <slot></slot>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
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
   * Default Layout
   * ============
   *
   * Used for the home and account pages.
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
