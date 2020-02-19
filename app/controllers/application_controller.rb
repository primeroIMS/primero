# frozen_string_literal: true

# Superclass for all non-API controllers
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception, prepend: true, unless: -> { request.format.json? }
end
