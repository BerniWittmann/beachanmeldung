<template>
    <v-layout>
        <div slot="header" class="team-header">
            <h1>
                {{ team.completeName }}
            </h1>
        </div>
        <el-row class="team-body">
            <el-col>
                <el-row>
                    <el-col>
                        <el-steps :active="currentStep" finish-status="wait" process-status="success" align-center
                                  :direction="currentStepLayoutDirection">
                            <el-step title="Vorläufige Anmeldung"></el-step>
                            <el-step title="Auf Warteliste"></el-step>
                            <el-step title="Angemeldet" description="Nicht Bezahlt"></el-step>
                            <el-step title="Angemeldet" description="Bezahlt"></el-step>
                            <el-step title="Mannschaftsliste hochgeladen"></el-step>
                        </el-steps>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span: 16, offset: 4}" :md="{span: 18, offset: 3}" :sm="{span: 22, offset: 1}"
                            :xs="{span: 24, offset: 0}">
                        <el-table
                                :data="tableData"
                                fit :show-header="false"
                                style="width: 100%">
                            <el-table-column
                                    prop="label"
                                    align="center">
                            </el-table-column>
                            <el-table-column
                                    prop="value"
                                    align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isPaidRow">
                                        <el-checkbox v-model="hasPaid" border @change="triggerPaidChange" :disabled="!isStaff">
                                            <span v-if="hasPaid">
                                                Bezahlt
                                            </span>
                                            <span v-else>
                                                Nicht Bezahlt
                                            </span>
                                        </el-checkbox>
                                    </span>
                                    <span v-else>
                                        {{ scope.row.value }}
                                        <span v-if="scope.row.isTrainerRow && isStaff"> <a
                                                :href="`mailto:${trainer.email}`"><el-button
                                                size="mini" round icon="el-icon-message"></el-button></a></span>
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <h2 class="text-center">Aktionen</h2>
                        <el-row>
                            <el-col class="team-action-buttons">
                                <el-button>Bearbeiten</el-button>
                                <el-button type="primary" @click="teamTransitionStateSignup(team.id)"
                                           v-if="isStaff && displayButtonSignup">Anmeldung Bestätigen
                                </el-button>
                                <el-button type="warning" @click="teamTransitionStateWaiting(team.id)"
                                           v-if="isStaff && displayButtonWaitlist">Auf Warteliste Setzen
                                </el-button>
                                <el-button type="success" @click="teamTransitionStatePaid(team.id)" v-if="isStaff && !hasPaid">
                                    Als Bezahlt markieren
                                </el-button>
                                <el-button type="info" @click="teamTransitionStateUnpaid(team.id)" v-if="isStaff && hasPaid">
                                    Als Nicht Bezahlt markieren
                                </el-button>
                                <el-button type="danger" @click="teamTransitionStateDenied(team.id)">Abmelden
                                </el-button>
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
   * Team Single Page
   * ============
   *
   * A page which displays a single Team
   */

  import { teamStates } from '@/utils/constants';
  import TeamStateTransitionMixin from '@/mixins/teamStateTransitions';

  export default {
    components: {
      VLayout: require('@/layouts/default.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
    },

    mixins: [
      TeamStateTransitionMixin,
    ],

    data() {
      return {
        currentStepLayoutDirection: 'horizontal',
      };
    },

    computed: {
      team() {
        return this.$store.state.team.activeTeam;
      },

      trainer() {
        return this.team.trainer || {};
      },

      isStaff() {
        return this.$store.state.account.isStaff;
      },

      currentStep() {
        switch (this.team.state) {
          case teamStates.needsApproval:
            return 0;
          case teamStates.waiting:
            return 1;
          case teamStates.signedUp:
            if (!this.team.paid) return 2;
            // TODO Check if player list already uploadded
            return 3;
          default:
            return 0;
        }
      },

      tableData() {
        return [{
          label: 'Name',
          value: this.team.completeName,
        }, {
          label: 'Turnier',
          value: `${this.team.tournament.name} (${this.team.tournament.gender})`,
        }, {
          label: 'Verantwortlicher',
          value: `${this.trainer.firstName} ${this.trainer.lastName}`,
          isTrainerRow: true,
        }, {
          label: 'Angemeldet am',
          value: this.team.dateSignup.format('DD.MM.YYYY HH:mm'),
        }, {
          label: 'Bezahlt',
          value: this.team.paid,
          isPaidRow: true,
        }];
      },

      displayButtonSignup() {
        return [
          teamStates.needsApproval,
          teamStates.waiting,
          teamStates.denied,
        ].includes(this.team.state);
      },

      displayButtonWaitlist() {
        return [
          teamStates.needsApproval,
          teamStates.signedUp,
          teamStates.denied,
        ].includes(this.team.state);
      },

      hasPaid() {
        return this.team.paid;
      },
    },

    methods: {
      handleWindowResize() {
        this.currentStepLayoutDirection = document.documentElement.clientWidth <= 1000 ? 'vertical' : 'horizontal';
      },

      triggerPaidChange() {
        if (this.team.paid) {
          this.teamTransitionStateUnpaid(this.team.id);
        } else {
          this.teamTransitionStatePaid(this.team.id);
        }
      },
    },

    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.handleWindowResize);

        this.handleWindowResize();
      });
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
  };
</script>
