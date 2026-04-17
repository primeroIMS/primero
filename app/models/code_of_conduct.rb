# frozen_string_literal: true

# Describes codes of conduct
class CodeOfConduct < ApplicationRecord
  self.table_name = 'codes_of_conduct'

  CODE_OF_CONDUCT_FIELDS_SCHEMA = {
    'title' => { 'type' => 'string' }, 'content' => { 'type' => 'string' }
  }.freeze

  before_save :set_created_on

  validates :title, presence: { message: 'errors.models.code_of_conduct.title_present' }
  validates :content, presence: { message: 'errors.models.code_of_conduct.content_present' }
  validates :created_by, presence: { message: 'errors.models.code_of_conduct.created_by_present' }
  class << self
    def permitted_api_params
      %i[title content]
    end

    def current
      order(created_on: :desc).first
    end

    def current_or_new_with_user(user, params)
      code_of_conduct = CodeOfConduct.current
      code_of_conduct = CodeOfConduct.new(params) if code_of_conduct.blank? || !code_of_conduct.same_data?(params)
      code_of_conduct.created_by = user.user_name

      code_of_conduct
    end
  end

  def same_data?(params)
    title == params[:title] && content == params[:content]
  end

  private

  def set_created_on
    self.created_on = DateTime.now
  end
end
