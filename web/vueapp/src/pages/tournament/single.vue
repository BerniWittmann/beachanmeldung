<template>
    <v-layout>
        <div slot="header" class="tournament-header">
            <h1>
                <v-tournament-name :tournament="tournament"></v-tournament-name>
            </h1>
            <span class="tournament-header-right">
                <v-link-button :disabled="!tournament.signupOpen" slot="reference"
                               :route="{ name: 'team.register', query: { tournament: tournament.id } }">
                    {{ $t('tournament.register_team') }}
                </v-link-button>
                <p v-if="tournament.isBeforeSignup">
                    {{ $t('tournament.signup_not_open.before_signup', getDateTime('startSignup')) }}
                </p>
                <p v-else-if="tournament.isAfterSignup">
                    {{ $t('tournament.signup_not_open.after_signup', getDateTime('deadlineSignup')) }}
                </p>
                <p v-else-if="tournament.fewPlacesLeft" class="tournament-header-note-big">
                    {{ $tc('tournament.few_places_left', tournament.freePlaces, { amount: tournament.freePlaces }) }}
                </p>
                <p v-else-if="tournament.noPlacesLeft" class="tournament-header-note-big">
                    {{ $t('tournament.no_places_left') }}
                </p>
            </span>
        </div>
        <el-row class="tournament-body">
            <el-col>
                <div class="tournament-body-information">
                    <el-row>
                        <el-col class="tournament-body-information-row" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.date_of_tournament')"
                                        placement="top-start">
                                <i class="el-icon-date"></i>
                            </el-tooltip>
                            <p>{{ tournament.tournamentDate }}</p>
                        </el-col>
                        <el-col class="tournament-body-information-row" :xl="4" :lg="4" :md="4" :sm="12" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.starting_fee')"
                                        placement="top-start">
                                <i>€</i>
                            </el-tooltip>
                            <p>{{ tournament.startingFee }}</p>
                        </el-col>
                        <el-col class="tournament-body-information-row" :xl="4" :lg="4" :md="4" :sm="12" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.number_of_places')"
                                        placement="top-start">
                                <i class="el-icon-tickets"></i>
                            </el-tooltip>
                            <p>{{ tournament.numberOfPlaces }}</p>
                        </el-col>
                        <el-col class="tournament-body-information-row" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                            <el-tooltip class="item" effect="dark" :content="$t('tournament.deadline_signup')"
                                        placement="top-start">
                                <i class="el-icon-edit-outline"></i>
                            </el-tooltip>
                            <p>
                                {{ $t('tournament.display_date_time', { datetime: tournament.deadlineSignup.format('DD.MM.YYYY HH:mm') })
                                }}</p>
                        </el-col>
                    </el-row>
                </div>
                <div class="tournament-body-contact-buttons">
                    <a :href="tournament.advertisementUrl" target="_blank">
                        <el-button type="info" icon="el-icon-document" round>{{ $t('tournament.advertisement') }}
                        </el-button>
                    </a>
                    <a :href="`mailto:${tournament.contactEmail}`">
                        <el-button type="info" icon="el-icon-message" round>{{ $t('tournament.contact') }}</el-button>
                    </a>
                </div>
                <div class="tournament-body-lists">
                    <h2>{{ $t('tournament.list_signed_up') }}</h2>
                    <v-team-teable :teams="signedUpTeams" :max-count="tournament.numberOfPlaces"></v-team-teable>
                    <br>
                    <div v-if="isStaff">
                        <h2>{{ $t('tournament.list_waiting') }}</h2>
                        <v-team-teable :teams="waitingTeams"></v-team-teable>
                    </div>
                </div>
                <div class="tournament-body-actions" v-if="isStaff">
                    <el-col class="team-action-buttons">
                        <v-download-excel :data="teamListData" :fields="teamListFields" :name="teamListFileName"
                                          type="csv"
                                          :meta="teamListFileMeta">
                            <el-button plain type="primary" icon="el-icon-download">{{ $t('tournament.download_teams')
                                }}
                            </el-button>
                        </v-download-excel>
                    </el-col>
                    <el-col class="team-action-buttons">
                        <v-link-button plain
                                       :route="{ name: 'etc.admin', query: { type: 'payment', checked: [this.tournament.id] } }">
                            {{ $t('etc.admin.send_payment_reminder') }}
                        </v-link-button>
                        <v-link-button plain
                                       :route="{ name: 'etc.admin', query: { type: 'player_list', checked: [this.tournament.id] } }">
                            {{ $t('etc.admin.send_player_list_reminder') }}
                        </v-link-button>
                    </el-col>
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

  import { getDateTimeByKey } from '@/utils/helpers';
  import { teamStates, waitingListTeamStates } from '@/utils/constants';

  export default {
    components: {
      VLayout: require('@/layouts/default.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
      VTeamTeable: require('@/components/teamTable.vue'),
    },

    computed: {
      tournament() {
        return this.$store.state.tournament.activeTournament;
      },

      teams() {
        return this.$store.getters['team/teamsByTournament'](this.tournament.id);
      },

      signedUpTeams() {
        return this.teams.filter(single => single.state === teamStates.signedUp);
      },

      waitingTeams() {
        return this.teams.filter(single => waitingListTeamStates.includes(single.state));
      },

      isStaff() {
        return this.$store.state.account.isStaff;
      },

      teamListFileName() {
        return `${this.tournament.name.replace(/ /g, '_')}_${this.tournament.gender}.csv`;
      },

      teamListData() {
        return this.teams.map(t => ({
          name: t.name,
          beachname: t.beachname,
          countPlayers: t.players.length,
          hasPaid: t.paid,
          state: this.$t(`team.status.${t.state.replace(/ /g, '_')}`),
          dateSignup: t.dateSignup.format('DD.MM.YYYY'),
          trainerFirstName: t.trainer ? t.trainer.firstName : undefined,
          trainerLastName: t.trainer ? t.trainer.lastName : undefined,
          trainerEmail: t.trainer ? t.trainer.email : undefined,
          trainerPhone: t.trainer ? t.trainer.phone : undefined,
        }));
      },
    },

    methods: {
      getDateTime(key) {
        return getDateTimeByKey(this.tournament, key);
      },
    },

    data() {
      return {
        teamListFields: {
          name: this.$t('team.name'),
          beachname: this.$t('team.beachname'),
          countPlayers: this.$t('team.count_players'),
          hasPaid: this.$t('team.has_paid'),
          state: this.$t('team.state'),
          dateSignup: this.$t('team.date_signup'),
          trainerFirstName: this.$t('team.trainer_first_name'),
          trainerLastName: this.$t('team.trainer_last_name'),
          trainerEmail: this.$t('team.trainer_email'),
          trainerPhone: this.$t('team.trainer_phone'),
        },
        teamListFileMeta: [
          [{
            key: 'charset',
            value: 'utf-8',
          }],
        ],
      };
    },
  };
</script>
