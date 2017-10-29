<template>
    <v-layout>
        <el-row class="home-part home-part-image">
            <div class="home-header-image home-header-image-thin">
            </div>
        </el-row>

        <el-row>
            <el-col :span="20" :offset="2">
                <h1 class="text-center">{{ $t('nav.team') }}</h1>
                <el-row :gutter="20">
                    <el-col :span="spanWidth" :xs="24" class="team-member" v-for="member in members" :key="member.id">
                        <div class="team-member-image-wrap">
                            <a class="team-member-image" :href="getMailTo(member)" v-if="hasImage(member)">
                                <img :src="member.thumbnail">
                            </a>
                        </div>
                        <p class="team-member-name">{{member.name}}</p>
                        <p class="team-member-role">{{member.role}}</p>
                        <p class="team-member-description">{{member.description}}</p>
                        <v-link-button type="primary" :href="getMailTo(member)" class="team-member-email"><i
                                class="fa fa-lg fa-envelope"></i></v-link-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </v-layout>
</template>

<script>
  /* ============
   * Team Page
   * ============
   *
   * Page where the user can view the team
   */

  export default {
    components: {
      VLinkButton: require('@/components/linkButton.vue'),
      VLayout: require('@/layouts/fullWidth.vue'),
      VPanel: require('@/components/panel.vue'),
    },

    computed: {
      members() {
        return this.$store.state.team.members;
      },

      spanWidth() {
        return Math.max(24 / this.members.length, 6);
      },
    },

    methods: {
      hasImage(member) {
        return !!member.thumbnail;
      },

      getMailTo(member) {
        return `mailto:${member.email}`;
      },
    },
  };
</script>
