/**
 * 显化资本 - 品牌网站交互脚本
 * 实现导航栏、滚动动画、数字计数、轮播、表单等功能
 */

(function() {
    'use strict';

    // ========================
    // DOM 加载完成后初始化
    // ========================
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollAnimations();
        initCounterAnimation();
        initTestimonialSlider();
        initContactForm();
        initSmoothScroll();
        initBackToTop();
        initMobileMenu();
        initFAQ();
    });

    // ========================
    // 导航栏功能
    // ========================
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // 滚动时改变导航栏样式
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // 点击导航链接时更新活动状态
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.forEach(function(l) {
                    l.classList.remove('active');
                });
                link.classList.add('active');
            });
        });

        // 滚动时更新活动导航链接
        updateActiveNavLink();
        window.addEventListener('scroll', updateActiveNavLink);
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========================
    // 滚动动画
    // ========================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.slide-up, .slide-in-left, .slide-in-right, .fade-in'
        );

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(function(el) {
                el.style.animationPlayState = 'paused';
                observer.observe(el);
            });
        }
    }

    // ========================
    // 数字计数动画
    // ========================
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(function(counter) {
                observer.observe(counter);
            });
        } else {
            // 回退方案
            counters.forEach(function(counter) {
                animateCounter(counter);
            });
        }
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = formatNumber(target);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // ========================
    // 学员感言轮播
    // ========================
    function initTestimonialSlider() {
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.nav-dot');
        let currentIndex = 0;
        let autoplayInterval;

        if (cards.length === 0 || dots.length === 0) return;

        function showSlide(index) {
            cards.forEach(function(card) {
                card.classList.remove('active');
            });
            dots.forEach(function(dot) {
                dot.classList.remove('active');
            });

            cards[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % cards.length;
            showSlide(nextIndex);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                stopAutoplay();
                showSlide(index);
                startAutoplay();
            });
        });

        // 触摸支持
        let touchStartX = 0;
        let touchEndX = 0;

        cards.forEach(function(card) {
            card.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoplay();
            }, { passive: true });

            card.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoplay();
            }, { passive: true });
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
                showSlide(prevIndex);
            }
        }

        startAutoplay();
    }

    // ========================
    // 联系表单处理
    // ========================
    function initContactForm() {
        const form = document.getElementById('contact-form');

        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // 表单验证
            if (!validateForm(form)) {
                return;
            }

            // 显示加载状态
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            // 模拟表单提交
            setTimeout(function() {
                showFormSuccess(form);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 1500);
        });

        // 输入框焦点效果
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }

    function validateForm(form) {
        const name = form.querySelector('#name');
        const phone = form.querySelector('#phone');
        const interest = form.querySelector('#interest');

        // 姓名验证
        if (!name.value.trim()) {
            showFieldError(name, '请输入您的姓名');
            return false;
        }

        // 手机号验证
        if (!phone.value.trim()) {
            showFieldError(phone, '请输入您的手机号码');
            return false;
        }
        if (!/^1[3-9]\d{9}$/.test(phone.value.trim())) {
            showFieldError(phone, '请输入正确的手机号码');
            return false;
        }

        // 课程选择验证
        if (!interest.value) {
            showFieldError(interest, '请选择感兴趣的课程');
            return false;
        }

        return true;
    }

    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');

        // 移除之前的错误提示
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // 添加新的错误提示
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: var(--color-error); font-size: 0.875rem; margin-top: 0.25rem;';
        formGroup.appendChild(errorEl);

        // 3秒后移除错误提示
        setTimeout(function() {
            errorEl.remove();
            formGroup.classList.remove('error');
        }, 3000);

        field.focus();
    }

    function showFormSuccess(form) {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; margin-right: 8px;"><circle cx="12" cy="12" r="10"/><polyline points="16 8 10 14 8 12"/></svg> 提交成功！我们会尽快与您联系。';
        successMessage.style.cssText = 'display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--color-success); border-radius: 0.5rem; color: var(--color-success); margin-bottom: 1rem;';
        form.prepend(successMessage);

        setTimeout(function() {
            successMessage.remove();
        }, 5000);
    }

    // ========================
    // 平滑滚动
    // ========================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // 关闭移动端菜单
                    const navMenu = document.getElementById('nav-menu');
                    const navToggle = document.getElementById('nav-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            });
        });
    }

    // ========================
    // 返回顶部按钮
    // ========================
    function initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');

        if (!backToTopBtn) return;

        // 滚动显示/隐藏按钮
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // 点击返回顶部
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================
    // 移动端菜单
    // ========================
    function initMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // 点击菜单外部关闭
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // ESC键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================
    // Q&A问答模块
    // ========================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        if (faqItems.length === 0) return;

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;

            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // 关闭所有其他展开的项
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });

                // 切换当前项的状态
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    // 设置max-height为scrollHeight以实现平滑动画
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // ========================
    // 工具函数
    // ========================

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

})();
