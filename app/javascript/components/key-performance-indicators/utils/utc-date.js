export default class UTCDate {
  static fromDate(date) {
    return new UTCDate(date.getFullYear(), date.getMonth(), date.getDate() - 1)
  }

  constructor(year, month, day) {
    this.year = year
    this.month = month
    this.day = day
  }

  endOfMonth() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate()
    return new UTCDate(this.year, this.month, daysInMonth - 1)
  }

  startOfMonth() {
    return new UTCDate(this.year, this.month, 0)
  }

  subMonths(months) {
    const year = this.year + Math.floor((this.month - months) / 12)
    const month = (12 + (this.month - months)) % 12
    return new UTCDate(year, month, this.day)
  }

  toDate() {
    return new Date(Date.UTC(this.year, this.month, this.day + 1))
  }

  toString() {
    const year = this.year.toString().padStart(4, '0')
    const month = (this.month + 1).toString().padStart(2, '0')
    const day = (this.day + 1).toString().padStart(2, '0')
    return `${year}-${month}-${day}T00:00:00.000Z` 
  }

  toJSON() {
    return this.toString()
  }
}
