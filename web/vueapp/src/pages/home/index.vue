<template>
    <v-layout>
        <el-row class="home-part home-part-image">
            <div class="home-header-image">
                <h1>{{ $t('general.header.title', { currentYear: year }) }}</h1>
                <h2>{{ $t('general.header.subtitle') }}</h2>
            </div>
        </el-row>

        <el-row class="home-part">
            <el-col :span="24">
                <p v-html="welcomeText"></p>
                <v-link-button
                        type="primary"
                        size="large"
                        :route="{ name: 'team.register' }"
                >{{ $t('general.call_to_action') }}
                </v-link-button>
            </el-col>
        </el-row>

        <el-row class="home-part homepart-content-vertical">
            <el-col :span="24" v-if="currentUsersTeams && currentUsersTeams.length > 0">
                <h2>{{ $t('team.mine') }}</h2>
                <v-team-card v-for="team in currentUsersTeams" :key="'team_card_' + team.id" :team="team"></v-team-card>
            </el-col>

            <el-col :span="24">
                <h2>{{ $t('tournament.all_tournaments') }}</h2>
                <v-tournament-card v-for="tournament in tournaments" :key="'tournament_' + tournament.id" :tournament="tournament"></v-tournament-card>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * Home Index Page
   * ============
   *
   * The home index page.
   */

  export default {
    components: {
      VLayout: require('@/layouts/fullWidth.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentCard: require('@/components/tournamentCard'),
      VTeamCard: require('@/components/teamCard'),
    },

    computed: {
      year() {
        return this.$store.state.config.year;
      },

      welcomeText() {
        return this.$store.state.config.welcomeText;
      },

      tournaments() {
        return Object.assign([], this.$store.state.tournament.tournaments).sort((a, b) => {
          if (a.startDate.isBefore(b.startDate)) {
            return -1;
          } else if (a.startDate.isAfter(b.startDate)) {
            return 1;
          }
          return 0;
        });
      },

      currentUsersTeams() {
        return this.$store.getters['team/teamsByUser'] || [];
      },
    },
  };
</script>
