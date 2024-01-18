function save_options() {
    var log_url = document.getElementById('log-url').value;
    browser.storage.sync.set({
        log_url: log_url.length > 0 ? log_url : ''
    }).then(() => {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
            window.close();
        }, 750);
    });
}

function restore_options() {
    browser.storage.sync.get({
        log_url: ''
    }).then((items) => {
        document.getElementById('log-url').value = items.log_url;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    restore_options();
    document.getElementById('save').addEventListener('click', save_options);
});
