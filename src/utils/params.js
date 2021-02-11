export const TaskRequestParams = {
  today() {
    let d = new Date(Date.now());
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return Math.floor(d.getTime() / 1000);
  },

  tomorrow() {
    let td = this.today();
    td += 24 * 60 * 60;
    return td;
  },

  dayAfterTomorrow() {
    let td = this.today();
    td += 48 * 60 * 60;
    return td;
  },

  twoDaysAfterTomorrow() {
    let td = this.today();
    td += 72 * 60 * 60;
    return td;
  },

  nextWeek() {
    let td = this.today();
    td += 7 * 24 * 60 * 60;
    return td;
  },

  prevWeek() {
    let td = this.today();
    td -= 7 * 24 * 60 * 60;
    return td;
  },

  yesterday() {
    let td = this.today();
    td -= 24 * 60 * 60;
    return td;
  },

  dayBeforeYesterday() {
    let td = this.today();
    td -= 48 * 60 * 60;
    return td;
  },

  twoDaysBeforeYesterday() {
    let td = this.today();
    td -= 72 * 60 * 60;
    return td;
  },

  nextYear() {
    let td = this.today();
    td += 365 * 24 * 60 * 60;
    return td;
  },

  getNextDay(day) {
    return day + 24 * 60 * 60;
  },

  getDayBefore(day) {
    return day - 24 * 60 * 60;
  },

  getNextWeek(day) {
    return day + 7 * 24 * 60 * 60;
  },

  getWeekBefore(day) {
    return day - 7 * 24 * 60 * 60;
  },

  sortOrderAsc: "asc",
  sortOrderDesc: "desc",
};
