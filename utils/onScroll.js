const handleScroll = async (e, callback) => {
  e.stopPropagation();
  const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
  if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
    await callback();
  }
};
export default handleScroll;
