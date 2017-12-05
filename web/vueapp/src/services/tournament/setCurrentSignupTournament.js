import tournamentTransformer from './../../transformers/tournament';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (tournament) => {
  tournament = tournamentTransformer.fetch(tournament);

  store.dispatch('tournament/setActive', tournament);
};

// When the request fails
const failed = () => {
  store.dispatch('tournament/setActive', undefined);
};

export default (tournamentID) => {
  if (!tournamentID) {
    failed();
    return Promise.resolve();
  }
  return Vue.$http.get(`/tournaments/${tournamentID}/`)
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
};
