/**@type {{accountId: string, expire: Date}[]} */
let blacklist = [];

export default {
  blacklist,
  isInBlackList: (accountId) => {
    const index = blacklist.findIndex((item) => item.accountId === accountId);
    if (index === -1) return 0;
    const expireTime = blacklist[index].expire;
    if (expireTime && expireTime.getMilliseconds < Date.now) {
      blacklist.splice(index, 1);
      return -1;
    } else return 1;
  },
  addToBlackList: (accountId, expire = null) => {
    const index = blacklist.findIndex((item) => item.accountId === accountId);
    if (index !== -1) return;
    blacklist.push({ accountId, expire });
    return;
  },
  removeFromBlackList: (accountId) => {
    const index = blacklist.findIndex((item) => item.accountId === accountId);
    if (index === -1) return;
    blacklist.splice(index, 1);
    return;
  },
};
