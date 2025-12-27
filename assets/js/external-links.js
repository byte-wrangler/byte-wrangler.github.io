/**
 * 自动为所有外部链接添加 target="_blank" 和 rel="noopener noreferrer"
 * 让外部链接在新标签页打开
 */
(function() {
  'use strict';

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addTargetBlank);
  } else {
    addTargetBlank();
  }

  function addTargetBlank() {
    // 获取当前站点的域名
    const currentDomain = window.location.hostname;
    
    // 获取所有链接
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(function(link) {
      const href = link.getAttribute('href');
      
      // 跳过以下情况：
      // 1. 锚点链接（以 # 开头）
      // 2. 邮件链接（以 mailto: 开头）
      // 3. 电话链接（以 tel: 开头）
      // 4. JavaScript 链接（以 javascript: 开头）
      if (!href || 
          href.startsWith('#') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') || 
          href.startsWith('javascript:')) {
        return;
      }
      
      // 判断是否为外部链接
      let isExternal = false;
      
      try {
        // 相对路径视为内部链接
        if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
          isExternal = false;
        }
        // 以 http:// 或 https:// 开头的链接
        else if (href.startsWith('http://') || href.startsWith('https://')) {
          const linkUrl = new URL(href);
          // 判断域名是否不同
          isExternal = linkUrl.hostname !== currentDomain;
        }
      } catch (e) {
        // URL 解析失败，保守处理为外部链接
        isExternal = true;
      }
      
      // 如果是外部链接，添加 target="_blank" 和安全属性
      if (isExternal) {
        link.setAttribute('target', '_blank');
        // 添加安全属性，防止新页面访问原页面的 window 对象
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
})();
