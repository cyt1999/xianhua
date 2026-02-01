/**
 * 学员心声无缝滚动脚本
 * 实现卡片的无缝滚动效果，避免滚动中断
 */

(function() {
    'use strict';

    function initTestimonialsScroll() {
        const tracks = document.querySelectorAll('.testimonials-track');
        
        if (tracks.length === 0) {
            console.log('未找到 testimonials-track 元素');
            return;
        }
        
        tracks.forEach((track, index) => {
            const cards = track.querySelectorAll('.testimonial-card-horizontal');
            const cardWidth = 380; // 卡片宽度
            const gap = 24; // 卡片间距 (对应 CSS 中的 --space-6)
            const totalCards = cards.length;
            
            if (totalCards === 0) {
                console.log('未找到 testimonial-card-horizontal 元素');
                return;
            }
            
            // 复制卡片以实现无缝滚动
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                track.appendChild(clone);
            });
            
            // 设置轨道宽度
            const trackWidth = (cardWidth + gap) * totalCards * 2;
            track.style.width = trackWidth + 'px';
            
            let position = 0;
            const direction = index % 2 === 0 ? -1 : 1; // 交替方向
            const speed = 0.5; // 滚动速度
            
            function animate() {
                // 计算新位置
                position += direction * speed;
                
                // 重置位置以实现循环
                if (direction === -1 && position <= -trackWidth / 2) {
                    position = 0;
                } else if (direction === 1 && position >= 0) {
                    position = -trackWidth / 2;
                }
                
                // 应用位置
                track.style.transform = `translateX(${position}px)`;
                
                requestAnimationFrame(animate);
            }
            
            // 开始动画
            animate();
        });
    }

    // 确保DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTestimonialsScroll);
    } else {
        // DOM已经加载完成，直接初始化
        initTestimonialsScroll();
    }
})();