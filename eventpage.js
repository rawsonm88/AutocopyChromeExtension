console.log("started")

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var tabId = sender.tab.id;

    if (message.command && message.command == 'getHostname') {
        chrome.tabs.get(tabId, (tab) => {
            var url = new URL(tab.url)
            var domain = url.hostname;

            sendResponse(domain);
        })

        return true;

    }else if(message.command && message.command == 'createNotification'){
        chrome.notifications.create("autoCopied", {
            type: 'basic',
            title: chrome.i18n.getMessage('copiedToClipboard'),
            message: message.text,
            iconUrl: chrome.extension.getURL('copy.png')
		})
    }else if(message.command && message.command == 'updateIcon'){
        var iconPath;

        if(message.enabled) iconPath = chrome.extension.getURL('copy-enabled_38.png');
        if(!message.enabled) iconPath = chrome.extension.getURL('copy_38.png');
        
        chrome.browserAction.setIcon({
            path: iconPath,
            tabId: tabId
        }, () => null);
    }
})