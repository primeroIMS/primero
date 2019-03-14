class UserGroup < ActiveRecord::Base

  before_create :set_unique_id

  private

  def set_unique_id
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name}".parameterize.dasherize
    end
  end
end
