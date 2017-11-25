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
                    <el-col :lg="{span: 14, offset: 5}" :md="{span: 16, offset: 4}" :sm="{span: 20, offset: 2}"
                            :xs="{span: 24, offset: 0}">
                        <el-form :rules="rules" :model="team" ref="teamEditForm">
                            <el-form-item prop="name">
                                <el-input v-model="team.name"
                                          type="text" @keyup.native.enter="save"
                                          v-bind:placeholder="$t('team.name')"></el-input>
                            </el-form-item>
                            <el-form-item prop="beachname">
                                <el-input v-model="team.beachname"
                                          type="text" @keyup.native.enter="save"
                                          v-bind:placeholder="$t('team.beachname')"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-col :lg="{span: 15}" :md="{span: 13}" :sm="{span: 9}"
                                        :xs="{span: 14}">
                                    <el-button :loading="loading" type="primary" @click="save">
                                        {{ $t('team.save') }}
                                    </el-button>
                                    <v-link-button :route="{ name: 'team.single', params: { teamID: activeTeam.id } }">{{ $t('team.abort') }}</v-link-button>
                                </el-col>
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
        team: {
          name: undefined,
          beachname: undefined,
        },
        rules: {
          name: [
            { required: true, message: this.$t('validation.team_name.required'), trigger: 'blur' },
          ],
          beachname: [],
        },
      };
    },

    methods: {
      save() {
        this.$refs.teamEditForm.validate((valid) => {
          if (valid) {
            teamService.update(this.team);
          } else {
            this.$message.error(this.$t('validation.failed'));
          }
        });
      },

      getNewestTeamData() {
        this.team = Object.assign({}, this.activeTeam);
      },
    },

    beforeMount() {
      this.getNewestTeamData();
    },
  };
</script>
