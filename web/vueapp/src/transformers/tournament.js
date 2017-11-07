/* ============
 * Tournament Transformer
 * ============
 *
 * The transformer for the tournament.
 */

import moment from 'moment';
import { parseDate, parseDateToISOString } from '@/utils/helpers';
import Transformer from './transformer';

export default class TournamentTransformer extends Transformer {
  /**
   * Method used to transform a fetched tournament
   *
   * @param tournament The fetched tournament
   *
   * @returns {Object} The transformed tournament
   */
  static fetch(tournament) {
    return {
      id: tournament.id,
      name: tournament.name,
      gender: tournament.gender,
      startDate: parseDate(tournament.start_date),
      endDate: parseDate(tournament.end_date),
      startSignup: parseDate(tournament.start_signup),
      deadlineSignup: parseDate(tournament.deadline_signup),
      deadlineEdit: parseDate(tournament.deadline_edit),
      advertisementUrl: tournament.advertisement_url,
      contactEmail: tournament.contact_email,
      signupOpen: tournament.signup_open,
      startingFee: tournament.starting_fee,
    };
  }

  /**
   * Method used to transform a send tournament
   *
   * @param tournament The tournament to be send
   *
   * @returns {Object} The transformed tournament
   */
  static send(tournament) {
    return {
      id: tournament.id,
      name: tournament.name,
      gender: tournament.gender,
      start_date: parseDateToISOString(tournament.startDate),
      end_date: parseDateToISOString(tournament.endDate),
      start_signup: parseDateToISOString(tournament.startSignup),
      deadline_signup: parseDateToISOString(tournament.deadlineSignup),
      deadline_edit: parseDateToISOString(tournament.deadlineEdit),
      advertisement_url: tournament.advertisementUrl,
      contact_email: tournament.contactEmail,
      signup_open: tournament.signupOpen,
      starting_fee: tournament.startingFee,
    };
  }
}
