class ContactInformation < ApplicationRecord
  include Configuration

  def self.current
    ContactInformation.first
  end

  def self.get_or_create
    ContactInformation.first || ContactInformation.create
  end
end
