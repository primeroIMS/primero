# frozen_string_literal: true

# Describes codes of conduct
class CodeOfConduct < ApplicationRecord
  self.table_name = 'codes_of_conduct'

  before_create :set_created_on

  validates :title, presence: { message: 'errors.models.code_of_conduct.title_present' }
  validates :content, presence: { message: 'errors.models.code_of_conduct.content_present' }
  validates :created_by, presence: { message: 'errors.models.code_of_conduct.created_by_present' }
  class << self
    def permitted_api_params
      %i[title content]
    end

    def new_with_user(user, params)
      code_of_conduct = CodeOfConduct.new(params)
      code_of_conduct.created_by = user.user_name
      code_of_conduct
    end

    def current
      order(created_on: :desc).first
    end
  end

  private

  def set_created_on
    self.created_on = DateTime.now
  end
end
