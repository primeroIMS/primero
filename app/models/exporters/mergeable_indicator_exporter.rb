# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Methods for mergeable indicator exporters
module Exporters::MergeableIndicatorExporter
  extend ActiveSupport::Concern

  attr_accessor :merged_indicators

  def build_combined_data
    merged_indicators.map do |indicator|
      [I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"), values[indicator]&.first&.dig('total')]
    end
  end
end
