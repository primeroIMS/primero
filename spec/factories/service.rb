# frozen_string_literal: true

class Service
  attr_accessor :_id, :unique_id, :service_response_type, :service_objective, :service_type,
                :service_response_day_time, :service_appointment_date, :service_response_timeframe, :service_implementing_agency, :service_provider, :service_implementing_agency_individual, :service_status_referred, :service_referral_notes, :service_implemented, :service_implemented_day_time
end

FactoryBot.define do
  factory :service, traits: [:model] do
    _id { "service#{counter}" }
    unique_id { "service#{counter}" }
    service_response_type { 'intervention_judicial' }
  end
end
