let blacklist: { accountId: string; expire: Date }[] = [];

export default {
  blacklist,
  isInBlackList: (accountId: string) => {
    const index = blacklist.findIndex((item) => item.accountId === accountId);
    if (index === -1) return 0;
    const expireTime = blacklist[index].expire;
    if (expireTime && expireTime.getMilliseconds < Date.now) {
      blacklist.splice(index, 1);
      return -1;
    } else return 1;
  },
  addToBlackList: (accountId: string, expire?: Date) => {
    const index = blacklist.findIndex((item) => item.accountId === accountId);
    if (index !== -1) {
      blacklist[index].expire = expire;
      return;
    }
    blacklist.push({ accountId, expire });
    return;
  },
  removeFromBlackList: (accountId: string) => {
    const index = blacklist.findIndex((item) => item.accountId === accountId);
    if (index === -1) return;
    blacklist.splice(index, 1);
    return;
  },
};
