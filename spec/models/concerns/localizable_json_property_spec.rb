# frozen_string_literal: true

require 'rails_helper'

describe LocalizableJsonProperty do
  before :each do
    allow(I18n).to receive(:available_locales) { %i[a b] }

    @klass = Class.new(Field) do
      include LocalizableJsonProperty

      localize_properties [:display_name]
      localize_properties :option_strings_text, options_list: true
    end
    @object = @klass.new
  end

  it 'should create localized properties' do
    expect(@object).to respond_to('display_name_a', 'display_name_b', 'option_strings_text_a', 'option_strings_text_b')
  end

  it 'should create default property which sets system default locale' do
    I18n.stub locale: :b
    @object.display_name = 'test'
    @object.option_strings_text = [{ id: '1', display_text: 'test 1' }, { id: '2', display_text: 'test 2' }]

    expect(@object.display_name_a).to be_nil
    expect(@object.display_name_b).to eq('test')
    expect(@object.option_strings_text_a).to match_array([{ 'display_text' => nil, 'id' => '1' },
                                                          { 'display_text' => nil, 'id' => '2' }])
    expect(@object.option_strings_text_b).to match_array([{ 'display_text' => 'test 1', 'id' => '1' },
                                                          { 'display_text' => 'test 2', 'id' => '2' }])
    expect(@object.option_strings_text).to match_array([{ 'display_text' => 'test 1', 'id' => '1' },
                                                        { 'display_text' => 'test 2', 'id' => '2' }])
  end

  it 'should create all property which sets all locales' do
    @object.display_name_all = 'test'
    expect(@object.display_name_a).to eq('test')
    expect(@object.display_name_b).to eq('test')
  end

  it 'should use constructor for default property' do
    I18n.stub locale: :b
    @object = @klass.new('display_name' => 'test')
    expect(@object.display_name_a).to be_nil
    expect(@object.display_name_b).to eq('test')
  end

  it 'should use constructor for all properties' do
    @object = @klass.new('display_name_all' => 'test')
    expect(@object.display_name_a).to eq('test')
    expect(@object.display_name_b).to eq('test')
  end

  it 'should provide formatted hash of locale data' do
    @object = @klass.new display_name_a: 'test a', display_name_b: 'test b'

    expect(@object.localized_hash('a')).to eq('display_name' => 'test a')
    expect(@object.localized_hash('b')).to eq('display_name' => 'test b')
  end

  it 'should merge to options' do
    option_string_text = [
      { id: '1', display_text: 'test 1' },
      { id: '2', display_text: 'test 2' },
      { id: '3', display_text: 'test 3' }
    ]
    @object = @klass.new(display_name: 'test', option_strings_text: option_string_text.first(2))

    merged_options = @object.merge_options(@object.option_strings_text, option_string_text.last(1))
    expect(merged_options).to match_array(option_string_text)
  end
end
