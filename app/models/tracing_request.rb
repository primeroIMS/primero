# frozen_string_literal: true

# Describes a request by a single individual to trace one or more children (cases)
class TracingRequest < ApplicationRecord
  include Record
  include Searchable
  include Matchable
  include Ownable
  include Historical
  include Flaggable
  include Alertable
  include Attachable

  has_many :traces
  store_accessor :data,
                 :tracing_request_id, :inquiry_date, :relation_name, :relation_age,
                 :relation_date_of_birth, :relation_sex,
                 :relation_nickname, :relation_other_family, :relation,
                 :relation_nationality, :relation_language, :relation_religion,
                 :relation_ethnicity, :relation_sub_ethnicity1, :relation_sub_ethnicity2,
                 :monitor_number, :survivor_code, :reunited, :inquiry_date,
                 :tracing_request_subform_section,
                 :location_last
  alias inquirer_id tracing_request_id

  def self.quicksearch_fields
    %w[
      tracing_request_id short_id relation_name relation_nickname tracing_names
      tracing_nicknames monitor_number survivor_code
    ]
  end

  def self.summary_field_names
    common_summary_fields + %w[
      relation_name inquiry_date tracing_names
    ]
  end

  searchable do
    extend Matchable::Searchable
    string :status, as: 'status_sci'
    quicksearch_fields.each { |f| configure_for_matching(f) }
  end

  alias super_defaults defaults
  def defaults
    super_defaults
    self.inquiry_date ||= Date.today
  end

  def self.minimum_reportable_fields
    {
      'boolean' => ['record_state'],
      'string' => %w[status owned_by],
      'multistring' => %w[associated_user_names owned_by_groups],
      'date' => ['inquiry_date']
    }
  end

  def tracing_names
    traces.map { |t| t['name'] }.compact
  end

  def tracing_nicknames
    traces.map { |t| t['name_nickname'] }.compact
  end

  def set_instance_id
    self.tracing_request_id ||= unique_identifier
  end
end
