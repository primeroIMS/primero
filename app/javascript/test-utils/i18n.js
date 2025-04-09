// eslint-disable-next-line import/prefer-default-export
export const abbrMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function freezeTimeZone(offset = 0) {
  // eslint-disable-next-line no-extend-native
  global.Date.prototype.getTimezoneOffset = jest.fn(() => offset);
}
