/* ============
 * Player Transformer
 * ============
 *
 * The transformer for the Player.
 */

import Transformer from './transformer';

export default class ListPlayerTransformer extends Transformer {
  /**
   * Method used to transform a fetched player in a list
   *
   * @param player The fetched player
   *
   * @returns {Object} The transformed player
   */
  static fetch(player) {
    return {
      id: player.id,
      name: player.name,
      firstName: player.first_name,
      lastName: player.last_name,
      birthDate: player.birth_date,
      number: player.number,
      teamID: player.team ? player.team.id : undefined,
      teamName: player.team ? player.team.name : undefined,
      teamBeachName: player.team ? player.team.beachname : undefined,
      teamState: player.team ? player.team.state : undefined,
      tournamentName: (player.team && player.team.tournament) ? `${player.team.tournament.name} - ${player.team.tournament.gender}` : undefined,
    };
  }

  /**
   * Method used to transform a send player
   *
   * @returns {Object} The transformed player
   */
  static send() {
    return {};
  }
}
