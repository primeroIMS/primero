class UserGroup < ActiveRecord::Base

  before_create :set_unique_id

  has_and_belongs_to_many :users

  private

  def set_unique_id
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name}".parameterize.dasherize
    end
  end
end
