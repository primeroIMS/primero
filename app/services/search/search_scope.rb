# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class that applies a scope in a SQL Query
class Search::SearchScope < ValueObject
  attr_accessor :scope, :user_scope, :module_scope, :record_type

  def self.apply(scope, query)
    new(scope:).apply(query)
  end

  def initialize(args = {})
    super(args)
    self.user_scope = args[:user_scope] || scope&.dig(:user)
    self.module_scope = args[:module_scope] || scope&.dig(:module)
    self.record_type = args[:record_type] || Child.name
  end

  def apply(query)
    @query = query
    @query = apply_user_scope
    @query = apply_module_scope
    @query
  end

  private

  def apply_user_scope
    return @query unless user_scope.present?

    if user_scope['user'].present?
      apply_user_associated_scope
    elsif user_scope['agency'].present?
      apply_agency_associated_scope
    elsif user_scope['group'].present?
      apply_group_associated_scope
    else
      @query
    end
  end

  def apply_user_associated_scope
    @query.joins(
      SearchFilters::TextValue.new(
        field_name: 'associated_user_names', value: user_scope['user']
      ).searchable_join_query(record_type)
    )
  end

  def apply_agency_associated_scope
    @query.joins(
      SearchFilters::TextValue.new(
        field_name: 'associated_user_agencies', value: user_scope['agency']
      ).searchable_join_query(record_type)
    )
  end

  def apply_group_associated_scope
    @query.joins(
      SearchFilters::TextList.new(
        field_name: 'associated_user_groups', values: user_scope['group']
      ).searchable_join_query(record_type)
    )
  end

  def apply_module_scope
    return @query unless module_scope.present?

    @query.joins(
      SearchFilters::TextList.new(field_name: 'module_id', values: module_scope).searchable_join_query(record_type)
    )
  end
end
