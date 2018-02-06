<template>
    <el-table
            :ref="ref"
            :data="tableData"
            border fit :show-header="false"
            style="width: 100%"
            class="team-table"
            @row-click="navigateToTeam">
        <el-table-column
                type="expand" v-if="canDisplayOptions" @click.prevent.stop>
            <template slot-scope="props">
                <v-team-table-options v-if="props.row.data" :team="props.row.data"></v-team-table-options>
            </template>
        </el-table-column>
        <el-table-column
                prop="nr"
                width="40"
                align="center">
        </el-table-column>
        <el-table-column
                min-width="200"
                prop="name">
        </el-table-column>
        <el-table-column
                width="70"
                v-if="canDisplayOptions">
            <template slot-scope="scope">
                <div v-if="scope.row.data">
                    <el-tooltip v-if="scope.row.data.paid" :content="$t('team.paid')" placement="top">
                        <i class="fa fa-money fa-fw"></i>
                    </el-tooltip>
                    <el-tooltip v-if="scope.row.data.hasPlayers" :content="$t('team.list_uploaded')" placement="top">
                        <i class="fa fa-list fa-fw"></i>
                    </el-tooltip>
                    <el-tooltip v-if="needsApproval(scope.row.data)" :content="$t('team.needs_approval')"
                                placement="top">
                        <el-button @click.prevent.stop="expandRow(scope.row)" icon="el-icon-warning" type="danger"
                                   size="mini" round></el-button>
                    </el-tooltip>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
  /* ============
   * Panel Component
   * ============
   *
   * A team Table.
   *
   * A Table which renders teams and options.
   */
  import { teamStates } from '@/utils/constants';

  export default {
    components: {
      VTeamTableOptions: require('@/components/teamTableOptions'),
    },
    props: {
      teams: {
        type: Array,
        required: true,
      },
      maxCount: {
        type: Number,
        required: false,
      },
    },
    computed: {
      ref() {
        /* eslint-disable no-underscore-dangle */
        return `teamTable${this._uid}`;
        /* eslint-enable no-underscore-dangle */
      },

      tableData() {
        const teamData = this.teams.map((single, index) => ({
          nr: index + 1,
          name: single.completeName,
          data: single,
        }));

        if (!this.fillWithEmptyRows) {
          return teamData;
        }

        for (let i = teamData.length; i < this.maxCount; i += 1) {
          teamData.push({
            nr: i + 1,
            name: undefined,
          });
        }
        return teamData;
      },

      fillWithEmptyRows() {
        return !(!this.maxCount || this.maxCount <= this.teams.length);
      },

      canDisplayOptions() {
        return this.$store.state.account.isStaff;
      },
    },

    methods: {
      needsApproval(team) {
        return team.state === teamStates.needsApproval;
      },

      expandRow(row) {
        this.$refs[this.ref].toggleRowExpansion(row, true);
      },

      navigateToTeam(row, event, column) {
        if (!row || !row.data || !row.data.id || column.type === 'expand') return;

        this.$router.push({
          name: 'team.single',
          params: {
            teamID: row.data.id,
          },
        });
      },
    },
  };

</script>
