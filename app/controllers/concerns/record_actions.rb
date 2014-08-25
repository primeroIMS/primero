module RecordActions
  extend ActiveSupport::Concern

  included do
    skip_before_filter :verify_authenticity_token
    skip_before_filter :check_authentication, :only => [:reindex]

    before_filter :set_class_name
    before_filter :current_user, :except => [:reindex]
    before_filter :get_form_sections, :only => [:show, :new, :edit]
  end

  def reindex
    @className.reindex!
    render :nothing => true
  end

  def get_form_sections
    #@form_sections = FormSection.find_form_groups_by_parent_form(@className.parent_form)
    #binding.pry
    permitted_forms = FormSection.get_permitted_form_sections(record, current_user)
    FormSection.link_subforms(permitted_forms)
    @form_sections = FormSection.group_forms(permitted_forms)
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

  #Gets the record which is the objects of the implementing controller.
  #Note that the controller needs to load this record before this concern method is invoked.
  def record
    @record ||= eval("@#{@className.name.underscore}")
  end

end