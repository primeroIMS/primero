# frozen_string_literal: true

# Concern of Historical
module Historical
  extend ActiveSupport::Concern

  EVENT_CREATE = 'create'
  EVENT_UPDATE = 'update'

  included do
    store_accessor :data, :created_organization, :created_agency_office, :created_by, :created_by_full_name,
                   :created_at, :last_updated_at, :last_updated_by, :last_updated_by_full_name,
                   :last_updated_organization, :posted_at

    has_many :record_histories, as: :record

    searchable do
      %i[created_organization created_agency_office created_by last_updated_by last_updated_organization].each do |f|
        string f, as: "#{f}_sci"
      end
      %i[created_at last_updated_at posted_at].each do |f|
        time f
      end
    end

    validate :validate_created_at
    validate :validate_last_updated_at

    before_save :update_last_updated_at
    before_save :update_organization
    # TODO: These actions should be asynchronous
    after_create :add_creation_history
    after_update :update_history
  end

  # Module for ClassMethods
  module ClassMethods
    def all_by_creator(created_by)
      where('data @> ?', { created_by: created_by }.to_json)
    end
  end

  def validate_created_at
    return if created_at.nil? || created_at.is_a?(DateTime) || created_at.is_a?(Time)

    errors.add(:created_at, '')
  end

  def validate_last_updated_at
    return if last_updated_at.nil? || last_updated_at.is_a?(DateTime) || last_updated_at.is_a?(Time)

    errors.add(:last_updated_at, '')
  end

  def creation_fields_for(user)
    self.last_updated_by = user.try(:user_name)
    self.created_by = user.try(:user_name)
    self.created_by_full_name = user.try(:full_name)
    self.created_organization = user.try(:organization)
    self.created_agency_office = user.try(:agency_office)
    self.last_updated_at ||= self.created_at ||= DateTime.now
    self.posted_at = DateTime.now
  end

  def update_organization
    self.created_organization ||= created_by_user.try(:organization)
  end

  def created_by_user
    @created_by_user ||= (created_by.present? ? User.find_by_user_name(created_by) : nil)
  end

  def update_last_updated_at
    now = DateTime.now
    self.created_at ||= now
    self.last_updated_at = now
  end

  def ordered_histories
    record_histories.order(datetime: :desc)
  end

  #This is an alias to make migration easier
  def histories
    ordered_histories
  end

  def add_creation_history
    RecordHistory.create(
      record: self,
      record_type: self.class.name,
      user_name: created_by,
      datetime: self.created_at,
      action: EVENT_CREATE
    )
  end

  def update_history
    # TODO: Figure out some useful way of specifying attachment changes
    return unless saved_change_to_attribute?('data')

    saved_changes_to_record = self.saved_changes_to_record
    return unless saved_changes_to_record.present?

    RecordHistory.create(
      record: self,
      record_type: self.class.name,
      user_name: last_updated_by,
      datetime: self.last_updated_at,
      action: EVENT_UPDATE,
      record_changes: saved_changes_to_record
    )
  end

  def saved_changes_to_record
    return {} unless saved_changes?

    saved_changes_to_record = {}
    old_values = saved_change_to_attribute('data')[0] || {}
    new_values = saved_change_to_attribute('data')[1] || {}
    if new_values.present?
      new_values = new_values.reject { |k, _| %w[last_updated_at last_updated_by].include?(k) }
      diff = hash_diff(new_values, old_values)
      if diff.present?
        saved_changes_to_record = diff.map { |k, v| [k, { 'from' => old_values[k], 'to' => v }] }.to_h
        # mark the 'name' attribute as dirty if `hidden name` changed
        if saved_changes_to_record.key?('hidden_name') && !saved_changes_to_record.key?('name')
          saved_changes_to_record['name'] = [name, name]
        end
      end
    end
    saved_changes_to_record
  end

  #TODO: For performance reasons, consider caching this and assuming that
  #      by the time the before_save callback is invoked, all changes have taken place
  def changes_to_save_for_record
    changes_to_save_for_record = {}
    if will_save_change_to_attribute?('data')
      old_values = changes_to_save['data'][0] || {}
      new_values = changes_to_save['data'][1] || {}
      diff = hash_diff(new_values, old_values)
      changes_to_save_for_record = diff.map { |k, v| [k, [old_values[k], v]] }.to_h if diff.present?
    end
    changes_to_save_for_record
  end

  private

  # #Returns all pairs in hash A that have a different value in B
  def hash_diff(new_values, old_values)
    if old_values.nil?
      diff = new_values
    else
      diff = new_values.to_a - old_values.to_a
      diff.to_h
    end
    diff
  end
end
