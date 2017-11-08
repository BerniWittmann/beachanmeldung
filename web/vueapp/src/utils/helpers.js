import moment from 'moment';

export function parseDate(dateString) {
  return dateString ? moment(dateString, [moment.ISO_8601, 'DD.MM.YYYY']) : undefined;
}

export function parseDateToISOString(date) {
  return date ? date.toISOString() : undefined;
}

export function getDateTimeByKey(obj, key) {
  if (!obj || !key || !obj[key] || !moment(obj[key]).isValid()) {
    return {
      date: undefined,
      time: undefined,
    };
  }
  const datetime = obj[key];
  return {
    date: datetime.format('DD.MM.YYYY'),
    time: datetime.format('HH:mm'),
  };
}
