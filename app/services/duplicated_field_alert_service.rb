# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Handle alerts for duplicated fields
class DuplicatedFieldAlertService
  class << self
    def duplicate_records(record, field_name)
      record_class = record.class

      return record_class.none unless record.data[field_name].present?

      duplicate_query = record_class.where('data @> ?', { field_name => record.data[field_name] }.to_json)

      return duplicate_query if record.new_record?

      duplicate_query.where.not(id: record.id)
    end

    def duplicates_field?(record, field_name)
      duplicate_records(record, field_name).exists?
    end

    # TODO: Use left join to improve query
    def duplicate_alert(record, field_name)
      Alert.includes(:record)
           .where(alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, type: field_name, record_type: record.class.name)
           .find { |alert| alert.record.data[field_name] == record.data[field_name] }
    end

    def create_or_remove_alerts!(record, alert_on_duplicate)
      alert_on_duplicate.each do |field_name, form_name|
        if DuplicatedFieldAlertService.duplicates_field?(record, field_name)
          Alert.create!(
            alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, date: Date.today, type: field_name,
            form_sidebar_id: form_name, record:
          )
        else
          Alert.find_by(alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, type: field_name, record:)&.destroy!
        end
      end
    end
  end
end
