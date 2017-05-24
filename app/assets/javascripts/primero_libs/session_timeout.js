var IdleSessionTimeout = {};

IdleSessionTimeout.start = function() {
    var element = new Foundation.Reveal($('#idleModal'));

    $('#idleModal .keepworking').on('click', function(e) {
        element.close();
    });

    $('#idleModal .logout').on('click', function(e) {
        e.preventDefault();
        $.idleTimeout.options.onTimeout.call(this);
    });

    $.idleTimeout('#idleModal', 'button.keepworking', {
        idleAfter: 900,
        pollingInterval: 180,
        warningLength: 300,
        keepAliveURL: '/active',
        serverResponseEquals: 'OK',
        onTimeout: function() {
            window.location = "/logout";
        },
        onIdle: function() {
            element.open();
        },
        onCountdown: function(counter) {
            $("#dialog-countdown").html(counter);
        },
        onResume: function() {
            // the dialog is closed by a button in the dialog
            // no need to do anything else
        }
    });
};


