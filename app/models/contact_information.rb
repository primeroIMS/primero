# frozen_string_literal: true

# System-level contact info
class ContactInformation < ApplicationRecord
  include ConfigurationRecord

  def self.current
    ContactInformation.first
  end
end
