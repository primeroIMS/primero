# frozen_string_literal: true

# This class is used for the members of changes_field_to_form in system_settings.
# It is used to store the form name, and the alert strategy (associated_users, owner, nobody)
class AlertConfigEntryService
  attr_accessor :form_section_unique_id, :alert_strategy

  def initialize(args)
    if args.is_a?(Hash)
      @form_section_unique_id = args['form_section_unique_id']
      @alert_strategy = args['alert_strategy'] || Alertable::AlertStrategy::NOT_OWNER

    else
      @form_section_unique_id = args
      @alert_strategy = Alertable::AlertStrategy::NOT_OWNER
    end
  end
end
