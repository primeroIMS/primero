module Alertable
  extend ActiveSupport::Concern

  included do
    property :alerts, [], :default => []
  end

  def add_remove_alert(current_user, type = nil, form_sidebar_id = nil)
    if current_user.user_name == self.owned_by && self.alerts != nil
      if type == nil
        self.alerts = []
      else
        self.alerts.delete_if{|x| x[:type] == type}
      end
    elsif current_user.user_name != self.owned_by && self.alerts != nil
      self.alerts << {type: type, date: Date.today.strftime("%m/%d/%Y"), form_sidebar_id: form_sidebar_id}
    end
  end
end