<template>
    <v-layout>
        <el-row class="home-part home-part-image">
            <div class="home-header-image">
                <h1>{{ $t('general.header.title', { currentYear: year }) }}</h1>
                <h2>{{ $t('general.header.subtitle') }}</h2>
            </div>
        </el-row>

        <el-row class="home-part">
            <el-col :span="24">
                <h1>{{ $t('etc.terms_of_participation.headline') }}</h1>
                <p v-html="termsOfParticipation"></p>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * etc Terms of Participation Page
   * ============
   *
   * A PAge that displays the terms of participation.
   */

  export default {
    components: {
      VLayout: require('@/layouts/fullWidth.vue'),
    },

    computed: {
      year() {
        return this.$store.state.config.year;
      },

      termsOfParticipation() {
        return this.$store.state.config.termsOfParticipation.replace('{link}', 'https://www.handballismaning.de/turniere-und-events');
      },
    },
  };
</script>
