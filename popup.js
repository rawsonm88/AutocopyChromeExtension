var enabledForSite = true;

$(function () {
    $('#position').change(function () {
        chrome.storage.sync.set({ position: $('#position').val() })
    })

    $('#site-enabled').change(function () {
        chrome.tabs.getSelected(null, function (tab) {
            var url = new URL(tab.url)
            var domain = url.hostname

            chrome.storage.sync.set({ ["enabledfor." + domain]: $('#site-enabled').prop('checked') });
        })
    })

    $('#enabled').change(function () {
        chrome.storage.sync.set({ enabled: $('#enabled').prop('checked') });
    })

    chrome.storage.sync.get("position", function (value) {
        if (value != null) {
            $('#position').val(value.position);
        } else {
            chrome.storage.sync.set({ position: 'top-right' })
        }
    });

    chrome.tabs.getSelected(null, function (tab) {
        var url = new URL(tab.url)
        var domain = url.hostname
        chrome.storage.sync.get("enabledfor." + domain, function (value) {
            console.log(value, value["enabledfor." + domain]);
            if (value != null && value["enabledfor." + domain] != null) {
                $('#site-enabled').prop('checked', value["enabledfor." + domain]);
            }
        });
    })

    chrome.storage.sync.get("enabled", function(value){
        if(value.enabled != null){
            $('#enabled').prop('checked', value.enabled);
        }
    })

    chrome.storage.sync.get("position", function (value) {
        if (value.position != null) {
            $('#position').val(value.position);
        } else {
            chrome.storage.sync.set({ position: 'top-right' })
        }
    });
})