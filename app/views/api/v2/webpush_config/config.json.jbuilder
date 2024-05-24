# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.enabled Rails.configuration.x.webpush.enabled
  json.pause_after Rails.configuration.x.webpush.pause_after
  json.vapid_public Rails.configuration.x.webpush.vapid_public
end
