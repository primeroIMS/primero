class UserGroup < ApplicationRecord

  include Configuration

  before_create :set_unique_id

  has_and_belongs_to_many :users

  class << self
    alias super_clear clear
    def clear
      self.all.each do |ug|
        ug.users.destroy(ug.users)
      end
      super_clear
    end
  end

  private

  def set_unique_id
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name}".parameterize.dasherize
    end
  end
end
