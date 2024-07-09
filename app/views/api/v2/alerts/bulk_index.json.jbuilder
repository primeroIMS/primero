# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.case @alerts[:case]
  json.incident @alerts[:incident]
  json.tracing_request @alerts[:tracing_request]
end
