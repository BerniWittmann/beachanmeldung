<template>
    <el-row class="footer-wrap">
        <el-col :span="24" class="footer-col">
            <el-row :gutter="20" class="footer">
                <el-col :lg="12" :md="12" :sm="12" :xs="24">
                    <p class="footer-paragraph">
                        <router-link :to="{ name: 'etc.contact' }">{{ $t('nav.contact') }}</router-link>
                    </p>
                    <p class="footer-paragraph">
                        <router-link :to="{ name: 'etc.terms-of-participation' }">{{ $t('nav.terms_of_participation') }}</router-link>
                    </p>
                    <p class="footer-paragraph" v-if="isStaff">
                        <a href="/admin/">{{ $t('general.admin') }}</a>
                    </p>
                </el-col>
                <el-col :lg="{span: 7, offset: 5}" :md="{span: 7, offset: 5}" :sm="{span: 7, offset: 5}"
                        :xs="{span: 24}">
                    <p class="footer-paragraph footer-paragrap-copyright"><i class="fa fa-copyright"></i> {{currentYear}} {{ $t('general.copyright_name')
                        }}</p>
                    <p class="footer-paragraph">
                        <a href="http://www.handballismaning.de/impressum">{{ $t('nav.imprint') }}</a>
                    </p>
                    <p class="footer-paragraph">
                        <router-link :to="{ name: 'etc.privacy' }">{{ $t('nav.privacy') }}</router-link>
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

      isStaff() {
        return this.$store.state.account.isStaff;
      },
    },
  };

</script>
