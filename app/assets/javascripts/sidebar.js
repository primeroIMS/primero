_primero.tabRedirection = {
    ls_set_tab: function (tab) {
        localStorage.setItem('current_tab', tab)
    },
    ls_clear_tab: function() {
        localStorage.removeItem('current_tab')
    },
    redirect: function() {
        if($('.error-item').size()) {
           tab = $('.error-item:first').data('error-item');
           this.ls_set_tab(tab);
           this.is_error = true;
        }

        _primero.listen_for_reset();
        var active_tab = localStorage.getItem('current_tab'),
            tab = $(active_tab);
        if (active_tab !== null && tab.length) {
            $(".tab-handles li").removeClass("current");
            $(".tab").hide();

            $('a[href="' + active_tab + '"]').parent().addClass("current");
            tab.show();
        }
        _primero.set_content_sidebar_equality();
    },
    is_error: false
};

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

_primero.getUrlParams = function(param) {
    var url = window.location.search.substring(1),
        params = url.split('&');
    for (var i = 0; i < params.length; i++) {
        var name = params[i].split('=');
        if (name[0] == param) {
            return name[1];
        }
    }
};

_primero.listen_for_reset = function() {
    if (this.getUrlParams('follow') || this.tabRedirection.is_error) {
        return true
    } else {
        this.tabRedirection.ls_clear_tab();
    }
};

$(document).ready(function() {
    $("ul.side-nav").sticky({ 
        topSpacing: 0,
        bottomSpacing: 40 
    });
});