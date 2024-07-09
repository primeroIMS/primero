# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Calculates the tracing names and nicknames
module CalculateTracingNames
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :tracing_names, :tracing_nicknames
    before_save :calculate_tracing_names, :calculate_tracing_nicknames
  end

  def calculate_tracing_names(persisted_traces = false)
    traces_to_calculate = persisted_traces ? traces : @traces_to_save
    return [] unless traces_to_calculate.present?

    self.tracing_names = traces_to_calculate.map(&:name).compact
    tracing_names
  end

  def calculate_tracing_nicknames(persisted_traces = false)
    traces_to_calculate = persisted_traces ? traces : @traces_to_save
    return [] unless traces_to_calculate.present?

    self.tracing_nicknames = traces_to_calculate.map(&:name_nickname).compact
    tracing_nicknames
  end
end
