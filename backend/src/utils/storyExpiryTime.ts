export const getStoryExpiryTime = () =>
  new Date(Date.now() - 24 * 60 * 60 * 1000);

export default getStoryExpiryTime;
