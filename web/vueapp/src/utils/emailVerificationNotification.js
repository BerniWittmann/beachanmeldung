import Vue from 'vue';
import store from '@/store';

export default function checkEmailVerification() {
  if (store.state.auth.authenticated && !store.state.account.isVerified && !sessionStorage.getItem('resent_verification')) {
    Vue.$message({
      dangerouslyUseHTMLString: true,
      message: Vue.i18n.t('general.email_verification_notice'),
      duration: 10000,
      type: 'warning',
      customClass: 'message-bottom',
    });
  }
}
