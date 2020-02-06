# frozen_string_literal: true

# Simple check to return status code 204 if Primero is healthy
class HealthController < ApplicationController
  def index
    head :no_content
  end
end