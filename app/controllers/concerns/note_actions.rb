module NoteActions
  extend ActiveSupport::Concern

  def add_note
    authorize! :add_note, @record

    if @record.blank?
      flash[:notice] = t('notes.no_records_selected')
      redirect_back(fallback_location: root_path) and return
    end

    @record.notes_section = [] if @record.notes_section.nil?
    note = Note.new(field_notes_subform_fields: notes, note_subject: note_subject, notes_date: DateTime.now,
                    note_created_by: current_user.user_name)
    @record.notes_section << note
    @record.update_last_updated_by(current_user)
    if @record.save
      redirect_to polymorphic_path(@record, { follow: true })
    else
      flash[:notice] = t('notes.error_adding_note')
      redirect_back(fallback_location: root_path) and return
    end
  end

  private

  def note_subject
    @note_subject ||= params[:subject]
  end

  def notes
    @notes ||= params[:notes]
  end

end