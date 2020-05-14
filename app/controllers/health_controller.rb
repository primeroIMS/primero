# frozen_string_literal: true

# Simple check to return status code 204 if Primero is healthy
class HealthController < ApplicationController
  def index
    return head :no_content if HealthCheckService.healthy?

    head :service_unavailable
  end
end
