/* ============
 * Team State Transitions Mixin
 * ============
 *
 * Mixins are used to easily expand Vue components.
 * This mixin, will add team State Transition -methods
 * to the specified Vue component.
 */
import teamService from '@/services/team';
import { teamStates } from '@/utils/constants';

export default {
  methods: {
    teamTransitionStateSignup(teamid) {
      return teamService.updateState(teamid, teamStates.signedUp);
    },

    teamTransitionStateWaiting(teamid) {
      return teamService.updateState(teamid, teamStates.waiting);
    },

    teamTransitionStateDenied(teamid) {
      return teamService.updateState(teamid, teamStates.denied);
    },

    teamTransitionStateNeedsApproval(teamid) {
      return teamService.updateState(teamid, teamStates.needsApproval);
    },

    teamTransitionStatePaid(teamid) {
      return teamService.markPaid(teamid);
    },

    teamTransitionStateUnpaid(teamid) {
      return teamService.markUnpaid(teamid);
    },
  },
};
