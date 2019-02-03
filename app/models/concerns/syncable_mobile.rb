module SyncableMobile
  extend ActiveSupport::Concern

  included do
    design :ids_and_revs_by_owned_by do
      view :ids_and_revs_by_owned_by,
           :map => "function(doc) {
              if (doc['couchrest-type'] == '#{self.model.name}' && doc.hasOwnProperty('owned_by')){
                emit(doc.owned_by, {_id: doc._id, _rev: doc._rev, last_updated_at: doc.last_updated_at});
              }
            }"
    end

    design :ids_and_revs_by_owned_by_and_marked_for_mobile do
     view :ids_and_revs_by_owned_by_and_marked_for_mobile,
           :map => "function(doc) {
              if (doc['couchrest-type'] == '#{self.model.name}' && doc.hasOwnProperty('owned_by') && doc.hasOwnProperty('marked_for_mobile')){
                emit([doc.owned_by, doc.marked_for_mobile], {_id: doc._id, _rev: doc._rev, last_updated_at: doc.last_updated_at});
              }
            }"
    end

    design :ids_and_revs_by_owned_by_and_marked_for_mobile_and_module_id do
      view :ids_and_revs_by_owned_by_and_marked_for_mobile_and_module_id,
           :map => "function(doc) {
              if (doc['couchrest-type'] == '#{self.model.name}' && doc.hasOwnProperty('owned_by') && doc.hasOwnProperty('marked_for_mobile')){
                emit([doc.owned_by, doc.marked_for_mobile, doc.module_id], {_id: doc._id, _rev: doc._rev, last_updated_at: doc.last_updated_at});
              }
            }"

    end
  end

  module ClassMethods

    def fetch_all_ids_and_revs(owned_by_ids = [], marked_for_mobile, last_update_date, module_id)
      if marked_for_mobile
        if module_id.present?
          all_rows = self.ids_and_revs_by_owned_by_and_marked_for_mobile_and_module_id(keys: owned_by_ids.map{|id| [id, true, module_id]}).rows
        else
          all_rows = self.ids_and_revs_by_owned_by_and_marked_for_mobile(keys: owned_by_ids.map{|id| [id, true]}).rows
        end
      else
        all_rows = self.ids_and_revs_by_owned_by(keys: owned_by_ids).rows
      end

      if all_rows.present?
        if last_update_date.present?
          last_update_date_time = Time.parse(last_update_date)
          all_rows = all_rows.select{|r| r['value']['last_updated_at'] > last_update_date_time}
        end
        all_rows.present? ? all_rows.map{|r| r.value.except("last_updated_at")} : []
      else
        []
      end
    end
  end
end
