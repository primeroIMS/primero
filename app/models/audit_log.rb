class AuditLog < ActiveRecord::Base

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  scope :find_by_user_name, ->(user_name) { where(user_name: user_name) }

  class << self
    def find_by_timestamp(from_time = nil, to_time = nil)
      return all.order(timestamp: :desc) if from_time.nil? || to_time.nil?
      return nil unless valid_times?(from_time, to_time)
      where(timestamp: from_time..to_time).order(timestamp: :desc)
    end

    def find_by_user_name_and_timestamp(search_user_name, from_time = nil, to_time = nil)
      return nil unless search_user_name.present? && search_user_name.is_a?(String)
      find_by_user_name(search_user_name).find_by_timestamp(from_time, to_time)
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
