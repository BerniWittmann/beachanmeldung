<template>
    <span>{{ tournament.name }} <span v-if="showGender"> - {{ $t('general.gender.' + tournament.gender) }}</span></span>
</template>

<script>
  /* ============
   * Tournament Name Component
   * ============
   *
   * Renders the name of a tournament
   */

  export default {
    props: {
      tournament: {
        type: Object,
        required: true,
        default: () => ({
          name: undefined,
          gender: 'mixed',
        }),
      },
    },
    computed: {
      showGender() {
        return this.tournament.gender !== 'mixed';
      },
    },
  };

</script>
