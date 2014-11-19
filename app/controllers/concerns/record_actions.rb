module RecordActions
  extend ActiveSupport::Concern

  include ImportActions
  include ExportActions

  included do
    skip_before_filter :verify_authenticity_token
    skip_before_filter :check_authentication, :only => [:reindex]

    before_filter :current_user, :except => [:reindex]
    before_filter :get_form_sections, :only => [:show, :edit]
    before_filter :get_lookups, :only => [:new, :edit, :index]
    before_filter :current_modules, :only => [:index]
    before_filter :is_manager, :only => [:index]
    before_filter :is_cp, :only => [:index]
    before_filter :is_gbv, :only => [:index]
    before_filter :is_mrm, :only => [:index]
  end

  def retrieve_records_and_total(filter)
    if params["page"] == "all"
      pagination_ops = {:page => 1, :per_page => 100}
      records = []
      begin
        search = model_class.list_records filter, order, pagination_ops, users_filter, params[:query], @match_request
        results = search.results
        records.concat(results)
        pagination_ops[:page] = results.next_page
      end until results.next_page.nil?
      total_records = search.total
    else
      search = model_class.list_records filter, order, pagination, users_filter, params[:query], @match_request
      records = search.results
      total_records = search.total
    end
    [records, total_records]
  end

  def get_form_sections
    get_record
    permitted_forms = FormSection.get_permitted_form_sections(@record.module, @record.class.parent_form, current_user)
    FormSection.link_subforms(permitted_forms)
    visible_forms = FormSection.get_visible_form_sections(permitted_forms)
    @form_sections = FormSection.group_forms(visible_forms)
  end

  #TODO - Primero - Refactor needed.  Determine more elegant way to load the lookups.
  def get_lookups
    @lookups = Lookup.all
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

  def exported_properties
    model_class.properties
  end

  #Gets the record which is the objects of the implementing controller.
  #Note that the controller needs to load this record before this concern method is invoked.
  def get_record
    @record ||= eval("@#{self.model_class.name.underscore}")
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
end
