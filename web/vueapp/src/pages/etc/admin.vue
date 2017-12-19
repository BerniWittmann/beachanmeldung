<template>
    <v-layout>
        <el-row class="home-part home-part-image">
            <div class="home-header-image">
                <h1>{{ $t('general.header.title', { currentYear: currentYear }) }}</h1>
                <h2>{{ $t('general.header.subtitle') }}</h2>
            </div>
        </el-row>

        <el-row class="home-part">
            <el-col :span="24">
                <h1>{{ $t('etc.admin.headline') }}</h1>
                <el-row>
                    <el-col class="center">
                        <h2><v-link-button href="/admin/" plain icon="el-icon-setting">{{ $t('etc.admin.to_django_admin') }}</v-link-button></h2>
                        <p>{{ $t('etc.admin.django_explanation') }}</p>
                        <br>
                        <el-row>
                            <h2>{{ $t('etc.admin.other_actions') }}</h2>
                            <el-col class="team-action-buttons">
                                <v-download-excel :data="playerListData" :fields="playerListFields" :name="playerListFileName" type="csv" :meta="playerListFileMeta">
                                    <el-button plain type="primary" icon="el-icon-download">{{ $t('etc.admin.download_all_players') }}</el-button>
                                </v-download-excel>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * etc Admin Page
   * ============
   *
   * The admin page.
   */
  import moment from 'moment';

  export default {
    components: {
      VLayout: require('@/layouts/fullWidth.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
    },

    computed: {
      currentYear() {
        return moment().format('YYYY');
      },

      players() {
        return this.$store.state.player.players;
      },

      playerListFileName() {
        return `${this.$t('nav.name').replace(/ /g, '_')}.csv`;
      },

      playerListData() {
        return this.players.map(single => ({
          id: single.id,
          number: single.number,
          firstName: single.firstName,
          lastName: single.lastName,
          yearOfBirth: single.yearOfBirth,
          teamID: single.teamID,
          teamName: single.teamName,
          teamBeachName: single.teamBeachName,
          teamState: this.$t(`team.status.${single.teamState.replace(/ /g, '_')}`),
          tournamentName: single.tournamentName,
        }));
      },
    },

    data() {
      return {
        playerListFields: {
          id: this.$t('player.id'),
          number: this.$t('player.number'),
          firstName: this.$t('player.first_name'),
          lastName: this.$t('player.last_name'),
          yearOfBirth: this.$t('player.year_of_birth'),
          teamID: this.$t('player.team_id'),
          teamName: this.$t('player.team_name'),
          teamBeachName: this.$t('player.team_beachname'),
          teamState: this.$t('player.team_state'),
          tournamentName: this.$t('player.tournament_name'),
        },
        playerListFileMeta: [
          [{
            key: 'charset',
            value: 'utf-8',
          }],
        ],
      };
    },
  };
</script>
