/* ============
 * Team Transformer
 * ============
 *
 * The transformer for the Team.
 */

import { parseDate, checkObjectEmpty } from '@/utils/helpers';
import Transformer from './transformer';
import TournamentTransformer from './tournament';
import AccountTransformer from './account';
import PlayerTransformer from './player';

function fetchTrainer(trainer) {
  return checkObjectEmpty(trainer) ? undefined : AccountTransformer.fetch(trainer);
}

export default class TeamTransformer extends Transformer {
  /**
   * Method used to transform a fetched team
   *
   * @param team The fetched team
   *
   * @returns {Object} The transformed team
   */
  static fetch(team) {
    return {
      id: team.id,
      name: team.name,
      beachname: team.beachname,
      dateSignup: parseDate(team.date_signup),
      state: team.state,
      paid: team.paid,
      trainer: fetchTrainer(team.trainer),
      tournament: team.tournament ? TournamentTransformer.fetch(team.tournament) : undefined,
      isDisplayed: team.is_displayed,
      completeName: team.complete_name,
      players: team.players ? PlayerTransformer.fetchCollection(team.players)
        .sort((a, b) => a.number - b.number) : [],
    };
  }

  /**
   * Method used to transform a send team
   *
   * @param team The team to be send
   *
   * @returns {Object} The transformed team
   */
  static send(team) {
    return {
      id: team.id,
      name: team.name,
      beachname: team.beachname,
      tournament: team.tournamentID,
      players: team.players ? PlayerTransformer.sendCollection(team.players) : [],
    };
  }
}
