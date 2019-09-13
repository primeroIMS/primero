class JwtTokenSetter
  def initialize(app)
    @app = app
  end

  def call(env)
    unless env['HTTP_AUTHORIZATION'].present?
      request = Rack::Request.new(env)
      token = request.cookies['primero_token']
      if token.present?
        env['HTTP_AUTHORIZATION'] = "Bearer #{token}"
      end
    end

    @app.call(env)
  end
end