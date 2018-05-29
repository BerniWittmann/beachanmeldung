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
                    <el-col :lg="{span: 20, offset: 2}" :md="{span: 20, offset: 2}" :sm="{span: 22, offset: 1}"
                            :xs="{span: 24, offset: 0}">
                        <el-form :rules="rules" :model="team" ref="teamEditForm">
                            <el-row>
                                <el-col :lg="{span: 16, offset: 4}" :md="{span: 18, offset: 3}"
                                        :sm="{span: 20, offset: 2}"
                                        :xs="{span: 24, offset: 0}">
                                    <el-form-item prop="name">
                                        <el-input v-model="team.name" @change="handleChange"
                                                  type="text" @keyup.native.enter="save"
                                                  v-bind:placeholder="$t('team.name')"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="beachname">
                                        <el-input v-model="team.beachname" @change="handleChange"
                                                  type="text" @keyup.native.enter="save"
                                                  v-bind:placeholder="$t('team.beachname_placeholder')"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <h2>{{ $t('team.player_list') }}</h2>
                            <el-row
                                    v-for="(player, index) in team.players"
                                    :key="`player_${player.key}`"
                            >
                                <el-col :lg="{span: 22, offset: 1}" :md="{span: 22, offset: 1}"
                                        :sm="{span: 24, offset: 0}"
                                        :xs="{span: 24, offset: 0}">
                                    <h3>
                                        {{ $t('player.index', { index: player.key }) }}
                                    </h3>
                                    <el-row :gutter="10">
                                        <el-col :lg="2" :md="2" :sm="6" :xs="24">
                                            <el-form-item :prop="`players.${index}.value.number`"
                                                          :rules="playerRules.number">
                                                <el-input v-model.number="player.value.number" @change="handleChange"
                                                          v-bind:placeholder="$t('player.number')"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :lg="7" :md="7" :sm="12" :xs="24">
                                            <el-form-item :prop="`players.${index}.value.firstName`"
                                                          :rules="playerRules.firstName">
                                                <el-input v-model="player.value.firstName" type="text" @change="handleChange"
                                                          v-bind:placeholder="$t('player.first_name')"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :lg="7" :md="7" :sm="12" :xs="24">
                                            <el-form-item :prop="`players.${index}.value.lastName`"
                                                          :rules="playerRules.lastName">
                                                <el-input v-model="player.value.lastName" type="text" @change="handleChange"
                                                          v-bind:placeholder="$t('player.last_name')"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :lg="6" :md="6" :sm="6" :xs="24">
                                            <el-form-item :prop="`players.${index}.value.birthDate`"
                                                          :rules="playerRules.birthDate">
                                                <el-date-picker
                                                        v-model="player.value.birthDate"
                                                        type="date" @change="handleChange"
                                                        format="dd.MM.yyyy"
                                                        v-bind:placeholder="$t('player.birth_date')">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :lg="2" :md="2" :sm="6" :xs="24">
                                            <el-tooltip effect="dark" :content="$t('player.remove')"
                                                        placement="top">
                                                <el-button @click.prevent="removePlayer(player)" type="danger"
                                                           plain icon="el-icon-delete"></el-button>
                                            </el-tooltip>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <el-form-item>
                                <el-row>
                                    <el-col>
                                        <el-button icon="el-icon-plus" type="success" plain
                                                   @click.prevent="addPlayer()">{{ $t('player.add') }}
                                        </el-button>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :lg="{span: 15}" :md="{span: 13}" :sm="{span: 9}"
                                            :xs="{span: 14}">
                                        <el-button :loading="loading" :icon="saveButtonIcon" type="primary" @click="save">
                                            {{ saveButtonText }}
                                        </el-button>
                                        <v-link-button
                                                :route="{ name: 'team.single', params: { teamID: activeTeam.id } }">
                                            {{ $t('team.abort') }}
                                        </v-link-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * Team Edit Page
   * ============
   *
   * A page which edits a single Team
   */

  import teamService from '@/services/team';
  import moment from 'moment';

  export default {
    components: {
      VLayout: require('@/layouts/default.vue'),
      VLinkButton: require('@/components/linkButton.vue'),
    },

    computed: {
      activeTeam() {
        return this.$store.state.team.activeTeam;
      },
      loading() {
        return this.$store.getters['loading/isLoading'];
      },
      currentYear() {
        return parseInt(moment().format('YYYY'), 10);
      },
      saveButtonIcon() {
        return this.saved ? 'el-icon-check' : null;
      },
      saveButtonText() {
        return this.saved ? this.$t('team.saved') : this.$t('team.save');
      },
    },

    watch: {
      activeTeam: {
        handler: function handler() {
          this.getNewestTeamData();
        },
        deep: true,
      },
    },

    data() {
      return {
        saved: false,
        team: {
          name: undefined,
          beachname: undefined,
          players: [],
        },
        rules: {
          name: [
            { required: true, message: this.$t('validation.team_name.required'), trigger: 'blur' },
          ],
          beachname: [],
        },
        playerRules: {
          number: [
            { required: true, message: this.$t('validation.player.number.required') },
            { type: 'number', message: this.$t('validation.player.number.type'), trigger: 'blur' },
            { min: 0, type: 'number', message: this.$t('validation.player.number.min'), trigger: 'blur' },
            {
              validator: this.validateNumberUnique,
              message: this.$t('validation.player.number.unique'),
              trigger: 'blur',
            },
          ],
          firstName: [
            { required: true, message: this.$t('validation.player.first_name.required'), trigger: 'blur' },
            {
              validator: this.validateNameUnique,
              message: this.$t('validation.player.name.unique'),
              trigger: 'blur',
            },
          ],
          lastName: [
            { required: true, message: this.$t('validation.player.last_name.required'), trigger: 'blur' },
            {
              validator: this.validateNameUnique,
              message: this.$t('validation.player.name.unique'),
              trigger: 'blur',
            },
          ],
          birthDate: [
            { required: true, message: this.$t('validation.player.birth_date.required') },
            {
              validator: this.validateDate,
              message: this.$t('validation.player.birth_date.valid'),
              trigger: 'blur',
            },
          ],
        },
      };
    },

    methods: {
      save() {
        this.$refs.teamEditForm.validate((valid) => {
          if (valid) {
            const team = Object.assign({}, this.team);
            team.players = this.team.players.map(single => ({
              ...single.value,
              birthDate: moment(single.value.birthDate),
            }));
            teamService.update(team).then(() => {
              this.$refs.teamEditForm.clearValidate();
              this.saved = true;
            });
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },

      getNewestTeamData() {
        this.team = Object.assign({}, this.activeTeam);
        this.team.players = this.team.players.map((single, index) => ({
          key: index + 1,
          value: Object.assign({}, single),
        }));
      },

      removePlayer(item) {
        this.handleChange();
        const index = this.team.players.indexOf(item);
        if (index !== -1) {
          this.team.players.splice(index, 1);
        }
      },
      addPlayer() {
        this.handleChange();
        this.team.players.push({
          key: this.team.players.length + 1,
          value: {
            number: undefined,
            firstName: undefined,
            lastName: undefined,
            birthDate: undefined,
          },
        });
      },

      validateNumberUnique(rule, value, callback) {
        const amount = this.team.players.filter(single => single.value.number === value).length;
        return amount > 1 ? callback(new Error('Player number not unique')) : callback();
      },

      validateNameUnique(rule, value, callback) {
        const uniquePlayerNames = [];
        this.team.players.forEach((player) => {
          const name = `${player.value.firstName}-${player.value.lastName}`;
          if (uniquePlayerNames.includes(name)) {
            return callback(new Error('Player Name not unique'));
          }
          return uniquePlayerNames.push(name);
        });
        return callback();
      },

      validateDate(rule, value, callback) {
        return moment(value, 'DD.MM.YYYY').isValid() ? callback() : callback(new Error('Invalid Date'));
      },

      handleChange() {
        this.saved = false;
      },
    },

    beforeMount() {
      this.getNewestTeamData();
    },
  };
</script>
