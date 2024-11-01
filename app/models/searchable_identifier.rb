# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class for SearchableIdentifier
class SearchableIdentifier < ApplicationRecord
  belongs_to :record, polymorphic: true
end
