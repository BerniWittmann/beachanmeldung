<template>
    <v-layout>
        <el-row>
            <el-col :lg="{span: 8, offset: 8}" :md="{span: 8, offset: 8}" :sm="{span: 8, offset: 8}"
                    :xs="{span: 22, offset: 1}">
                <v-panel contextual-style="primary">
                    <h1 class="panel-title" slot="header">
                        {{ $t('auth.registration') }}
                    </h1>
                    <div slot="body">
                        <el-form ref="registerForm" :rules="rules" :model="user">
                            <el-form-item prop="firstName">
                                <el-input v-model="user.firstName"
                                          type="text"
                                          v-bind:placeholder="$t('auth.first_name')"></el-input>
                            </el-form-item>
                            <el-form-item prop="lastName">
                                <el-input v-model="user.lastName"
                                          type="text"
                                          v-bind:placeholder="$t('auth.last_name')"></el-input>
                            </el-form-item>
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
                            <el-form-item prop="passwordConfirm">
                                <el-input v-model="user.passwordConfirm"
                                          type="password"
                                          v-bind:placeholder="$t('auth.password_confirm')"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button :loading="loading" type="primary" @click="register">{{ $t('auth.register') }}
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                {{ $t('auth.already_account') }}
                                <router-link :to="{ name: 'auth.login' }">{{ $t('auth.login') }}</router-link>
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
   * Register Index Page
   * ============
   *
   * Page where the user can register.
   */

  import authService from '@/services/auth';
  import { validatePassword, validatePasswordConfirm } from '@/utils/validators';

  export default {

    data() {
      return {
        user: {
          firstName: null,
          lastName: null,
          email: null,
          passwordConfirm: null,
          password: null,
        },
        rules: {
          firstName: [
            { required: true, message: this.$t('validation.first_name.required'), trigger: 'blur' },
            { min: 3, message: this.$t('validation.first_name.min'), trigger: 'blur' },
          ],
          lastName: [
            { required: true, message: this.$t('validation.last_name.required'), trigger: 'blur' },
            { min: 3, message: this.$t('validation.last_name.min'), trigger: 'blur' },
          ],
          email: [
            { required: true, message: this.$t('validation.email.required'), trigger: 'blur' },
            { type: 'email', message: this.$t('validation.email.valid') },
          ],
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

    methods: {
      register() {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            authService.register(this.user);
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },

      validatePass(rule, value, callback) {
        validatePassword(rule, value, callback, this, 'registerForm');
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
