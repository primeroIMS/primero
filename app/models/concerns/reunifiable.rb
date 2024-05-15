# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern to handle reunification related data
module Reunifiable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :reunification_details_section, :reunification_dates

    before_save :calculate_reunification_dates

    def calculate_reunification_dates
      self.reunification_dates = reunification_details_section&.reduce([]) do |acc, elem|
        acc << elem['date_reunification']
      end&.compact
      reunification_dates
    end
  end
end
