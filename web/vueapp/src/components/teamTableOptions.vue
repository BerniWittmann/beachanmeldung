<template>
    <div v-if="team" class="team-action-buttons">
        <el-button v-if="needsApproval || isWaiting" type="primary" @click.prevent.stop="teamTransitionStateSignup(team.id)">{{ $t('team.sign_up') }}</el-button>
        <el-button v-if="needsApproval || isSignedUp" type="warning" @click.prevent.stop="teamTransitionStateWaiting(team.id)">{{ $t('team.move_to_waitlist') }}</el-button>
        <el-button>{{ $t('team.edit') }}</el-button>
        <el-button v-if="!hasPaid" type="success" @click.prevent.stop="teamTransitionStatePaid(team.id)">{{ $t('team.mark_paid') }}</el-button>
        <el-button v-if="hasPaid" type="info" @click.prevent.stop="teamTransitionStateUnpaid(team.id)">{{ $t('team.mark_unpaid') }}</el-button>
    </div>
</template>

<script>
  /* ============
   * Team Table Options Component
   * ============
   *
   * A team Table Option Component.
   *
   * Additonal options for a team in the team table
   */

  import { teamStates } from '@/utils/constants';
  import TeamStateTransitionMixin from '@/mixins/teamStateTransitions';

  export default {
    props: {
      team: {
        type: Object,
        required: true,
      },
    },

    mixins: [
      TeamStateTransitionMixin,
    ],

    computed: {
      needsApproval() {
        return this.team.state === teamStates.needsApproval;
      },

      isWaiting() {
        return this.team.state === teamStates.waiting;
      },

      isSignedUp() {
        return this.team.state === teamStates.signedUp;
      },

      hasPaid() {
        return this.team.paid;
      },
    },
  };

</script>
