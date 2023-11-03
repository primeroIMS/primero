# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.transitioned_to params[:data][:transitioned_to]
  json.filters params[:data][:filters]
end
