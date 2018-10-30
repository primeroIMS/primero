/*
 * jQuery Idle Timeout 1.2
 * Copyright (c) 2011 Eric Hynds
 *
 * http://www.erichynds.com/jquery/a-new-and-improved-jquery-idle-timeout-plugin/
 *
 * Depends:
 *  - jQuery 1.4.2+
 *  - jQuery Idle Timer (by Paul Irish, http://paulirish.com/2009/jquery-idletimer-plugin/)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/

(function($, win){
	function setData(key, value) {
		return localStorage.setItem(key, value);
	}

	function getData(key) {
		return localStorage.getItem(key);
	}

	function setDataDefaults() {
		setData('warningTimer', false);
		setData('idleStart', -1);
		setData('logoutTriggered', false);
		setData('lastActivity', $.now());
		setData('idleCounter', -1);
	}

	var idleTimeout = {
		init: function( element, resume, options ){
			var self = this, elem;

			setDataDefaults()

			this.warning = elem = $(element);
			this.resume = $(resume);
			this.options = options;
			this.countdownOpen = false;
			this.failedRequests = options.failedRequests;
			this._startTimer();
			this.title = document.title;
			this.focused = document["visibilityState"] == "visible"

			document.addEventListener('visibilitychange', function(){
				this.focused = !document.hidden
			})

			win.addEventListener("storage", function(e) {
				if (e.key == 'logoutTriggered' && e.newValue == 'true') {
					self.options.onTimeout.call(self.warning);
				}

				if (e.key == 'idleStart' && e.newValue == -1) {
					self._continue();
				}

				if (e.key == 'idleCounter' && e.newValue > 0) {
					self._setCountDown(e.newValue)
				}

				if (e.key == 'idleCounter' && e.newValue == 0) {
					self.options.onTimeout.call(self.warning);
				}

				if (e.key == 'warningTimer' && e.newValue == 'false') {
					if (getData('idleCounter') > 0) {
						self.startWarningTimer(getData('idleCounter'));
					}
				}
			}, false);

			elem.find('.logout').on('click', function(e) {
				e.preventDefault();
				setData('logoutTriggered', true);
				self.options.onTimeout.call(this);
			})

			// expose obj to data cache so peeps can call internal methods
			$.data( elem[0], 'idletimeout', this );

			// start the idle timer
			$.idleTimer({
				timeout: options.idleAfter * 1000,
				timerSyncId: 'idleSync'
			});

			win.addEventListener("beforeunload", function (e) {
				if (win.countdown && getData('warningTimer') == 'true') {
					setData('warningTimer', false)
				}
			});

			// once the user becomes idle
			$(document).bind("idle.idleTimer", function(){
				var idleTimerObj = $.data(document, 'idleTimerObj')
				// if the user is idle and a countdown isn't already running
				if(idleTimerObj && idleTimerObj.idle && !self.countdownOpen ) {
					setData('idleStart', $.now());
					self._stopTimer();
					self.countdownOpen = true;

					self._idle(self.focused);
				}
			});

			// bind continue link
			this.resume.bind("click", function(e){
				e.preventDefault();
				self._continue();
			});
		},

		_continue: function() {
			var self = this;

			setDataDefaults()

			win.clearInterval(self.countdown); // stop the countdown
			win.clearInterval(win.countdown)
			self.countdownOpen = false; // stop countdown
			self._startTimer(); // start up the timer again
			self._keepAlive( false ); // ping server
			self.options.onResume.call( self.warning ); // call the resume callback
		},

		_idle: function(){
			var self = this,
				options = this.options,
				warning = this.warning[0],
				counter = options.warningLength;


			// fire the onIdle function
			options.onIdle.call(warning);

			// set inital value in the countdown placeholder
			options.onCountdown.call(warning, counter);

			this.startWarningTimer(counter)
		},

		startWarningTimer(counter) {
			var self = this;

			if (getData('warningTimer') == 'false') {
				setData('warningTimer', true)

				window.countdown = this.countdown = win.setInterval(function() {
					if (--counter === 0) {
						window.clearInterval(self.countdown);

						self.options.onTimeout.call(self.warning[0]);
					} else {
						self._setCountDown(counter)
					}

					setData('idleCounter', counter);
				}, 1000);
			}
		},

		_setCountDown(counter) {
			this.options.onCountdown.call(this.warning[0], counter);
			document.title = this.options.titleMessage.replace('%s', counter) + this.title;
		},

		_startTimer: function(){
			var self = this;

			window.timer = this.timer = win.setTimeout(function(){
				self._keepAlive();
			}, this.options.pollingInterval * 1000);
		},

		_stopTimer: function(){
			// reset the failed requests counter
			this.failedRequests = this.options.failedRequests;
			win.clearTimeout(this.timer);
		},

		_keepAlive: function( recurse ){
			var self = this,
				options = this.options;

			//Reset the title to what it was.
			document.title = self.title;

			// assume a startTimer/keepAlive loop unless told otherwise
			if( typeof recurse === "undefined" ){
				recurse = true;
			}

			// if too many requests failed, abort
			if( !this.failedRequests ){
				this._stopTimer();
				options.onAbort.call( this.warning[0] );
				return;
			}

			$.ajax({
				timeout: options.AJAXTimeout,
				url: options.keepAliveURL,
				error: function(){
					self.failedRequests--;
				},
				success: function(response){
					if($.trim(response) !== options.serverResponseEquals){
						self.failedRequests--;
					}
				},
				complete: function(){
					if( recurse ){
						self._startTimer();
					}
				}
			});
		}
	};

	// expose
	$.idleTimeout = function(element, resume, options){
		idleTimeout.init( element, resume, $.extend($.idleTimeout.options, options) );
		return this;
	};

	// options
	$.idleTimeout.options = {
		// number of seconds after user is idle to show the warning
		warningLength: 30,

		// url to call to keep the session alive while the user is active
		keepAliveURL: "",

		// the response from keepAliveURL must equal this text:
		serverResponseEquals: "OK",

		// user is considered idle after this many seconds.  10 minutes default
		idleAfter: 600,

		// a polling request will be sent to the server every X seconds
		pollingInterval: 60,

		// number of failed polling requests until we abort this script
		failedRequests: 5,

		// the $.ajax timeout in MILLISECONDS!
		AJAXTimeout: 250,

		// %s will be replaced by the counter value
    titleMessage: 'Warning: %s seconds until log out | ',

		/*
			Callbacks
			"this" refers to the element found by the first selector passed to $.idleTimeout.
		*/
		// callback to fire when the session times out
		onTimeout: $.noop,

		// fires when the user becomes idle
		onIdle: $.noop,

		// fires during each second of warningLength
		onCountdown: $.noop,

		// fires when the user resumes the session
		onResume: $.noop,

		// callback to fire when the script is aborted due to too many failed requests
		onAbort: $.noop
	};

})(jQuery, window);