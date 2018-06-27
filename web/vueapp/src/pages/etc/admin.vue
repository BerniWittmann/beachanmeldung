<template>
    <v-layout>
        <el-row class="home-part home-part-image">
            <div class="home-header-image">
                <h1>{{ $t('general.header.title', { currentYear: year }) }}</h1>
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
                        <el-button plain icon="el-icon-bell" @click="currentTeamDialogOption = reminderTypes.payment">
                            {{ $t('etc.admin.send_payment_reminder') }}
                        </el-button>
                        <el-button plain icon="el-icon-tickets" @click="currentTeamDialogOption = reminderTypes.playerList">
                            {{ $t('etc.admin.send_player_list_reminder') }}
                        </el-button>
                        <el-button icon="el-icon-message" plain @click="currentTeamDialogOption = reminderTypes.email">
                            {{ $t('etc.admin.send_email_reminder') }}
                        </el-button>
                    </el-col>
                    <el-dialog :title="currentTreeTitle" v-loading="loading"
                               :visible.sync="selectTeamsDialogVisible">
                        <el-tree
                                :data="teamTreeData"
                                :props="treeProps"
                                ref="teamListTree"
                                node-key="id"
                                show-checkbox
                                :default-checked-keys="defaultCheckedTeams">
                        </el-tree>
                        <div v-if="currentTeamDialogOption == reminderTypes.email">
                            <br>
                            <h3>{{ $t('etc.admin.email.title') }}</h3>
                            <el-form :rules="emailRules" :model="email" ref="emailForm">
                                <el-form-item prop="subject">
                                    <el-input v-model="email.subject"
                                              type="text"
                                              v-bind:placeholder="$t('etc.admin.email.subject')"></el-input>
                                </el-form-item>
                                <el-form-item prop="text">
                                    <el-input v-model="email.text"
                                              type="textarea"
                                              :autosize="{ minRows: 4 }"
                                              v-bind:placeholder="$t('etc.admin.email.text')"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button icon="el-icon-close" @click="abort()">
                                {{ $t('etc.admin.select_teams_dialog.abort') }}
                            </el-button>
                            <el-button icon="el-icon-check" type="primary" @click="sendReminders()">
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
  import { teamStates, reminderTypes } from '@/utils/constants';
  import teamService from '@/services/team';

  export default {
    components: {
      VLayout: require('@/layouts/fullWidth.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
    },

    computed: {
      year() {
        return this.$store.state.config.year;
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
          id: `t_${t.id}`,
          completeName: t.gender === 'mixed' ? t.name : `${t.name} - ${t.gender}`,
          isDisabled: false,
          teams: this.teams.filter(single =>
            single.tournament.id === t.id && single.state === teamStates.signedUp)
            .map((s) => {
              let isDisabled = this.currentTeamDialogOption === reminderTypes.payment
                ? s.paid : s.hasPlayers;
              if (this.currentTeamDialogOption === reminderTypes.email) {
                isDisabled = false;
              }

              return {
                ...s,
                isDisabled,
              };
            }),
        }));
      },

      playerListData() {
        return this.players.map(single => ({
          id: single.id,
          number: single.number,
          firstName: single.firstName,
          lastName: single.lastName,
          birthDate: single.birthDate,
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
          this.email = {
            subject: undefined,
            text: undefined,
          };
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
          birthDate: this.$t('player.birth_date'),
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
        defaultCheckedTeams: [],
        email: {
          subject: undefined,
          text: undefined,
        },
        emailRules: {
          subject: [
            { required: true, message: this.$t('validation.email.subject.required'), trigger: 'blur' },
          ],
          text: [
            { required: true, message: this.$t('validation.email.text.required'), trigger: 'blur' },
          ],
        },
      };
    },

    methods: {
      sendReminders() {
        if (this.currentTeamDialogOption === reminderTypes.email) {
          this.$refs.emailForm.validate((valid) => {
            if (valid) {
              this.send();
            }
          });
        } else {
          this.send();
        }
      },

      send() {
        const teams = this.$refs.teamListTree.getCheckedKeys();
        if (teams.length === 0) return;
        const body = {
          subject: this.email.subject,
          text: this.email.text ? this.email.text.replace(/(?:\r\n|\r|\n)/g, '<br />') : undefined,
        };
        teamService.sendReminder(teams, this.currentTeamDialogOption, body).then(() => {
          this.selectTeamsDialogVisible = false;
          this.email = {
            subject: undefined,
            text: undefined,
          };
        });
      },

      abort() {
        this.selectTeamsDialogVisible = false;
        this.email = {
          subject: undefined,
          text: undefined,
        };
      },
    },

    beforeMount() {
      let checked = this.$route.query.checked;
      if (checked) {
        checked = Array.isArray(checked) ? checked : [checked];
        this.defaultCheckedTeams = checked;
      }
    },

    mounted() {
      if (Object.values(reminderTypes).includes(this.$route.query.type)) {
        this.currentTeamDialogOption = this.$route.query.type;
      }
    },
  };
</script>
