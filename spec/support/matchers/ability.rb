# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

RSpec::Matchers.define :authorize do |action, object|
  match do |ability|
    ability.can? action, object
  end

  failure_message do |ability|
    "Expected Permissions #{ability.user.role.permissions.inspect} To Authorize #{action} On #{object.inspect}"
  end

  failure_message_when_negated do |ability|
    "Did not expect User #{ability.user.inspect} To Authorize #{action} On #{object.inspect}"
  end
end

RSpec::Matchers.define :authorize_all do |actions, *objects|
  match do |ability|
    actions.product(objects).all? do |(action, object)|
      @action = action
      @object = object
      ability.can? action, object
    end
  end

  failure_message do |ability|
    "Expected User #{ability.user.inspect} To Authorize #{@action} On #{@object.inspect}"
  end

  failure_message_when_negated do |ability|
    "Did not expect User #{ability.user.inspect} To Authorize #{@action} On #{@object.inspect}"
  end
end

RSpec::Matchers.define :authorize_any do |actions, *objects|
  match do |ability|
    actions.product(objects).any? do |(action, object)|
      @action = action
      @object = object
      ability.can? action, object
    end
  end

  failure_message_when_negated do |ability|
    "Did not expect User #{ability.user.inspect} To Authorize #{@action.inspect} On #{@object.inspect}"
  end
end
