<template>
    <v-layout>
        <div slot="header" class="tournament-header">
            <h1>
                <v-tournament-name :tournament="tournament"></v-tournament-name>
            </h1>
            <span class="tournament-header-right">
                <v-link-button :disabled="!isSignupOpen" slot="reference">
                    {{ $t('tournament.register_team') }}
                </v-link-button>
                <p v-if="isBeforeSignup">
                    {{ $t('tournament.signup_not_open.before_signup', getDateTime('startSignup')) }}
                </p>
                <p v-if="isAfterSignup">
                    {{ $t('tournament.signup_not_open.after_signup', getDateTime('deadlineSignup')) }}
                </p>
            </span>
        </div>
        <el-row class="tournament-body">
            <el-col>
                <div class="tournament-body-information">
                    <el-row>
                        <el-col class="tournament-body-information-row" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.date_of_tournament')" placement="top-start">
                                <i class="el-icon-date"></i>
                            </el-tooltip>
                            <p>{{ tournamentDate }}</p>
                        </el-col>
                        <el-col class="tournament-body-information-row" :xl="4" :lg="4" :md="4" :sm="12" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.starting_fee')" placement="top-start">
                                <i>€</i>
                            </el-tooltip>
                            <p>{{ tournament.startingFee }}</p>
                        </el-col>
                        <el-col class="tournament-body-information-row" :xl="4" :lg="4" :md="4" :sm="12" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.number_of_places')" placement="top-start">
                                <i class="el-icon-tickets"></i>
                            </el-tooltip>
                            <p>12</p>
                        </el-col>
                        <el-col class="tournament-body-information-row" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.deadline_signup')" placement="top-start">
                                <i class="el-icon-edit-outline"></i>
                            </el-tooltip>
                            <p>{{ $t('tournament.display_date_time', { datetime: tournament.deadlineSignup.format('DD.MM.YYYY HH:mm') } ) }}</p>
                        </el-col>
                    </el-row>
                </div>
                <div class="tournament-body-contact-buttons">
                    <a :href="tournament.advertisementUrl" target="_blank">
                        <el-button type="info" icon="el-icon-document" round>{{ $t('tournament.advertisement') }}</el-button>
                    </a>
                    <a :href="`mailto:${tournament.contactEmail}`">
                        <el-button type="info" icon="el-icon-message" round>{{ $t('tournament.contact') }}</el-button>
                    </a>
                </div>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * Tournament Single Page
   * ============
   *
   * A page which displays a single tournament
   */

  import moment from 'moment';

  export default {
    components: {
      VLayout: require('@/layouts/default.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
    },

    computed: {
      tournament() {
        return this.$store.state.tournament.activeTournament;
      },

      tournamentDate() {
        if (this.tournament.startDate.isSame(this.tournament.endDate, 'day')) {
          return this.tournament.startDate.format('DD.MM.YYYY');
        }
        return `${this.tournament.startDate.format('DD.MM.YYYY')} - ${this.tournament.endDate.format('DD.MM.YYYY')}`;
      },

      isSignupOpen() {
        return this.tournament.signupOpen;
      },

      isBeforeSignup() {
        return !this.isSignupOpen && moment().isBefore(this.tournament.startSignup);
      },

      isAfterSignup() {
        return !this.isSignupOpen && moment().isAfter(this.tournament.deadlineSignup);
      },
    },

    methods: {
      getDateTime(key) {
        const datetime = this.tournament[key];
        return {
          date: datetime.format('DD.MM.YYYY'),
          time: datetime.format('HH:mm'),
        };
      },
    },
  };
</script>
