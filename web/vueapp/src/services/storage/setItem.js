export default (key, data) => {
  try {
    localStorage.setItem(key, data);
  } catch (e) {
  }
};
