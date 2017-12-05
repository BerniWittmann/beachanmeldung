<template>
    <el-card class="team-card" @click.native="navigateToTeam()">
        <div slot="header" class="header">
            <span class="team-name">{{ team.completeName }}</span>
            <span class="team-status">{{ $t(`team.status.${team.state.replace(' ', '_')}`) }}
                <el-tooltip :content="paymentText" placement="top">
                    <span :class="paymentClasses"><i class="fa fa-lg fa-money"></i></span>
                </el-tooltip>
                 <el-tooltip :content="listUploadText" placement="top">
                    <span :class="listUploadClasses"><i class="fa fa-lg fa-list"></i></span>
                </el-tooltip>
            </span>
        </div>
        <div class="body">
            <span class="team-tournament-name">
                <v-tournament-name :tournament="team.tournament"></v-tournament-name>
            </span>
            <span class="team-tournament-button">
                <v-link-button size="small" :route="routeConfigTeamPage">
                    {{ $t('team.edit') }}
                </v-link-button>
            </span>
        </div>
    </el-card>
</template>

<script>
  /* ============
   * Team Card Component
   * ============
   *
   * A Card component that displays a single Team
   *
   */

  export default {
    props: {
      team: {
        type: Object,
        required: true,
      },
    },

    components: {
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
    },

    methods: {
      navigateToTeam() {
        this.$router.push(this.routeConfigTeamPage);
      },
    },

    computed: {
      paymentClasses() {
        return this.team.paid ? 'team-status-positive' : 'team-status-negative';
      },
      listUploadClasses() {
        return this.team.hasPlayers ? 'team-status-positive' : 'team-status-negative';
      },
      paymentText() {
        return this.team.paid ? this.$t('team.paid') : this.$t('team.not_paid');
      },
      listUploadText() {
        return this.team.hasPlayers ? this.$t('team.list_uploaded') : this.$t('team.list_not_uploaded');
      },

      routeConfigTeamPage() {
        return {
          name: 'team.single',
          params: {
            tournamentID: this.team.tournament.id,
            teamID: this.team.id,
          },
        };
      },
    },
  };

</script>
