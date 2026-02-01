/**
 * 显化交易学院 - 网站验证脚本
 * 验证网站文件结构和基本内容
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 显化交易学院网站验证\n');
console.log('='.repeat(50));

// 验证文件存在
const requiredFiles = [
    'index.html',
    'css/styles.css',
    'js/main.js',
    'manifest.json',
    'robots.txt',
    'icons/icon.svg'
];

let allFilesExist = true;

console.log('\n📁 检查必要文件:\n');

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${file}`);
    
    if (!exists) {
        allFilesExist = false;
    }
});

// 检查HTML文件内容
console.log('\n📄 检查HTML文件内容:\n');

const htmlPath = path.join(__dirname, 'index.html');
if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // 检查关键元素
    const checks = [
        { name: 'DOCTYPE声明', test: htmlContent.includes('<!DOCTYPE html>') },
        { name: '字符集声明', test: htmlContent.includes('charset="UTF-8"') },
        { name: '视口设置', test: htmlContent.includes('viewport') },
        { name: '品牌名称', test: htmlContent.includes('显化') },
        { name: '导航链接', test: htmlContent.includes('nav-link') },
        { name: '首页横幅', test: htmlContent.includes('hero') },
        { name: '课程卡片', test: htmlContent.includes('course-card') },
        { name: '学员评价', test: htmlContent.includes('testimonial') },
        { name: '联系表单', test: htmlContent.includes('contact-form') },
        { name: '页脚', test: htmlContent.includes('footer') },
        { name: 'CSS链接', test: htmlContent.includes('css/styles.css') },
        { name: 'JS脚本', test: htmlContent.includes('js/main.js') },
        { name: 'Google Fonts', test: htmlContent.includes('fonts.googleapis.com') },
        { name: 'PWA Manifest', test: htmlContent.includes('manifest.json') }
    ];
    
    checks.forEach(check => {
        const status = check.test ? '✅' : '❌';
        console.log(`  ${status} ${check.name}`);
    });
}

// 检查CSS文件
console.log('\n🎨 检查CSS文件:\n');

const cssPath = path.join(__dirname, 'css/styles.css');
if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const cssChecks = [
        { name: 'CSS变量定义', test: cssContent.includes(':root') },
        { name: '响应式设计', test: cssContent.includes('@media') },
        { name: '动画效果', test: cssContent.includes('@keyframes') },
        { name: '导航栏样式', test: cssContent.includes('.navbar') },
        { name: '首页横幅样式', test: cssContent.includes('.hero') },
        { name: '课程卡片样式', test: cssContent.includes('.course-card') },
        { name: '学员评价样式', test: cssContent.includes('.testimonial') },
        { name: '联系表单样式', test: cssContent.includes('.contact-form') },
        { name: '页脚样式', test: cssContent.includes('.footer') }
    ];
    
    cssChecks.forEach(check => {
        const status = check.test ? '✅' : '❌';
        console.log(`  ${status} ${check.name}`);
    });
}

// 检查JS文件
console.log('\n⚡ 检查JavaScript文件:\n');

const jsPath = path.join(__dirname, 'js/main.js');
if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    
    const jsChecks = [
        { name: 'DOM加载事件', test: jsContent.includes('DOMContentLoaded') },
        { name: '导航功能', test: jsContent.includes('initNavigation') },
        { name: '滚动动画', test: jsContent.includes('initScrollAnimations') },
        { name: '数字计数动画', test: jsContent.includes('initCounterAnimation') },
        { name: '轮播功能', test: jsContent.includes('initTestimonialSlider') },
        { name: '表单处理', test: jsContent.includes('initContactForm') },
        { name: '平滑滚动', test: jsContent.includes('initSmoothScroll') },
        { name: '返回顶部', test: jsContent.includes('initBackToTop') },
        { name: '移动端菜单', test: jsContent.includes('initMobileMenu') }
    ];
    
    jsChecks.forEach(check => {
        const status = check.test ? '✅' : '❌';
        console.log(`  ${status} ${check.name}`);
    });
}

// 计算文件大小
console.log('\n📊 文件大小统计:\n');

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(2);
        console.log(`  📄 ${file}: ${size} KB`);
    }
});

// 总结
console.log('\n' + '='.repeat(50));
console.log('\n✨ 验证完成!\n');

if (allFilesExist) {
    console.log('✅ 所有必要文件都已创建');
    console.log('✅ 网站结构完整');
    console.log('✅ 准备就绪，可以部署\n');
} else {
    console.log('❌ 部分文件缺失，请检查上述错误\n');
}

console.log('='.repeat(50));
