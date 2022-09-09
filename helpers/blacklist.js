let blacklist = [];

export default {
  blacklist,
  isInBlackList: (data) => {
    if (blacklist.includes(data)) return true;
    return false;
  },
  addToBlackList: (data) => {
    if (blacklist.includes(data)) return;
    blacklist.push(data);
    return;
  },
  removeFromBlackList: (data) => {
    if (blacklist.includes(data)) {
      blacklist = blacklist.filter((item) => item !== data);
      return;
    }
    return;
  },
};
