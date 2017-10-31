<template>
    <v-layout>
        <el-row>
            <el-col :lg="{span: 8, offset: 8}" :md="{span: 8, offset: 8}" :sm="{span: 8, offset: 8}"
                    :xs="{span: 22, offset: 1}">
                <v-panel contextual-style="primary">
                    <h1 class="panel-title" slot="header">
                        {{ $t('auth.reset_password') }}
                    </h1>
                    <div slot="body">
                        <el-form ref="passwordResetForm" :rules="rules" :model="user">
                            <el-form-item prop="password">
                                <el-input v-model="user.password"
                                          type="password" @keyup.native.enter="resetPassword"
                                          v-bind:placeholder="$t('auth.password')"></el-input>
                            </el-form-item>
                            <el-form-item prop="passwordConfirm">
                                <el-input v-model="user.passwordConfirm"
                                          type="password" @keyup.native.enter="resetPassword"
                                          v-bind:placeholder="$t('auth.password_confirm')"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button :loading="loading" type="primary" @click="resetPassword">
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
   * Password Reset Index Page
   * ============
   *
   * Page where the user can reset the password.
   */
  import authService from '@/services/auth';
  import { validatePassword, validatePasswordConfirm } from '@/utils/validators';

  export default {
    data() {
      return {
        user: {
          code: null,
          password: null,
          passwordConfirm: null,
        },
        rules: {
          password: [
            { required: true, message: this.$t('validation.password.required'), trigger: 'blur' },
            { validator: this.validatePass, trigger: 'blur' },
            { min: 8, message: this.$t('validation.password.min'), trigger: 'blur' },
          ],
          passwordConfirm: [
            { required: true, message: this.$t('validation.password_confirm.required'), trigger: 'blur' },
            { validator: this.validatePass2, trigger: 'blur' },
            { min: 8, message: this.$t('validation.password_confirm.min'), trigger: 'blur' },
          ],
        },
      };
    },

    beforeMount() {
      authService.checkResetPasswordCode(this.$route.query.code);
      this.user.code = this.$route.query.code;
    },

    methods: {
      resetPassword() {
        this.$refs.passwordResetForm.validate((valid) => {
          if (valid) {
            authService.resetPassword(this.user);
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },

      validatePass(rule, value, callback) {
        validatePassword(rule, value, callback, this, 'passwordResetForm');
      },
      validatePass2(rule, value, callback) {
        validatePasswordConfirm(rule, value, callback, this);
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
