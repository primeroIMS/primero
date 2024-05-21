# frozen_string_literal: true

require 'logger'

# Script to create sample data

# To execute this script:
#   rails r ./cases_and_families.rb true <number_main_records>
#   rake sunspot:reindex

log_filename = "output-create-sample-data-#{DateTime.now.strftime('%Y%m%d.%H%M')}.log"
LOG = Logger.new(log_filename)
LOG.formatter = proc do |_severity, _datetime, _progname, msg|
  "#{msg}\n"
end

def print_log(message)
  message = "#{Time.now.strftime('%Y/%m/%d %H:%M')}|| #{message}"
  puts(message)
  LOG.info message
end

def read_file(filename)
  File.open(filename, 'r') do |file|
    file.each_line.map(&:chomp)
  end
end

def lookup_values_ids(lookup_unique_id)
  Lookup.find_by(unique_id: lookup_unique_id).lookup_values.map { |v| v['id'] }.reject { |id| id == 'reopened' }
end

def random_boolean
  [true, false].sample
end

save_records = ARGV[0] || false
total_records = ARGV[1] || 500

NAMES = { female: read_file("#{__dir__}/names/sample-names-en-female.txt"),
          male: read_file("#{__dir__}/names/sample-names-en-male.txt") }.freeze
LASTNAMES = read_file("#{__dir__}/names/english_surnames.csv")[0...-1].freeze
SEX = %w[male female].freeze

RISK_LEVEL = lookup_values_ids('lookup-risk-level')
PROTECTION_CONCERN = lookup_values_ids('lookup-protection-concerns')
CAREGIVER_CHANGE_REASON = lookup_values_ids('lookup-caregiver-change-reason')
CARE_ARRANGEMENTS_TYPE = lookup_values_ids('lookup-care-arrangements-type')
INCIDENT_IDENTIFICATION_VIOLENCE = lookup_values_ids('lookup-incident-identification')
INCIDENT_LOCATION = lookup_values_ids('lookup-incident-location')
TIMEOFDAY = lookup_values_ids('lookup-time-of-day')
CP_VIOLENCE_TYPE = lookup_values_ids('lookup-cp-violence-type')
PERPETRATOR_RELATIONSHIP = lookup_values_ids('lookup-perpetrator-relationship')
WORKFLOW_OPTS = lookup_values_ids('lookup-workflow')
FOLLOWUP_TYPE = lookup_values_ids('lookup-followup-type')
RESPONSE_TYPE = lookup_values_ids('lookup-service-response-type')
SERVICE_TYPE = lookup_values_ids('lookup-service-type')
FAMILY_RELATIONSHIP = lookup_values_ids('lookup-family-relationship')
YES_NO = lookup_values_ids('lookup-yes-no')
FAMILY_RELATIONSHIP_BY_SEX = {
  male: %w[father uncle grandfather brother husband partner other_family other_nonfamily],
  female: %w[mother aunt grandmother sister wife partner other_family other_nonfamily]
}.freeze

LOCATION_LEVEL_2 = Location.where(admin_level: 2).pluck(:location_code)
SS_USERS = Role.find_by(unique_id: 'role-cp-case-worker').users
SP_USERS = Role.find_by(unique_id: 'role-cp-service-provider').users

records = []

def generate_national_id(name)
  "#{name}-#{SecureRandom.uuid.last(4)}"
end

def create_care_arrangement(registration_date)
  (1...rand(1..3)).map do |_|
    {
      child_caregiver_reason_change: CAREGIVER_CHANGE_REASON.sample,
      care_arrangements_type: CARE_ARRANGEMENTS_TYPE.sample,
      name_caregiver: "#{NAMES[SEX.sample.to_sym].sample} #{LASTNAMES.sample.capitalize}",
      care_arrangement_started_date: rand(registration_date..1.weeks.ago).to_date
    }
  end
end

def create_followup(registration_date, workflow)
  return [] unless workflow.in?(%w[service_provision closed])

  (1...rand(1..3)).map do |_|
    {
      followup_type: FOLLOWUP_TYPE.sample,
      followup_needed_by_date: registration_date + rand(1...6).months
    }
  end
end

def create_approval_subform(requested_by, approval_date, approval_status, approval_requested_for)
  (requested_by.blank? ? {} : { requested_by: }).merge(
    {
      approval_date:,
      approval_status:,
      approval_requested_for:
    }
  )
end

def create_assessment(registration_date, owner_user_name)
  assessment_requested_on = registration_date + rand(4...7).days
  {
    assessment_requested_on:,
    approval_status_assessment: 'pending',
    approval_subforms:
    [create_approval_subform(owner_user_name, assessment_requested_on, 'requested', 'assessment')]
  }
end

def create_case_plan(registration_date, owner_user_name)
  date_case_plan = registration_date + rand(7...10).days
  {
    date_case_plan:,
    approval_subforms:
      [create_approval_subform(owner_user_name, date_case_plan + 2.days, 'requested', 'case_plan'),
       create_approval_subform(nil, date_case_plan + 2.days, 'approved', 'case_plan')],
    approval_status_case_plan: 'approved',
    case_plan_approved: true,
    case_plan_approved_date: date_case_plan + 2.days
  }
end

# rubocop:disable Metrics/AbcSize
# rubocop:disable Metrics/MethodLength
def create_service_provision(registration_date, service_users)
  {
    services_section: (1...rand(1..4)).map do |_|
      service_user = service_users.sample
      {
        service_response_type: RESPONSE_TYPE.sample,
        service_type: service_user.services.sample,
        service_response_day_time: registration_date + rand(4...7).days,
        service_appointment_date: registration_date + rand(7...10).days,
        service_implementing_agency: service_user.agency.agency_code,
        service_implementing_agency_individual: service_user.user_name,
        service_implemented_day_time: registration_date + rand(10...13).days
      }
    end
  }
