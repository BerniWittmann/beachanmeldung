<template>
    <el-card class="tournament-card">
        <div slot="header" class="header">
            <span class="tournament-name">{{ tournament.name }} <span v-if="showGender"> - {{ $t('general.gender.' + tournament.gender) }}</span></span>
            <el-popover
                    placement="top"
                    :title="$t('tournament.signup_not_open.title')"
                    trigger="hover"
                    :disabled="isSignupOpen">
                <span v-show="isBeforeSignup">{{ $t('tournament.signup_not_open.before_signup', getDateTime('startSignup') ) }}</span>
                <span v-show="isAfterSignup">{{ $t('tournament.signup_not_open.after_signup',  getDateTime('deadlineSignup') ) }}</span>
                <v-link-button slot="reference">{{ $t('tournament.register_team') }}</v-link-button>
            </el-popover>
        </div>
        <div class="body">
            <span><i class="el-icon-date"></i> {{ tournamentDate }}</span>
            <span>€ {{ tournament.startingFee }}</span>
        </div>
    </el-card>
</template>

<script>
  /* ============
   * Tournament Card Component
   * ============
   *
   * A Card component that displays a single Tournament
   *
   */

  import moment from 'moment';

  export default {
    props: {
      tournament: {
        type: Object,
        required: true,
      },
    },

    components: {
      VLinkButton: require('@/components/linkButton.vue'),
    },

    computed: {
      showGender() {
        return this.tournament.gender !== 'mixed';
      },

      isSignupOpen() {
        return this.tournament.signupOpen;
      },

      isBeforeSignup() {
        return !this.tournament.signupOpen && moment().isBefore(this.tournament.startSignup);
      },

      isAfterSignup() {
        return !this.tournament.signupOpen && moment().isAfter(this.tournament.deadlineSignup);
      },

      tournamentDate() {
        if (this.tournament.startDate.isSame(this.tournament.endDate, 'day')) {
          return this.tournament.startDate.format('DD.MM.YYYY');
        }
        return `${this.tournament.startDate.format('DD.MM.YYYY')} - ${this.tournament.endDate.format('DD.MM.YYYY')}`;
      },
    },

    methods: {
      getDateTime(key) {
        const datetime = this.tournament[key];
        return {
          date: datetime.format('DD.MM.YYYY'),
          time: datetime.format('HH:mm'),
        };
      },
    },
  };

</script>
