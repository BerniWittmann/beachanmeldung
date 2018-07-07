import Vue from 'vue';

import storageService from '@/services/storage';

export function checkCookie() {
  const hasAcceptedAlready = storageService.hasItem('cookie_accepted');
  if (!hasAcceptedAlready) {
    Vue.$message({
      showClose: true,
      message: Vue.i18n.t('general.cookie_notice'),
      duration: 10000,
      customClass: 'message-bottom',
      onClose: () => {
        storageService.setItem('cookie_accepted', true);
      },
    });
  }
}

export function checkLocalStorageAvailable() {
  const isAvailable = storageService.isAvailable();
  if (!isAvailable) {
    Vue.$message({
      message: Vue.i18n.t('general.local_storage_not_available'),
      duration: 10000,
      type: 'warning',
    });
  }
}
