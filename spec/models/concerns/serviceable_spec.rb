# frozen_string_literal: true

require 'rails_helper'

describe Serviceable do
  before do
    @date_time = DateTime.parse('2017/11/01 12:54:55 -0400')
    DateTime.stub(:now).and_return(@date_time)
    @sys_settings = SystemSettings.new
    @case1 = Child.new
  end

  describe 'service_due_date' do
    before do
      @service_appointment_date = (@date_time + 7.days).to_date
      @service = { 'service_response_day_time' => @date_time, 'service_appointment_date' => @service_appointment_date }
    end
    context 'when system is configured for due_date_from_appointment_date' do
      before do
        @sys_settings.due_date_from_appointment_date = true
        SystemSettings.stub(:current).and_return(@sys_settings)
      end

      it 'returns the appointment_date' do
        expect(@case1.service_due_date(@service)).to eq(
          @service_appointment_date.end_of_day.strftime('%Y-%m-%d %H:%M:%S %z')
        )
      end
    end

    context 'when system is not configured for due_date_from_appointment_date' do
      before do
        @sys_settings.due_date_from_appointment_date = false
        SystemSettings.stub(:current).and_return(@sys_settings)
      end

      context 'and service_response_timeframe is set to 1 hour' do
        before do
          @service['service_response_timeframe'] = '1_hour'
        end

        it 'returns 1 hour after the create date' do
          expect(@case1.service_due_date(@service)).to eq(@date_time + 1.hour)
        end
      end

      context 'and service_response_timeframe is set to 3 hours' do
        before do
          @service['service_response_timeframe'] = '3_hours'
        end

        it 'returns 3 hours after the create date' do
          expect(@case1.service_due_date(@service)).to eq(@date_time + 3.hours)
        end
      end

      context 'and service_response_timeframe is set to 1 day' do
        before do
          @service['service_response_timeframe'] = '1_day'
        end

        it 'returns 1 day after the create date' do
          expect(@case1.service_due_date(@service)).to eq(@date_time + 1.day)
        end
      end

      context 'and service_response_timeframe is set to 3 days' do
        before do
          @service['service_response_timeframe'] = '3_days'
        end

        it 'returns 3 days after the create date' do
          expect(@case1.service_due_date(@service)).to eq(@date_time + 3.days)
        end
      end

      context 'and service_response_timeframe is not set' do
        before do
          @service['service_response_timeframe'] = nil
        end

        it 'returns nil' do
          expect(@case1.service_due_date(@service)).to be_nil
        end
      end
    end
  end
end
