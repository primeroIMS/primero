
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
      rows.reject! {|r| r.blank?}
      
      #Remove the 2nd row.  It isn't needed here.  It just contains CPIMS form info
      rows.delete_at(1)
      
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
