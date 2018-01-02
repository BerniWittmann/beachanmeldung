import Vue from 'vue';

export default function checkCookie() {
  const hasAcceptedAlready = !!localStorage.getItem('cookie_accepted');
  if (!hasAcceptedAlready) {
    Vue.$message({
      showClose: true,
      message: Vue.i18n.t('general.cookie_notice'),
      duration: 10000,
      customClass: 'message-bottom',
      onClose: () => {
        localStorage.setItem('cookie_accepted', true);
      },
    });
  }
}
