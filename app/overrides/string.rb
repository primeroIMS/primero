# frozen_string_literal: true

# Legacy usage kept for backwards compatibility. Don't use this method!
# TODO: Clean up app/models/report.rb and app/services/report_field_service.rb
# rubocop:disable Style/DoubleNegation
String.class_eval do
  def number?
    !!(self =~ /^\d*\.{0,1}\d?$/)
  end
  alias_method :is_number?, :number?
end
# rubocop:enable Style/DoubleNegation
