<template>
  <v-layout>
    <el-row class="home-part home-part-image">
      <div class="home-header-image">
      </div>
    </el-row>

    <el-row class="home-part">
      <el-col :span="24">
        <h2>Die Beachturniere in Ismaning starten wieder</h2>
        <h4>Melden Sie sich heute noch an.</h4>
        <v-link-button
                type="primary"
                size="large"
        >Anmelden
        </v-link-button>
      </el-col>
    </el-row>

    <el-row class="home-part">
      <el-col :span="24">
        <h3>{{ $t("general.welcome") }}</h3>
        <p>
          {{ $t("general.welcome_text") }}
        </p>
        <p>
          {{ $t("general.bug_notice") }}
        </p>
        <el-row :gutter="20">
          <el-col :lg="4" :md="6" :sm="8" :xs="12">
            <v-link-button type="primary" href="https://github.com/BerniWittmann/mampf-prototype/issues" target="_blank">
              <i class="fa fa-github fa-fw" aria-hidden="true"></i>
              <span class="padding-left">{{ $t("general.github") }}</span>
            </v-link-button>
          </el-col>
          <el-col :lg="4" :md="6" :sm="8" :xs="12">
            <v-link-button type="primary" href="mailto:b.wittmann@mail.de">
              <i class="fa fa-envelope fa-fw" aria-hidden="true"></i>
              <span class="padding-left">{{ $t("general.email") }}</span>
            </v-link-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </v-layout>
</template>

<script>
  /* ============
   * Home Index Page
   * ============
   *
   * The home index page.
   */

  export default {
    components: {
      VLayout: require('@/layouts/fullWidth.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
    },
  };
</script>
