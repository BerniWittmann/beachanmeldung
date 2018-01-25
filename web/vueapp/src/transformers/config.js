/* ============
 * Config Transformer
 * ============
 *
 * The transformer for the config.
 */

import Transformer from './transformer';

export default class ConfigTransformer extends Transformer {
  /**
   * Method used to transform a fetched config
   *
   * @param config The fetched config
   *
   * @returns {Object} The transformed config
   */
  static fetch(config) {
    return {
      year: config.year,
      welcomeText: config.welcome_text,
      termsOfParticipation: config.terms_of_participation,
    };
  }

  /**
   * Method used to transform a send config
   *
   * @param config The config to be send
   *
   * @returns {Object} The transformed config
   */
  static send(config) {
    return {
      year: config.year,
      welcome_text: config.welcomeText,
      terms_of_participation: config.termsOfParticipation,
    };
  }
}
