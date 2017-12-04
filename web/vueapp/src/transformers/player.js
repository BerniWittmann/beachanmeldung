/* ============
 * Player Transformer
 * ============
 *
 * The transformer for the Player.
 */

import Transformer from './transformer';

export default class PlayerTransformer extends Transformer {
  /**
   * Method used to transform a fetched player
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
      yearOfBirth: player.year_of_birth,
      number: player.number,
    };
  }

  /**
   * Method used to transform a send player
   *
   * @param player The player to be send
   *
   * @returns {Object} The transformed player
   */
  static send(player) {
    return {
      id: player.id,
      first_name: player.firstName,
      last_name: player.lastName,
      year_of_birth: player.yearOfBirth,
      number: player.number,
    };
  }
}
