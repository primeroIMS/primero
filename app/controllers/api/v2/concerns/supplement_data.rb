# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# A module to handle access logs for a record
module Api::V2::Concerns::SupplementData
  extend ActiveSupport::Concern

  protected

  def timestamp_param
    from_param..to_param
  end

  def from_param
    params.dig(:filters, :from).present? ? Time.zone.parse(params.dig(:filters, :from)) : Time.at(0).to_datetime
  end

  def to_param
    params.dig(:filters, :to).present? ? Time.zone.parse(params.dig(:filters, :to)) : DateTime.now.end_of_day
  end

  def authorize_access!(action)
    authorize!(:read, @record)
    authorize!(action, @record)
  end
end
