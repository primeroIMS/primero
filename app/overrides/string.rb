# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Legacy usage kept for backwards compatibility. Don't use this method!
# TODO: Clean up app/models/report.rb and app/services/report_field_service.rb
String.class_eval do
  def number?
    !!(self =~ /^\d*\.{0,1}\d?$/)
  end
  alias_method :is_number?, :number?
end
