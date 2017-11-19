<template>
   <div v-if="team">
       <el-button v-if="needsApproval">{{ $t('team.approve') }}</el-button>
       <el-button v-if="isWaiting">{{ $t('team.sign_up') }}</el-button>
       <el-button v-if="isSignedUp">{{ $t('team.move_to_waitlist') }}</el-button>
       <el-button>{{ $t('team.edit') }}</el-button>
       <el-button v-if="!hasPaid">{{ $t('team.mark_paid') }}</el-button>
       <el-button v-if="hasPaid">{{ $t('team.mark_unpaid') }}</el-button>
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

  export default {
    props: {
      team: {
        type: Object,
        required: true,
      },
    },
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
