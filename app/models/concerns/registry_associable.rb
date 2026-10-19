# frozen_string_literal: true

# A concern for all record types that can be linked to RegistryRecord objects.
# This requires an underlying join table to be created between the record table and the
# registry_records table. See cases_registry_records.
module RegistryAssociable
  extend ActiveSupport::Concern

  included do
    has_many :registry_associations, as: :registry_associable, dependent: :destroy
    has_many :registry_records, through: :registry_associations

    before_save :associate_registries
    after_save :reset_changed_registry_fields
  end

  # TODO: Association maintenance is currently N+1,
  #       but we are not expecting more than a handful of associations per record
  # rubocop:disable Metrics/AbcSize,Metrics/CyclomaticComplexity,Metrics/MethodLength,Metrics/PerceivedComplexity
  def associate_registries
    return unless changed_registry_fields.present?

    changed_registry_fields.each do |field_name, change|
      if change_on_subform?(change)
        # delete associations for all missing rows
        deleted_row_ids = row_ids_for_subform(change[0]) - row_ids_for_subform(change[1])
        registry_associations.where(subform_unique_id: deleted_row_ids).delete_all

        change[1].each do |row|
          row.except('unique_id').each do |field_name_in_subform, value_in_subform|
            if value_in_subform.present?
              association_field_name = "#{field_name}.#{field_name_in_subform}"
              # add associations if they dont already exist for all new rows with present values
              registry_associations.find_or_create_by(
                registry_record_id: value_in_subform,
                field_name: association_field_name,
                subform_unique_id: row['unique_id']
              )
            else
              # delete associations for all new rows with blank values
              registry_associations.where(field_name: association_field_name, subform_unique_id: row['unique_id'])
            end
          end
        end
      elsif change[1].present?
        registry_associations << RegistryAssociation.new(registry_record_id: change[1], field_name:)
      else
        registry_associations.where(registry_record_id: change[0], field_name:).delete_all
      end
    end
  end
  # rubocop:enable Metrics/AbcSize,Metrics/CyclomaticComplexity,Metrics/MethodLength,Metrics/PerceivedComplexity

  def reset_changed_registry_fields
    @changed_registry_fields = nil
  end

  private

  def row_ids_for_subform(value)
    value&.map { |row| row['unique_id'] } || []
  end

  # Returns a hash of registry fields that changed where every key is the field name
  # and the value is the pair of old value, new value. If the change is on a subform, it returns an array
  # of hashes where each hash is the changed registry fields for that subform and the unique_id of the row.
  # For example:
  # {
  #   "farm_cooperative" => [nil, "abc123"],
  #   "services_section" => [
  #     nil,
  #     [
  #       { "unique_id" => "def123", "service_provider" => "abc456"},
  #       { "unique_id" => "def456", "service_provider" => "abc789"}
  #     ]
  #   ]
  # }
  # TODO: This method inefficiently queries for registry Field objects. These queries should be cached
  # rubocop:disable Metrics/AbcSize,Metrics/CyclomaticComplexity,Metrics/MethodLength,Metrics/PerceivedComplexity
  def changed_registry_fields
    return unless will_save_change_to_attribute?('data')

    return @changed_registry_fields if @changed_registry_fields

    all_registry_fields = Field.all_registry_fields.to_h { |f| [f.name, f] }
    all_registry_subforms = all_registry_fields.values.select { |f| f.form_section.subform_field.present? }.to_h do |f|
      [f.form_section.subform_field.name, f.form_section.subform_field]
    end
    @changed_registry_fields = changes_to_save_for_record.map do |field_name, value|
      if all_registry_fields.keys.include?(field_name)
        [field_name, value]
      elsif all_registry_subforms.keys.include?(field_name)
        rows = value.map do |changes|
          changes&.map { |v| v.slice('unique_id', *all_registry_fields.keys) }
        end
        [field_name, rows]
      end
    end.compact.to_h
  end
  # rubocop:enable Metrics/AbcSize,Metrics/CyclomaticComplexity,Metrics/MethodLength,Metrics/PerceivedComplexity

  def change_on_subform?(change)
    change[0].is_a?(Array) || change[1].is_a?(Array)
  end
end
