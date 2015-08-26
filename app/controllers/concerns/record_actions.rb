module RecordActions
  extend ActiveSupport::Concern

  include ImportActions
  include ExportActions
  include TransitionActions
  include MarkForMobileActions

  included do
    skip_before_filter :verify_authenticity_token
    skip_before_filter :check_authentication, :only => [:reindex]

    before_filter :load_record, :except => [:new, :create, :index, :reindex]
    before_filter :current_user, :except => [:reindex]
    before_filter :get_lookups, :only => [:new, :edit, :index]
    before_filter :load_locations, :only => [:new, :edit]
    before_filter :current_modules, :only => [:show, :index]
    before_filter :is_manager, :only => [:index]
    before_filter :is_cp, :only => [:index]
    before_filter :is_gbv, :only => [:index]
    before_filter :is_mrm, :only => [:index]
    before_filter :load_consent, :only => [:show]
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
    @records, @total_records = retrieve_records_and_total(@filters)

    @referral_roles = Role.by_referral.all
    @transfer_roles = Role.by_transfer.all
    module_ids = @records.map(&:module_id).uniq if @records.present? && @records.is_a?(Array)
    module_users(module_ids) if module_ids.present?

    # Alias @records to the record-specific name since ERB templates use that
    # right now
    # TODO: change the ERB templates to just accept the @records instance
    # variable
    instance_variable_set("@#{list_variable_name}", @records)

    @per_page = per_page

    # @highlighted_fields = []

    respond_to do |format|
      format.html
      format.json { render :json => @records.map{|r| r.as_couch_json} } unless params[:password]

      unless params[:format].nil? || params[:format] == 'json'
        if @records.empty?
          flash[:notice] = t('exports.no_records')
          redirect_to :action => :index and return
        end
      end

      respond_to_export format, @records
    end
  end

  def show
    authorize! :read, (@record || model_class)

    @referral_roles = Role.by_referral.all
    @transfer_roles = Role.by_transfer.all
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
        @duplicates = model_class.duplicates_of(params[:id])
        @form_sections = @record.allowed_formsections(current_user)
      end

      format.json do
        if @record.present?
          render :json => @record.as_couch_json
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

    @form_sections = @record.allowed_formsections(current_user)

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
      @form_sections = @record.allowed_formsections(current_user)
      if @record.save
        post_save_processing @record
        flash[:notice] = t("#{model_class.locale_prefix}.messages.creation_success", record_id: @record.short_id)
        format.html { redirect_after_update }
        format.json { render :json => @record.as_couch_json, :status => :created, :location => @record }
      else
        format.html {
          get_lookups
          load_locations
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

    @form_sections = @record.allowed_formsections(current_user)
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
        format.json { render :json => @record.as_couch_json }
      else
        @form_sections ||= @record.allowed_formsections(current_user)
        format.html {
          get_lookups
          load_locations
          render :action => "edit"
        }
        format.json { render :json => @record.errors, :status => :unprocessable_entity }
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
    if params["page"] == "all"
      pagination_ops = {:page => 1, :per_page => 100}
      records = []
      begin
        search = model_class.list_records filter, order, pagination_ops, users_filter, params[:query], @match_criteria
        results = search.results
        records.concat(results)
        #Set again the values of the pagination variable because the method modified the variable.
        pagination_ops[:page] = results.next_page
        pagination_ops[:per_page] = 100
      end until results.next_page.nil?
      total_records = search.total
    else
      search = model_class.list_records filter, order, pagination, users_filter, params[:query], @match_criteria
      records = search.results
      total_records = search.total
    end
    [records, total_records]
  end

  #TODO - Primero - Refactor needed.  Determine more elegant way to load the lookups.
  def get_lookups
    @lookups = Lookup.all
  end

  def load_locations
    @locations = Location.all_names
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

  def record_params
    param_root = model_class.name.underscore
    params[param_root] || {}
  end

  # All the stuff that isn't properties that should be allowed
  def extra_permitted_parameters
    ['base_revision', 'unique_identifier', 'upload_document', 'update_document']
  end

  def permitted_property_keys(record, user = current_user)
    record.permitted_property_names(user) + extra_permitted_parameters
  end

  # Filters out any unallowed parameters for a record and the current user
  def filter_params(record)
    permitted_keys = permitted_property_keys(record)
    record_params.select {|k,v| permitted_keys.include?(k) }
  end

  #TODO: This method will be very slow for very large exports: models.size > 1000.
  #      One such likely case will be the GBV IR export. We may need to either explicitly ignore it,
  #      pull out the recursion (this is there for nested forms, and it may be ok to grant access to the entire nest),
  #      or have a more efficient way of determining the `all_permitted_keys` set.
  def filter_permitted_export_properties(models, props, user = current_user)
    # this first condition is for the list view CSV export, which for some
    # reason is implemented with a completely different interface. TODO: don't
    # do that.
    if props.include?(:fields)
      props
    else
      all_permitted_keys = models.inject([]) {|acc, m| acc | permitted_property_keys(m, user) }
      prop_selector = lambda do |ps|
        case ps
        when Hash
          ps.inject({}) {|acc, (k,v)| acc.merge( k => prop_selector.call(v) ) }
        when Array
          ps.select {|p| all_permitted_keys.include?(p.name) }
        else
          ps
        end
      end

      prop_selector.call(props)
    end
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

  def load_consent
    if @record.present?
      @referral_consent = @record.given_consent(Transition::TYPE_REFERRAL)
      @transfer_consent = @record.given_consent(Transition::TYPE_TRANSFER)
    end
  end

  def exported_properties
    if params[:export_list_view].present? && params[:export_list_view] == "true"
      build_list_field_by_model(model_class)
    else
      model_class.properties
    end
  end

  private

  def filter_custom_exports(properties_by_module)
    if params[:custom_exports].present?
      properties_by_module = properties_by_module.select{|key| params[:custom_exports][:module].include?(key)}

      if params[:custom_exports][:forms].present? || params[:custom_exports][:selected_subforms].present?
        properties_by_module = filter_by_subform(properties_by_module).deep_merge(filter_by_form(properties_by_module))
      elsif params[:custom_exports].present? && params[:custom_exports][:fields].present?
        properties_by_module.each do |pm, fs|
          filtered_forms = fs.map{|fk, fields| [fk, fields.select{|f| params[:custom_exports][:fields].include?(f)}]}
          properties_by_module[pm] = filtered_forms.to_h
        end
        properties_by_module.compact
      end
    end
    properties_by_module
  end

  def filter_by_subform(properties)
    sub_props = {}
    if params[:custom_exports][:selected_subforms].present?
      properties.each do |pm, fs|
        sub_props[pm] = fs.map{|fk, fields| [fk, fields.select{|f| params[:custom_exports][:selected_subforms].include?(f)}]}.to_h.compact
      end
    end
    sub_props
  end

  def filter_by_form(properties)
    props = {}
    if params[:custom_exports][:forms].present?
      properties.each do |pm, fs|
        props[pm] = fs.select{|key| params[:custom_exports][:forms].include?(key)}
      end
    end
    props
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
    update_record_with_attachments(@record)
  end

  def module_users(module_ids)
    @module_users = User.find_by_modules(module_ids).map(&:user_name).reject {|u| u == current_user.user_name}
  end

end
