enum CustomCronExpression {
  /**
   * This function will trigger a cron job every day at 8:15 PM server time (UTC+0).
   * The server uses the Dublin, Edinburgh, Lisbon, London time zone (UTC+0).
   * The cron schedule is set to '15 20 * * *', which corresponds to 2 AM of the next day in Nepal time (UTC+5:45).
   * This is because Nepal is 5 hours and 45 minutes ahead of UTC+0.
   */
  NEPAL_TIME_TWO_AM_DAILY = '15 20 * * * ',
  NEPAL_TIME_THREE_AM_DAILY = '15 21 * * * ',
}
export default CustomCronExpression;
