_primero.Views.PhotoAudioFields = _primero.Views.Base.extend({
  el: "body",
  events: {
    "click .audio_player_section .audio .delete_check_box input[type='checkbox']" : "delete_check_box_click"
  },

  initialize: function(){
    this.init_audio_player();
  },

  init_audio_player: function() {
    var $jplayer_input = $("#jquery_jplayer_1");
    var audio_url = $jplayer_input.data("audio-url");
    $jplayer_input.jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia", {
          mp3: audio_url
        });
      },
      swfPath: "/assets",
      supplied: "mp3",
      useStateClassSkin: true,
      autoBlur: false,
      solution:"flash, html"
    });
  },

  //Check the current audio for delete will disable the input file and clear it.
  delete_check_box_click: function(event){
    var $target = $(event.target);
    var model = $target.attr("data-model");
    var $upload_audio_input = $("fieldset[id$='photos_and_audio'] #" + model + "_audio");
    var $audio_path_label = $("fieldset[id$='photos_and_audio'] #" + model + "_audio_file_path");
    if ($target.attr('checked')) {
      $upload_audio_input.attr('disabled', 'disabled').val("");
      $audio_path_label.text($audio_path_label.data('default-text'));
    } else {
      $upload_audio_input.removeAttr('disabled');
    }
  }
});