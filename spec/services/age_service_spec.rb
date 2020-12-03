# frozen_string_literal: true

require 'rails_helper'

describe AgeService do
  describe '.day_of_year' do
    it 'returns the day of year given a date' do
      expect(AgeService.day_of_year(Date.new(2019, 7, 24))).to eq(205)
    end

    it 'accounts for leap years and normalizes the day of year to a non-leap year' do
      # 2020 is a leap year, the actual day of year for July 24 is 206
      expect(AgeService.day_of_year(Date.new(2020, 7, 24))).to eq(205)
    end
  end

  describe 'age' do
    it 'returns the age on any particluar day given a birthdate' do
      birthdate = Date.new(1982, 10, 10)
      on = Date.new(2020, 7, 24)
      expect(AgeService.age(birthdate, on)).to eq(37)
    end

    it 'returns the age accurately on the day of the birthday' do
      birthdate = Date.new(1982, 10, 10)
      on = Date.new(2020, 10, 10)
      expect(AgeService.age(birthdate, on)).to eq(38)
    end
  end
end
