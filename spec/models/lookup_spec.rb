# frozen_string_literal: true

require 'rails_helper'

describe Lookup do
  before :each do
    clean_data(Lookup)
  end

  it 'should not be valid if name is empty' do
    lookup = Lookup.new
    lookup.should_not be_valid
    lookup.errors[:name].should == ['Name must not be blank']
  end

  it 'should be valid if lookup_values is empty' do
    lookup = Lookup.new(name: 'Name')
    lookup.should be_valid
  end

  it 'should have a unique id when the name is the same as an existing lookup' do
    lookup1 = create :lookup, name: 'Unique', lookup_values: [
      { id: 'value1', display_text: 'value1' }, { id: 'value2', display_text: 'value2' }
    ]
    lookup2 = create :lookup, name: 'Unique', lookup_values: [
      { id: 'value3', display_text: 'value3' }, { id: 'value4', display_text: 'value4' }
    ]
    lookup1.id.should_not == lookup2.id
  end

  it 'should not allow blank id on the lookup_values' do
    lookup = Lookup.new(name: 'test_lookup')
    lookup.lookup_values = [{ id: nil, display_text: { en: 'example' } }]
    expect(lookup.valid?).to be false
    expect(lookup.errors[:lookup_values].first).to eq('A lookup_value id is blank')
  end

  it 'should create a valid lookup' do
    Lookup.new(
      name: 'some_lookup', lookup_values: [
        { id: 'value1', display_text: 'value1' }, { id: 'value2', display_text: 'value2' }
      ]
    ).should be_valid
  end

  it 'should generate id' do
    lookup = Lookup.create(name: 'test lookup 1234', id: nil)
    lookup.reload
    lookup.unique_id.should include('lookup-test-lookup-1234')
  end

  it 'should create a lookup from params' do
    unique_id = 'lookup-test-1'
    params = {
      unique_id: unique_id,
      name: {
        en: 'Lookup Test1 '
      },
      values: [
        {
          'id' => 'option1',
          'display_text' => {
            'en' => 'Option 1',
            'fr' => '',
            'es' => ''
          }
        }
      ]
    }
    lookup_test = Lookup.new_with_properties(params)
    expect(lookup_test).to be_valid
    lookup_test.save!
    expect(Lookup.find_by(unique_id: unique_id)).not_to be_nil
  end

  it 'should update lookup values from params' do
    unique_id = 'lookup-some-lookup'
    some_lookup = Lookup.create!(
      unique_id: unique_id, name: 'some_lookup', lookup_values: [{ id: 'value1', display_text: 'value1' }]
    )

    params = {
      values: [
        {
          'id' => 'value2',
          'display_text' => {
            'en' => 'value2',
            'fr' => '',
            'es' => ''
          }
        }
      ]
    }

    some_lookup.update_properties(params)
    expect(some_lookup).to be_valid
    some_lookup.save!
    expect(Lookup.find_by(unique_id: unique_id).lookup_values_en.size).to eq(2)
  end

  it 'should re-order lookup values from order params' do
    unique_id = 'lookup-some-lookup'
    some_lookup = Lookup.create!(
      unique_id: unique_id, name: 'some_lookup', lookup_values: [
        { id: 'value1', display_text: 'value1' },
        { id: 'value2', display_text: 'value2' }
      ]
    )

    expect(Lookup.find_by(unique_id: unique_id).lookup_values_i18n.first.dig('display_text', 'en')).to eq('value1')
    expect(Lookup.find_by(unique_id: unique_id).lookup_values_i18n.last.dig('display_text', 'en')).to eq('value2')

    params = {
      values: [
        { 'id' => 'value2', 'display_text' => { 'en' => 'value2' } },
        { 'id' => 'value1', 'display_text' => { 'en' => 'value1' } }
      ]
    }

    some_lookup.update_properties(params)
    expect(some_lookup).to be_valid
    some_lookup.save!
    expect(Lookup.find_by(unique_id: unique_id).lookup_values_i18n.first.dig('display_text', 'en')).to eq('value2')
    expect(Lookup.find_by(unique_id: unique_id).lookup_values_i18n.last.dig('display_text', 'en')).to eq('value1')
  end

  it 'should delete a lookup value' do
    unique_id = 'lookup-some-lookup'
    some_lookup = Lookup.create!(
      unique_id: unique_id, name: 'some_lookup', lookup_values: [
        { id: 'value1', display_text: 'value1' },
        { id: 'value2', display_text: 'value2' }
      ]
    )

    expect(Lookup.find_by(unique_id: unique_id).lookup_values_en.size).to eq(2)

    params = {
      values: [
        { 'id' => 'value1', 'display_text' => { 'en' => 'value1' }, '_delete' => true }
      ]
    }

    some_lookup.update_properties(params)
    expect(some_lookup).to be_valid
    some_lookup.save!
    expect(Lookup.find_by(unique_id: unique_id).lookup_values_en.size).to eq(1)
  end

  describe 'check being used' do
    before do
      clean_data(Lookup)
      @lookup =
        create :lookup, name: 'test lookup', lookup_values: [
          { id: 'value1', display_text: 'value1' }, { id: 'value2', display_text: 'value2' }
        ]
    end

    context 'when not on a form' do
      it 'should return that it is not being used' do
        expect(@lookup.being_used?).to be_falsey
      end
    end

    context 'when on a form' do
      before do
        clean_data(Field, FormSection, Lookup)
        @lookup_d = Lookup.create!(
          unique_id: 'd', name: 'D',
          lookup_values: [
            { id: 'd', display_text: 'D' }, { id: 'dd', display_text: 'DD' },
            { id: 'ddd', display_text: 'DDD' }, { id: 'dddd', display_text: 'DDDD' }
          ]
        )
        select_box_field = Field.new(
          name: 'select_box', type: Field::SELECT_BOX, display_name: 'My Select Box', option_strings_source: 'lookup d'
        )
        create :form_section, fields: [select_box_field]
      end

      it 'should return that it is being used' do
        expect(@lookup_d.being_used?).to be_truthy
      end
    end
  end

  describe 'check return when locale is specified' do
    before do
      clean_data(Lookup)
      @lookup_multi_locales = Lookup.create!(
        unique_id: 'test', name_en: 'English', name_fr: 'French', name_ar: 'Arabic', name_es: 'Spanish',
        lookup_values_en: [{ id: 'lkp1', display_text: 'EN1' }, { id: 'lkp2', display_text: 'EN2' }],
        lookup_values_fr: [{ id: 'lkp1', display_text: 'FR1' }, { id: 'lkp2', display_text: 'FR2' }],
        lookup_values_ar: [{ id: 'lkp1', display_text: 'AR1' }, { id: 'lkp2', display_text: 'AR2' }],
        lookup_values_es: [{ id: 'lkp1', display_text: '' }, { id: 'lkp2', display_text: '' }]
      )
      @lookup_no_locales = Lookup.create!(
        unique_id: 'default', name: 'Default',
        lookup_values: [
          { id: 'default1', display_text: 'Default1' }, { id: 'default2', display_text: 'default2' }
        ]
      )
    end

    context 'when lookup has many locales' do
      it 'should return settings for specified locale' do
        expect(Lookup.values('test', nil, locale: :ar).map { |loc| loc['display_text'] }).to include('AR1', 'AR2')
      end

      context 'and locale is passed in' do
        context 'and passed locale has value for all display_text' do
          it 'returns display text for the locale' do
            expect(Lookup.values('test', nil, locale: :fr).map { |loc| loc['display_text'] }).to include('FR1', 'FR2')
          end
        end

        context 'and passed locale has no value for any display_text' do
          it 'returns display text for the english locale' do
            expect(Lookup.values('test', nil, locale: :en).map { |loc| loc['display_text'] }).to include('EN1', 'EN2')
          end
        end
      end
    end

    context 'when lookup is does not specify all locales' do
      it 'should return the default locale for any missing locales' do
        expect(Lookup.values('default', nil, locale: :ar)[0]['id']).to eq('default1')
      end
    end
  end

  describe 'update_translations' do
    before do
      clean_data(Lookup)
      Lookup.create!(
        unique_id: 'lookup_1', name_en: 'English', name_fr: 'French', name_ar: 'Arabic', name_es: 'Spanish',
        lookup_values_en: [
          { id: 'option_1', display_text: 'English Option 1' }, { id: 'option_2', display_text: 'English Option 2' }
        ],
        lookup_values_fr: [
          { id: 'option_1', display_text: 'French Option 1' }, { id: 'option_2', display_text: 'French Option 2' }
        ],
        lookup_values_ar: [
          { id: 'option_1', display_text: 'Arabic Option 1' }, { id: 'option_2', display_text: 'Arabic Option 2' }
        ],
        lookup_values_es: [
          { id: 'option_1', display_text: 'Spanish Option 1' }, { id: 'option_2', display_text: 'Spanish Option 2' }
        ]
      )
      Lookup.create!(
        unique_id: 'lookup_2', name_en: 'English Two',
        lookup_values_en: [
          { id: 'option_1', display_text: 'English Option One' }, { id: 'option_2', display_text: 'English Option Two' }
        ]
      )
    end

    context 'when translations are French' do
      before :each do
        @locale = :fr
        @translated_hash = {
          'lookup_1' => {
            'name' => 'French Translated',
            'lookup_values' => {
              'option_1' => 'French Option 1 Translated', 'option_2' => 'French Option 2 Translated'
            }
          },
          'lookup_2' => {
            'name' => 'French Two Translated',
            'lookup_values' => {
              'option_1' => 'French Option One Translated', 'option_2' => 'French Option Two Translated'
            }
          }
        }
        @lkp1 = Lookup.find_by(unique_id: 'lookup_1')
        @lkp1.update_translations(@locale, @translated_hash.values.first)
        @lkp2 = Lookup.find_by(unique_id: 'lookup_2')
        @lkp2.update_translations(@locale, @translated_hash.values.last)
      end

      it 'does not change the English names' do
        expect(@lkp1.name_en).to eq('English')
        expect(@lkp2.name_en).to eq('English Two')
      end

      it 'updates the translations for the French names' do
        expect(@lkp1.name_fr).to eq('French Translated')
        expect(@lkp2.name_fr).to eq('French Two Translated')
      end

      it 'does not change the English lookup values' do
        expected = [{ 'id' => 'option_1', 'display_text' => 'English Option 1' },
                    { 'id' => 'option_2', 'display_text' => 'English Option 2' }]
        expect(@lkp1.lookup_values_en).to match_array(expected)

        expected2 = [{ 'id' => 'option_1', 'display_text' => 'English Option One' },
                     { 'id' => 'option_2', 'display_text' => 'English Option Two' }]
        expect(@lkp2.lookup_values_en).to match_array(expected2)
      end

      it 'updates the translations for the French lookup values' do
        expected = [{ 'id' => 'option_1', 'display_text' => 'French Option 1 Translated' },
                    { 'id' => 'option_2', 'display_text' => 'French Option 2 Translated' }]
        expect(@lkp1.lookup_values_fr).to match_array(expected)

        expected2 = [{ 'id' => 'option_1', 'display_text' => 'French Option One Translated' },
                     { 'id' => 'option_2', 'display_text' => 'French Option Two Translated' }]
        expect(@lkp2.lookup_values_fr).to match_array(expected2)
      end
    end

    describe 'handles bad input data' do
      before do
        @locale = :es
      end
      context 'when locale translations do not exist' do
        context 'and input has all of the options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_10', name_en: 'English Ten',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_10' => {
                'name' => 'Spanish Ten Translated',
                'lookup_values' => {
                  'option_1' => 'Spanish Option One Translated',
                  'option_2' => 'Spanish Option Two Translated',
                  'option_3' => 'Spanish Option Three Translated'
                }
              }
            }
            @lkp10 = Lookup.find_by(unique_id: 'lookup_10')
            @lkp10.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@lkp10.lookup_values_es).to match_array(expected)
          end
        end

        context 'and input has only some of the options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_11', name_en: 'English Eleven',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_11' => {
                'name' => 'Spanish Eleven Translated',
                'lookup_values' => {
                  'option_1' => 'Spanish Option One Translated', 'option_2' => 'Spanish Option Two Translated'
                }
              }
            }

            @lkp11 = Lookup.find_by(unique_id: 'lookup_11')
            @lkp11.update_translations(@locale, @translated_hash.values.first)
          end

          it 'only updates the translations passed in' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => nil }]
            expect(@lkp11.lookup_values_es).to match_array(expected)
          end
        end

        context 'and input has too many options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_12', name_en: 'English Twelve',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_12' => {
                'name' => 'Spanish Twelve Translated',
                'lookup_values' => {
                  'option_1' => 'Spanish Option One Translated',
                  'option_2' => 'Spanish Option Two Translated',
                  'option_3' => 'Spanish Option Three Translated',
                  'option_4' => 'Spanish Option Four Translated'
                }
              }
            }
            @lkp12 = Lookup.find_by(unique_id: 'lookup_12')
            @lkp12.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds only the translated options that also exist in the default locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@lkp12.lookup_values_es).to match_array(expected)
          end

          it 'does not add an option that does not exist in the default locale' do
            expect(@lkp12.lookup_values_es.map { |lv| lv['id'] }).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_13', name_en: 'English Thirteen',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_13' => {
                'name' => 'Spanish Thirteen Translated',
                'lookup_values' => {
                  'option_4' => 'Spanish Option Four Translated',
                  'option_5' => 'Spanish Option Five Translated',
                  'option_6' => 'Spanish Option Six Translated',
                  'option_7' => 'Spanish Option Seven Translated'
                }
              }
            }
            @lkp13 = Lookup.find_by(unique_id: 'lookup_13')
            @lkp13.update_translations(@locale, @translated_hash.values.first)
          end

          it 'does not add any option that does not exist in the default locale' do
            default_ids = @lkp13.lookup_values_en.map { |h| h['id'] }
            spanish_ids = @lkp13.lookup_values_es.map { |h| h['id'] }

            expect(default_ids - spanish_ids).to be_empty
            expect(spanish_ids - default_ids).to be_empty
          end
        end

        context 'and input has same options in different order' do
          before do
            Lookup.create!(
              unique_id: 'lookup_14', name_en: 'English Fourteen',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_14' => {
                'name' => 'Spanish Fourteen Translated',
                'lookup_values' => {
                  'option_2' => 'Spanish Option Two Translated',
                  'option_1' => 'Spanish Option One Translated',
                  'option_3' => 'Spanish Option Three Translated'
                }
              }
            }
            @lkp14 = Lookup.find_by(unique_id: 'lookup_14')
            @lkp14.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@lkp14.lookup_values_es).to match_array(expected)
          end
        end
      end
      context 'locale translations do exist' do
        context 'and input has all of the options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_20', name_en: 'English Twenty',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ],
              lookup_values_es: [
                { id: 'option_1', display_text: 'Spanish Option One' },
                { id: 'option_2', display_text: 'Spanish Option Two' },
                { id: 'option_3', display_text: 'Spanish Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_20' => {
                'name' => 'Spanish Twenty Translated',
                'lookup_values' => {
                  'option_1' => 'Spanish Option One Translated',
                  'option_2' => 'Spanish Option Two Translated',
                  'option_3' => 'Spanish Option Three Translated'
                }
              }
            }
            @lkp20 = Lookup.find_by(unique_id: 'lookup_20')
            @lkp20.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@lkp20.lookup_values_es).to match_array(expected)
          end
        end

        context 'and input has only some of the options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_21', name_en: 'English Twenty-one',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ],
              lookup_values_es: [
                { id: 'option_1', display_text: 'Spanish Option One' },
                { id: 'option_2', display_text: 'Spanish Option Two' },
                { id: 'option_3', display_text: 'Spanish Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_21' => {
                'name' => 'Spanish Twenty-one Translated',
                'lookup_values' => {
                  'option_1' => 'Spanish Option One Translated', 'option_2' => 'Spanish Option Two Translated'
                }
              }
            }
            @lkp21 = Lookup.find_by(unique_id: 'lookup_21')
            @lkp21.update_translations(@locale, @translated_hash.values.first)
          end

          it 'updates only the translated options provided for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three' }]
            expect(@lkp21.lookup_values_es).to match_array(expected)
          end
        end

        context 'and input has too many options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_22', name_en: 'English Twenty-two',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ],
              lookup_values_es: [
                { id: 'option_1', display_text: 'Spanish Option One' },
                { id: 'option_2', display_text: 'Spanish Option Two' },
                { id: 'option_3', display_text: 'Spanish Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_22' => {
                'name' => 'Spanish Twenty-two Translated',
                'lookup_values' => {
                  'option_1' => 'Spanish Option One Translated',
                  'option_2' => 'Spanish Option Two Translated',
                  'option_3' => 'Spanish Option Three Translated',
                  'option_4' => 'Spanish Option Four Translated'
                }
              }
            }
            @lkp22 = Lookup.find_by(unique_id: 'lookup_22')
            @lkp22.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds only the translated options that also exist in the default locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@lkp22.lookup_values_es).to match_array(expected)
          end

          it 'does not add an option that does not exist in the default locale' do
            expect(@lkp22.lookup_values_es.map { |lv| lv['id'] }).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            Lookup.create!(
              unique_id: 'lookup_23', name_en: 'English Twenty-three',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ],
              lookup_values_es: [
                { id: 'option_1', display_text: 'Spanish Option One' },
                { id: 'option_2', display_text: 'Spanish Option Two' },
                { id: 'option_3', display_text: 'Spanish Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_23' => {
                'name' => 'Spanish Twenty-three Translated',
                'lookup_values' => {
                  'option_4' => 'Spanish Option Four Translated',
                  'option_5' => 'Spanish Option Five Translated',
                  'option_6' => 'Spanish Option Six Translated',
                  'option_7' => 'Spanish Option Seven Translated'
                }
              }
            }
            @lkp23 = Lookup.find_by(unique_id: 'lookup_23')
            @lkp23.update_translations(@locale, @translated_hash.values.first)
          end

          it 'does not add any option that does not exist in the default locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three' }]
            expect(@lkp23.lookup_values_es).to match_array(expected)
          end
        end

        context 'and input has same options in different order' do
          before do
            Lookup.create!(
              unique_id: 'lookup_24', name_en: 'English Twenty-four',
              lookup_values_en: [
                { id: 'option_1', display_text: 'English Option One' },
                { id: 'option_2', display_text: 'English Option Two' },
                { id: 'option_3', display_text: 'English Option Three' }
              ]
            )
            @translated_hash = {
              'lookup_24' => {
                'name' => 'Spanish Twenty-four Translated',
                'lookup_values' => {
                  'option_2' => 'Spanish Option Two Translated',
                  'option_1' => 'Spanish Option One Translated',
                  'option_3' => 'Spanish Option Three Translated'
                }
              }
            }
            @lkp24 = Lookup.find_by(unique_id: 'lookup_24')
            @lkp24.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@lkp24.lookup_values_es).to match_array(expected)
          end
        end
      end
    end
  end
end
