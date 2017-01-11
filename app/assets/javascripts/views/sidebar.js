_primero.Views.tabNavigation = Backbone.View.extend({
  is_error: false,

  el: '.page_container',

  events: {
    'click .tab-handles a:not(div.record_status a)': 'tabControl',
    'click #show_change_log' : 'show_change_log'
  },

  initialize: function() {
    $(".tab").hide();
    $('.tab-handles li[data-first-tab="true"]').addClass("current").show();
    $('.tab[data-first-tab="true"]').show();

    this.first_tab();
    this.tabRedirection();
    _primero.set_content_sidebar_equality();

    $(".side-nav-container").sticky({
      topSpacing: 130,
      bottomSpacing: 90
    });

    if ($('.errorExplanation').length || $('p.notice').length) {
      _primero.scrollTop();
    }
  },

  first_tab: function() {
    var tab = $('.tab-handles li.current').children('a').attr('href'),
      current_tab = localStorage.getItem('current_tab'),
      first_tab = localStorage.getItem('first_tab');

    localStorage.setItem('first_tab', tab);

    if (current_tab === null) {
      this.ls_set_tab(tab);
    }
  },

  tabControl: function(event) {
    event.preventDefault();

    var $tab = $(event.target),
      $check_sub = $tab.next();

    $(".tab-handles li").removeClass("current");

    $tab.parents('.group').addClass('current');
    $tab.parent().addClass("current");

    if(($check_sub.is('ul')) && ($check_sub.is(':visible'))) {
      $tab.parent().removeClass('current');
      $check_sub.slideUp('normal');
    }

    if(($check_sub.is('ul')) && (!$check_sub.is(':visible'))) {
      $('ul.tab-handles ul:visible').slideUp('normal');
      $check_sub.find('li').first().addClass('current');
      $check_sub.slideDown('normal');
    }

    if($tab.hasClass('non-group')) {
      $('ul.tab-handles ul:visible').slideUp('normal');
    }

    $(".tab").hide();

    var activeTab = $tab.attr("href");

    this.ls_set_tab(activeTab);

    $(activeTab).show();
    _primero.set_content_sidebar_equality();

    //When make visible a tab, initialize the chosen in the tab.
    _primero.chosen(activeTab + ' select.chosen-select:visible');

    _primero.scrollTop();
    return false;
  },

  listen_for_reset: function() {
    if (this.getUrlParams('follow') || this.is_error) {
      return true;
    } else {
      this.ls_clear_tab();
    }
  },

  getUrlParams: function(param) {
    var url = window.location.search.substring(1),
      params = url.split('&');
    for (var i = 0; i < params.length; i++) {
      var name = params[i].split('=');
      if (name[0] == param) {
        return name[1];
      }
    }
  },

  ls_set_tab: function (tab) {
    localStorage.setItem('current_tab', tab);
  },

  ls_clear_tab: function() {
    localStorage.removeItem('current_tab');
  },

  tabRedirection: function() {
    if($('.error-item').size()) {
      tab = $('.error-item:first').data('error-item');
      this.ls_set_tab(tab);
      this.is_error = true;
    }

    if(this.listen_for_reset()) {
      this.determine_current_tab('current');
    } else {
      this.determine_current_tab('first');
    }
  },

  determine_current_tab: function(action) {
    var active_tab = localStorage.getItem(action + '_tab'),
      $tab = $(active_tab),
      tab_nav = $('a[href="' + active_tab + '"]'),
      subgroup = tab_nav.parents('ul.sub');

    if (active_tab !== null && $tab.length) {
      $(".tab-handles li").removeClass("current");
      $(".tab").hide();

      tab_nav.parents('li').addClass("current");

      if (subgroup) {
        subgroup.slideDown('normal');
      }

      $tab.show();
    }
  },

  show_change_log: function(event) {
    event.preventDefault();
    var $show_history_button = $(event.target),
      history_url = $show_history_button.data('change_log_url'),
      $target_div = $("#" + $show_history_button.data('reveal-id'));
    if ($target_div.html() === "") {
      $.get( history_url, function(response) {
        $target_div.html(response);
      });
    }
  }
});