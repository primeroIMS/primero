# frozen_string_literal: true

# RecordScopeService
class RecordScopeService
  class << self
    # TODO: We want to allow the service query either by associated_users or by record_owner,
    # at the moment we are not stamping associated_user_names in the database.
    def scope_with_user(records, user)
      case user.user_query_scope
      when Permission::AGENCY
        records.where('data @> ?', { owned_by_agency_id: user.agency.unique_id }.to_json)
      when Permission::GROUP
        records.where("data->'owned_by_groups' ?| array[:groups]", groups: user.user_group_unique_ids)
      when Permission::USER
        records.where('data @> ?', { owned_by: user.user_name }.to_json)
      when Permission::ALL
        records.all
      else
        records.none
      end
    end
  end
end
