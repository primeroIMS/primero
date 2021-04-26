# frozen_string_literal: true

# API endpoint for code of conduct
class Api::V2::CodesOfConductController < ApplicationApiController
  def model_class
    CodeOfConduct
  end

  def index
    @code_of_conduct = CodeOfConduct.current

    raise ActiveRecord::RecordNotFound if @code_of_conduct.blank?
  end

  def create
    authorize! :create, CodeOfConduct
    @code_of_conduct = CodeOfConduct.current_or_new_with_user(current_user, code_of_conduct_params)
    @code_of_conduct.save!
  end

  private

  def code_of_conduct_params
    params.require(:data).permit(CodeOfConduct.permitted_api_params)
  end
end
