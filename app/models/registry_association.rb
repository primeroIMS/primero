# frozen_string_literal: true

# Describes the association between a record and a RegistryRecord
class RegistryAssociation < ApplicationRecord
  belongs_to :registry_record
  belongs_to :registry_associable, polymorphic: true
end
