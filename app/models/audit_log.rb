class AuditLog < CouchRest::Model::Base
  include PrimeroModel

  use_database :audit_log

  property :user_name
  property :action_name
  property :record_id
  property :display_id
  property :record_type
  property :timestamp, DateTime

  design do
    view :by_timestamp
    view :by_user_name_and_timestamp
    view :by_action_name_and_timestamp
  end

  def initialize(*args)
    super

    self.timestamp ||= DateTime.now
  end

  class << self
    def find_by_timestamp(begin_time=nil, end_time=nil)
      if begin_time.present? && end_time.present?
        by_timestamp(descending: true, startkey: [begin_time], endkey: [end_time]).all
      elsif begin_time.present?
        by_timestamp(descending: true, startkey: [begin_time]).all
      else
        by_timestamp(descending: true).all
      end
    end

    def find_by_user_name_and_timestamp(search_user_name, begin_time=nil, end_time=nil)
      return [] if search_user_name.blank? || !search_user_name.is_a?(String)
      begin_time ||= DateTime.now
      if end_time.present?
        by_user_name_and_timestamp(descending: true, startkey: [search_user_name, begin_time], endkey: [search_user_name, end_time]).all
      else
        by_user_name_and_timestamp(descending: true, startkey: [search_user_name, begin_time], endkey: [search_user_name]).all
      end
    end

    def find_by_action_name_and_timestamp(search_action_name, begin_time=nil, end_time=nil)
      return [] if search_action_name.blank? || !search_action_name.is_a?(String)
      begin_time ||= DateTime.now
      if end_time.present?
        by_action_name_and_timestamp(descending: true, startkey: [search_action_name, begin_time], endkey: [search_action_name, end_time]).all
      else
        by_action_name_and_timestamp(descending: true, startkey: [search_action_name, begin_time], endkey: [search_action_name]).all
      end
    end
  end
end
