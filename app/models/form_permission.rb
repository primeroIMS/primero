# frozen_string_literal: true

# This table is used as has many betwee form_section and roles
class FormPermission < ApplicationRecord
  self.table_name = 'form_sections_roles'
  belongs_to :form_section
  belongs_to :role, touch: true

  PERMISSIONS = {
    read: 'r',
    read_write: 'rw'
  }.freeze
end
