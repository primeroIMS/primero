# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class that applies a scope in a SQL Query
class Search::SearchScope < ValueObject
  attr_accessor :scope, :user_scope, :module_scope

  def self.apply(scope, query)
    new(scope:).apply(query)
  end

  def initialize(args = {})
    super(args)
    self.user_scope = args[:user_scope] || scope&.dig(:user)
    self.module_scope = args[:module_scope] || scope&.dig(:module)
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
    @query.where("data->'associated_user_names' ? :user", user: user_scope['user'])
  end

  def apply_agency_associated_scope
    @query.where("data->'associated_user_agencies' ? :agency", agency: user_scope['agency'])
  end

  def apply_group_associated_scope
    @query.where("data->'associated_user_groups' ?| array[:groups]", groups: user_scope['group'])
  end

  def apply_module_scope
    return @query unless module_scope.present?

    @query.where("data->>'module_id' = :module_id", module_id: module_scope)
  end
end
