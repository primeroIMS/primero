class Session < ApplicationRecord
  use_database :sessions

  include PrimeroModel

  property :imei
  property :user_name

  design do
    view :by_user_name
  end

  def self.for_user( user, imei)
    Session.new(
      :user_name => user.user_name,
      :imei => imei
    )
  end

  def user
    @user ||= User.find_by_user_name(user_name)
  end

  def self.delete_for(user)
    by_user_name(:key => user.user_name).each {|s| s.destroy }
  end

  def token
    self.id
  end

  def full_name
    user.full_name
  end

  def device_blacklisted?
    if (imei)
      return true if Device.all.any? {|device| device.imei == imei && device.blacklisted? }
    end
    false
  end

end
