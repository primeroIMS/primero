# frozen_string_literal: true

# This represents the columns that are to be displayed on the record list views
# rubocop:disable Metrics/ClassLength
class Header < ValueObject
  attr_accessor :name, :field_name, :id_search

  SHORT_ID = Header.new(name: 'id', field_name: 'short_id', id_search: true)
  CASE_ID_DISPLAY = Header.new(name: 'id', field_name: 'case_id_display', id_search: true)
  CASE_NAME = Header.new(name: 'name', field_name: 'name')
  SURVIVOR_CODE = Header.new(name: 'survivor_code', field_name: 'survivor_code_no')
  SURVIVOR_CODE_INCIDENT = Header.new(name: 'survivor_code', field_name: 'survivor_code')
  AGE = Header.new(name: 'age', field_name: 'age', id_search: true)
  SEX = Header.new(name: 'sex', field_name: 'sex', id_search: true)
  REGISTRATION_DATE = Header.new(name: 'registration_date', field_name: 'registration_date')
  CASE_OPENING_DATE = Header.new(name: 'case_opening_date', field_name: 'created_at')
  PHOTO = Header.new(name: 'photo', field_name: 'photo')
  SOCIAL_WORKER = Header.new(name: 'social_worker', field_name: 'owned_by')
  OWNED_BY = Header.new(name: 'owned_by', field_name: 'owned_by', id_search: true)
  OWNED_BY_AGENCY = Header.new(name: 'owned_by_agency', field_name: 'owned_by_agency_id', id_search: true)
  DATE_OF_INTERVIEW = Header.new(name: 'date_of_interview', field_name: 'date_of_first_report')
  DATE_OF_INCIDENT = Header.new(name: 'date_of_incident', field_name: 'incident_date')
  GBV_DATE_OF_INCIDENT = Header.new(name: 'date_of_incident', field_name: 'incident_date')
  GBV_VIOLENCE_TYPE = Header.new(name: 'violence_type', field_name: 'gbv_sexual_violence_type')
  CP_DATE_OF_INCIDENT = Header.new(name: 'date_of_incident', field_name: 'incident_date')
  CP_VIOLENCE_TYPE = Header.new(name: 'violence_type', field_name: 'cp_incident_violence_type')
  INCIDENT_LOCATION = Header.new(name: 'incident_location', field_name: 'incident_location')
  VIOLATIONS = Header.new(name: 'violations', field_name: 'violation_category')
  NAME_OF_INQUIRER = Header.new(name: 'name_of_inquirer', field_name: 'relation_name')
  DATE_OF_INQUIRY = Header.new(name: 'date_of_inquiry', field_name: 'inquiry_date')
  TRACING_REQUESTS = Header.new(name: 'tracing_requests', field_name: 'tracing_names')
  NAME = Header.new(name: 'name', field_name: 'name')
  DESCRIPTION = Header.new(name: 'description', field_name: 'description')
  CASE_ID = Header.new(name: 'id', field_name: 'record_id_display')
  PRIORITY = Header.new(name: 'priority', field_name: 'priority')
  TYPE_DISPLAY = Header.new(name: 'type', field_name: 'type')
  DUE_DATE = Header.new(name: 'due_date', field_name: 'due_date')
  FILE_NAME = Header.new(name: 'file_name', field_name: 'file_name')
  RECORD_TYPE = Header.new(name: 'record_type', field_name: 'record_type')
  STARTED_ON = Header.new(name: 'started_on', field_name: 'started_on')
  TIMESTAMP = Header.new(name: 'timestamp', field_name: 'timestamp')
  USER_NAME = Header.new(name: 'user_name', field_name: 'user_name')
  ACTION = Header.new(name: 'action', field_name: 'action')
  RECORD_OWNER = Header.new(name: 'record_owner', field_name: 'record_owner')
  AGENCY_NAME = Header.new(name: 'agency.name', field_name: 'name')
  FULL_NAME = Header.new(name: 'full_name', field_name: 'full_name')
  POSITION = Header.new(name: 'position', field_name: 'position')
  AGENCY = Header.new(name: 'agency', field_name: 'agency')
  USER_GROUP_NAME = Header.new(name: 'user_group.name', field_name: 'name')
  STATUS = Header.new(name: 'status', field_name: 'status')
  ALERT_COUNT = Header.new(name: 'alert_count', field_name: 'alert_count')
  FLAG_COUNT = Header.new(name: 'flag_count', field_name: 'flag_count')
  LOCATION_CODE = Header.new(name: 'location.code', field_name: 'code')
  LOCATION_ADMIN_LEVEL = Header.new(name: 'location.admin_level', field_name: 'admin_level')
  LOCATION_TYPE = Header.new(name: 'location.type', field_name: 'type')
  LOCATION_HIERARCHY = Header.new(name: 'location.hierarchy', field_name: 'hierarchy')
  REGISTRY_NAME = Header.new(name: 'name', field_name: 'name')
  REGISTRY_CODE = Header.new(name: 'registry_no', field_name: 'registry_no')
  COMPLETE = Header.new(name: 'complete', field_name: 'complete')

  class << self
    def get_headers(user, record_type)
      case record_type
      when 'case' then case_headers(user)
      when 'incident' then incident_headers(user)
      when 'tracing_request' then tracing_request_headers
      when 'registry_record' then registry_record_headers(user)
      else []
      end
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    # rubocop:disable Metrics/MethodLength
    def case_headers(user)
      header_list = []
      header_list << CASE_ID_DISPLAY
      header_list << SHORT_ID
      # TODO: There's an id_search logic I'm not sure about
      header_list << CASE_NAME if user.module?(PrimeroModule::CP) && user.can_list_case_names?
      header_list << COMPLETE if user.can?(:mark_for_offline, Child)
      header_list << SURVIVOR_CODE if user.module?(PrimeroModule::GBV) && !user.manager?
      header_list << AGE if user.module?(PrimeroModule::CP)
      header_list << SEX if user.module?(PrimeroModule::CP)
      header_list << REGISTRATION_DATE if user.module?(PrimeroModule::CP)
      header_list << CASE_OPENING_DATE if user.module?(PrimeroModule::GBV)
      header_list << PHOTO if user.module?(PrimeroModule::CP) && user.can?(:view_photo, Child)
      header_list << SOCIAL_WORKER if user.manager?
      header_list << ALERT_COUNT
      header_list << FLAG_COUNT

      header_list
    end

    def incident_headers(user)
      header_list = []
      header_list << SHORT_ID
      header_list << DATE_OF_INCIDENT if user.module?(PrimeroModule::MRM)
      header_list << SURVIVOR_CODE_INCIDENT if !user.manager? && user.module?(PrimeroModule::GBV)
      header_list << DATE_OF_INTERVIEW if user.module?(PrimeroModule::GBV) || user.module?(PrimeroModule::CP)
      header_list << GBV_DATE_OF_INCIDENT if user.module?(PrimeroModule::GBV)
      header_list << GBV_VIOLENCE_TYPE if user.module?(PrimeroModule::GBV)
      header_list << CP_DATE_OF_INCIDENT if user.module?(PrimeroModule::CP)
      header_list << CP_VIOLENCE_TYPE if user.module?(PrimeroModule::CP)
      header_list << INCIDENT_LOCATION if user.module?(PrimeroModule::MRM)
      header_list << VIOLATIONS if user.module?(PrimeroModule::MRM)
      header_list << SOCIAL_WORKER if user.manager?
      header_list << FLAG_COUNT
      header_list
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
    # rubocop:enable Metrics/MethodLength

    def tracing_request_headers
      [SHORT_ID, NAME_OF_INQUIRER, DATE_OF_INQUIRY, TRACING_REQUESTS, FLAG_COUNT]
    end

    def registry_record_headers(user)
      header_list = []
      header_list << SHORT_ID
      header_list << REGISTRY_NAME
      header_list << COMPLETE if user.can?(:mark_for_offline, RegistryRecord)
      header_list << REGISTRY_CODE
      header_list << REGISTRATION_DATE
      header_list
    end

    def report_headers
      [NAME, DESCRIPTION]
    end

    def task_headers
      [CASE_ID, CASE_NAME, PRIORITY, TYPE_DISPLAY, DUE_DATE, STATUS]
    end

    def bulk_export_headers
      [FILE_NAME, RECORD_TYPE, STARTED_ON]
    end

    def audit_log_headers
      [TIMESTAMP, USER_NAME, ACTION, DESCRIPTION, RECORD_OWNER]
    end

    def agency_headers
      [AGENCY_NAME, DESCRIPTION]
    end

    def user_headers
      [FULL_NAME, USER_NAME, POSITION, AGENCY]
    end

    def user_group_headers
      [USER_GROUP_NAME, DESCRIPTION]
    end

    def locations_headers
      [NAME, LOCATION_CODE, LOCATION_ADMIN_LEVEL, LOCATION_TYPE, LOCATION_HIERARCHY]
    end
  end

  def initialize(args = {})
    super(args)
  end

  def inspect
    "Header(name: #{name}, field_name: #{field_name})"
  end
end
# rubocop:enable Metrics/ClassLength
