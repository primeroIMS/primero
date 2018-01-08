require 'rubygems'
require 'rails/commands/server'

# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])

module Rails
  class Server
    new_defaults = Module.new do
      def default_options
        default_host = Rails.env == 'development' ? '0.0.0.0' : '127.0.0.1'
        super.merge( Host: default_host )
      end
    end

    prepend new_defaults
  end
end