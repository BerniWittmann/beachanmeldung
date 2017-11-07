import moment from 'moment';

export function parseDate(dateString) {
  return dateString ? moment(dateString, [moment.ISO_8601, 'DD.MM.YYYY']) : undefined;
}

export function parseDateToISOString(date) {
  return date ? date.toISOString() : undefined;
}
