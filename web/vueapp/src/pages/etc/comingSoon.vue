<template>
    <v-layout>
        <el-row>
            <el-col :lg="{span: 18, offset: 3}" :md="{span: 18, offset: 3}" :sm="{span: 18, offset: 3}"
                    :xs="{span: 22, offset: 1}">
                <v-panel contextual-style="primary">
                    <div slot="body" class="text-center">
                        <h1>{{ $t('comingSoon.title') }}</h1>
                        <p>
                            <i class="fa fa-cog fa-3x fa-slow-spin"></i>
                        </p>
                        <p>{{ $t('comingSoon.text') }}</p>
                        <p>{{ $t('comingSoon.registration_prompt') }}</p>
                        <v-link-button :route="{ name: 'auth.registration' }" type="primary">{{ $t('auth.register') }}</v-link-button>
                    </div>
                </v-panel>
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
      VLayout: require('@/layouts/background.vue'),
      VPanel: require('@/components/panel.vue'),
    },
  };
</script>
