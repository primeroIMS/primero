var IdleSessionTimeout = {};

IdleSessionTimeout.start = function() {
    var element = new Foundation.Reveal($('#idleModal'));

    $.idleTimeout('#idleModal', 'button.keepworking', {
        idleAfter: 300,
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
            element.close()
        }
    });
};


