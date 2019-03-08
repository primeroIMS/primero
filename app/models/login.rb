class Login
  include Validatable
  attr_accessor :errors
  attr_accessor :user_name
  attr_accessor :password

  def initialize(params)
    @user_name = params[:user_name]
    @password = params[:password]
    @imei = params[:imei]
    @mobile_number = params[:mobile_number]
  end

  def authenticate_user
    user = User.find_by_user_name(@user_name)
    return Session.for_user(user, @imei) if user && user.authenticate(@password)
    nil
  end

  def errors
    @errors ||= Errors.new
  end
end
