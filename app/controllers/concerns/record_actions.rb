module RecordActions
  extend ActiveSupport::Concern

  include ImportActions
  include MarkForMobileActions
  include AuditLogActions

  included do
    skip_before_action :verify_authenticity_token, raise: false
    skip_before_action :authenticate_user!, :only => [:reindex], raise: false

    before_action :load_record, :except => [:new, :create, :index, :reindex]
    before_action :load_selected_records, :except => [:show, :update, :edit, :new, :create, :index, :reindex]
    before_action :current_user, :except => [:reindex]
    before_action :get_lookups, :only => [:show, :new, :edit, :index]
    before_action :current_modules, :only => [:show, :index] #TODO: We probably don't need this
    before_action :record_module, only: [:new, :create, :show, :edit, :update]
    before_action :is_manager, :only => [:index]
    before_action :is_admin, :only => [:index]
    before_action :is_cp, :only => [:index]
    before_action :is_gbv, :only => [:index]
    before_action :is_mrm, :only => [:index]
    before_action :load_consent, :only => [:show]
    before_action :load_default_settings, :only => [:index, :show, :edit, :request_approval, :approve_form, :transition]
    before_action :load_referral_role_options, :only => [:index, :show]
    before_action :load_transfer_role_options, :only => [:index, :show]
    before_action :load_filter_fields, only: [:index]
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
    @saved_searches = SavedSearch.where(user_name: current_user.user_name, record_type: model_class.name.underscore) if can? :read, SavedSearch
    #make sure to get all records when querying for ids to sync down to mobile
    #TODO: This is questionable for large databases. May break the phone? the server?
    #      Revisit when integrating in v1.3.x
    #params['page'] = 'all' if params['mobile'] && params['ids']
    @records, @total_records = retrieve_records_and_total(@filters)
    module_ids = @records.map{ |m| m.module.unique_id }.uniq if @records.present? && @records.is_a?(Array)
    @associated_agencies = User.agencies_for_user_names(@associated_users).map{|a| {a.id => a.name}}
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

          render :json => {
            results: @records,
            meta: {
              total: @total_records,
              per: @per_page,
            }
          }
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
        #TODO: Does that mean that all parts of the record are visible as json?
        @form_sections = grouped_permitted_forms
        sort_subforms
      end

      format.json do
        if @record.present?
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

    @form_sections = grouped_permitted_forms

    respond_to do |format|
      format.html
    end
  end

  def create
    authorize! :create, model_class
    @record = model_class.find_by_unique_identifier(record_params[:unique_identifier]) if record_params[:unique_identifier]
    if @record.nil?
      @record = model_class.new_with_user(current_user, record_params)
    else
      authorize! :update, @record
      merge_append_only_subforms(@record) if is_mobile?
      @record.update_properties(record_params, current_user.name)
    end
    instance_variable_set("@#{model_class.name.underscore}", @record)

    respond_to do |format|
      @form_sections = grouped_permitted_forms #TODO: This is an awkwardly placed call
      if @record.save
        flash[:notice] = t("#{model_class.locale_prefix}.messages.creation_success", record_id: @record.short_id)
        format.html { redirect_after_update }
        format.json do
          @record = clear_append_only_subforms(@record)
          @record = format_json_response(@record)
          render :json => @record, :status => :created, :location => @record
        end
      else
        format.html {
          get_lookups
          render :action => "new"
        }
        format.json { render :json => @record.errors, :status => :unprocessable_entity }
      end
    end
  end

  def edit
    if @record.nil?
      redirect_on_not_found
      return
    end

    authorize! :update, @record
    @form_sections = grouped_permitted_forms
    sort_subforms
    @page_name = t("#{model_class.locale_prefix}.edit")
  end

  def update
    authorize! :update, @record
    @record = model_class.find_by_unique_identifier(record_params[:unique_identifier]) if record_params[:unique_identifier]
    if @record.nil?
      authorize! :create, model_class
      @record = model_class.new_with_user(current_user, record_params)
    else
      merge_append_only_subforms(@record) if is_mobile?
      @record.update_properties(record_params, current_user.name)
    end
    instance_variable_set("@#{model_class.name.underscore}", @record)
    respond_to do |format|
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
          @record = clear_append_only_subforms(@record)
          @record = format_json_response(@record)
          render :json => @record.slice!("_attachments", "histories")
        end
      else
        @form_sections ||= grouped_permitted_forms
        format.html {
          get_lookups
          render :action => "edit"
        }
        format.json { render :json => @record.errors, :status => :unprocessable_entity }
      end
    end
  end

  def sort_subforms
    if @record.present? && @form_sections.present?
      #TODO: Whyt are form sections still grouped by english group name?
      @form_sections.values.flatten.each do |form|
        unless form.is_nested?
          form.fields.each do |field|
            if field.subform_sort_by.present?
              if @record.data[field.name].present?
                # Partitioning because dates can be nil. In this case, it causes an error on sort.
                subforms = @record.data[field.name].partition{|r| r[field.subform_sort_by].nil?}
                @record.data[field.name] = subforms.first + subforms.last.sort_by{|x| x[field.subform_sort_by]}.reverse
              end
            end
          end
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
        records = model_class.where(id: selected_record_ids)
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
    @lookups = Lookup.all
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

  def record_module
    params_module_id = (params['module_id'] || (params['child'].try(:[], 'module_id')))

    if @record.present? && @record.module_id.present?
      @record_module ||= @record.module
    elsif params_module_id.present?
      @record_module ||= PrimeroModule.find_by(unique_id: params_module_id)
    else
      @record_module ||= current_user.modules.first
    end
  end

  def current_modules
    record_type = model_class.parent_form
    @current_modules ||= current_user.modules_for_record_type(record_type)
  end

  def is_admin
    @is_admin ||= @current_user.admin?
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
    if @record_params.blank?
      param_root = model_class.name.underscore
      @record_params = params[param_root].try(:to_h) || {}
      @record_params = DestringifyService.destringify(@record_params)
      @record_params = filter_permitted_params(@record_params) #TODO: This business logic may need to be moved to a service
    end
    @record_params.with_indifferent_access
  end

  # All the stuff that isn't properties that should be allowed
  # TODO: Clean this up with
  def extra_permitted_parameters
    ['unique_identifier', 'record_state', 'upload_bid_document', 'update_bid_document',
     'upload_other_document', 'update_other_document', 'upload_bia_document', 'update_bia_document']
  end

  def permitted_property_keys
    current_user.permitted_fields(@record_module, model_class.parent_form, true).map(&:name) + extra_permitted_parameters
  end

  # Filters out any un-allowed parameters for the current user
  # TODO: This business logic may need to be moved to a service
  def filter_permitted_params(record_params)
    permitted_keys = permitted_property_keys
    record_params.select{|k,_| permitted_keys.include?(k) }
  end

  def load_record
    if params[:id].present?
      @record = model_class.find(params[:id])
    end

    # Alias the record to a more specific name since the record controllers
    # already use it
    instance_variable_set("@#{model_class.name.underscore}", @record)
  end

  #TODO: Is this load invoked twice?
  def load_selected_records
    @records = []
    if params[:selected_records].present?
      selected_ids = params[:selected_records].split(',')
      @records = model_class.where(id: selected_ids)
    end

    # Alias the records to a more specific name since the record controllers
    # already use it
    instance_variable_set("@#{model_class.name.pluralize.underscore}", @records)
  end

  #TODO: Refactor UIUX
  def load_consent
    if @record.present? && @record.respond_to?(:given_consent) #Yuck!
      @referral_consent = @record.given_consent(Transition::REFERRAL)
      @transfer_consent = @record.given_consent(Transition::TRANSFER)
    end
  end

  def load_filter_fields
    filter_field_names = %w(
      gbv_displacement_status protection_status urgent_protection_concern
      protection_concerns type_of_risk
    )
    @filter_fields = Field.get_by_name(filter_field_names).map{|f| [f.name, f]}.to_h
  end

  private

  #Discard nil values and empty arrays.
  def format_json_response(record)
    record = record.data.clone
    if params[:mobile].present?
      record.each do |field_key, value|
        if value.kind_of? Array
          if value.size == 0
            record.delete(field_key)
          elsif value.first.respond_to?(:each)
            value = value.map do |v|
              nested = v.clone
              v.each do |field_key, value|
                nested.delete(field_key) if !value.present?
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

  def module_users(module_ids)
    @module_users = User.by_modules(module_ids).map(&:user_name).reject {|u| u == current_user.user_name}
  end

  def clear_append_only_subforms(record)
    if is_mobile?
      Field.find_with_append_only_subform.each do |field|
        record.data[field.name] = []
      end
    end
    return record
  end

  def is_mobile?
    params[:mobile].present? && params[:mobile] == 'true'
  end

  protected

  #Override method in AuditLogActions.
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

  #Override method in AuditLogActions.
  def logger_display_id
    return @record.display_id if @record.present? && @record.respond_to?(:display_id)
    return @records.map{|r| r.display_id} if @records.present? && @records.first.respond_to?(:display_id)
    super
  end

  #Override method in AuditLogActions.
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

  #Override method in AuditLogActions.
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

  #Override method in AuditLogActions.
  def logger_owned_by
    return @record.owned_by if @record.present? && @record.respond_to?(:owned_by)
    return @records.map{|r| r.owned_by} if @records.present? && @records.first.respond_to?(:owned_by)
    super
  end

  def merge_append_only_subforms(record)
    # TODO: Although all subforms are being merged through Utils#merge_data (see Record.rb)
    # this code makes sure we don't delete old subforms if they are not present. This can happen
    # because subform_append_only subforms get removed from the mobile app, a user can push an update
    # without subforms and that doesn't mean he wants to delete them.
    Field.find_with_append_only_subform.each do |field|
      # Since this only happens if the mobile param is true, the subform section has to be an Array, we don't merge otherwise.
      if !@record_params[field.name].nil? && @record_params[field.name].is_a?(Array)
        record_subforms = (record.data[field.name] || [])
        param_subforms = @record_params[field.name]
        # If for any reason a user sends updates to existing forms, we will update them.
        unchanged_subforms = record_subforms.reject {|old_subform| param_subforms.any?{ |new_subform| old_subform["unique_id"] == new_subform["unique_id"] } }
        @record_params[field.name] = unchanged_subforms + param_subforms
      end
    end
  end

  # Recursively parse and cast a hash of string values to Dates, DateTimes, Integers, Booleans.
  # If all keys in a hash are numeric, convert it to an array.
  def destringify(value)
    case value
    when nil, ""
      nil
    when ::ActiveSupport::JSON::DATE_REGEX
      begin
        Date.parse(value)
      rescue ArgumentError
        value
      end
    when ::ActiveSupport::JSON::DATETIME_REGEX
      begin
        Time.zone.parse(value)
      rescue ArgumentError
        value
      end
    when ::PrimeroDate::DATE_REGEX  #TODO: This is a hack, but we'll fix dates later
      begin
        PrimeroDate.parse_with_format(value)
      rescue ArgumentError
        value
      end
    when /^(true|false)$/
      ::ActiveRecord::Type::Boolean.new.cast(value)
    when /^\d+$/
      value.to_i
    when Array
      value.map{|v| destringify(v)}
    when Hash
      has_numeric_keys = value.keys.reduce(true){|memo, k| memo && k.match?(/^\d+$/)}
      if has_numeric_keys
        value.sort_by{|k,_| k.to_i}.map{|_,v| destringify(v)}
      else
        value.map{|k,v| [k, destringify(v)]}.to_h
      end
    else
      value
    end
  end

  def grouped_permitted_forms
    FormSection.group_forms(current_user.permitted_forms(@record.module, @record.class.parent_form, true))
  end

end
