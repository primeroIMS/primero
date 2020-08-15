# frozen_string_literal: true

# System-level contact info
class ContactInformation < ApplicationRecord
  include ConfigurationRecord

  self.unique_id_attribute = 'name'

  def self.current
    ContactInformation.first
  end
end
