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

export function checkObjectEmpty(obj) {
  if (!obj) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function arrayUnion(arr1, arr2, equalityFunc) {
  const union = [].concat(arr1);

  arr2.forEach((obj) => {
    const index = arr1.findIndex(single => equalityFunc(single, obj));
    if (index < 0) {
      union.push(obj);
    } else {
      union[index] = obj;
    }
  });

  return union;
}

export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
