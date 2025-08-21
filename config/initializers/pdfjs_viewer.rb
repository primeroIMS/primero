# frozen_string_literal: true

# PdfjsViewer Configuration

PdfjsViewer.configure do |config|
  # Show/hide the highlight button in the toolbar
  # config.show_highlight_button = true

  # Show/hide the text annotation button in the toolbar
  # config.show_text_button = true

  # Show/hide the draw button in the toolbar
  # config.show_draw_button = true

  # Show/hide the add/edit image button in the toolbar
  # config.show_add_edit_image_button = true

  # Show/hide the print button in the toolbar
  # config.show_print_button = true

  # Show/hide the save/download button in the toolbar
  # config.show_save_button = true

  # Show/hide the open file button in the toolbar
  config.show_open_file_button = false

  config.stylesheet_path = '/pdf-viewer.css'
end
