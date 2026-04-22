# frozen_string_literal: true

if ENV['PROFILE'] == 'true'
  require 'rack-mini-profiler'
  Rack::MiniProfilerRails.initialize!(Rails.application)
end
