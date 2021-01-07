# frozen_string_literal: true

# Simple check to return status code 204 if Primero is healthy
class HealthController < ApplicationController
  RETRY_AFTER = 60

  def index
    return head :no_content if HealthCheckService.healthy?

    head :service_unavailable
  end

  def show
    if HealthCheckService::BACKENDS.include?(params[:id]) && HealthCheckService.healthy?(params[:id])
      return head :no_content
    end

    response.set_header('Retry-After', RETRY_AFTER)
    head :service_unavailable
  end
end
