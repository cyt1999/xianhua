/**
 * 显化交易学院 - Hero区域K线图动画
 * 实现从右向左无限滚动的动态K线图效果
 */

(function() {
    'use strict';

    // ========================
    // K线图动画初始化
    // ========================
    function initHeroChart() {
        const canvas = document.getElementById('hero-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let candles = [];
        let price = 100;
        let direction = Math.random() > 0.5 ? 1 : -1;
        let volatility = 3; // 增加波动幅度，让K线更明显

        // 设置Canvas尺寸
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 生成新的K线数据
        function createCandle() {
            const open = price;

            // 使用平滑的随机波动
            const change = (Math.random() - 0.5 + direction * 0.1) * volatility;
            const close = open + change;

            // 缓慢改变趋势方向
            if (Math.random() < 0.1) {
                direction *= -1;
            }

            // 确保价格不会偏离太远
            if (price > 120) direction = -1;
            if (price < 80) direction = 1;

            price = close;

            return {
                open: open,
                high: Math.max(open, close) + Math.random() * volatility * 0.3,
                low: Math.min(open, close) - Math.random() * volatility * 0.3,
                close: close,
                color: close >= open ? '#10b981' : '#ef4444'
            };
        }

        // 初始化K线数据
        function initCandles() {
            const candleWidth = 4;
            const numCandles = Math.ceil(canvas.width / candleWidth) + 10;

            price = 100 + (Math.random() - 0.5) * 10;

            for (let i = 0; i < numCandles; i++) {
                candles.push(createCandle());
            }
        }

        // 绘制K线
        function drawCandle(candle, x, width, height, minPrice, maxPrice) {
            const priceRangeForCandle = maxPrice - minPrice;
            const candleHeight = (candle.close - candle.open) / priceRangeForCandle * height;
            const openY = (maxPrice - candle.open) / priceRangeForCandle * height;
            const closeY = (maxPrice - candle.close) / priceRangeForCandle * height;
            const highY = (maxPrice - candle.high) / priceRangeForCandle * height;
            const lowY = (maxPrice - candle.low) / priceRangeForCandle * height;

            const candleWidthActual = width * 0.7;

            // 绘制影线
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.strokeStyle = candle.color;
            ctx.lineWidth = 1;
            ctx.stroke();

            // 绘制实体
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(candleHeight) || 1;

            ctx.fillStyle = candle.color;
            ctx.fillRect(
                x - candleWidthActual / 2,
                bodyTop,
                candleWidthActual,
                bodyHeight
            );
        }

        // 绘制网格线
        function drawGrid() {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;

            // 水平网格线（固定）
            for (let i = 1; i < 5; i++) {
                const y = (canvas.height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // 垂直网格线（随K线一起移动）
            const gridSpacing = 40;
            const offset = gridOffset % gridSpacing;
            for (let i = -1; i < Math.ceil(canvas.width / gridSpacing) + 1; i++) {
                const x = i * gridSpacing - offset;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
        }

        // 绘制价格线（均线）
        function drawMovingAverage(candles, period, color, width, scrollOffset, minPrice, priceRange) {
            if (candles.length < period || typeof minPrice === 'undefined' || priceRange <= 0) return;

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;

            for (let i = candles.length - period; i < candles.length; i++) {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    if (i - j >= 0) {
                        sum += candles[i - j].close;
                    }
                }
                const ma = sum / period;
                const x = canvas.width - scrollOffset - (candles.length - 1 - i) * width;
                // 统一坐标计算方式，与K线一致
                const y = (maxPrice - ma) / priceRange * canvas.height;

                if (i === candles.length - period) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        // 动画参数
        let scrollOffset = 0;
        let gridOffset = 0;
        const candleWidth = 4;
        let minPrice = 100, maxPrice = 100, priceRange = 1;
        let lastCandleTime = 0;
        let lastTimestamp = 0;
        const candleInterval = 100; // 每100ms生成一根新K线
        const scrollSpeed = 0.04; // 每毫秒移动0.04像素，减慢滚动速度

        // 主动画函数
        function animate(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;

            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 绘制背景渐变
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(10, 22, 40, 0.5)');
            gradient.addColorStop(1, 'rgba(5, 10, 20, 0.5)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 计算滚动增量（基于时间）
            scrollOffset += scrollSpeed * deltaTime;
            gridOffset += scrollSpeed * deltaTime;

            // 绘制网格
            drawGrid();

            // 计算价格范围
            if (candles.length > 0) {
                const prices = candles.flatMap(c => [c.high, c.low]);
                const priceMin = Math.min(...prices);
                const priceMax = Math.max(...prices);
                const padding = (priceMax - priceMin) * 0.1 || 1;
                minPrice = priceMin - padding;
                maxPrice = priceMax + padding;
                priceRange = maxPrice - minPrice || 1;
            } else {
                // 当candles数组为空时，使用默认值
                minPrice = 90;
                maxPrice = 110;
                priceRange = 20;
            }

            // 绘制K线
            candles.forEach((candle, index) => {
                const x = canvas.width - scrollOffset - (candles.length - 1 - index) * candleWidth;
                if (x > -candleWidth && x < canvas.width + candleWidth) {
                    drawCandle(candle, x, candleWidth, canvas.height, minPrice, maxPrice);
                }
            });

            // 绘制均线
            if (candles.length >= 5) {
                drawMovingAverage(candles, 5, 'rgba(201, 162, 39, 0.8)', candleWidth, scrollOffset, minPrice, priceRange);
            }
            if (candles.length >= 10) {
                drawMovingAverage(candles, 10, 'rgba(201, 162, 39, 0.5)', candleWidth, scrollOffset, minPrice, priceRange);
            }
            if (candles.length >= 20) {
                drawMovingAverage(candles, 20, 'rgba(201, 162, 39, 0.3)', candleWidth, scrollOffset, minPrice, priceRange);
            }

            // 当第一根K线完全移出屏幕时，移除它并添加新的
            if (scrollOffset >= candleWidth) {
                const overflow = scrollOffset % candleWidth;
                scrollOffset = overflow;
                gridOffset = overflow;
                candles.shift();

                // 添加新K线
                if (candles.length < Math.ceil(canvas.width / candleWidth) + 5) {
                    candles.push(createCandle());
                }
            }

            lastTimestamp = timestamp;
            animationId = requestAnimationFrame(animate);
        }

        // 启动动画
        initCandles();

        // 调试信息
        console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
        console.log('Initial candles:', candles.length);
        console.log('Sample candle:', candles[0]);

        animationId = requestAnimationFrame(animate);

        // 页面隐藏时暂停动画
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                lastTimestamp = 0; // 重置时间戳，避免时间跳跃
                animationId = requestAnimationFrame(animate);
            }
        });
    }

    // ========================
    // DOM加载完成后初始化
    // ========================
    document.addEventListener('DOMContentLoaded', function() {
        initHeroChart();
    });

})();
