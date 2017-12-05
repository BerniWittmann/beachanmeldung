<template>
    <v-layout>
        <div slot="header" class="team-header">
            <h1>
                {{ $t('team.register') }}
            </h1>
        </div>
        <el-row class="team-body">
            <el-col>
                <el-row>
                    <el-col>
                        <el-steps :active="currentStep" align-center finishStatus="success"
                                  :direction="currentStepLayoutDirection">
                            <el-step :title="$t('team.signup.state.account')"></el-step>
                            <el-step :title="$t('team.signup.state.tournament')"></el-step>
                            <el-step :title="$t('team.signup.state.teaminfo')"></el-step>
                            <el-step :title="$t('team.signup.state.confirm')"></el-step>
                        </el-steps>
                    </el-col>
                </el-row>
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

  import StepLayoutDirectionMixin from '@/mixins/stepLayoutDirection';


  export default {
    components: {
      VLayout: require('@/layouts/default.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
    },

    mixins: [
      StepLayoutDirectionMixin,
    ],

    data() {
      return {
        currentStep: 0,
      };
    },

    computed: {
      isLoggedIn() {
        return this.$store.state.auth.authenticated;
      },

      currentTournament() {
        return this.$store.state.tournament.activeTournament;
      },
    },

    methods: {
      nextStep() {
        this.currentStep += 1;
      },
    },
  };
</script>
