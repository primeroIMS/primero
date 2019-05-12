require 'rails_helper'

describe DestringifyService do

  it 'sets empty values as nil' do
    result = DestringifyService.destringify({a: nil, b: ''})
    expect(result[:a]).to be_nil
    expect(result[:b]).to be_nil
  end

  it 'leaves regular string values alone' do
    result = DestringifyService.destringify('test')
    expect(result).to eq('test')
  end

  it 'converts numeric formatted strings' do
    result = DestringifyService.destringify("12345")
    expect(result).to eq(12345)
  end

  it 'converts ISO 8601 formatted date strings to Dates' do
    result = DestringifyService.destringify("2019-05-10")
    expect(result).to eq(Date.new(2019, 5, 10))
  end

  it 'converts ISO 8601 formatted datetime strings to UTC Time' do
    result = DestringifyService.destringify("2019-05-10T05:34:59.514Z")
    expect(result).to eq(Time.utc(2019, 5, 10, 5, 34, 59, 514000))
  end

  it 'converts boolean formatted strings' do
    result = DestringifyService.destringify({a: 'true', b: 'false', c: 'tru'})
    expect(result[:a]).to be true
    expect(result[:b]).to be false
    expect(result[:c]).to eq('tru')
  end

  it 'works recursively on arrays' do
    result = DestringifyService.destringify(['1', "", 'true', 'test'])
    expect(result).to eq([1, nil, true, 'test'])
  end

  it 'works recursively on hashes' do
    result = DestringifyService.destringify({a: ['1', "", 'true', 'test'], b: {c: "3"}})
    expect(result[:a]).to eq([1, nil, true, 'test'])
    expect(result[:b][:c]).to eq(3)
  end

  it 'converts number indexed hashes to arrays' do
    result = DestringifyService.destringify({'0' => 'a', '1' => 'b', '2' => 'c'})
    expect(result).to eq(%w(a b c))
  end

  describe 'lists and ranges' do

    it 'converts range formatted numerics to a range hash' do
      result = DestringifyService.destringify('0..12', true)
      expect(result).to eq({'from' => 0, 'to' => 12})
    end

    it 'converts ISO date formatted dates to a range hash' do
      result = DestringifyService.destringify('2018-05-10..2019-05-10', true)
      expect(result).to eq({'from' => Date.new(2018,5,10), 'to' => Date.new(2019,5,10)})
    end

    it 'converts a comma delimited list to an array' do
      result = DestringifyService.destringify('a,b,c', true)
      expect(result).to eq(%w(a b c))
    end

    it "doesn't convert a comma delimited list to an array unless told to do so" do
      result = DestringifyService.destringify('a,b,c', false)
      expect(result).to eq('a,b,c')
    end
  end

end