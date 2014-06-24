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
    @form_sections = FormSection.find_all_visible_by_parent_form(@className.parent_form)
  end
  
end