<template>
  <v-layout>
    <el-row class="home-part home-part-image">
      <div class="home-header-image">
      </div>
    </el-row>

    <el-row class="home-part">
      <el-col :span="24">
        <h2>Bringt Leben an den Esstisch</h2>
        <h4>Mit Mampf essen Sie gemeinsam und sparen dabei sogar noch</h4>
        <v-link-button
                type="primary"
                size="large"
        >Essen finden
        </v-link-button>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="home-part">
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <div class="home-subheader-image"></div>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <h3>Gemeinsam essen lohnt sich</h3>
        <p class="lead">Essen anbieten. Gäste einladen. Kosten sparen</p>
        <v-link-button
                type="primary"
                size="large"
        >Essen anbieten
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
