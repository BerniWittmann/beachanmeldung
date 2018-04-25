<template>
    <v-layout>
        <div slot="header" class="tournament-signup-header">
            <h1>
                {{ $t('team.register') }}
            </h1>
        </div>
        <el-row class="tournament-signup-body">
            <el-col>
                <v-wizard :steps="steps" :current-step="currentStep">
                    <div slot="step_0" v-if="!loginOption" class="text-center">
                        <p>{{ $t('team.signup.account.text') }}</p>
                        <el-row :gutter="20">
                            <el-col :xl="12" :lg="12" :md="12" :xs="24">
                                <el-button @click="loginOption = 'login'">{{ $t('team.signup.account.login') }}
                                </el-button>
                            </el-col>
                            <el-col :xl="12" :lg="12" :md="12" :xs="24">
                                <el-button @click="loginOption = 'register'">{{ $t('team.signup.account.register') }}
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <br/><br/>
                        </el-row>
                    </div>
                    <div slot="step_0" v-else-if="loginOption === 'login'">
                        <el-row>
                            <el-col :xl="{ span: 10, offset: 7}" :lg="{ span: 12, offset: 6}"
                                    :md="{ span: 16, offset: 4}" :xs="{ span: 24, offset: 0}">
                                <h2>{{ $t('team.signup.account.login') }}</h2>

                                <el-form :rules="rules" :model="user" ref="loginForm">
                                    <el-form-item prop="email">
                                        <el-input v-model="user.email"
                                                  type="email" @keyup.native.enter="login"
                                                  v-bind:placeholder="$t('auth.email')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input v-model="user.password"
                                                  type="password" @keyup.native.enter="login"
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
                                            <router-link :to="{ name: 'auth.password-forgot' }">
                                                {{ $t('auth.forgot_password')
                                                }}
                                            </router-link>
                                        </el-col>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>
                    <div slot="step_0" v-else-if="loginOption === 'register'">
                        <el-row>
                            <el-col :xl="{ span: 10, offset: 7}" :lg="{ span: 12, offset: 6}"
                                    :md="{ span: 16, offset: 4}" :xs="{ span: 24, offset: 0}">
                                <h2>{{ $t('team.signup.account.register') }}</h2>

                                <el-form ref="registerForm" :rules="rules" :model="user">
                                    <el-form-item prop="firstName">
                                        <el-input v-model="user.firstName"
                                                  type="text" @keyup.native.enter="register"
                                                  v-bind:placeholder="$t('auth.first_name')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="lastName">
                                        <el-input v-model="user.lastName"
                                                  type="text" @keyup.native.enter="register"
                                                  v-bind:placeholder="$t('auth.last_name')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="email">
                                        <el-input v-model="user.email"
                                                  type="email" @keyup.native.enter="register"
                                                  v-bind:placeholder="$t('auth.email')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="phone">
                                        <el-input v-model="user.phone"
                                                  type="phone" @keyup.native.enter="register"
                                                  v-bind:placeholder="$t('auth.phone')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input v-model="user.password"
                                                  type="password" @keyup.native.enter="register"
                                                  v-bind:placeholder="$t('auth.password')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="passwordConfirm">
                                        <el-input v-model="user.passwordConfirm"
                                                  type="password" @keyup.native.enter="register"
                                                  v-bind:placeholder="$t('auth.password_confirm')"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button :loading="loading" type="primary" @click="register">{{ $t('auth.register') }}
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>
                    <div slot="step_1">
                        <h2>{{ $t('team.signup.tournament.title') }}</h2>
                        <div class="tournament-buttons">
                            <el-button :loading="loading" v-for="tournament in tournaments" :key="`tournament_button_${tournament.id}`" @click="chooseTournament(tournament)">
                                <v-tournament-name :tournament="tournament"></v-tournament-name>
                            </el-button>
                        </div>

                        <p v-if="tournaments.length === 0">{{ $t('team.signup.tournament.none_open') }}</p>
                    </div>
                    <div slot="step_2">
                        <h2>{{ $t('team.signup.teaminfo.title') }}</h2>
                        <el-form :rules="rules" :model="team" ref="teamEditForm">
                            <el-row>
                                <el-col :lg="{span: 16, offset: 4}" :md="{span: 18, offset: 3}"
                                        :sm="{span: 20, offset: 2}"
                                        :xs="{span: 24, offset: 0}">
                                    <el-form-item prop="name">
                                        <el-input v-model="team.name"
                                                  type="text" @keyup.native.enter="saveTeamInfo"
                                                  v-bind:placeholder="$t('team.name')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="beachname">
                                        <el-input v-model="team.beachname"
                                                  type="text" @keyup.native.enter="saveTeamInfo"
                                                  v-bind:placeholder="$t('team.beachname_placeholder')"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button :loading="loading" type="primary" @click="saveTeamInfo">
                                            {{ $t('team.signup.teaminfo.save') }}
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div slot="step_3">
                        <h2>{{ $t('team.signup.confirmation.title') }}</h2>
                        <p><b>{{ $t('team.signup.confirmation.starting_fee', { amount: startingFee }) }}</b></p>
                        <p v-html="termsOfParticipation"></p>
                        <el-button :loading="loading" type="success" @click="confirm">
                            {{ $t('team.signup.confirmation.save') }}
                        </el-button>
                    </div>
                </v-wizard>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * Team Signup Page
   * ============
   *
   * A page to register a Team
   */

  import authService from '@/services/auth';
  import tournamentService from '@/services/tournament';
  import teamService from '@/services/team';
  import { validatePassword, validatePasswordConfirm } from '@/utils/validators';

  export default {
    components: {
      VLayout: require('@/layouts/default.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
      VWizard: require('@/components/wizard.vue'),
    },

    data() {
      return {
        currentStep: 0,
        steps: [
          {
            stepTitle: this.$t('team.signup.state.account'),
          },
          {
            stepTitle: this.$t('team.signup.state.tournament'),
          },
          {
            stepTitle: this.$t('team.signup.state.teaminfo'),
          },
          {
            stepTitle: this.$t('team.signup.state.confirm'),
          },
        ],
        loginOption: undefined,
        user: {
          email: undefined,
          password: undefined,
          passwordConfirm: undefined,
          firstName: undefined,
          lastName: undefined,
          phone: undefined,
        },
        team: {
          name: undefined,
          beachname: undefined,
          players: [],
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
          name: [
            { required: true, message: this.$t('validation.team_name.required'), trigger: 'blur' },
          ],
          beachname: [],
          phone: [
            { required: true, message: this.$t('validation.phone.required'), trigger: 'blur' },
            { type: 'string', pattern: /^\+?1?\d{9,15}$/, message: this.$t('validation.phone.valid') },
          ],
        },
      };
    },

    computed: {
      termsOfParticipation() {
        return this.$store.state.config.termsOfParticipation.replace('{link}', this.advertisementUrl);
      },

      isLoggedIn() {
        return this.$store.state.auth.authenticated;
      },

      currentTournament() {
        return this.$store.state.tournament.activeTournament;
      },

      startingFee() {
        return this.currentTournament ? this.currentTournament.startingFee : undefined;
      },

      advertisementUrl() {
        return this.currentTournament ? this.currentTournament.advertisementUrl : undefined;
      },

      initialStep() {
        if (!this.isLoggedIn) return 0;
        if (!this.currentTournament) return 1;
        return 2;
      },

      tournaments() {
        return this.$store.state.tournament.tournaments.filter(t => t.signupOpen);
      },

      loading() {
        return this.$store.getters['loading/isLoading'];
      },
    },

    methods: {
      confirm() {
        this.team.tournamentID = this.currentTournament.id;
        teamService.create(this.team).then((team) => {
          this.currentStep = 4;
          this.$router.push({
            name: 'team.single',
            params: {
              tournamentID: team.tournament.id,
              teamID: team.id,
            },
          });
        }, () => {
          this.currentStep = 2;
        });
      },

      chooseTournament(tournament) {
        tournamentService.setCurrentSignupTournament(tournament.id).then(this.nextStep);
      },

      saveTeamInfo() {
        this.$refs.teamEditForm.validate((valid) => {
          if (valid) {
            this.nextStep();
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },

      login() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            authService.login(this.user, { noredirect: true }).then(this.nextStep, () => {
            });
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },

      register() {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            authService.register(this.user, { noredirect: true }).then(() => {
              authService.login(this.user, { noredirect: true }).then(this.nextStep, () => {});
            }, () => {
            });
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },

      validatePass(rule, value, callback) {
        if (this.loginOption === 'login') return callback();
        return validatePassword(rule, value, callback, this, 'registerForm');
      },

      validatePass2(rule, value, callback) {
        validatePasswordConfirm(rule, value, callback, this);
      },

      nextStep() {
        if (this.currentStep < this.steps.length - 1) {
          this.currentStep += 1;
        }
        // skip tournament choose if already chosen
        if (this.currentStep === 1 && this.currentTournament) {
          this.currentStep += 1;
        }
      },
    },

    beforeMount() {
      this.currentStep = this.initialStep;
    },
  };
</script>
