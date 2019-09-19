module Api::V2
  class TransitionsController < RecordResourceController

    def index
      authorize! :read, @record
      types = params[:types].try(:split, ',')
      @transitions = @record.transitions_for_user(current_user, types)
      render 'api/v2/transitions/index'
    end

  end
end
