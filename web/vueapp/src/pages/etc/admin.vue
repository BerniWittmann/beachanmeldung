<template>
    <v-layout>
        <el-row class="home-part home-part-image">
            <div class="home-header-image">
                <h1>{{ $t('general.header.title', { currentYear: currentYear }) }}</h1>
                <h2>{{ $t('general.header.subtitle') }}</h2>
            </div>
        </el-row>

        <el-row class="home-part">
            <el-col :span="24" class="center">
                <h1>{{ $t('etc.admin.headline') }}</h1>
                <el-row>
                    <h2>
                        <v-link-button href="/admin/" plain icon="el-icon-setting">{{ $t('etc.admin.to_django_admin')
                            }}
                        </v-link-button>
                    </h2>
                </el-row>
                <el-row>
                    <p>{{ $t('etc.admin.django_explanation') }}</p>
                </el-row>
                <el-row>
                    <h2>{{ $t('etc.admin.other_actions') }}</h2>
                    <el-col class="team-action-buttons">
                        <v-download-excel :data="playerListData" :fields="playerListFields" :name="playerListFileName"
                                          type="csv" :meta="playerListFileMeta">
                            <el-button plain type="primary" icon="el-icon-download">
                                {{ $t('etc.admin.download_all_players') }}
                            </el-button>
                        </v-download-excel>
                    </el-col>
                    <el-col class="team-action-buttons">
                        <el-button plain @click="currentTeamDialogOption = reminderTypes.payment">
                            {{ $t('etc.admin.send_payment_reminder') }}
                        </el-button>
                        <el-button plain @click="currentTeamDialogOption = reminderTypes.playerList">
                            {{ $t('etc.admin.send_player_list_reminder') }}
                        </el-button>
                    </el-col>
                    <el-dialog :title="currentTreeTitle" v-loading="loading"
                               :visible.sync="selectTeamsDialogVisible">
                        <el-tree
                                :data="teamTreeData"
                                :props="treeProps"
                                ref="teamListTree"
                                node-key="id"
                                show-checkbox>
                        </el-tree>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="selectTeamsDialogVisible = false">
                                {{ $t('etc.admin.select_teams_dialog.abort') }}
                            </el-button>
                            <el-button type="primary" @click="sendReminders()">
                                {{ $t('etc.admin.select_teams_dialog.send') }}
                            </el-button>
                        </div>
                    </el-dialog>
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
  import { teamStates, reminderTypes } from '@/utils/constants';
  import teamService from '@/services/team';

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

      teams() {
        return this.$store.state.team.teams;
      },

      tournaments() {
        return this.$store.state.tournament.tournaments;
      },

      teamTreeData() {
        return this.tournaments.map(t => ({
          ...t,
          completeName: t.gender === 'mixed' ? t.name : `${t.name} - ${t.gender}`,
          isDisabled: false,
          teams: this.teams.filter(single =>
            single.tournament.id === t.id && single.state === teamStates.signedUp)
            .map(s => ({
              ...s,
              isDisabled: this.currentTeamDialogOption === reminderTypes.payment
                ? s.paid : s.hasPlayers,
            })),
        }));
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

      treeProps() {
        return {
          children: 'teams',
          label: 'completeName',
          disabled: 'isDisabled',
        };
      },

      currentTreeTitle() {
        return this.$t(`etc.admin.select_teams_dialog.title.${this.currentTeamDialogOption}`);
      },

      selectTeamsDialogVisible: {
        get() {
          return !!this.currentTeamDialogOption;
        },
        set() {
          this.currentTeamDialogOption = undefined;
        },
      },

      loading() {
        return this.$store.getters['loading/isLoading'];
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
        currentTeamDialogOption: undefined,
        reminderTypes,
      };
    },

    methods: {
      sendReminders() {
        const teams = this.$refs.teamListTree.getCheckedNodes().map(s => s.id);
        if (teams.length === 0) return;
        teamService.sendReminder(teams, this.currentTeamDialogOption).then(() => {
          this.selectTeamsDialogVisible = false;
        });
      },
    },
  };
</script>
