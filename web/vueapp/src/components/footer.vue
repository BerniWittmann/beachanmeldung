<template>
    <el-row class="footer-wrap">
        <el-col :span="24" class="footer-col">
            <el-row :gutter="20" class="footer">
                <el-col :lg="12" :md="12" :sm="12" :xs="24">
                    <p class="footer-paragraph" v-html="$t('general.by_text')"></p>
                    <p class="footer-paragraph footer-paragrap-copyright"><i class="fa fa-copyright"></i> {{currentYear}} {{ $t('general.copyright_name')
                        }}</p>
                </el-col>
                <el-col :lg="{span: 4, offset: 8}" :md="{span: 4, offset: 8}" :sm="{span: 4, offset: 8}"
                        :xs="{span: 4}">
                    <p class="footer-paragraph">
                        <router-link :to="{ name: 'etc.team' }">{{ $t('nav.team') }}</router-link>
                    </p>
                    <p class="footer-paragraph">
                        <router-link :to="{}" tag="p">{{ $t('nav.contact') }}</router-link>
                    </p>
                    <p class="footer-paragraph">
                        <router-link :to="{}" tag="p">{{ $t('nav.about') }}</router-link>
                    </p>
                    <p class="footer-paragraph">
                        <router-link :to="{}" tag="p">{{ $t('nav.privacy') }}</router-link>
                    </p>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
  /* ============
   * Footer Component
   * ============
   *
   * A footer component.
   */

  import moment from 'moment';

  export default {
    computed: {
      currentYear() {
        return moment().format('YYYY');
      },
    },
  };

</script>
