import Vue from 'vue';
import store from './../../store';
import ConfigTransformer from '@/transformers/config';

// When the request succeeds
const success = (data) => {
  store.dispatch('config/store', ConfigTransformer.fetch(data));
};

// When the request fails
const failed = () => {};

export default () =>
  /*
   * Normally you would perform an AJAX-request.
   * But to get the example working, the data is hardcoded.
   *
   * With the include REST-client Axios, you can do something like this:
   * Vue.$http.post('/auth/login', user)
   *   .then((response) => {
   *     success(response);
   *   })
   *   .catch((error) => {
   *     failed(error);
   *   });
   */
  Vue.$http.get('/config/')
    .then(response => success(response.data))
    .catch(failed);
