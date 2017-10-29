export function validatePassword(rule, value, callback, vueinstance, formname) {
  if (!value || value === '') {
    callback(new Error(vueinstance.$t('validation.password.required')));
  } else {
    if (vueinstance.user.passwordConfirm !== '') {
      vueinstance.$refs[formname].validateField('passwordConfirm');
    }
    callback();
  }
}

export function validatePasswordConfirm(rule, value, callback, vueinstance) {
  if (!value || value === '') {
    callback(new Error(vueinstance.$t('validation.password_confirm.required')));
  } else if (value !== vueinstance.user.password) {
    callback(new Error(vueinstance.$t('validation.password_confirm.match')));
  } else {
    callback();
  }
}
