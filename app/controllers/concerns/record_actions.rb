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
    all_forms = FormSection.find_by_parent_form(@className.parent_form)

    #Load in all the subforms
    @form_sections = []
    subforms_hash = {}

    all_forms.each do |form|
      if form.visible?
        @form_sections.push form
      else
        subforms_hash[form.id] = form
      end
    end

    #TODO: The map{}.flatten still takes 13 ms to run
    @form_sections.map{|f| f.fields}.flatten.each do |field|
      if field.type == 'subform' && field.subform_section_id
        field.subform ||= subforms_hash[field.subform_section_id]
      end
    end

  end

end