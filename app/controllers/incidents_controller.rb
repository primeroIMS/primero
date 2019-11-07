class IncidentsController < ApplicationController
  @model_class = Incident

  include RecordFilteringPagination

  #before_action :normalize_violations, :only => [:create, :update] #TODO: Refactor with violations
  before_action :load_fields, :only => [:index]
  #TODO: Do we need to sanitize params?
  #TODO: Dp we need to filter_params_array_duplicates?

  include RecordActions

  #TODO: Refactor with Violations
  def normalize_violations
    if params['incident'].present? && params['incident']['violations'].present?
      violations_subforms_control_keys = []
      # Save the keys for control inputs created when removing the last violation subform.
      params['incident']['violations'].keys.each { |key| violations_subforms_control_keys << key if params['incident']['violations'][key].is_a? String }

      params['incident']['violations'].each do |k, v|
        if v.present?
          v.each do |sk, sv|
            has_values_present = sv.any? do |fk, fv|
              fk == 'unique_id' ? false : fv.present?
            end
            unless has_values_present
              params['incident']['violations'][k].delete(sk)
            end
          end
          params['incident']['violations'].delete(k) if !params['incident']['violations'][k].present?
        end
      end

      violations_subforms_control_keys.each {|key| params['incident']['violations'][key] = ""}
    end
  end

  #TODO: Refactor with Violations
  def create_cp_case_from_individual_details
    authorize! :create, Child
    incident_id = params[:incident_id]
    individual_details_subform_section = params[:individual_details_subform_section]
    redirect_to new_case_path({module_id: PrimeroModule::CP, incident_id: incident_id, individual_details_subform_section: individual_details_subform_section })
  end

  private

  def load_fields
    @gbv_sexual_violence_type_field = Field.get_by_name('gbv_sexual_violence_type')
    @agency_offices = Lookup.values('lookup-agency-office')
    @user_group_ids = UserGroup.all.map(&:id)
  end

  def extra_permitted_parameters
    super + ['violations']
  end

  def make_new_record
    case_record = params['case_id'].present? ? Child.find_by(id: params['case_id']) : nil
    Incident.new_incident_from_case(params['module_id'], case_record)
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

end
