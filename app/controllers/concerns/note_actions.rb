module NoteActions
  extend ActiveSupport::Concern

  def add_note
    authorize! :add_note, model_class

    if @record.present?
      @record.notes_section = [] if @record.notes_section.nil?
      note = Note.new(field_notes_subform_fields: notes, note_subject: note_subject, notes_date: DateTime.now)
      @record.notes_section << note
      @record.save
    end

    redirect_back(fallback_location: root_path)
  end

  private

  def note_subject
    @note_subject ||= params[:subject]
  end

  def notes
    @notes ||= params[:notes]
  end

end