# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class that applies a scope in a SQL Query
class Search::SearchScope < ValueObject
  attr_accessor :scope, :user_scope, :module_scope

  def self.scope_filters(scope)
    new(scope:).scope_filters
  end

  def initialize(args = {})
    super(args)
    self.user_scope = args[:user_scope] || scope&.dig(:user)
    self.module_scope = args[:module_scope] || scope&.dig(:module)
  end

  def scope_filters
    filters = []
    filters << user_scope_filter if user_scope.present?
    filters << module_scope_filter if module_scope.present?

    filters
  end

  def user_scope_filter
    return unless user_scope.present?

    if user_scope['user'].present?
      self_scope_filter
    elsif user_scope['agency'].present?
      agency_scope_filter
    elsif user_scope['group'].present?
      group_scope_filter
    end
  end

  def self_scope_filter
    SearchFilters::TextValue.new(
      field_name: 'associated_user_names', value: user_scope['user']
    )
  end

  def agency_scope_filter
    SearchFilters::TextValue.new(
      field_name: 'associated_user_agencies', value: user_scope['agency']
    )
  end

  def group_scope_filter
    SearchFilters::TextList.new(
      field_name: 'associated_user_groups', values: user_scope['group']
    )
  end

  def module_scope_filter
    SearchFilters::TextList.new(field_name: 'module_id', values: module_scope)
  end
end
