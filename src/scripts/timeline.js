// ===== Timeline section interactions =====
// 鼠标悬停某章节 → 该章节的照片层激活，照片沿对角线依次出现
const initTimeline = () => {
    const sections = document.querySelectorAll('.timeline-section');

    sections.forEach((section) => {
        const markers = section.querySelectorAll('.chapter-marker');
        const groups = section.querySelectorAll('.tl-photos');

        const showChapter = (id) => {
            groups.forEach((g) => {
                g.classList.toggle('active', g.dataset.ch === id);
            });
        };

        const hideAll = () => {
            groups.forEach((g) => g.classList.remove('active'));
        };

        markers.forEach((marker) => {
            const id = marker.dataset.ch;

            // 桌面：悬停即切换到该章节
            marker.addEventListener('mouseenter', () => showChapter(id));

            // 鼠标移开该章节 dot（含标签）即收起照片；
            // 直接移到另一个 dot 时，随后的 mouseenter 会立即显示新章节
            marker.addEventListener('mouseleave', () => hideAll());

            // 触屏 / 点击：切换该章节照片（再次点击收起）
            marker.addEventListener('click', () => {
                const group = section.querySelector(`.tl-photos[data-ch="${id}"]`);
                const wasActive = group && group.classList.contains('active');
                hideAll();
                if (!wasActive) showChapter(id);
            });
        });

        // 鼠标离开整个时间轴区域时收起照片
        section.addEventListener('mouseleave', hideAll);
    });
};

// Astro 会把 <script> 作为 module（defer）打包，执行时 DOM 通常已就绪，
// 这里同时兼容脚本提前执行的情况
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
} else {
    initTimeline();
}
