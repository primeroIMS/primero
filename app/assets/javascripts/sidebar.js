tabNavigation = Backbone.View.extend({
  is_error: false,

  el: '.side-tab',

  events: {
    'click .tab-handles a': 'tabControl'
  },

  initialize: function() {
    $(".tab").hide();
    $('.tab-handles li[data-first-tab="true"]').addClass("current").show();
    $('.tab[data-first-tab="true"]').show();

    this.first_tab();
    this.tabRedirection();
  },

  first_tab: function() {
    var tab = $('.tab-handles li.current').children('a').attr('href')
    localStorage.setItem('first_tab', tab)
  },

  tabControl: function(event) {
    event.preventDefault();

    var tab = $(event.target),
        check_sub = tab.next();

    $(".tab-handles li").removeClass("current");

    tab.parents('.group').addClass('current');
    tab.parent().addClass("current");

    if((check_sub.is('ul')) && (check_sub.is(':visible'))) {
      tab.parent().removeClass('current');
      check_sub.slideUp('normal')
    }

    if((check_sub.is('ul')) && (!check_sub.is(':visible'))) {
      $('ul.tab-handles ul:visible').slideUp('normal');
      check_sub.find('li').first().addClass('current');
      check_sub.slideDown('normal');
    }

    if(tab.hasClass('non-group')) {
      $('ul.tab-handles ul:visible').slideUp('normal');
    }
    
    $(".tab").hide();

    var activeTab = tab.attr("href");

    this.ls_set_tab(activeTab);

    $(activeTab).show();
    _primero.set_content_sidebar_equality();

    //When make visible a tab, initialize the chosen in the tab.
    _primero.chosen(activeTab + ' select.chosen-select:visible');
    return false;
  },

  listen_for_reset: function() {
    if (this.getUrlParams('follow') || this.is_error) {
        return true
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
    localStorage.setItem('current_tab', tab)
  },

  ls_clear_tab: function() {
    localStorage.removeItem('current_tab')
  },

  tabRedirection: function() {
      if($('.error-item').size()) {
        tab = $('.error-item:first').data('error-item');
        this.ls_set_tab(tab);
        this.is_error = true;
      }

      if(this.listen_for_reset()) {
        this.determine_current_tab('current')
      } else {
        this.determine_current_tab('first')
      }
      _primero.set_content_sidebar_equality();
  }, 

  determine_current_tab: function(action) {
    var active_tab = localStorage.getItem(action + '_tab'),
        tab = $(active_tab),
        tab_nav = $('a[href="' + active_tab + '"]'),
        subgroup = tab_nav.parents('ul.sub');

    if (active_tab !== null && tab.length) {
      $(".tab-handles li").removeClass("current");
      $(".tab").hide();

      tab_nav.parents('li').addClass("current");

      if (subgroup) {
        subgroup.slideDown('normal');
      }
      
      tab.show();
    }
  }
});

_primero.set_content_sidebar_equality = function() {
  // Added to size sidebar and side content
  var content = $('.side-tab-content'),
      sidebar = $('.side-tab'),
  content_height = function() {
    var sidebar_height = sidebar.find('ul.side-nav').height();
    if (content.height() < sidebar_height) {
      return sidebar_height + 20;
    } else {
      return content.height() + 50
    }
  };

  sidebar.height(content_height());
};

$(document).ready(function() {
  new tabNavigation();

  $("ul.side-nav").sticky({ 
    topSpacing: 50,
    bottomSpacing: 40 
  });

  // set height of sidebar depending on side content
  _primero.set_content_sidebar_equality();
});