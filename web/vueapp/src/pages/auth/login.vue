<template>
    <v-layout>
        <el-row>
            <el-col :lg="{span: 8, offset: 8}" :md="{span: 8, offset: 8}" :sm="{span: 8, offset: 8}"
                    :xs="{span: 22, offset: 1}">
                <v-panel contextual-style="primary">
                    <h1 class="panel-title" slot="header">
                        {{ $t('auth.login') }}
                    </h1>
                    <div slot="body">
                        <el-form :rules="rules" :model="user" ref="loginForm">
                            <el-form-item prop="email">
                                <el-input v-model="user.email"
                                          type="email"
                                          v-bind:placeholder="$t('auth.email')"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input v-model="user.password"
                                          type="password"
                                          v-bind:placeholder="$t('auth.password')"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-col :lg="{span: 15}" :md="{span: 13}" :sm="{span: 9}"
                                        :xs="{span: 14}">
                                    <el-button :loading="loading" type="primary" @click="login">
                                        {{ $t('auth.login') }}
                                    </el-button>
                                </el-col>
                                <el-col :lg="{span: 9}" :md="{span: 11}" :sm="{span: 15}"
                                        :xs="{span: 10}">
                                    <router-link :to="{ name: 'auth.password-forgot' }">{{ $t('auth.forgot_password')
                                        }}
                                    </router-link>
                                </el-col>
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
   * Login Index Page
   * ============
   *
   * Page where the user can login.
   */
  import authService from '@/services/auth';

  export default {
    data() {
      return {
        user: {
          email: null,
          password: null,
        },
        rules: {
          email: [
            { required: true, message: this.$t('validation.email.required'), trigger: 'blur' },
            { type: 'email', message: this.$t('validation.email.valid'), trigger: 'blur' },
          ],
          password: [
            { required: true, message: this.$t('validation.password.required'), trigger: 'blur' },
          ],
        },
      };
    },

    methods: {
      login() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            authService.login(this.user);
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
