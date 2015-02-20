
module Importers
  class CPIMSImporter
    def self.id
      'cpims'
    end

    def self.display_name
      'CPIMS'
    end

    def self.import(file_obj)
      book = Spreadsheet.open(file_obj)
      rows = book.worksheets[0].to_a
      
      #Remove empty lines
      #This includes the "Form Name" line which has a blank first column
      #TODO - would it be better to just delete the row from the excel file?
      rows.reject! {|r| r.blank? || r[0].blank?}
      
      #Now we have the first 2 lines as heading lines
      #Reconcile / merge row 1 and 2.  The heading is a mixture of both.  Confused yet?
      #To do this, iterate through row 1's elements, if nil, replace with value from row 2.
      a = []
      rows[0].each_with_index {|r, i| a << (r || rows[1][i])}
      rows.shift(2)
      rows.unshift(a)

      cpims_data = Importers.flat_to_nested(rows)
      
      #Now translate CPIMS stuff to Primero stuff
      primero_data = []
      cpims_data.each {|d| primero_data << Child.map_from_CPIMS(d)}
      return primero_data
    end
  end
end
