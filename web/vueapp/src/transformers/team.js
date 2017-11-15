/* ============
 * Team Transformer
 * ============
 *
 * The transformer for the Team.
 */

import { parseDate } from '@/utils/helpers';
import Transformer from './transformer';
import TournamentTransformer from './tournament';
import AccountTransformer from './account';

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
      trainer: team.trainer ? AccountTransformer.fetch(team.trainer) : undefined,
      tournament: team.tournament ? TournamentTransformer.fetch(team.tournament) : undefined,
      isDisplayed: team.is_displayed,
      completeName: team.complete_name,
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
    };
  }
}
