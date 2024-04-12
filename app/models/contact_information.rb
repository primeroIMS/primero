# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# System-level contact info
class ContactInformation < ApplicationRecord
  include ConfigurationRecord

  CONTACT_INFORMATION_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'name' => { 'type' => 'string' },
    'organization' => { 'type' => 'string' }, 'phone' => { 'type' => 'string' },
    'location' => { 'type' => 'string' }, 'other_information' => { 'type' => 'string' },
    'support_forum' => { 'type' => 'string' }, 'email' => { 'type' => 'string' },
    'position' => { 'type' => 'string' }
  }.freeze

  self.unique_id_attribute = 'name'

  def self.current
    ContactInformation.first
  end
end
