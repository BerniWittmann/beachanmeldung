export default (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return undefined;
  }
};
