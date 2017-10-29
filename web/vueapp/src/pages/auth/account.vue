<template>
    <v-layout>
        <el-row slot="side">
            <v-panel contextual-style="primary">
                <div slot="body">
                    <h3>{{ fullName }}</h3>
                    <h4>
                        <i class="fa fa-fw fa-envelope"></i>
                        {{ account.email }}
                    </h4>
                    <p class="account-page-side-resend-verification" v-if="!account.isVerified">{{ $t('account.please_verify') }} <a href="" @click.prevent="resendVerification()">{{ $t('account.resend_verification') }}</a></p>
                </div>
            </v-panel>
        </el-row>
        <el-row>
            <el-col>
                <v-editing-panel contextual-style="primary" :onSave="save" :onAbort="abort" class="account-page-main">
                    <span slot="header">
                        {{ $t('account.details') }}
                    </span>
                    <div slot="body">
                        <p>{{ dateJoined }}</p>
                    </div>
                    <div slot="bodyEditing">
                        <el-form ref="accountEditForm" :rules="rules" :model="user">
                            <el-form-item prop="firstName">
                                <el-input v-model="user.firstName"
                                          type="text"
                                          v-bind:placeholder="$t('account.first_name')"></el-input>
                            </el-form-item>
                            <el-form-item prop="lastName">
                                <el-input v-model="user.lastName"
                                          type="text"
                                          v-bind:placeholder="$t('account.last_name')"></el-input>
                            </el-form-item>
                            <el-form-item prop="email">
                                <el-input v-model="user.email"
                                          type="email"
                                          v-bind:placeholder="$t('account.email')"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </v-editing-panel>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * Account Index Page
   * ============
   *
   * Page where the user can view the account information.
   */

  import accountService from '@/services/account';
  import authService from '@/services/auth';

  export default {
    components: {
      VLayout: require('@/layouts/backgroundWithSide.vue'),
      VPanel: require('@/components/panel.vue'),
      VEditingPanel: require('@/components/editingPanel.vue'),
    },

    data() {
      return {
        user: {
          firstName: undefined,
          lastName: undefined,
          email: undefined,
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
        },
      };
    },

    computed: {
      account() {
        const account = this.$store.state.account;
        this.user = { ...account };
        return account;
      },

      fullName() {
        const { firstName, lastName } = this.account;
        if (!firstName && !lastName) return undefined;
        if (!firstName) return lastName;
        if (!lastName) return firstName;
        return `${this.account.firstName} ${this.account.lastName}`;
      },

      dateJoined() {
        if (!this.account.dateJoined) return undefined;
        return `${this.$t('account.date_joined')}: ${this.account.dateJoined.format('DD.MM.YYYY')}`;
      },
    },

    methods: {
      save() {
        accountService.update(this.user);
      },

      abort() {
        this.user = { ...this.account };
      },

      resendVerification() {
        authService.resendVerification();
      },
    },
  };
</script>
