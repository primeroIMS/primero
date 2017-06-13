module Alertable
  extend ActiveSupport::Concern

  included do
    property :alerts, [], :default => []
  end

  def add_remove_alert(current_user, type)
    if current_user.user_name == self.owned_by && self.alerts != nil
      self.alerts.delete_if{|x| x[:type] == type}
    elsif current_user.user_name != self.owned_by && self.alerts != nil
      self.alerts << {type: type, date: Date.today}
    end
  end
end