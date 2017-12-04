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
                <h1>{{ $t('etc.contact.headline') }}</h1>

                <p>{{ $t('etc.contact.match_operations') }}</p>
                <el-row :gutter="20">
                    <el-col>
                        <v-link-button icon="el-icon-message" href="mailto:gs-handball@tsv-ismaning.de">
                            {{ $t('etc.contact.mail') }}
                        </v-link-button>
                    </el-col>
                </el-row>

                <br>

                <h2>{{ $t('etc.contact.implementation') }}</h2>
                <p>{{ $t('etc.contact.implementation_name') }}</p>
                <el-row :gutter="20">
                    <el-col :lg="4" :md="4" :sm="6" :xs="12">
                        <v-link-button href="https://github.com/BerniWittmann/" target="_blank">
                            <i class="fa fa-github"></i> {{ $t('etc.contact.github') }}
                        </v-link-button>
                    </el-col>
                    <el-col :lg="4" :md="4" :sm="6" :xs="12">
                        <v-link-button href="mailto:b.wittmann@mail.de" icon="el-icon-message">
                            {{ $t('etc.contact.mail') }}
                        </v-link-button>
                    </el-col>
                </el-row>
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
      VLinkButton: require('@/components/linkButton.vue'),
    },

    computed: {
      currentYear() {
        return moment().format('YYYY');
      },
    },
  };
</script>
