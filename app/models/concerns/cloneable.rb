module Cloneable
  extend ActiveSupport::Concern
  include Namable

  #This is necessary to clear the couch '_rev' attribute so the new record is instantiated properly
  #without conflicting with the original
  #If a name is passed in, that name is used
  #Otherwise, the current name is prepended with 'copy of'
  def clone(newName = '')
    newRecord = self.dup
    newRecord['_id'] = nil
    newRecord['_rev'] = nil
    if newName.present?
      newRecord.name = newName
    else
      newRecord.name.prepend('copy of ')
    end
    newRecord.generate_id
    newRecord
  end

end
