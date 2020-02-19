require 'rails_helper'

describe IdentitySync::Connection do
  let(:driver) { double('driver') }
  let(:connection) do
    connection = IdentitySync::Connection.new
    connection.driver = driver
    connection
  end

  it 'correctly parses hash params to a GET url format' do
    expect(driver).to(
      receive(:get).with('/users', 'foo=foo&bar=1', nil)
                   .and_return(double(status: 0, body: '{}'))
    )
    connection.get('/users', foo: 'foo', bar: 1)
  end

  it 'correctly parses hash params to a POST url format' do
    expect(driver).to(
      receive(:post).with('/users', '{"foo":"foo","bar":1}', nil)
        .and_return(double(status: 0, body: '{}'))
    )
    connection.post('/users', foo: 'foo', bar: 1)
  end

  it 'correctly parses hash params to a PATCH url format' do
    expect(driver).to(
      receive(:patch).with('/users', '{"foo":"foo","bar":1}', nil)
        .and_return(double(status: 0, body: '{}'))
    )
    connection.patch('/users', foo: 'foo', bar: 1)
  end
end