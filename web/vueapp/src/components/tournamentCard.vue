<template>
    <el-card class="tournament-card" @click.native="navigateToTournament()">
        <div slot="header" class="header">
            <span class="tournament-name"><v-tournament-name :tournament="tournament"></v-tournament-name></span>
            <el-popover
                    placement="top"
                    :title="$t('tournament.signup_not_open.title')"
                    trigger="hover"
                    :disabled="tournament.signupOpen">
                <span v-show="tournament.isBeforeSignup">{{ $t('tournament.signup_not_open.before_signup', getDateTime('startSignup'))
                    }}</span>
                <span v-show="tournament.isAfterSignup">{{ $t('tournament.signup_not_open.after_signup', getDateTime('deadlineSignup'))
                    }}</span>
                <v-link-button slot="reference"
                               :route="{ name: 'tournament.single', params: { tournamentID: tournament.id }}">
                    {{ $t('tournament.register_team') }}
                </v-link-button>
            </el-popover>
        </div>
        <div class="body">
            <span><i class="el-icon-date"></i> {{ tournament.tournamentDate }}</span>
            <span>€ {{ tournament.startingFee }}</span>
        </div>
    </el-card>
</template>

<script>
  /* ============
   * Tournament Card Component
   * ============
   *
   * A Card component that displays a single Tournament
   *
   */

  import { getDateTimeByKey } from '@/utils/helpers';

  export default {
    props: {
      tournament: {
        type: Object,
        required: true,
      },
    },

    components: {
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
    },

    methods: {
      getDateTime(key) {
        return getDateTimeByKey(this.tournament, key);
      },

      navigateToTournament() {
        this.$router.push({ name: 'tournament.single', params: { tournamentID: this.tournament.id } });
      },
    },
  };

</script>
