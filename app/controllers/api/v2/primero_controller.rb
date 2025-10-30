# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Unprotected API endpoint for public system info
class Api::V2::PrimeroController < ApplicationApiController
  skip_before_action :authenticate_user!, only: [:index]
  skip_after_action :write_audit_log, only: [:index]

  def index
    agencies = Agency.with_logos.or(Agency.with_pdf_logo_option)
    @agencies_with_system_logos = agencies.select(&:logo_enabled)[0..2]
    @agencies_with_logo_options = agencies.select(&:pdf_logo_option)
    @system_options = SystemSettings.current.system_options
  end
end
