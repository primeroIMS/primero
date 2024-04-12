# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

if ENV['PROFILE'] == 'true'
  require 'rack-mini-profiler'
  Rack::MiniProfilerRails.initialize!(Rails.application)
end
