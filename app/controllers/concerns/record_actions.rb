module RecordActions
  extend ActiveSupport::Concern

  include ImportActions
  include ExportActions
  include TransitionActions
  include MarkForMobileActions
  include LoggerActions

  included do
    skip_before_action :verify_authenticity_token, raise: false
    skip_before_action :check_authentication, :only => [:reindex], raise: false

    before_action :load_record, :except => [:new, :create, :index, :reindex]
    before_action :load_selected_records, :except => [:show, :update, :edit, :new, :create, :index, :reindex]
    before_action :current_user, :except => [:reindex]
    before_action :get_lookups, :only => [:show, :new, :edit, :index]
    before_action :current_modules, :only => [:show, :index]
    before_action :is_manager, :only => [:index]
    before_action :is_admin, :only => [:index]
    before_action :is_cp, :only => [:index]
    before_action :is_gbv, :only => [:index]
    before_action :is_mrm, :only => [:index]
    before_action :load_consent, :only => [:show]
    before_action :sort_subforms, :only => [:show, :edit]
    before_action :load_default_settings, :only => [:index, :show, :edit, :request_approval, :approve_form, :transition]
    before_action :load_referral_role_options, :only => [:index, :show]
    before_action :load_transfer_role_options, :only => [:index, :show]
    before_action :log_controller_action, :except => [:new]
    before_action :can_access_approvals, :only => [:index]
    before_action :can_sync_mobile, :only => [:index]
    before_action :can_view_protection_concerns_filter, :only => [:index]
    before_action :display_view_page, :only => [:index]
    before_action :view_reporting_filter, :only => [:index]
    before_action :can_request_transfer, :only => [:index, :quick_view]
    before_action :can_view_photo, :only => [:quick_view]
  end

  def list_variable_name
    model_class.name.pluralize.underscore
  end

  def index
    authorize! :index, model_class
    @page_name = t("home.view_records")
    @aside = 'shared/sidebar_links'
    @associated_users = current_user.managed_user_names
    @filters = record_filter(filter)
    @saved_searches = SavedSearch.by_user_name_and_record_type(key: [current_user.user_name, model_class.name.underscore]).all if can? :read, SavedSearch
    #make sure to get all records when querying for ids to sync down to mobile
    #TODO: This is questionable for large databases. May break the phone? the server?
    #      Revisit when integrating in v1.3.x
    #params['page'] = 'all' if params['mobile'] && params['ids']
    @records, @total_records = retrieve_records_and_total(@filters)
    module_ids = @records.map(&:module_id).uniq if @records.present? && @records.is_a?(Array)
    @associated_agencies = User.agencies_by_user_list(@associated_users).map{|a| {a.id => a.name}}
    @options_reporting_locations = Location.find_names_by_admin_level_enabled(@admin_level, @reporting_location_hierarchy_filter, locale: I18n.locale)
    module_users(module_ids) if module_ids.present?
    # Alias @records to the record-specific name since ERB templates use that
    # right now
    # TODO: change the ERB templates to just accept the @records instance
    # variable
    instance_variable_set("@#{list_variable_name}", @records)

    @per_page = per_page

    # @highlighted_fields = []
    respond_to do |format|
      format.html do
        if params[:query].present? && @id_search.present? && !@records.present?
          if params[:redirect_not_found].present?
            flash[:notice] = t('case.id_search_no_results', id: params[:query])
            redirect_to new_case_path(module_id: params[:module_id])
          else
            # Use flash.now so message does not appear on next request (i.e. if you click to another page)
            flash.now[:notice] = t('case.id_search_no_results', id: params[:query])
          end
        end
      end
      unless params[:password]
        format.json do
          @records = @records.select{|r| r.marked_for_mobile} if params[:mobile].present?
          if params[:ids].present?
            @records = @records.map{|r| r.id}
          else
            @records = @records.map{|r| format_json_response(r)}
          end

          render :json => @records
        end
      end
      #TODO v1.3: We are losing the use case of not exporting an empty set with bulk exports.
      #      In the case of a bulk export the controller doesnt do the counting.
      #      In the case of a selected records export, we know what records are selected
      # unless params[:format].nil? || params[:format] == 'json' || (params[:page] == 'all')
      #   if @records.empty?
      #     flash[:notice] = t('exports.no_records')
      #     redirect_to :action => :index and return
      #   end
      # end
      respond_to_export format, @records
    end
  end

  def show
    authorize! :read, (@record || model_class)

    @associated_users = current_user.managed_user_names
    module_users([@record.module_id]) if @record.present?

    respond_to do |format|
      format.html do
        if @record.nil?
          redirect_on_not_found
          return
        end

        @page_name = t "#{model_class.locale_prefix}.view", :short_id => @record.short_id
        @body_class = 'profile-page'
        @form_sections = @record.class.allowed_formsections(current_user, @record.module, lookups: @lookups)
      end

      format.json do
        if @record.present?
          # TODO: This method is doing an incorrect assumption about that the name of the FormSection is identical to the name of the Field that contains it.
          # For example: A form parent_form_1 can have a subform field subform_field_1 and the actual subform can be called subform_1 instead of subform_field_1.
          @record = clear_append_only_subforms(@record)
          @record = format_json_response(@record)
          render :json => @record
        else
          render :json => '', :status => :not_found
        end
      end unless params[:password]

      respond_to_export format, [ @record ]
    end
  end

  def new
    authorize! :create, model_class

    # Ugh...why did we make two separate locale namespaces for each record type (cases/children have four)?
    @page_name = t("#{model_class.locale_prefix.pluralize}.register_new_#{model_class.locale_prefix}")

    @record = make_new_record
    # TODO: make the ERB templates use @record
    instance_variable_set("@#{model_class.name.underscore}", @record)
    @form_sections = @record.class.allowed_formsections(current_user, @record.module, lookups: @lookups)

    respond_to do |format|
      format.html
    end
  end

  def create
    authorize! :create, model_class
    reindex_hash record_params
    @record = create_or_update_record(params[:id])
    initialize_created_record(@record)
    respond_to do |format|
      if @record.save
        post_save_processing @record
        flash[:notice] = t("#{model_class.locale_prefix}.messages.creation_success", record_id: @record.short_id)
        format.html { redirect_after_update }
        format.json do
          # TODO: This method is doing an incorrect assumption about that the name of the FormSection is identical to the name of the Field that contains it.
          # For example: A form parent_form_1 can have a subform field subform_field_1 and the actual subform can be called subform_1 instead of subform_field_1.
          @record = clear_append_only_subforms(@record)
          @record = format_json_response(@record)
          render :json => @record, :status => :created, :location => @record
        end
      else
        format.html {
          get_lookups
          @form_sections = @record.class.allowed_formsections(current_user, @record.module, lookups: @lookups)
          render :action => "new"
        }
        format.json { render :json => @record.errors, :status => :unprocessable_entity }
      end
    end
  end

  def post_save_processing record
    # This is for operation after saving the record.
  end

  def edit
    if @record.nil?
      redirect_on_not_found
      return
    end

    authorize! :update, @record

    @form_sections = @record.class.allowed_formsections(current_user, @record.module, lookups: @lookups)
    @page_name = t("#{model_class.locale_prefix}.edit")
  end

  def update
    respond_to do |format|
      create_or_update_record(params[:id])
      if @record.save
        format.html do
          flash[:notice] = I18n.t("#{model_class.locale_prefix}.messages.update_success", record_id: @record.short_id)
          if params[:redirect_url]
            redirect_to "#{params[:redirect_url]}?follow=true"
          else
            redirect_after_update
          end
        end
        format.json do
          # TODO: This method is doing an incorrect assumption about that the name of the FormSection is identical to the name of the Field that contains it.
          # For example: A form parent_form_1 can have a subform field subform_field_1 and the actual subform can be called subform_1 instead of subform_field_1.
          @record = clear_append_only_subforms(@record)
          @record = format_json_response(@record)
          render :json => @record.slice!("_attachments", "histories")
        end
      else
        get_lookups
        @form_sections ||= @record.class.allowed_formsections(current_user, @record.module, lookups: @lookups)
        format.html {
          render :action => "edit"
        }
        format.json { render :json => @record.errors, :status => :unprocessable_entity }
      end
    end
  end

  def sort_subforms
    if @record.present?
      @record.field_definitions.select{|f| !f.subform_sort_by.nil?}.each do |field|
        if @record[field.name].present?
          # Partitioning because dates can be nil. In this case, it causes an error on sort.
          subforms = @record[field.name].partition{|r| r[field.subform_sort_by].nil?}
          @record[field.name] = subforms.first + subforms.last.sort_by{|x| x[field.subform_sort_by]}.reverse
        end
      end
    end
  end

  def redirect_on_not_found
    respond_to do |format|
      format.html do
        flash[:error] = "#{model_class.name.underscore.capitalize.sub('_', ' ')} with the given id is not found"
        redirect_to :action => :index
        return
      end
    end
  end

  def retrieve_records_and_total(filter)
    records = []
    total_records = 0
    if params["selected_records"].present?
      selected_record_ids = params["selected_records"].split(',')
      if selected_record_ids.present?
        records = model_class.all(keys: selected_record_ids).all
        total_records = records.size
      end
    #NOTE: params[:page] is 'all' during bulk export.
    # That's fine.  The record retrieval is handled in bulk export.
    # 'all' should not be used for other invocations.
    # When mobile is implemented, it should not use 'all'
    elsif params[:page] != 'all'
      @id_search = params[:id_search]
      search = model_class.list_records(filter, order, pagination, users_filter, params[:query], params[:match])
      records = search.results
      total_records = search.total
    end
    [records, total_records]
  end

  #TODO - Primero - Refactor needed.  Determine more elegant way to load the lookups.
  def get_lookups
    @lookups = Lookup.all.all
  end

  def load_default_settings
    if @system_settings.present? && @system_settings.reporting_location_config.present?
      @admin_level ||= @system_settings.reporting_location_config.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL
      @reporting_location ||= @system_settings.reporting_location_config.field_key || ReportingLocation::DEFAULT_FIELD_KEY
      @reporting_location_label ||= @system_settings.reporting_location_config.label_key || ReportingLocation::DEFAULT_LABEL_KEY
      #NOTE: @system_settings.reporting_location_config.reg_ex_filter is deprecated
      @reporting_location_hierarchy_filter ||= @system_settings.reporting_location_config.hierarchy_filter || nil
    else
      @admin_level ||= ReportingLocation::DEFAULT_ADMIN_LEVEL
      @reporting_location ||= ReportingLocation::DEFAULT_FIELD_KEY
      @reporting_location_label ||= ReportingLocation::DEFAULT_LABEL_KEY
      @reporting_location_hierarchy_filter ||= nil
    end
  end

  def load_referral_role_options
    @referral_role_options ||= Role.names_and_ids_by_referral
  end

  def load_transfer_role_options
    @transfer_role_options ||= Role.names_and_ids_by_transfer
  end

  # This is to ensure that if a hash has numeric keys, then the keys are sequential
  # This cleans up instances where multiple forms are added, then 1 or more forms in the middle are removed
  def reindex_hash(a_hash)
    a_hash.each do |key, value|
      if value.is_a?(Hash) and value.present?
        #if this is a hash with numeric keys, do the re-index, else keep searching
        if value.keys[0].is_number?
          new_hash = {}
          count = 0
          value.each do |k, v|
            new_hash[count.to_s] = v
            count += 1
          end
          value.replace(new_hash)
        else
          reindex_hash(value)
        end
      end
    end
  end

  def current_modules
    record_type = model_class.parent_form
    @current_modules ||= current_user.modules.select{|m| m.associated_record_types.include? record_type}
  end

  def is_admin
    @is_admin ||= @current_user.is_admin?
  end

  def is_manager
    @is_manager ||= @current_user.is_manager?
  end

  def is_cp
    @is_cp ||= @current_user.has_module?(PrimeroModule::CP)
  end

  def is_gbv
    @is_gbv ||= @current_user.has_module?(PrimeroModule::GBV)
  end

  def is_mrm
    @is_mrm ||= @current_user.has_module?(PrimeroModule::MRM)
  end

  def can_access_approvals
    @can_approval_bia = can?(:approve_bia, model_class) || can?(:request_approval_bia, model_class)
    @can_approval_case_plan = can?(:approve_case_plan, model_class) || can?(:request_approval_case_plan, model_class)
    @can_approval_closure = can?(:approve_closure, model_class) || can?(:request_approval_closure, model_class)
    @can_approvals = @can_approval_bia || @can_approval_case_plan || @can_approval_closure
  end

  def can_view_protection_concerns_filter
    @can_view_protection_concerns_filter = can?(:view_protection_concerns_filter, model_class)
  end

  def can_sync_mobile
    @can_sync_mobile = can?(:sync_mobile, model_class)
  end

  def display_view_page
    @can_display_view_page = can?(:display_view_page, model_class)
  end

  def can_request_transfer
    @can_request_transfer = can?(:request_transfer, model_class)
  end

  def can_view_photo
    @can_view_photo = can?(:view_photo, model_class)
  end

  def view_reporting_filter
    #TODO: This will change once the filters become configurable
    @can_view_reporting_filter = (can?(:dash_reporting_location, Dashboard) | is_admin | is_manager) && @current_user.has_reporting_location_filter?
  end

  def record_params
    param_root = model_class.name.underscore
    params[param_root].try(:to_h) || {}
  end

  # All the stuff that isn't properties that should be allowed
  def extra_permitted_parameters
    ['base_revision', 'unique_identifier', 'record_state', 'upload_bid_document', 'update_bid_document',
     'upload_other_document', 'update_other_document', 'upload_bia_document', 'update_bia_document']
  end

  def permitted_property_keys(record, user = current_user, read_only_user = false)
    record.class.permitted_property_names(user, record.module, read_only_user) + extra_permitted_parameters
  end

  # Filters out any unallowed parameters for a record and the current user
  def filter_params(record)
    permitted_keys = permitted_property_keys(record)
    record_params.select{|k,v| permitted_keys.include?(k) }
  end

  def record_short_id
    record_params.try(:fetch, :short_id, nil) || record_params.try(:fetch, :unique_identifier, nil).try(:last, 7)
  end

  def load_record
    if params[:id].present?
      @record = model_class.get(params[:id])
    end

    # Alias the record to a more specific name since the record controllers
    # already use it
    instance_variable_set("@#{model_class.name.underscore}", @record)
  end

  def load_selected_records
    @records = []
    if params[:selected_records].present?
      selected_ids = params[:selected_records].split(',')
      @records = model_class.all(keys: selected_ids).all
    end

    # Alias the records to a more specific name since the record controllers
    # already use it
    instance_variable_set("@#{model_class.name.pluralize.underscore}", @records)
  end

  def load_consent
    if @record.present?
      @referral_consent = @record.given_consent(Transition::TYPE_REFERRAL)
      @transfer_consent = @record.given_consent(Transition::TYPE_TRANSFER)
    end
  end

  #This overrides method in export_actions
  def export_properties(exporter)
    authorized_export_properties(exporter, current_user, @current_modules, model_class)
  end

  private

  #Discard nil values and empty arrays.
  def format_json_response(record)
    record = record.as_couch_json.clone
    if params[:mobile].present?
      record.each do |field_key, value|
        if value.kind_of? Array
          if value.size == 0
            record.delete(field_key)
          elsif value.first.respond_to?(:each)
            value = value.map do |v|
              nested = v.clone
              v.each do |field_key, value|
                if value.to_s.blank? || ((value.is_a?(Array) || value.is_a?(Hash)) && value.blank?)
                  nested.delete(field_key)
                end
              end
              nested
            end
            record[field_key] = value
          end
        end
      end
    end
    return record
  end

  def create_or_update_record(id)
    @record = model_class.by_short_id(:key => record_short_id).first if record_params[:unique_identifier]
    if @record.nil?
      @record = model_class.new_with_user_name(current_user, record_params)
    else
      @record = update_record_from(id)
    end

    instance_variable_set("@#{model_class.name.underscore}", @record)
  end

  def update_record_from(id)
    authorize! :update, @record

    reindex_hash record_params
    @record_filtered_params = filter_params(@record)
    merge_append_only_subforms(@record) if has_mobile_param?
    update_record_with_attachments(@record)
  end

  def module_users(module_ids)
    @module_users = User.find_by_modules(module_ids).map(&:user_name).reject {|u| u == current_user.user_name}
  end

  def clear_append_only_subforms(record)
    # TODO: This method is doing an incorrect assumption about that the name of the FormSection is identical to the name of the Field that contains it.
    # For example: A form parent_form_1 can have a subform field subform_field_1 and the actual subform can be called subform_1 instead of subform_field_1.
    if has_mobile_param?
      FormSection.get_append_only_subform_ids.each do |subform_id|
        record.try("#{subform_id}=", [])
      end
    end
    return record
  end

  def has_mobile_param?
    params[:mobile].present? && params[:mobile] == 'true'
  end

  protected

  #Override method in LoggerActions.
  def logger_action_identifier
    if @record.respond_to?(:case_id_display)
      "#{logger_model_titleize} '#{@record.case_id_display}'"
    elsif @record.present?
      "#{logger_model_titleize} '#{@record.id}'"
    elsif action_name == "transition" || action_name == "mark_for_mobile" || (action_name == "index" && params[:format].present?)
      if params[:selected_records].present?
        "#{params[:selected_records].split(",").length} #{logger_model_titleize.pluralize}"
      elsif params[:id].blank?
        logger_model_titleize.pluralize
      else
        super
      end
    else
      super
    end
  end

  #Override method in LoggerActions.
  def logger_display_id
    return @record.display_id if @record.present? && @record.respond_to?(:display_id)
    return @records.map{|r| r.display_id} if @records.present? && @records.first.respond_to?(:display_id)
    super
  end

  #Override method in LoggerActions.
  #TODO v1.3: make sure the mobile syncs are audited
  def logger_action_name
    if (action_name == "show" && params[:format].present?) || (action_name == "index" && params[:format].present?)
      #Export action take on the show controller method.
      #In order to know that is an "Export" use the <format>.
      #Empty <format> is for read view.
      'export'
    elsif action_name == "transition"
      #Transition is the action but does not says what kind of transition is
      #So must use the transition_type parameters to know that.
      transition_type
    elsif action_name == "mark_for_mobile"
      #The effective action on the record is at the parameter <mobile_value>.
      "mark_for_mobile.#{params[:mobile_value]}"
    elsif action_name == "request_approval"
      #The effective action on the record is at the parameter <approval_type>.
      "request_approval.#{params[:approval_type]}"
    elsif action_name == "approve_form"
      #The effective action on the record is at the parameter <approval_type> and <approval>.
      "approve_form.#{params[:approval] || "false"}"
      # "#{I18n.t("logger.approve_form.#{params[:approval] || "false"}", :locale => :en)} #{I18n.t("logger.approve_form.#{params[:approval_type]}", :locale => :en)}"
    elsif action_name == "transfer_status"
      "transfer_status.#{params[:transition_status]}"
    else
      super
    end
  end

  #Override method in LoggerActions.
  def logger_action_suffix
    if (action_name == "show" && params[:format].present?) || (action_name == "index" && params[:format].present?)
      #Action is an export.
      "#{I18n.t("logger.to", :locale => :en)} #{params[:format].upcase} #{by_action_user}"
    elsif action_name == "transition"
      if params[:is_remote] == "true"
        users = "'#{params[:other_user]}'"
        if params[:other_user_agency].present?
          users = "#{users}, '#{params[:other_user_agency]}'"
        end
      else
        users = "'#{params[:existing_user]}'"
      end
      "#{by_action_user} #{I18n.t("logger.to_user", :locale => :en)} #{users}"
    else
      super
    end
  end

  #Override method in LoggerActions.
  def logger_owned_by
    return @record.owned_by if @record.present? && @record.respond_to?(:owned_by)
    return @records.map{|r| r.owned_by} if @records.present? && @records.first.respond_to?(:owned_by)
    super
  end

  def merge_append_only_subforms(record)
    FormSection.get_append_only_subform_ids.each do |subform_id|
      # Since this only happens if the mobile param is true, the subform section has to be an Array, we don't merge otherwise.
      if @record_filtered_params[subform_id].present? && @record_filtered_params[subform_id].is_a?(Array)
        record_subforms = (record.try(subform_id) || []).map(&:attributes)
        param_subforms = @record_filtered_params[subform_id]
        # If for any reason a user sends updates to existing forms, we will update them.
        unchanged_subforms = record_subforms.reject {|old_subform| param_subforms.any?{ |new_subform| old_subform["unique_id"] == new_subform["unique_id"] } }
        @record_filtered_params[subform_id] = unchanged_subforms + param_subforms
      end
    end
  end
end
