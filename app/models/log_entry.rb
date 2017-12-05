class LogEntry < ApplicationRecord
  include PrimeroModel

  use_database :log_entry
  before_save :set_created_at

  TYPE = {:cpims => "CPIMS Export", :csv => "CSV Export", :pdf => "PDF Export", :photowall => "Photo Wall Export", :list_view_csv => "Export List"}

  def set_created_at
     self[:created_at] = Primero::Clock.current_formatted_time
  end

  design do
    view :by_created_at,
          :map => "function(doc) {
                if ((doc['couchrest-type'] == 'LogEntry') && doc['created_at'])
                {
                     emit(doc['created_at'], null);
                }
          }"
  end

end
