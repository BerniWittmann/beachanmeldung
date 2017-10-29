/* ============
 * Team Member Transformer
 * ============
 *
 * The transformer for the team members.
 */

import Transformer from './transformer';

export default class TeamMemberTransformer extends Transformer {
  /**
   * Method used to transform a fetched team member
   *
   * @param member The fetched team member
   *
   * @returns {Object} The transformed team member
   */
  static fetch(member) {
    return {
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      description: member.description,
      image: member.image,
      thumbnail: member.thumbnail,
    };
  }

  /**
   * Method used to transform a send team member
   *
   * @param member The team member to be send
   *
   * @returns {Object} The transformed team member
   */
  static send(member) {
    return {
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      description: member.description,
      image: member.image,
      thumbnail: member.thumbnail,
    };
  }
}
