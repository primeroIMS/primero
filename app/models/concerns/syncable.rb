module Syncable
  extend ActiveSupport::Concern

  include Historical

  included do
    design do
      view :conflicting_records,
              :map => "function(doc) {
                if (doc._conflicts) {
                  emit(null, [doc._rev].concat(doc._conflicts));
                }
              }"
    end
  end

  module ClassMethods
    def all_conflicting_records
      self.conflicting_records.all
    end
  end

  def get_all_conflicting_revisions
    self_with_conflicts = self.database.get self._id, {:conflicts => true}

    if self_with_conflicts.to_hash.include? '_conflicts'
      self_with_conflicts['_conflicts'].map do |rev|
        self.class.build_from_database(self.database.get(self._id, {:rev => rev}))
      end
    else
      []
    end
  end

  def resolve_conflicting_revisions
    oldest_to_newest = lambda do |x,y|
      return 0 if x.last_updated_at.nil? && y.last_updated_at.nil?
      return 1 if x.last_updated_at.nil?
      return -1 if y.last_updated_at.nil?

      x.last_updated_at <=> y.last_updated_at
    end

    conflicting_revs = get_all_conflicting_revisions()
    all_revs = (conflicting_revs + [self]).sort &oldest_to_newest

    all_revs.inject({}) do |updates, r|
      last_update = latest_update_from_history

      if last_update.present?
        add_proc = ->(updates, (key, change)) do
          case change
          when Array
            change.inject(updates) do |acc, ch|
              i = acc.index {|el| el['unique_id'] == ch[:to]['unique_id'] }
              acc[k] = ch[:to]
            end
          end
        end
        last_update.changes.inject({}) &add_proc
      end
      updates
    end.each do |k,v|
      self[k] = v
    end

    conflicting_revs.each do |r|
      Rails.logger.debug {"Deleting revision #{r.rev} for #{r.id}"}
      r.destroy
    end
    Rails.logger.debug {"Saving Active Revision: #{rev} for #{id}"}

    save
  end

  def remove_stale_properties(properties, revision)
    inter_changes = get_intermediate_changes(revision)

    inter_changes.inject(properties.clone) do |props_to_update, changes|
      remove_proc = lambda do |props, (key, prop_change)|
        new_props = props.clone
        case new_props[key]
        when Hash
          new_props[key] = new_props[key].keys.inject(new_props[key]) do |acc, k|
            if prop_change[k].present?
              remove_proc.call(acc, [k, prop_change[k]])
            else
              acc
            end
          end
        when Array
          new_props[key] = prop_change.inject(new_props[key]) do |acc, (unique_id, ch)|
            i = acc.index {|el| el['unique_id'] == unique_id }
            remove_proc.call(acc, [i, ch])
          end
        else
          # We need unique_ids to distinguish between deleting and leaving
          # unaltered
          if new_props[key] == prop_change['from'] && key != 'unique_id'
            new_props.delete key
          end
        end
        new_props
      end

      changes.inject(props_to_update, &remove_proc)
    end
  end

  def update_attributes_without_saving(hash)
    revision = hash.delete 'revision'

    new_hash = if revision.present? && revision != self.rev
      remove_stale_properties(hash, revision)
    else 
      hash
    end

    super(merge_with_existing_attrs(new_hash))
  end
  alias :attributes= :update_attributes_without_saving

  private

  def get_intermediate_changes revision
    changes = histories.reverse
                       .drop_while {|h| h.prev_revision != revision }
                       .reverse
                       .map {|h| h.changes }

    # Throw an exception until a legitimate reason for missing revisions is found
    if changes.length == 0
      raise Errors::RevisionNotFoundError.new("Unknown revision provided #{revision}")
    end

    changes
  end

  def merge_with_existing_attrs(properties)
    merger = ->(props, (k,existing_value)) do
      props = props.clone
      case props[k]
      when Array
        props[k] = props[k].inject([]) do |acc, (el, i)|
          if el.include?('unique_id')
            current = existing_value.find {|ev| ev.unique_id == el['unique_id'] }
            acc << (current.nil? ? el : current.to_hash.merge(el))
            #merger.call(acc, [i, el])
          else
            acc << el
          end
        end
        props
      when Hash
        if existing_value.present?
          props[k] = existing_value.to_hash.inject(props[k]) do |acc, (sub_k,ev)|
            acc.merge(merger.call(acc, [sub_k, ev]))
          end
        end
        props
      else
        props 
      end
    end

    self.attributes.inject(properties, &merger)
  end
end

