# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Users belong to user groups which may be used to limit the records that an individual user may have access to.
class UserGroup < ApplicationRecord
  include ConfigurationRecord
  USER_GROUP_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'unique_id' => { 'type' => 'string' },
    'name' => { 'type' => 'string' }, 'description' => { 'type' => 'string' },
    'disabled' => { 'type' => 'boolean' },
    'agency_ids' => { 'type' => 'array' },
    'agency_unique_ids' => { 'type' => 'array' }
  }.freeze

  has_and_belongs_to_many :users
  has_and_belongs_to_many :agencies

  before_create :generate_unique_id
  class << self
    def order_insensitive_attribute_names
      %w[name description]
    end

    def unique_id_parameters
      %w[agency_unique_ids]
    end

    def permitted_api_params
      %w[id unique_id name description disabled] + [agency_ids: [], agency_unique_ids: []]
    end

    def list(user, opts = {})
      user_groups = opts[:managed] ? user.permitted_user_groups : UserGroup.includes(:agencies).all
      user_groups = user_groups.where(disabled: opts[:disabled]) if opts[:disabled].present?
      if opts[:agency_unique_ids].present?
        user_groups = user_groups.distinct.joins(:agencies).where(agencies: { unique_id: opts[:agency_unique_ids] })
      end

      OrderByPropertyService.apply_order(user_groups, opts)
    end

    def new_with_properties(params, user)
      user_group = UserGroup.new(params)
      user_group.add_creating_user(user)
      user_group
    end
  end

  def initialize(attributes = nil, &)
    super(attributes&.except(*UserGroup.unique_id_parameters), &)
    associate_unique_id_properties(attributes.slice(*UserGroup.unique_id_parameters)) if attributes.present?
  end

  def update_properties(properties)
    assign_attributes(properties&.except(*UserGroup.unique_id_parameters))
    associate_unique_id_properties(properties)
  end

  def associate_unique_id_properties(properties)
    associate_agencies_unique_id(properties[:agency_unique_ids])
  end

  def associate_agencies_unique_id(unique_ids)
    return unless unique_ids.present?

    self.agencies = Agency.where(unique_id: unique_ids)
  end

  def agency_unique_ids
    agencies.pluck(:unique_id)
  end

  def add_creating_user(user)
    return unless [Permission::AGENCY, Permission::GROUP, Permission::SELF].include?(user.role&.group_permission)

    users << user
  end

  def configuration_hash
    hash = attributes.except('id', 'created_at', 'updated_at')
    hash['agency_unique_ids'] = agency_unique_ids
    hash.with_indifferent_access
  end
end
