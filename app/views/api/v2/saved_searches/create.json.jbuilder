# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.partial! 'api/v2/saved_searches/saved_search', saved_search: @saved_search
end
