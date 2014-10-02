FakeRecordWithHistory = Struct.new(:id, :histories, :created_at, :created_by) do
  def initialize user = "Bob", created = "2010/12/31 22:06:00 +0000"
    super()
    @id = "ChildId"
    @histories ||= []
    @created_at ||= created
    @created_by ||= user
  end

  def add_history history
    @histories.unshift(history)
  end

  def ordered_histories
    @histories
  end

  def add_photo_change username, date, *new_photos
    self.add_history(OpenStruct.new({
                         "changes" => {
                             "photo_keys" => {
                                 "added" => new_photos
                             }
                         },
                         "user_name" => username,
                         "datetime" => date,
                         "action" => :update,
                     }))
  end

  def add_single_change username, date, field, from, to, action = :update
    self.add_history(OpenStruct.new({
                         "changes" => {
                             field => {
                                 "from" => from,
                                 "to" => to
                             }
                         },
                         "user_name" => username,
                         "datetime" => date,
                         "action" => action,
                     }))
  end

  def last_updated_at
    Date.today
  end
end
