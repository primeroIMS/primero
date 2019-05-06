class Service
  attr_accessor :_id
  attr_accessor :unique_id
  attr_accessor :service_response_type
  attr_accessor :service_objective
  attr_accessor :service_type
  attr_accessor :service_response_day_time
  attr_accessor :service_appointment_date
  attr_accessor :service_response_timeframe
  attr_accessor :service_implementing_agency
  attr_accessor :service_provider
  attr_accessor :service_implementing_agency_individual
  attr_accessor :service_status_referred
  attr_accessor :service_referral_notes
  attr_accessor :service_implemented
  attr_accessor :service_implemented_day_time
end

FactoryBot.define do
  factory :service, :traits => [ :model ] do
    _id {"service#{counter}"}
    unique_id {"service#{counter}"}
    service_response_type { "intervention_judicial" }
  end
end
