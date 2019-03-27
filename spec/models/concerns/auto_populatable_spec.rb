require 'rails_helper'

describe AutoPopulatable do
  context 'when auto_populate_list is present' do
    before do
      SystemSettings.all.each &:destroy

      ap1 = AutoPopulateInformation.new(field_key: 'name',
                                       format: ['name_first', 'name_middle', 'name_last'],
                                       separator: ' ', auto_populated: true)
      ap2 = AutoPopulateInformation.new(field_key: 'id_code',
                                        format: ['name_last', 'code_1', 'code_2', 'code_3'],
                                        separator: '-', auto_populated: true)
      ap3 = AutoPopulateInformation.new(field_key: 'no_separator',
                                        format: ['name_first', 'name_middle', 'name_last', 'code_1'],
                                        auto_populated: true)
      ap4 = AutoPopulateInformation.new(field_key: 'no_code',
                                        format: ['name_last', 'code_1'],
                                        separator: '-', auto_populated: false)

      @system_settings = SystemSettings.create(default_locale: "en", auto_populate_list: [ap1, ap2, ap3, ap4])
    end

    context 'and auto_populated is true' do
      context 'and all format fields are populated' do
        before :each do
          @t1 = Child.new(data: {name_first: 'Jim', name_middle: 'Bob', name_last: 'Smith',
                              code_1: 'Abc', code_2: 'Def', code_3: 'Ghi'})
        end

        context 'and SystemSettings is passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name', @system_settings)).to eq('Jim Bob Smith')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code', @system_settings)).to eq('Smith-Abc-Def-Ghi')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator', @system_settings)).to eq('JimBobSmithAbc')
            end
          end
        end

        context 'and SystemSettings is not passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name')).to eq('Jim Bob Smith')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code')).to eq('Smith-Abc-Def-Ghi')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator')).to eq('JimBobSmithAbc')
            end
          end
        end

      end

      context 'and some format fields are populated' do
        before :each do
          @t1 = Child.new(data: {name_first: 'Jim', name_last: 'Smith',
                              code_1: 'Abc', code_3: 'Ghi'})
        end

        context 'and SystemSettings is passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name', @system_settings)).to eq('Jim Smith')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code', @system_settings)).to eq('Smith-Abc-Ghi')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator', @system_settings)).to eq('JimSmithAbc')
            end
          end
        end

        context 'and SystemSettings is not passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name')).to eq('Jim Smith')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code')).to eq('Smith-Abc-Ghi')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator')).to eq('JimSmithAbc')
            end
          end
        end

      end

      context 'and only one format field is populated' do
        before :each do
          @t1 = Child.new(name_last: 'Smith')
        end

        context 'and SystemSettings is passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name', @system_settings)).to eq('Smith')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code', @system_settings)).to eq('Smith')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator', @system_settings)).to eq('Smith')
            end
          end
        end

        context 'and SystemSettings is not passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name')).to eq('Smith')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code')).to eq('Smith')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator')).to eq('Smith')
            end
          end
        end
      end

      context 'and no format fields are populated' do
        before :each do
          @t1 = Child.new()
        end

        context 'and SystemSettings is passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name', @system_settings)).to eq('')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code', @system_settings)).to eq('')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator', @system_settings)).to eq('')
            end
          end
        end

        context 'and SystemSettings is not passed in' do
          context 'and separator is populated with a space' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('name')).to eq('')
            end
          end

          context 'and separator is populated with a dash' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('id_code')).to eq('')
            end
          end

          context 'and separator is not populated' do
            it 'generates the auto populate field' do
              expect(@t1.auto_populate('no_separator')).to eq('')
            end
          end
        end
      end
    end

    context 'and auto_populated is false' do
      before :each do
        @t1 = Child.new(data: {name_first: 'Jim', name_middle: 'Bob', name_last: 'Smith',
                            code_1: 'Abc', code_2: 'Def', code_3: 'Ghi'})
      end

      context 'and SystemSettings is passed in' do
        it 'returns nil' do
          expect(@t1.auto_populate('no_code', @system_settings)).to be_nil
        end
      end

      context 'and SystemSettings is not passed in' do
        it 'returns nil' do
          expect(@t1.auto_populate('no_code')).to be_nil
        end
      end
    end
  end

  context 'when auto_populate_list is nil' do
    before do
      SystemSettings.all.each &:destroy

      @system_settings = SystemSettings.create(default_locale: "en")

      @t1 = Child.new(data: {name_first: 'Jim', name_middle: 'Bob', name_last: 'Smith',
                          code_1: 'Abc', code_2: 'Def', code_3: 'Ghi'})
    end

    context 'and SystemSettings is passed in' do
      it 'returns nil' do
        expect(@t1.auto_populate('name', @system_settings)).to be_nil
      end
    end

    context 'and SystemSettings is not passed in' do
      it 'returns nil' do
        expect(@t1.auto_populate('name')).to be_nil
      end
    end
  end
end