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
                            <el-step :title="$t('team.states.preliminary_signup')"></el-step>
                            <el-step :title="$t('team.states.waitlist')"></el-step>
                            <el-step :title="$t('team.states.signed_up')"
                                     :description="$t('team.states.not_paid')"></el-step>
                            <el-step :title="$t('team.states.signed_up')"
                                     :description="$t('team.states.paid')"></el-step>
                            <el-step :title="$t('team.states.uploaded_player_list')"></el-step>
                        </el-steps>
                    </el-col>
                    <el-col v-if="teamIsDenied">
                        <el-alert
                                :title="$t('team.states.denied_description')"
                                type="error" :closable="false"
                                show-icon center>
                        </el-alert>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span: 18, offset: 3}" :md="{span: 18, offset: 3}" :sm="{span: 22, offset: 1}"
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
                                        <el-checkbox v-model="hasPaid" border @change="triggerPaidChange"
                                                     :disabled="!isStaff">
                                            <span v-if="hasPaid">
                                                {{ $t('team.states.paid') }}
                                            </span>
                                            <span v-else>
                                                {{ $t('team.states.not_paid') }}
                                            </span>
                                        </el-checkbox>
                                    </span>
                                    <span v-else-if="scope.row.isListUploadRow">
                                        <el-checkbox v-model="hasUploaded" border>
                                            <span v-if="hasUploaded">
                                                {{ $t('team.list_uploaded') }}
                                            </span>
                                            <span v-else>
                                                {{ $t('team.list_not_uploaded') }}
                                            </span>
                                        </el-checkbox>
                                    </span>
                                    <span v-else-if="scope.row.isTournamentRow">
                                        <v-tournament-name :tournament="scope.row.value.tournament"></v-tournament-name>
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
                <el-row v-if="!teamIsDenied">
                    <el-col>
                        <h2 class="text-center">{{ $t('team.actions.title') }}</h2>
                        <el-row>
                            <el-col class="team-action-buttons">
                                <v-link-button :route="{ name: 'team.edit', params: { teamID: team.id } }">
                                    {{ $t('team.edit') }}
                                </v-link-button>
                                <el-button type="primary" @click="teamTransitionStateSignup(team.id)"
                                           v-if="isStaff && displayButtonSignup">{{ $t('team.actions.confirm_signup') }}
                                </el-button>
                                <el-button type="warning" @click="teamTransitionStateWaiting(team.id)"
                                           v-if="isStaff && displayButtonWaitlist">
                                    {{ $t('team.actions.move_to_waitlist') }}
                                </el-button>
                                <el-button type="success" @click="teamTransitionStatePaid(team.id)"
                                           v-if="isStaff && !hasPaid">
                                    {{ $t('team.actions.mark_paid') }}
                                </el-button>
                                <el-button type="info" @click="teamTransitionStateUnpaid(team.id)"
                                           v-if="isStaff && hasPaid">
                                    {{ $t('team.actions.mark_unpaid') }}
                                </el-button>
                                <el-button type="danger" v-if="!teamIsDenied"
                                           @click="deleteDialogVisible = true">{{ $t('team.actions.sign_off.button') }}
                                </el-button>

                                <el-dialog
                                        :title="$t('team.actions.sign_off.title')"
                                        :visible.sync="deleteDialogVisible"
                                        width="30%"
                                        center>
                                    <span>{{ $t('team.actions.sign_off.message') }}</span>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="deleteDialogVisible = false">{{ $t('team.actions.sign_off.cancel') }}</el-button>
                                        <el-button type="danger"
                                                   @click="teamTransitionStateDenied(team.id); deleteDialogVisible = false">{{ $t('team.actions.sign_off.confirm') }}</el-button>
                                    </span>
                                </el-dialog>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span: 14, offset: 5}" :md="{span: 14, offset: 5}" :sm="{span: 16, offset: 4}"
                            :xs="{span: 24, offset: 0}">
                        <h2 class="text-center">{{ $t('team.player_list') }}</h2>
                        <el-table
                                :data="playerTableData"
                                fit
                                style="width: 100%">
                            <el-table-column
                                    prop="number"
                                    align="center"
                                    :label="$t('player.number')">
                            </el-table-column>
                            <el-table-column
                                    prop="firstName"
                                    align="center"
                                    :label="$t('player.first_name')">
                            </el-table-column>
                            <el-table-column
                                    prop="lastName"
                                    align="center"
                                    :label="$t('player.last_name')">
                            </el-table-column>
                            <el-table-column
                                    prop="birthDate"
                                    align="center"
                                    :label="$t('player.birth_date')">
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row v-if="isStaff">
                    <el-col class="team-action-buttons">
                        <v-download-excel :data="playerListData" :fields="playerListFields" :name="playerListFileName" type="csv" :meta="playerListFileMeta">
                            <el-button plain type="primary" icon="el-icon-download">{{ $t('team.download_player_list') }}</el-button>
                        </v-download-excel>
                    </el-col>
                    <el-col class="team-action-buttons">
                        <v-link-button icon="el-icon-bell" v-if="!team.paid" plain :route="{ name: 'etc.admin', query: { type: 'payment', checked: [this.team.id] } }">
                            {{ $t('etc.admin.send_payment_reminder') }}
                        </v-link-button>
                        <v-link-button icon="el-icon-tickets" v-if="!team.hasPlayers"  plain :route="{ name: 'etc.admin', query: { type: 'player_list', checked: [this.team.id] } }">
                            {{ $t('etc.admin.send_player_list_reminder') }}
                        </v-link-button>
                        <v-link-button icon="el-icon-message" plain :route="{ name: 'etc.admin', query: { type: 'email', checked: [this.team.id] } }">
                            {{ $t('etc.admin.send_email_reminder') }}
                        </v-link-button>
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
  import StepLayoutDirectionMixin from '@/mixins/stepLayoutDirection';

  export default {
    components: {
      VLayout: require('@/layouts/default.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
      VTournamentName: require('@/components/tournamentName.vue'),
    },

    mixins: [
      TeamStateTransitionMixin,
      StepLayoutDirectionMixin,
    ],

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
            if (this.team.hasPlayers) return 4;
            return 3;
          default:
            return -1;
        }
      },

      playerListFileName() {
        return `${this.team.completeName.replace(/ /g, '_')}.csv`;
      },

      playerListData() {
        return this.team.players.map(single => ({
          number: single.number,
          firstName: single.firstName,
          lastName: single.lastName,
          birthDate: single.birthDate.format('DD.MM.YYYY'),
        }));
      },

      tableData() {
        return [{
          label: this.$t('team.name'),
          value: this.team.completeName,
        }, {
          label: this.$t('team.tournament'),
          value: this.team,
          isTournamentRow: true,
        }, {
          label: this.$t('team.person_of_responsibility'),
          value: `${this.trainer.firstName} ${this.trainer.lastName}`,
          isTrainerRow: true,
        }, {
          label: this.$t('team.date_signup'),
          value: this.team.dateSignup.format('DD.MM.YYYY HH:mm'),
        }, {
          label: this.$t('team.paid'),
          value: this.team.paid,
          isPaidRow: true,
        }, {
          label: this.$t('team.player_list'),
          value: this.team.hasPlayers,
          isListUploadRow: true,
        }];
      },

      playerTableData() {
        return this.team.players.map(player => ({
          ...player,
          birthDate: player.birthDate.format('DD.MM.YYYY'),
        }));
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

      teamIsDenied() {
        return this.team.state === teamStates.denied;
      },

      hasPaid: {
        /* eslint-disable arrow-body-style */
        get: function get() {
          return this.team.paid;
        },
        set: () => {
        },
        /* eslint-enable arrow-body-style */
      },

      hasUploaded: {
        /* eslint-disable arrow-body-style */
        get: function get() {
          return this.team.hasPlayers;
        },
        set: () => {
        },
        /* eslint-enable arrow-body-style */
      },
    },

    methods: {
      triggerPaidChange() {
        if (this.team.paid) {
          this.teamTransitionStateUnpaid(this.team.id);
        } else {
          this.teamTransitionStatePaid(this.team.id);
        }
      },
    },

    data() {
      return {
        deleteDialogVisible: false,
        playerListFields: {
          number: this.$t('player.number'),
          firstName: this.$t('player.first_name'),
          lastName: this.$t('player.last_name'),
          birthDate: this.$t('player.birth_date'),
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
