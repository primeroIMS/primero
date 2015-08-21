module SyncableMobile
  extend ActiveSupport::Concern

  included do
  end

  module ClassMethods
    def is_syncable_with_mobile?
      #TODO - for now, this is memoized
      #       if further optimization is needed, may need to move to a class variable
      FormSection.find_mobile_forms_by_parent_form(parent_form).count > 0
    end
  end
end
