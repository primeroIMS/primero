# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

  describe '#merge_options' do
    it 'should merge to options' do
      option_string_text = [
        { id: '1', display_text: 'test 1' },
        { id: '2', display_text: 'test 2', disabled: true },
        { id: '3', display_text: 'test 3' }
      ]
      @object = @klass.new(display_name: 'test', option_strings_text: option_string_text.first(2))

      merged_options = @object.merge_options(@object.option_strings_text, option_string_text.last(1))
      expect(merged_options).to match_array(option_string_text)
    end

    it 'returns array when new_options is nil' do
      current_options = [
        { id: '1', display_text: 'test 1' },
        { id: '2', display_text: 'test 2' }
      ]

      result = @object.merge_options(current_options, nil)
      expect(result).to eq(current_options)
      expect(result).to be_an(Array)
    end

    it 'returns array when current_options is nil' do
      new_options = [
        { id: '3', display_text: 'test 3' },
        { id: '4', display_text: 'test 4' }
      ]

      result = @object.merge_options(nil, new_options)
      expect(result).to eq(new_options)
      expect(result).to be_an(Array)
    end

    it 'returns empty array when both options are nil' do
      result = @object.merge_options(nil, nil)
      expect(result).to eq([])
      expect(result).to be_an(Array)
    end

    it 'handles non-array current_options when new_options is nil' do
      current_options = 'not an array'

      result = @object.merge_options(current_options, nil)
      expect(result).to eq(['not an array'])
      expect(result).to be_an(Array)
    end

    it 'handles non-array new_options when current_options is nil' do
      new_options = 'not an array'

      result = @object.merge_options(nil, new_options)
      expect(result).to eq(['not an array'])
      expect(result).to be_an(Array)
    end

    it 'removes duplicate options by id' do
      current_options = [
        { id: '1', display_text: 'current 1' },
        { id: '2', display_text: 'current 2' }
      ]
      new_options = [
        { id: '1', display_text: 'new 1' },
        { id: '3', display_text: 'new 3' }
      ]

      result = @object.merge_options(current_options, new_options)
      expect(result.size).to eq(3)
      expect(result.map { |opt| opt['id'] }).to match_array(%w[1 2 3])

      option1 = result.find { |opt| opt['id'] == '1' }
      expect(option1['display_text']).to eq('new 1')
    end

    it 'filters out options marked for deletion' do
      current_options = [
        { id: '1', display_text: 'test 1' },
        { id: '2', display_text: 'test 2' }
      ]
      new_options = [
        { id: '2', display_text: 'updated 2', _delete: true },
        { id: '3', display_text: 'test 3' }
      ]

      result = @object.merge_options(current_options, new_options)
      expect(result.size).to eq(2)
      expect(result.map { |opt| opt['id'] }).to match_array(%w[1 3])
      expect(result.none? { |opt| opt.key?('_delete') && opt['_delete'] }).to be true
    end
  end

  describe 'when jsonb properties' do
    before :each do
      allow(I18n).to receive(:available_locales) { %i[a b] }

      @klass = Class.new(PrimeroModule) do
        include LocalizableJsonProperty

        store_accessor :module_options, :approvals_labels_i18n, :option_strings_text_i18n

        localize_jsonb_properties [:approvals_labels]
        localize_jsonb_properties [:option_strings_text], options_list: true
      end
      @object = @klass.new
    end

    it 'should create localized properties' do
      expect(@object).to respond_to('approvals_labels_b', 'approvals_labels_b')
    end

    it 'should create default property which sets system default locale' do
      I18n.stub locale: :b
      @object.approvals_labels = {
        assessment: 'Protection Eligibility',
        case_plan: 'Case Plan',
        closure: 'Case Closure',
        action_plan: 'Action Plan',
        gbv_closure: 'GBV Closure'
      }
      @object.option_strings_text = [{ id: '1', display_text: 'test 1' }, { id: '2', display_text: 'test 2' }]

      expect(@object.approvals_labels_a).to be_nil
      expect(@object.approvals_labels_b.with_indifferent_access).to match({ assessment: 'Protection Eligibility',
                                                                            case_plan: 'Case Plan',
                                                                            closure: 'Case Closure',
                                                                            action_plan: 'Action Plan',
                                                                            gbv_closure: 'GBV Closure' })
      expect(@object.approvals_labels.with_indifferent_access).to match({ assessment: 'Protection Eligibility',
                                                                          case_plan: 'Case Plan',
                                                                          closure: 'Case Closure',
                                                                          action_plan: 'Action Plan',
                                                                          gbv_closure: 'GBV Closure' })

      expect(@object.option_strings_text_a).to match_array([{ 'display_text' => nil, 'id' => '1' },
                                                            { 'display_text' => nil, 'id' => '2' }])
      expect(@object.option_strings_text_b).to match_array([{ 'display_text' => 'test 1', 'id' => '1' },
                                                            { 'display_text' => 'test 2', 'id' => '2' }])
      expect(@object.option_strings_text).to match_array([{ 'display_text' => 'test 1', 'id' => '1' },
                                                          { 'display_text' => 'test 2', 'id' => '2' }])
    end

    it 'should create all property which sets all locales' do
      @object.approvals_labels_all = 'test'
      expect(@object.approvals_labels_a).to eq('test')
      expect(@object.approvals_labels_b).to eq('test')
    end

    it 'should use constructor for default property' do
      I18n.stub locale: :b
      @object = @klass.new('approvals_labels' => 'test')
      expect(@object.approvals_labels_a).to be_nil
      expect(@object.approvals_labels_b).to eq('test')
    end

    it 'should use constructor for all properties' do
      @object = @klass.new('approvals_labels_all' => 'test')
      expect(@object.approvals_labels_a).to eq('test')
      expect(@object.approvals_labels_b).to eq('test')
    end
  end

  describe '#property_setter and helper methods' do
    let(:test_object) do
      klass = Class.new do
        include LocalizableJsonProperty
        attr_accessor :test_store

        def initialize
          @test_store = []
        end
      end
      klass.new
    end

    describe '#property_setter' do
      context 'when updating existing option' do
        before do
          test_object.test_store = [
            {
              'id' => 'value1',
              'display_text' => { 'en' => 'Original Value 1', 'es' => 'Valor Original 1' }
            }.with_indifferent_access
          ]
        end

        it 'updates display_text for existing option' do
          existing_option = test_object.test_store.first
          current_value = { 'id' => 'value1', 'display_text' => 'Updated Value 1' }.with_indifferent_access

          test_object.property_setter(test_object.test_store, existing_option, current_value, 'en')

          expect(existing_option['display_text']['en']).to eq('Updated Value 1')
          expect(existing_option['display_text']['es']).to eq('Valor Original 1')
        end

        it 'adds optional attributes to existing option' do
          existing_option = test_object.test_store.first
          current_value = {
            'id' => 'value1',
            'display_text' => 'Updated Value 1',
            'disabled' => true,
            'tags' => %w[important urgent]
          }.with_indifferent_access

          test_object.property_setter(test_object.test_store, existing_option, current_value, 'en')

          expect(existing_option['disabled']).to be true
          expect(existing_option['tags']).to eq(%w[important urgent])
        end

        it 'does not add optional attributes when they are blank' do
          existing_option = test_object.test_store.first
          current_value = {
            'id' => 'value1',
            'display_text' => 'Updated Value 1',
            'disabled' => nil,
            'tags' => ''
          }.with_indifferent_access

          test_object.property_setter(test_object.test_store, existing_option, current_value, 'en')

          expect(existing_option.key?('disabled')).to be false
          expect(existing_option.key?('tags')).to be false
        end
      end

      context 'when creating new option' do
        it 'creates new option when current_option is nil' do
          current_value = {
            'id' => 'new_value',
            'display_text' => 'New Value'
          }.with_indifferent_access

          test_object.property_setter(test_object.test_store, nil, current_value, 'en')

          expect(test_object.test_store.size).to eq(1)
          new_option = test_object.test_store.first
          expect(new_option['id']).to eq('new_value')
          expect(new_option['display_text']['en']).to eq('New Value')
        end

        it 'creates new option with optional attributes' do
          current_value = {
            'id' => 'new_value',
            'display_text' => 'New Value',
            'disabled' => true,
            'tags' => ['new']
          }.with_indifferent_access

          test_object.property_setter(test_object.test_store, nil, current_value, 'en')

          new_option = test_object.test_store.first
          expect(new_option['disabled']).to be true
          expect(new_option['tags']).to eq(['new'])
        end
      end
    end

    describe '#update_optional_attributes' do
      let(:option) { {}.with_indifferent_access }

      it 'adds disabled attribute when present' do
        current_value = { 'disabled' => true }.with_indifferent_access

        test_object.send(:update_optional_attributes, option, current_value)

        expect(option['disabled']).to be true
      end

      it 'adds tags attribute when present' do
        current_value = { 'tags' => %w[tag1 tag2] }.with_indifferent_access

        test_object.send(:update_optional_attributes, option, current_value)

        expect(option['tags']).to eq(%w[tag1 tag2])
      end

      it 'does not add attributes when blank' do
        current_value = { 'disabled' => nil, 'tags' => '' }.with_indifferent_access

        test_object.send(:update_optional_attributes, option, current_value)

        expect(option.key?('disabled')).to be false
        expect(option.key?('tags')).to be false
      end

      it 'adds both attributes when both are present' do
        current_value = {
          'disabled' => false,
          'tags' => ['important']
        }.with_indifferent_access

        test_object.send(:update_optional_attributes, option, current_value)

        expect(option['disabled']).to eq(false)
        expect(option['tags']).to eq(['important'])
      end
    end
  end

  describe 'Creating a lookup with localized values' do
    let(:lookup) do
      Lookup.create!(
        unique_id: 'lookup-random7',
        name_en: 'Random7',
        lookup_values_en: [
          { id: 'value4', display_text: 'Value 4' }.with_indifferent_access,
          { id: 'value5', display_text: 'Value 5' }.with_indifferent_access,
          { id: 'value6', display_text: 'Value 6', disabled: true }.with_indifferent_access
        ]
      )
    end

    before do
      allow(I18n).to receive(:available_locales) { %i[en es fr] }
    end

    it 'creates lookup with proper localized values' do
      expect(lookup.lookup_values_en).to match_array(
        [
          { 'id' => 'value4', 'display_text' => 'Value 4' },
          { 'id' => 'value5', 'display_text' => 'Value 5' },
          { 'id' => 'value6', 'display_text' => 'Value 6', 'disabled' => true }
        ]
      )
    end

    it 'allows updating values in different locales' do
      spanish_values = [
        { id: 'value4', display_text: 'Valor 4' }.with_indifferent_access,
        { id: 'value5', display_text: 'Valor 5' }.with_indifferent_access,
        { id: 'value6', display_text: 'Valor 6', disabled: true }.with_indifferent_access
      ]

      lookup.lookup_values_es = spanish_values

      expect(lookup.lookup_values_es).to match_array(
        [
          { 'id' => 'value4', 'display_text' => 'Valor 4' },
          { 'id' => 'value5', 'display_text' => 'Valor 5' },
          { 'id' => 'value6', 'display_text' => 'Valor 6', 'disabled' => true }
        ]
      )
    end

    it 'handles disabled attribute in different locales' do
      spanish_values = [
        { id: 'value4', display_text: 'Valor 4' }.with_indifferent_access,
        { id: 'value5', display_text: 'Valor 5', disabled: false }.with_indifferent_access,
        { id: 'value6', display_text: 'Valor 6', disabled: true }.with_indifferent_access
      ]

      lookup.lookup_values_es = spanish_values

      spanish_result = lookup.lookup_values_es
      value5_es = spanish_result.find { |v| v['id'] == 'value5' }
      value6_es = spanish_result.find { |v| v['id'] == 'value6' }

      expect(value5_es['disabled']).to eq(false)
      expect(value6_es['disabled']).to eq(true)
    end

    it 'handles adding new values to existing locale' do
      new_values = [
        { id: 'value7', display_text: 'New Value 7' }.with_indifferent_access
      ]

      combined_values = lookup.lookup_values_en + new_values
      lookup.lookup_values_en = combined_values

      expect(lookup.lookup_values_en.size).to eq(4)
      expect(lookup.lookup_values_en.last['id']).to eq('value7')
      expect(lookup.lookup_values_en.last['display_text']).to eq('New Value 7')
    end

    after do
      clean_data(Lookup)
    end
  end
end
