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
                    <h4>
                        <i class="fa fa-fw fa-phone"></i>
                        {{ account.phone }}
                    </h4>
                    <p class="account-page-side-resend-verification" v-if="!account.isVerified">
                        {{ $t('account.please_verify') }} <a href=""
                                                             @click.prevent="resendVerification()">{{ $t('account.resend_verification')
                        }}</a></p>
                    <p v-if="account.isStaff">
                        <v-link-button :route="{ name: 'etc.admin' }" plain icon="el-icon-setting">{{ $t('account.to_admin_area') }}</v-link-button>
                    </p>
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
                        <el-row>
                            <el-col>
                                <p>{{ dateJoined }}</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <h2>{{ $t('team.mine') }}</h2>
                                <el-row>
                                    <el-col :span="16" :offset="4">
                                        <v-team-card v-for="team in teams" :team="team"
                                                     :key="`team_card_${team.id}`"></v-team-card>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
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
                            <el-form-item prop="phone">
                                <el-input v-model="user.phone"
                                          type="phone"
                                          v-bind:placeholder="$t('account.phone')"></el-input>
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
      VTeamCard: require('@/components/teamCard.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
    },

    data() {
      return {
        user: {
          firstName: undefined,
          lastName: undefined,
          email: undefined,
          phone: undefined,
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
          phone: [
            { required: true, message: this.$t('validation.phone.required'), trigger: 'blur' },
            { type: 'string', pattern: /^\+?1?\d{9,15}$/, message: this.$t('validation.phone.valid') },
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

      teams() {
        return this.$store.getters['team/teamsByUser'];
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
        sessionStorage.setItem('resent_verification', true);
      },
    },

    mounted() {
      if (this.$route.query.resend_verification === 'true') {
        this.resendVerification();
      }
    },
  };
</script>