end

def family_detail(main_fields_values)
  {
    unique_id: SecureRandom.uuid,
    relation_name: main_fields_values[:full_name],
    relation: FAMILY_RELATIONSHIP_BY_SEX[main_fields_values[:sex].to_sym].sample,
    relation_is_caregiver: random_boolean,
    relation_lives_with_child: random_boolean,
    relation_child_lived_with_pre_separation: YES_NO.sample,
    relation_child_is_in_contact: YES_NO.sample,
    relation_child_is_separated_from: YES_NO.sample,
    relation_nickname: main_fields_values[:name_first],
    relation_is_alive: %w[unknown alive dead].sample,
    relation_age: main_fields_values[:age],
    relation_date_of_birth: main_fields_values[:dob],
    relation_sex: main_fields_values[:sex],
    relation_age_estimated: false,
    relation_national_id: generate_national_id(main_fields_values[:name_first]),
    relation_location_current: LOCATION_LEVEL_2.sample,
    relation_address_is_permanent: YES_NO.sample
  }
end
# rubocop:enable Metrics/AbcSize

def create_closed(registration_date, owner_user_name)
  date_closure = registration_date + rand(30...60).days
  {
    closure_reason: %w[formal_closing lost_contact transferred other].sample,
    date_closure:,
    approval_subforms:
    [create_approval_subform(owner_user_name, date_closure, 'requested', 'closure'),
     create_approval_subform(nil, date_closure, 'approved', 'closure')],
    approval_status_closure: 'approved',
    closure_approved: true,
    closure_approved_date: date_closure,
    status: 'closed'
  }
end

def main_fields_values
  date_of_birth = rand(18.year.ago..1.year.ago)
  sex = SEX.sample
  name_first = NAMES[:"#{sex}"].sample
  name_last = LASTNAMES.sample.capitalize

  {
    dob: date_of_birth.to_date,
    age: DateTime.now.year - date_of_birth.year,
    sex:,
    name_first:,
    name_last:,
    full_name: "#{name_first} #{name_last}"
  }
end
# rubocop:enable Metrics/MethodLength

def create_worklow(registration_date, workflow, owner, service_users)
  case workflow
  when 'assessment'
    create_assessment(registration_date, owner.user_name)
  when 'case_plan'
    create_case_plan(registration_date, owner.user_name)
  when 'service_provision'
    create_service_provision(registration_date, service_users)
  when 'closed'
    create_closed(registration_date, owner.user_name)
  else {} end
end

def create_family_details_section
  Array.new(4) do |_|
    family_detail(main_fields_values)
  end
end

# rubocop:disable Metrics/AbcSize
# rubocop:disable Metrics/MethodLength
def create_records
  registration_date = rand(2.year.ago..3.weeks.ago)
  record_main_fields_values = main_fields_values
  workflow_status = WORKFLOW_OPTS.sample
  owner = SS_USERS.sample
  primero_module = 'primeromodule-cp'
  service_users = UserTransitionService.referral(owner, Child, primero_module).transition_users.select do |user|
    user.role.unique_id == 'role-cp-service-provider'
  end

  workflow_object = {}
  if workflow_status == 'service_provision'
    workflow_status = WORKFLOW_OPTS.first unless service_users.present?
    workflow_object = create_worklow(registration_date.to_date, workflow_status, owner, service_users)
  end

  family_members = create_family_details_section
  child = Child.new(
    {
      id: SecureRandom.uuid,
      data: {
        owned_by: owner.user_name,
        registration_date: registration_date.to_date,
        date_of_birth: record_main_fields_values[:dob],
        name: record_main_fields_values[:full_name],
        name_first: record_main_fields_values[:name_first],
        name_last: record_main_fields_values[:name_last],
        sex: record_main_fields_values[:sex],
        age: record_main_fields_values[:age],
        national_id_no: generate_national_id(record_main_fields_values[:name_first]),
        workflow: workflow_status,
        status: 'open',
        record_state: true,
        module_id: primero_module,
        risk_level: RISK_LEVEL.sample,
        protection_concerns: PROTECTION_CONCERN.sample(rand(1..5)),
        care_arrangements_section: create_care_arrangement(registration_date),
        followup_subform_section: create_followup(registration_date.to_date, workflow_status),
        family_details_section: family_members
      }.merge(workflow_object)
    }
  )
  FamilyLinkageService.link_child_to_new_family(owner, child)

  child
end
# rubocop:enable Metrics/AbcSize
# rubocop:enable Metrics/MethodLength

def generate_family_members_records(owner, record)
  record.family_details_section.sample(2).each do |member|
    family_member_child = FamilyLinkageService.new_family_linked_child(owner, record, member['unique_id'])
    family_member_child.save!
    print_log("Family member Case - #{family_member_child.short_id} saved!")
  end
end

def print_total_records(before_after)
  print_log("#{before_after} insert records:")
  print_log(" - Total Cases: #{Child.count}")
  print_log(" - Total Families: #{Family.count}")
end

total_records.to_i.times do
  records << create_records
end

return unless save_records == 'true'

print_total_records('Before')
print_log("Creating #{records.count} cases")
begin
  records.each do |record|
    owner = SS_USERS.find_by(user_name: record.data['owned_by'])
    record.update_properties(owner, record.data)
    record.save!
    print_log("Case record #{record.short_id} saved!")

    generate_family_members_records(owner, record)
  end
rescue StandardError => e
  print_log("Cannot create Cases. Error #{e.message}")
end

print_total_records('After')
