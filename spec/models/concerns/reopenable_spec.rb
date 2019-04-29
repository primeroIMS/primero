require 'rails_helper'

describe Reopenable do
  it 'has empty log history on start' do
    test = Child.new()

    expect(test.reopened_logs.count).to equal(0)
  end

  it 'adds log with current time' do
    test = Child.new()
    date_time = DateTime.parse("2016/08/01 12:54:55 -0400")

    DateTime.stub(:now).and_return(date_time)

    test.add_reopened_log("")

    expect(test.reopened_logs.count).to equal(1)
    expect(test.reopened_logs.first['reopened_date']). to equal(date_time)
  end

  it 'adds log with current time' do
    test = Child.new()
    user = "trolololo"

    test.add_reopened_log(user)

    expect(test.reopened_logs.first['reopened_user']). to equal(user)
  end

end