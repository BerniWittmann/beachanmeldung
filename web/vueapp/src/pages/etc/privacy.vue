<template>
    <v-layout>
        <el-row class="home-part home-part-image">
            <div class="home-header-image">
                <h1>{{ $t('general.header.title', { currentYear: currentYear }) }}</h1>
                <h2>{{ $t('general.header.subtitle') }}</h2>
            </div>
        </el-row>

        <el-row class="home-part">
            <el-col :span="24">
                <h1>{{ $t('etc.privacy.headline') }}</h1>
                <p v-html="$t('etc.privacy.privacy_referral_text')"></p>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * etc About aus Page
   * ============
   *
   * The about us page.
   */
  import moment from 'moment';

  export default {
    components: {
      VLayout: require('@/layouts/fullWidth.vue'),
    },

    computed: {
      currentYear() {
        return moment().format('YYYY');
      },
    },
  };
</script>
