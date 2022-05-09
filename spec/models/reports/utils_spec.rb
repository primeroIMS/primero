# frozen_string_literal: true

require 'rails_helper'

describe Reports::Utils do
  before :each do
    @values = {
      ['2020-01-28T00:00:00Z'] => 0,
      ['2021-02-14T00:00:00Z'] => 1,
      ['2022-03-25T00:00:00Z'] => 100
    }
  end

  context '.group_values' do
    it 'group values and applied passed block' do
      expected_result = {
        [Reports::MonthRange.new('2020-01-28T00:00:00Z')] => 0,
        [Reports::MonthRange.new('2021-02-14T00:00:00Z')] => 1,
        [Reports::MonthRange.new('2022-03-25T00:00:00Z')] => 100
      }

      result = Reports::Utils.group_values(@values, 0) do |pivot_name|
        Reports::Utils.date_range(pivot_name, 'month')
      end

      expect(result.keys.flatten.map(&:date)).to match_array(expected_result.keys.flatten.map(&:date))
      expect(result.values).to match_array([0, 1, 100])
    end
  end

  context '.group_buckets' do
    it 'group buckets and applied passed block' do
      expected_result = {
        [Reports::MonthRange.new('2020-01-28T00:00:00Z')] => [[['2020-01-28T00:00:00Z'], 0]],
        [Reports::MonthRange.new('2021-02-14T00:00:00Z')] => [[['2021-02-14T00:00:00Z'], 1]],
        [Reports::MonthRange.new('2022-03-25T00:00:00Z')] => [[['2022-03-25T00:00:00Z'], 100]]
      }

      result = Reports::Utils.group_buckets(@values, 0) do |pivot_name|
        Reports::Utils.date_range(pivot_name, 'month')
      end

      expect(result.keys.flatten.map(&:date)).to match_array(expected_result.keys.flatten.map(&:date))
      expect(result.values).to match_array(
        [[[['2020-01-28T00:00:00Z'], 0]], [[['2021-02-14T00:00:00Z'], 1]], [[['2022-03-25T00:00:00Z'], 100]]]
      )
    end
  end

  context '.date_range' do
    before :each do
      @date_string = '2020-01-28T00:00:00Z'
    end
    context 'when the type is date' do
      it 'return an instance of DateRange' do
        result = Reports::Utils.date_range(@date_string, 'date')

        expect(result).to be_a(Reports::DateRange)
        expect(result).to have_attributes(date: @date_string.to_date)
        expect(result.to_s).to eq('28-Jan-2020')
      end
    end

    context 'when the type is week' do
      it 'return an instance of WeekRange' do
        result = Reports::Utils.date_range(@date_string, 'week')

        expect(result).to be_a(Reports::WeekRange)
        expect(result).to have_attributes(date: @date_string.to_date)
        expect(result.to_s).to eq('26-Jan-2020 - 01-Feb-2020')
      end
    end

    context 'when the type is month' do
      it 'return an instance of MonthRange' do
        result = Reports::Utils.date_range(@date_string, 'month')

        expect(result).to be_a(Reports::MonthRange)
        expect(result).to have_attributes(date: @date_string.to_date)
        expect(result.to_s).to eq('Jan-2020')
      end
    end

    context 'when the type is year' do
      it 'return an instance of YearRange' do
        result = Reports::Utils.date_range(@date_string, 'year')

        expect(result).to be_a(Reports::YearRange)
        expect(result).to have_attributes(date: @date_string.to_date)
        expect(result.to_s).to eq('2020')
      end
    end
  end
end
