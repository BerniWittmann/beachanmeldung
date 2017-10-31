<template>
  <v-layout>
    <el-row>
      <el-col :lg="{span: 8, offset: 8}" :md="{span: 8, offset: 8}" :sm="{span: 8, offset: 8}"
              :xs="{span: 22, offset: 1}">
        <v-panel contextual-style="primary">
          <h1 class="panel-title" slot="header">
            {{ $t('auth.forgot_password') }}
          </h1>
          <div slot="body">
            <el-form ref="forgotPasswordForm" :model="user" :rules="rules">
              <el-form-item prop="email">
                  <el-input v-model="user.email"
                            type="email" @keyup.native.enter="requestPassword"
                            v-bind:placeholder="$t('auth.email')"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button :loading="loading" type="primary" @click="requestPassword">
                    {{ $t('auth.reset_password') }}
                  </el-button>
              </el-form-item>
            </el-form>
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
   * Password forgot Index Page
   * ============
   *
   * Page where the user can request a new Password.
   */
  import authService from '@/services/auth';

  export default {
    data() {
      return {
        user: {
          email: null,
        },
        rules: {
          email: [
            { required: true, message: this.$t('validation.email.required'), trigger: 'blur' },
            { type: 'email', message: this.$t('validation.email.valid'), trigger: 'blur' },
          ],
        },
      };
    },

    methods: {
      requestPassword() {
        this.$refs.forgotPasswordForm.validate((valid) => {
          if (valid) {
            authService.requestPassword(this.user);
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },
    },

    computed: {
      loading() {
        return this.$store.getters['loading/isLoading'];
      },
    },

    components: {
      VLayout: require('@/layouts/background.vue'),
      VPanel: require('@/components/panel.vue'),
    },
  };
</script>
