class AuditLog < CouchRest::Model::Base
  include PrimeroModel

  use_database :audit_log

  property :user_name
  property :action_name
  property :record_id
  property :display_id
  property :record_type
  property :owned_by
  property :timestamp, DateTime

  design do
    view :by_timestamp
  end

  design :user_name_and_timestamp do
    view :by_user_name_and_timestamp
  end

  def initialize(*args)
    super

    self.timestamp ||= DateTime.now
  end

  class << self
    def find_by_timestamp(from_time=nil, to_time=nil)
      return nil unless valid_times?(from_time, to_time)
      to_time ||= DateTime.now
      by_timestamp(descending: true, startkey: to_time, endkey: from_time)
    end

    def find_by_user_name_and_timestamp(search_user_name, from_time=nil, to_time=nil)
      return nil unless search_user_name.present? && search_user_name.is_a?(String)
      return nil unless valid_times?(from_time, to_time)
      to_time ||= DateTime.now
      by_user_name_and_timestamp(descending: true, startkey: [search_user_name, to_time], endkey: [search_user_name, from_time])
    end

    private

    def valid_times?(from_time, to_time)
      return false unless valid_time?(from_time) && valid_time?(to_time)
      return false if from_time.present? && to_time.present? && from_time > to_time
      true
    end

    def valid_time?(a_time)
      return false if a_time.present? && !(a_time.is_a?(Time) || a_time.is_a?(DateTime))
      true
    end
  end
end
