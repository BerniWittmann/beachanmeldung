<template>
    <v-layout>
        <el-row>
            <el-col :lg="{span: 8, offset: 8}" :md="{span: 8, offset: 8}" :sm="{span: 8, offset: 8}"
                    :xs="{span: 22, offset: 1}">
                <v-panel contextual-style="primary">
                    <h1 class="panel-title" slot="header">
                        {{ $t('auth.verifying_email') }}
                    </h1>
                    <div slot="body">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <p>{{ $t('auth.verifying_email_text') }}</p>
                            </el-col>
                        </el-row>
                    </div>
                    <div slot="footer">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                {{ $t('auth.no_account') }}
                                <router-link :to="{ name: 'auth.registration' }">{{ $t('auth.register') }}</router-link>
                            </el-col>
                        </el-row>
                    </div>
                </v-panel>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * Email Verify Index Page
   * ============
   *
   * Page where the user can verify the email.
   */
  import authService from '@/services/auth';

  export default {
    mounted() {
      authService.verifyEmail(this.$route.query.code);
    },

    components: {
      VLayout: require('@/layouts/background.vue'),
      VPanel: require('@/components/panel.vue'),
    },
  };
</script>
