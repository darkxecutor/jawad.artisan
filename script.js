console.log("مرحباً بك في موقع Jawad Artisan");

// محاولة تشغيل الفيديو فالهاتف باش ما يبقاش الشاشة السوداء
document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("hero-video");
    if (video) {
        // بعض المتصفحات كتحتاج هاد السطر باش تشغل الفيديو أوتوماتيكياً
        video.play().catch(function(error) {
            console.log("المتصفح منع التشغيل التلقائي، خاص المستخدم يدوس على الفيديو:", error);
        });
    }
});
