# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module CanCan
  # rubocop:enable Style/ClassAndModuleChildren

  # Class has methods CustomRule
  class CustomRule < Rule
    def initialize(base_behavior, action, subject, *conditions, &)
      @except_actions = [conditions.try(:delete, :except)].flatten.compact
      super(base_behavior, action, subject, *conditions, &)
    end

    def matches_action?(action)
      (@expanded_actions.include?(:manage) && @except_actions.exclude?(action)) || @expanded_actions.include?(action)
    end
  end
end
