# frozen_string_literal: true

# Describes codes of conduct
class CodeOfConduct < ApplicationRecord
  def self.current
    order(created_on: :desc).first
  end
end
