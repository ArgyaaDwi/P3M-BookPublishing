export const getBadgeVariant = (statusId: number) => {
  if ([1, 4, 5, 9, 10].includes(statusId)) {
    return ["badgePending", "badgePendingText"];
  }
  if ([2, 6, 11].includes(statusId)) {
    return ["badgeRev", "badgeRevText"];
  }
  return ["badgeSuccess", "badgeSuccessText"];
};
