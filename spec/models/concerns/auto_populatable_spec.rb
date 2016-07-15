require 'spec_helper'

class TestClass < CouchRest::Model::Base
  include AutoPopulatable

  property :name, String, :default => 'A name'
  property :name_first, String
  property :name_middle, String
  property :name_last, String
  property :code_1, String
  property :code_2, String
  property :code_3, String


  def save_doc(*args)
    true
  end
end

describe AutoPopulatable do
  before do
    SystemSettings.all.each &:destroy

    # @t1 = TestClass.new({name_first: 'name_1', name_middle: 'name_2', name_last: 'name_3'})
    # @t2 = TestClass.new({name_middle: 'name_2', name_last: 'name_3'})
    # @t3 = TestClass.new({name_last: 'name_3'})
    # @t4 = TestClass.new()
    # @t5 = TestClass.new({name_first: 'name_1'})
    # @t6 = TestClass.new({name_middle: 'name_2'})
    # @t7 = TestClass.new({name_first: 'name_1', name_middle: 'name_2'})


    ap1 = AutoPopulateInformation.new(field_key: 'name',
                                     format: ['name_first', 'name_middle', 'name_last'],
                                     separator: ' ', auto_populated: true)
    ap2 = AutoPopulateInformation.new(field_key: 'id_code',
                                      format: ['name_last', 'code_1', 'code_2', 'code_3'],
                                      separator: '-', auto_populated: true)
    ap3 = AutoPopulateInformation.new(field_key: 'no_separator',
                                      format: ['name_first', 'name_last', 'code_1'],
                                      auto_populated: true)
    ap4 = AutoPopulateInformation.new(field_key: 'no_code',
                                      format: ['name_last', 'code_1'],
                                      separator: '-', auto_populated: false)

    @system_settings = SystemSettings.create(default_locale: "en", auto_populate_list: [ap1, ap2, ap3, ap4])
  end

  context 'when SystemSettings is passed in' do

    context 'and auto_populated is true' do
      context 'and all format fields are populated' do
        before :each do
          @t1 = TestClass.new(name_first: 'Jim', name_middle: 'Bob', name_last: 'Smith',
                              code_1: 'Abc', code_2: 'Def', code_3: 'Ghi')
        end

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
            expect(@t1.auto_populate('no_separator', @system_settings)).to eq('JimSmithAbc')
          end
        end
      end

      context 'and some format fields are populated' do
        #TODO
      end

      context 'and no format fields are populated' do
        #TODO
      end
    end

    context 'and auto_populated is false' do
      #TODO
    end

    context 'and auto_populate_list is nil' do
      #TODO
    end
  end

  # context 'when SystemSettings is not papassed in' do
  #   context 'and auto_populated is true' do
  #     context 'and separator is populated' do
  #
  #     end
  #
  #     context 'and separator is not populated' do
  #
  #     end
  #   end
  #
  #   context 'and auto_populated is false' do
  #
  #   end
  # end

end