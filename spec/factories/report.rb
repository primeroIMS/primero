# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :report, traits: [:active_model] do
    name { 'test_age_location_report' }
    record_type { 'case' }
    aggregate_by { ['location_current1'] }
    disaggregate_by { ['age'] }
    group_dates_by { 'date' }
    group_ages { true }
    is_graph { true }
    module_id { 'primeromodule-cp' }
    filters do
      [
        {
          'attribute' => 'status',
          'value' => ['open']
        },
        {
          'attribute' => 'record_state',
          'value' => ['true']
        }
      ]
    end
  end
end
