# frozen_string_literal: true

# Model representing an registry
class Registry < ApplicationRecord
  include Record
  include Searchable
  include Historical
  include Ownable
  include Flaggable
  include Alertable
  include Attachable
  include EagerLoadable

  store_accessor(
    :data,
    :registry_type
  )
end