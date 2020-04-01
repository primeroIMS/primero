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

    context 'Testing the mark_referrable_services method' do
      before do
        clean_data(Child, Agency, User, Role, Lookup)
        @agency = Agency.create!(name: 'Test Agency', agency_code: 'TA', services: ['Test type'])
        role_self = Role.create!(
          name: 'Test Role 3',
          unique_id: 'test-role-3',
          group_permission: Permission::SELF,
          permissions: [
            Permission.new(
              resource: Permission::CASE,
              actions: [Permission::MANAGE]
            )
          ]
        )
        @user = User.create!(
          full_name: 'Test User 2',
          user_name: 'test_user_2',
          password: 'a12345632',
          password_confirmation: 'a12345632',
          email: 'test_user_2@localhost.com',
          agency_id: @agency.id,
          role: role_self,
          services: ['Test type']
        )
        Lookup.create!(
          unique_id: 'lookup-service-type',
          name_en: 'Service Type',
          lookup_values_en: [
            { id: 'Test type', display_text: 'Safehouse Service' }.with_indifferent_access
          ]
        )
      end
      it 'Testing the mark_referrable_services method' do
        child_with_service = Child.create!(
          data: { name: 'Test1', age: 5, sex: 'male', services_section: [
            {
              service_type: 'Test type', service_implementing_agency: @agency.unique_id,
              service_implementing_agency_individual: @user.user_name, service_provider: true
            }
          ] }
        )
        expect(Child.count).to eq(1)
        expect(child_with_service.data['services_section'][0]['service_is_referrable']).to be_truthy
      end
      after do
        clean_data(Child, Agency, User, Role, Lookup)
      end
    end
  end
end
