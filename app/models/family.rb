# frozen_string_literal: true

# Describes the family linkages
class Family < ApplicationRecord
  include Record
  include Searchable
  include Historical
  include Ownable
  include Flaggable
  include Alertable
  include Attachable
  include EagerLoadable
  include LocationCacheable

  store_accessor :data, :registration_date, :status, :family_id, :family_name, :family_number, :family_members

  alias family_details_section family_members

  class << self
    def filterable_id_fields
      %w[family_id short_id family_number]
    end

    def quicksearch_fields
      filterable_id_fields + %w[family_name]
    end

    def sortable_text_fields
      %w[short_id]
    end
  end

  searchable do
    date :registration_date
    %w[id status].each { |f| string(f, as: "#{f}_sci") }
    filterable_id_fields.each { |f| string("#{f}_filterable", as: "#{f}_filterable_sci") { data[f] } }
    quicksearch_fields.each { |f| text_index(f) }
    sortable_text_fields.each { |f| string("#{f}_sortable", as: "#{f}_sortable_sci") { data[f] } }
    string :family_name, multiple: true
  end

  alias super_defaults defaults
  def defaults
    super_defaults
    self.family_members ||= []
  end

  def set_instance_id
    self.family_id ||= unique_identifier
  end
end
