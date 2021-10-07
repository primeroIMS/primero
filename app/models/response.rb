# frozen_string_literal: true

# Model for MRM Response
class Response < ApplicationRecord
  belongs_to :violations, optional: true
end
