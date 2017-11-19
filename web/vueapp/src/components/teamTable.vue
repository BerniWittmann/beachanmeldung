<template>
    <el-table
            :ref="ref"
            :data="tableData"
            border fit :show-header="false"
            style="width: 100%">
        <el-table-column
                type="expand" v-if="canDisplayOptions">
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
                v-if="canDisplayOptions">
            <template slot-scope="scope">
                <div v-if="scope.row.data">
                    <i v-if="scope.row.data.paid" class="fa fa-money fa-fw"></i>
                    <el-button @click="expandRow(scope.row)" v-if="needsApproval(scope.row.data)" type="danger" size="mini" round>{{ $t('team.needs_approval') }}</el-button>
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
    },
  };

</script>
