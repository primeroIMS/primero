class UserGroup < ActiveRecord::Base

  after_save :set_unique_id

  private

  def set_unique_id
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name}".parameterize.dasherize
      self.save!
    end
  end
end
