$(function () {
	var extensionEnabled;
	var siteEnabled;
	var enabled = false;
	var position;


	function initAutocopy(callback) {
		checkEnabled(() => {
			if (extensionEnabled) {
				checkSiteEnabled(() => {
					if (siteEnabled) {
						enableAutocopy();
						if (callback != null) callback(true);
					} else {
						if (callback != null) callback(false);
					}
				})
			} else {
				if (callback != null) callback(false);
			}
		})
	}

	initAutocopy(shouldEnable => {
		if (shouldEnable) { enableAutocopy(); } else {
			chrome.runtime.sendMessage({ 'command': 'updateIcon', enabled: false }, () => null);
		}
	});

	chrome.storage.sync.get("position", function (value) {
		if (value != null) {
			position = value.position;
		} else {
			chrome.storage.sync.set({ position: 'top-right' })
		}
	});

	function checkSiteEnabled(callback) {
		chrome.runtime.sendMessage({ command: 'getHostname' }, function (response) {
			var domain = response;
			chrome.storage.sync.get("enabledfor." + domain, function (value) {

				if (value != null && value["enabledfor." + domain] != null) {
					siteEnabled = value["enabledfor." + domain];
				} else {
					siteEnabled = false;
				}

				callback();
			});
		});

	}

	function checkEnabled(callback) {
		chrome.storage.sync.get("enabled", function (value) {
			if (value.enabled != null) {
				extensionEnabled = value.enabled;
			} else {
				extensionEnabled = true;
			}

			callback();
		});
	}

	chrome.storage.onChanged.addListener(function (changes, namespace) {
		initAutocopy((shouldEnable) => {
			if (changes.position != null) {
				position = changes.position.newValue;
			}

			if (shouldEnable) {
				if (enabled) {
					updatePosition();
				} else {
					enableAutocopy();
				}
			} else {
				disableAutocopy();
			}
		})



	});

	const green = "rgb(19, 216, 13)";
	const red = "rgb(216, 13, 13)";

	var copyToClipboard = function (d) {
		var selectedText = window.getSelection().toString();

		if (selectedText != '') {
			chrome.runtime.sendMessage({ 'command': 'createNotification', text: selectedText }, response => {

			});

			document.execCommand('copy');
		}
	};

	function updatePosition() {
		var positionObject = getPositionObject();

		$('#autocopy-extension-status').css({ bottom: 'auto', top: '', right: '', left: '' });
		$('#autocopy-extension-status').css(positionObject);
	}

	function getPositionCss() {
		var positionCss = "";
		if (position.indexOf('top') != -1) positionCss += "top: 0;";
		if (position.indexOf('bottom') != - 1) positionCss += "bottom: 0;";
		if (position.indexOf('right') != -1) positionCss += "right: 0;";
		if (position.indexOf('left') != -1) positionCss += "left: 0;";

		return positionCss;
	}

	function getPositionObject() {
		var positionCss = {};
		if (position.indexOf('top') != -1) positionCss["top"] = 0;
		if (position.indexOf('bottom') != - 1) positionCss["bottom"] = 0;
		if (position.indexOf('right') != -1) positionCss["right"] = 0;
		if (position.indexOf('left') != -1) positionCss["left"] = 0;

		return positionCss;
	}

	function enableAutocopy() {
		if (enabled) return;

		chrome.runtime.sendMessage({ 'command': 'updateIcon', enabled: true }, () => null);

		var positionCss = getPositionCss();
		$('body').mouseup(copyToClipboard);

		$('#autocopy-extension-status').click(function () {
			chrome.runtime.sendMessage({ command: 'getHostname' }, function (response) {
				var domain = response;
				chrome.storage.sync.set({ ["enabledfor." + domain]: false });
			});

			disableAutocopy();
		});

		enabled = true;
	}

	function disableAutocopy() {
		if (!enabled) return;

		chrome.runtime.sendMessage({ 'command': 'updateIcon', enabled: false }, () => null);

		$('body').off("mouseup", copyToClipboard);

		enabled = false;
	}
})

//# sourceURL=file://Auto-copy/content.js