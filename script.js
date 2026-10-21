console.log("مرحباً بك في موقع Jawad Artisan");

document.addEventListener("DOMContentLoaded", function () {
    
    // ===== 1. تشغيل الفيديو فالهاتف (حل الشاشة السوداء) =====
    const videoElement = document.getElementById("hero-video");
    
    if (videoElement) {
        // كنحاولو نشغلو الفيديو (بعض المتصفحات كتحتاج هاد السطر)
        let playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // الفيديو خدم مزيان
            }).catch(error => {
                console.log("المتصفح منع التشغيل التلقائي، خاص المستخدم يدوس على الفيديو:", error);
            });
        }
    }

    // ===== 2. منطق بطاقة المنتج =====
    // (هاد الكود كيخدم حيت البطاقة دخلناها فـ index.html)
    
    // دالة اختيار الحجم (خاصنا نعرفوها هنا حيت onclick فـ HTML كيقلب عليها)
    window.selectSize = function(size) {
        document.getElementById('selected-size-label').innerText = size;

        const buttons = document.querySelectorAll('.size-btn');
        buttons.forEach(btn => {
            if (btn.innerText === size) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    // دالة طلب الواتساب
    window.sendWhatsAppOrder = function() {
        const nameInput = document.getElementById('cust-name').value.trim() || 'غير محدد';
        const cityInput = document.getElementById('cust-city').value.trim() || 'غير محدد';
        const selectedSize = document.getElementById('selected-size-label').innerText;

        const productId = "#01";
        const productPrice = "200 DH";
        const whatsappNumber = '212771642822';

        const message = `*السلام عليكم،*\n*أريد طلب المنتج رقم: ${productId}*\n> الحجم المختار: ${selectedSize}\n> السعر: ${productPrice}.\n> الاسم: ${nameInput}\n> المدينة/العنوان: ${cityInput}\n*يرجى تأكيد الطلب.*`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    // دالة التفاصيل
    window.goToDetails = function() {
        window.location.href = 'index.html'; // تقدر تبدل هاد المسار بصفحة التفاصيل ديالك
    };

});
