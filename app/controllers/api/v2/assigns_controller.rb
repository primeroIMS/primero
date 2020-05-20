# frozen_string_literal: true

module Api::V2
  # API endpoints that handle record reassignment
  class AssignsController < RecordResourceController
    def index
      authorize! :read, @record
      @transitions = @record.assigns
      render 'api/v2/transitions/index'
    end

    def create
      authorize_assign!(@record)
      @transition = assign(@record)
      updates_for_record(@record)
      render 'api/v2/transitions/create'
    end

    def create_bulk
      authorize_assign_all!(@records)
      @transitions =
        @records.map do |record|
          assign(record)
        rescue StandardError => e
          handle_bulk_error(e, request) && nil
        end.compact
      updates_for_records(@records)
      render 'api/v2/transitions/create_bulk'
    end

    private

    def authorize_assign!(record)
      can_assign =
        current_user.can?(Permission::ASSIGN.to_sym, record) ||
        current_user.can?(Permission::ASSIGN_WITHIN_AGENCY.to_sym, record) ||
        current_user.can?(Permission::ASSIGN_WITHIN_USER_GROUP.to_sym, record)
      raise Errors::ForbiddenOperation unless can_assign
    end

    def authorize_assign_all!(records)
      records.each { |r| authorize_assign!(r) }
    end

    def assign(record)
      transitioned_to = params[:data][:transitioned_to]
      notes = params[:data][:notes]
      transitioned_by = current_user.user_name
      Assign.create!(record: record, transitioned_to: transitioned_to,
                     transitioned_by: transitioned_by, notes: notes)
    end

    def create_action_message
      'assign'
    end

    def destroy_action_message
      'unassign'
    end

    def create_bulk_record_resource
      'bulk_assign'
    end
  end
end
