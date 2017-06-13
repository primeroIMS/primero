module Alertable
  extend ActiveSupport::Concern

  def add_remove_subform_alert(current_user, subform_type)
    if current_user.user_name == self.owned_by && self.alerts != nil
      self.alerts.delete_if{|x| x[:type] == subform_type}
    elsif current_user.user_name != self.owned_by && self.alerts != nil
      self.alerts << {type: subform_type, date: Date.today}
    end
  end
end