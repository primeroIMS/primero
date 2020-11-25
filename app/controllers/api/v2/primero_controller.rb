# frozen_string_literal: true

# Unprotected API endpoint for public system info
class Api::V2::PrimeroController < ApplicationApiController
  skip_before_action :authenticate_user!, only: [:index]
  skip_after_action :write_audit_log, only: [:index]

  def index
    @agencies_with_logos = Agency.with_logos.limit(3)
  end
end
