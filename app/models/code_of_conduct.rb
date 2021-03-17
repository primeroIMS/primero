# frozen_string_literal: true

# Describes codes of conduct
class CodeOfConduct < ApplicationRecord
  self.table_name = 'codes_of_conduct'

  def self.current
    order(created_on: :desc).first
  end
end
