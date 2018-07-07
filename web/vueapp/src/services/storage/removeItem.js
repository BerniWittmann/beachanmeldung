export default (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
  }
};
