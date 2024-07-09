# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents an administrative level: country, state, province, township
# rubocop:disable Metrics/ClassLength
class Location < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  ADMIN_LEVELS = [0, 1, 2, 3, 4, 5].freeze
  ADMIN_LEVEL_OUT_OF_RANGE = 100
  READONLY_ATTRIBUTES = %i[parent_code admin_level location_code hierarchy_path].freeze
  ORDER_BY_FIELD_MAP = { code: :location_code, hierarchy: :hierarchy_path, name: :placename }.freeze

  LOCATION_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'code' => { 'type' => 'string' },
    'type' => { 'type' => 'string' }, 'admin_level' => { 'type' => 'integer' },
    'placename' => { 'type' => 'object' }, 'name' => { 'type' => 'object' },
    'parent_code' => { 'type' => 'string' }, 'disabled' => { 'type' => 'boolean' }
  }.freeze

  attribute :parent_code
  scope :enabled, ->(is_enabled = true) { where.not(disabled: is_enabled) }
  attr_readonly(*READONLY_ATTRIBUTES)

  localize_properties :name, :placename

  self.unique_id_attribute = 'location_code'

  validates :location_code, presence: { message: I18n.t('errors.models.location.code_present') },
                            uniqueness: { message: I18n.t('errors.models.location.unique_location_code') }
  validate :validate_placename_in_english

  before_create :hierarchy_from_parent
  before_create :hierarchy_defaulted
  before_create :admin_level_from_hierarchy
  before_create :name_from_hierarchy
  before_update :name_from_placename, if: -> { will_save_change_to_attribute?(:placename_i18n) }
  after_update :update_descendent_names, if: -> { saved_change_to_attribute?(:placename_i18n) }
  after_save :generate_location_files

  # This allows us to use the property 'type' on Location, normally reserved by ActiveRecord
  class << self
    # TODO: This is ugly, and one day we should use a proper cache for this.
    # This class variables should only be set when loading location information in bulk
    #   Location.locations_by_code = Locations.all.map{|l|[l.location_code, l]}.to_h
    attr_accessor :locations_by_code

    def order_insensitive_attribute_names
      %w[placename]
    end

    def get_by_location_code(location_code)
      if @locations_by_code.present?
        @locations_by_code[location_code]
      elsif location_code.present?
        Location.find_by(location_code:)
      end
    end

    def permitted_api_params
      %i[id code admin_level type parent_code disabled] + [placename: {}]
    end

    def inheritance_column
      'type_inheritance'
    end

    def new_with_properties(location_properties)
      Location.new(location_properties.slice(:type, :disabled, :parent_code, :hierarchy_path)).tap do |location|
        location.location_code = location_properties[:code]
        location.placename_i18n = location_properties[:placename]
      end
    end

    # TODO: This is used by the UserLocationService and should be deleted once that service is removed
    def reporting_locations_for_hierarchies(hierarchies)
      admin_level = SystemSettings.current&.reporting_location_config&.admin_level ||
                    ReportingLocation::DEFAULT_ADMIN_LEVEL
      Location.where('hierarchy_path @> ARRAY[:ltrees]::ltree[]', ltrees: hierarchies.compact.uniq)
              .where(admin_level:)
    end

    def list(filters = {}, options = {})
      OrderByPropertyService.apply_order(filters.blank? ? all : where(filters), options)
    end

    def update_in_batches(bulk_params)
      locations_to_update = bulk_params.reduce({}) { |acc, elem| acc.merge(elem[:id].to_i => elem) }

      updated_locations = []
      Location.transaction do
        Location.where(id: locations_to_update.keys).in_batches.each_record do |location|
          location.update_properties(locations_to_update[location.id])
          location.save!
          updated_locations << location
        end
      end

      updated_locations
    end
  end

  def update_properties(location_properties)
    location_properties = location_properties.with_indifferent_access if location_properties.is_a?(Hash)
    self.placename_i18n = placename_from_params(location_properties)
    self.attributes = location_properties.except(*(READONLY_ATTRIBUTES + %i[name code placename]))
  end

  def placename_from_params(params)
    FieldI18nService.merge_i18n_properties(
      { placename_i18n: },
      placename_i18n: params[:placename]
    )[:placename_i18n]
  end

  def country?
    @country ||= admin_level.zero?
  end

  def hierarchy
    # TODO: Should we enforce: hierarchy_path.split('.').map {|code| code.upcase.dasherize }
    @hierarchy ||= hierarchy_path.split('.')
  end

  def parent
    return if country?

    @parent ||= Location.get_by_location_code(hierarchy[-2])
  end

  # TODO: Make into association
  def descendents
    @descendents ||= Location.where('hierarchy_path <@ ?', hierarchy_path).order(:hierarchy_path)[1..] || []
  end

  # TODO: Make into association
  def ancestors
    return [] if country?

    @ancestors ||= Location.where(location_code: hierarchy).order(admin_level: :asc)
  end

  def ancestor(admin_level)
    return if admin_level >= self.admin_level

    ancestors[admin_level]
  end

  def ancestor_by_type(type)
    ancestors.find { |loc| loc.type == type }
  end

  def hierarchy_from_parent
    return if hierarchy_path.present?
    return unless will_save_change_to_attribute?(:parent_code)

    parent = Location.find_by(location_code: parent_code)
    return unless parent

    self.hierarchy_path = "#{parent.hierarchy_path}.#{location_code}"
  end

  def hierarchy_defaulted
    return if hierarchy_path.present?

    self.hierarchy_path = location_code
  end

  def admin_level_from_hierarchy
    self.admin_level = hierarchy.size - 1
  end

  def name_from_hierarchy
    self.name_i18n = I18n.available_locales.each_with_object({}.with_indifferent_access) do |locale, hash|
      use_placename = country? || parent.nil?
      hash[locale] = use_placename ? placename(locale) : "#{parent.name(locale)}::#{placename(locale)}"
    end
  end

  def name_from_placename
    I18n.available_locales.each do |locale|
      hierarchical_name = name(locale).split('::')
      hierarchical_name = hierarchical_name[0..-2] + [placename(locale)]
      name_i18n[locale] = hierarchical_name.join('::')
    end
  end

  def update_descendent_names
    descendents_to_update = descendents.map do |location|
      update_name_from_ancestor_name(location, name_i18n)
      location
    end
    return unless descendents_to_update.present?

    Location.transaction do
      descendents_to_update.each(&:save!)
    end
  end

  def update_name_from_ancestor_name(location, ancestor_name_i18n)
    I18n.available_locales.map(&:to_s).each do |locale|
      hierarchical_name = location.name(locale).split('::')
      hierarchical_name = [ancestor_name_i18n[locale]] + hierarchical_name[(admin_level + 1)..]
      location.name_i18n[locale] = hierarchical_name.join('::')
    end
  end

  def generate_location_files
    return if ENV['PRIMERO_BOOTSTRAP']

    GenerateLocationFilesJob.set(wait_until: 5.minutes.from_now).perform_later unless OptionsQueueStats.jobs?
  end

  private

  def validate_placename_in_english
    return if placename_en.present?

    errors.add(:placename, I18n.t('errors.models.location.name_present'))
  end
end
# rubocop:enable Metrics/ClassLength
