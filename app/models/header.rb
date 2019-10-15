class Header < ValueObject
  attr_accessor :name, :field_name, :id_search

  @primero_module_cp = PrimeroModule.cp
  @primero_module_gbv = PrimeroModule.gbv
  @primero_module_mrm = PrimeroModule.mrm

  SHORT_ID = Header.new(name: 'id', field_name: 'short_id')
  CASE_NAME = Header.new(name: 'sort', field_name: 'sortable_name', id_search: true)
  SURVIVOR_CODE = Header.new(name: 'survivor_code', field_name: 'survivor_code_no')
  AGE= Header.new(name: 'age', field_name: 'age', id_search: true)
  SEX = Header.new(name: 'sex', field_name: 'sex', id_search: true)
  REGISTRATION_DATE = Header.new(name: 'registration_date', field_name: 'registration_date', id_search: true)
  CASE_OPENING_DATE = Header.new(name: 'case_opening_date', field_name: 'case_opening_date', id_search: true)
  PHOTO = Header.new(name: 'photo', field_name: 'photo', id_search: true)
  SOCIAL_WORKER = Header.new(name: 'social_worker', field_name: 'owned_by', id_search: true)
  OWNED_BY = Header.new(name: 'owned_by', field_name: 'owned_by', id_search: true)
  OWNED_BY_AGENCY = Header.new(name: 'owned_by_agency', field_name: 'owned_by_agency', id_search: true)
  DATE_OF_INTERVIEW = Header.new(name: 'date_of_interview', field_name: 'date_of_first_report')
  DATE_OF_INCIDENT = Header.new(name: 'date_of_incident', field_name: 'incident_date_derived')
  VIOLENCE_TYPE = Header.new(name: 'violence_type', field_name: 'gbv_sexual_violence_type')
  INCIDENT_LOCATION = Header.new(name: 'incident_location', field_name: 'incident_location')
  VIOLATIONS = Header.new(name: 'violations', field_name: 'violations') 
  NAME_OF_INQUIRER = Header.new(name: 'name_of_inquirer', field_name: 'relation_name')
  DATE_OF_INQUIRY = Header.new(name: 'date_of_inquiry', field_name: 'inquiry_date')
  TRACING_REQUESTS = Header.new(name: 'tracing_requests', field_name: 'tracing_names')
  NAME = Header.new(name: 'name', field_name: 'name') 
  DESCRIPTION = Header.new(name: 'description', field_name: 'description')
  CASE_ID = Header.new(name: 'id', field_name: 'record_id_display')
  PRIORITY = Header.new(name: 'priority', field_name: 'priority')
  TYPE = Header.new(name: 'type', field_name: 'type')
  TYPE_DISPLAY = Header.new(name: 'type', field_name: 'type_display')
  DUE_DATE = Header.new(name: 'due_date', field_name: 'due_date')
  FILE_NAME = Header.new(name: 'file_name', field_name: 'file_name')
  RECORD_TYPE = Header.new(name: 'record_type', field_name: 'record_type')
  STARTED_ON = Header.new(name: 'started_on', field_name: 'started_on')
  TIMESTAMP = Header.new(name: 'timestamp', field_name: 'timestamp')
  USER_NAME = Header.new(name: 'user_name', field_name: 'user_name')
  ACTION = Header.new(name: 'action', field_name: 'action')
  RECORD_OWNER = Header.new(name: 'record_owner', field_name: 'record_owner')
  AGENCY_NAME = Header.new(name: 'agency.name', field_name: 'agency.name')
  FULL_NAME = Header.new(name: 'full_name', field_name: 'full_name')
  POSITION = Header.new(name: 'position', field_name: 'position')
  AGENCY = Header.new(name: 'agency', field_name: 'agency')
  USER_GROUP_NAME = Header.new(name: 'user_group.name', field_name: 'user_group.name')
  STATUS = Header.new(name: 'status', field_name: 'status')

  class << self

    def get_headers(user, record_type)
      case record_type
        when 'case' then case_headers(user)
        when 'incident' then incident_headers(user)
        when 'tracing_request' then tracing_request_headers
      end
    end

    def case_headers(user)
      header_list = []
      header_list << SHORT_ID
      # TODO: There's an id_search logic I'm not sure about
      header_list << CASE_NAME if user.has_module?(@primero_module_cp.id) && !user.is_manager?
      header_list << SURVIVOR_CODE if user.has_module?(@primero_module_gbv.id) && !user.is_manager?
      header_list << AGE if user.has_module?(@primero_module_cp.id)
      header_list << SEX if user.has_module?(@primero_module_cp.id)
      header_list << REGISTRATION_DATE if user.has_module?(@primero_module_cp.id)
      header_list << CASE_OPENING_DATE if user.has_module?(@primero_module_gbv.id) 
      header_list << PHOTO if user.has_module?(@primero_module_cp.id)
      header_list << SOCIAL_WORKER if user.is_manager?
      header_list << OWNED_BY if user.has_module?(@primero_module_cp.id)
      header_list << OWNED_BY_AGENCY if user.has_module?(@primero_module_cp.id)
      header_list
    end

    def incident_headers(user)
      header_list = []
      header_list << SHORT_ID
      header_list << DATE_OF_INTERVIEW  if user.has_module?(@primero_module_gbv.id)  || user.has_module?(@primero_module_cp.id)
      header_list << DATE_OF_INCIDENT
      header_list << VIOLENCE_TYPE if user.has_module?(@primero_module_gbv.id)  || user.has_module?(@primero_module_cp.id)
      header_list << INCIDENT_LOCATION if @primero_module_mrm.present? && user.has_module?(@primero_module_mrm.id)
      header_list << VIOLATIONS if user.is_manager?
      header_list
    end

    def tracing_request_headers
      [SHORT_ID, NAME_OF_INQUIRER, DATE_OF_INQUIRY, TRACING_REQUESTS]
    end

    def report_headers
      [NAME, DESCRIPTION]
    end

    def task_headers
      [CASE_ID, PRIORITY, TYPE_DISPLAY, DUE_DATE, STATUS]
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
  end

  def initialize(args={})
    super(args)
  end

  def inspect
    "Header(name: #{self.name}, field_name: #{self.field_name})"
  end

end
