import getItem from './getItem';

export default (key) => {
  try {
    return !!getItem(key);
  } catch (e) {
    return false;
  }
};
