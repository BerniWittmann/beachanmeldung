export default () => {
  try {
    localStorage.setItem('test', 'data');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};
