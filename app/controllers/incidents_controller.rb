class IncidentsController < ApplicationController
  @model_class = Incident

  include IndexHelper
  include RecordFilteringPagination

  before_action :normalize_violations, :only => [:create, :update]
  before_action :load_fields, :only => [:index]
  #TODO: Do we need to sanitize params?
  #TODO: Dp we need to filter_params_array_duplicates?

  include RecordActions

  def normalize_violations
    if params['incident'].present? && params['incident']['violations'].present?
      violations_hash = params['incident']['violations'].is_a?(ActionController::Parameters) ? params['incident']['violations'].to_h : params['incident']['violations']

      violations_subforms_control_keys = []
      # Save the keys for control inputs created when removing the last violation subform.
      violations_hash.keys.each { |key| violations_subforms_control_keys << key if violations_hash[key].is_a? String }

      violations_hash.each do |k, v|
        if v.present?
          v.each do |sk, sv|
            has_values_present = sv.any? do |fk, fv|
              fk == 'unique_id' ? false : fv.present?
            end
            unless has_values_present
              violations_hash[k].delete(sk)
            end
          end
          violations_hash.delete(k) if !violations_hash[k].present?
        end
      end

      violations_subforms_control_keys.each {|key| violations_hash[key] = ""}
    end
  end

  def create_cp_case_from_individual_details
    authorize! :create, Child
    incident_id = params[:incident_id]
    individual_details_subform_section = params[:individual_details_subform_section]
    redirect_to new_case_path({module_id: PrimeroModule::CP, incident_id: incident_id, individual_details_subform_section: individual_details_subform_section })
  end

  private

  def load_fields
    @gbv_sexual_violence_type_field = Field.find_by_name_from_view('gbv_sexual_violence_type')
    @agency_offices = Lookup.values('lookup-agency-office')
    @user_group_ids = UserGroup.all.rows.map(&:id).uniq
  end

  def extra_permitted_parameters
    super + ['violations']
  end

  def make_new_record
    case_record = params['case_id'].present? ? Child.get(params['case_id']) : nil
    Incident.make_new_incident(params['module_id'], case_record)
  end

  def post_save_processing incident
    # This is for operation after saving the record.
    case_id = params["incident_case_id"]
    if case_id.present? && incident.valid?
      #The Incident is being created from a GBV Case.
      #track the incident in the GBV case (incident_links)
      case_record = Child.get(case_id)
      case_record.incident_links << incident.id
      #TODO what if fails to save at this point? should rollback the incident?
      case_record.save
    end
  end

  def initialize_created_record incident
    incident['status'] = Record::STATUS_OPEN if incident['status'].blank?
  end

  def redirect_after_update
    redirect_to incident_path(@incident, { follow: true })
  end

  def redirect_after_deletion
    redirect_to(incidents_url)
  end

  def redirect_to_list
    redirect_to incidents_path(scope: {:status => "list||#{Record::STATUS_OPEN}", :record_state => "list||true"})
  end

  def record_filter filter
    #The 'Incident Recorder' should retrieve only GBV Incidents.
    filter["module_id"] = {:type => "single", :value => "#{PrimeroModule::GBV}"} if params["format"] == "incident_recorder_xls"
    filter
  end

  def update_record_with_attachments(incident)
    incident.update_properties(@record_filtered_params, current_user_name)
    incident
  end

end
