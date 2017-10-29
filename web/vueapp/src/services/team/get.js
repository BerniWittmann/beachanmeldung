import teamMemberTransformer from './../../transformers/team-member';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (members) => {
  store.dispatch('team/store', teamMemberTransformer.fetchCollection(members));
};

// When the request fails
const failed = () => {
};

export default () =>
  /*
   * Normally you would perform an AJAX-request.
   * But to get the example working, the data is hardcoded.
   *
   * With the include REST-client Axios, you can do something like this:
   * Vue.$http.get('/account')
   *   .then((response) => {
   *     success(response);
   *   })
   *   .catch((error) => {
   *     failed(error);
   *   });
   */
   Vue.$http.get('/team/members/')
    .then((response) => {
      success(response.data.results);
    }).catch((error) => {
      failed(error);
    });
