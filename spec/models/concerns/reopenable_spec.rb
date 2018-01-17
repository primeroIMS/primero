
require 'rails_helper'

class TestClass < CouchRest::Model::Base
  include Reopenable
end

describe Reopenable do
  it 'has empty log history on start' do
    test = TestClass.new()

    expect(test.reopened_logs.count).to equal(0)
  end

  it 'adds log with current time' do
    test = TestClass.new()
    date_time = DateTime.parse("2016/08/01 12:54:55 -0400")

    DateTime.stub(:now).and_return(date_time)

    test.add_reopened_log("")

    expect(test.reopened_logs.count).to equal(1)
    expect(test.reopened_logs.first.reopened_date). to equal(date_time)
  end

  it 'adds log with current time' do
    test = TestClass.new()
    user = "trolololo"

    test.add_reopened_log(user)

    expect(test.reopened_logs.first.reopened_user). to equal(user)
  end

end