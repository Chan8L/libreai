     1	// ========================================
     2	// LibreAI メインJavaScript (script.js)
     3	// ========================================
     4	
     5	// グローバル変数
     6	let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
     7	let cart = JSON.parse(localStorage.getItem('cart')) || [];
     8	
     9	// ページロード時の初期化
    10	document.addEventListener('DOMContentLoaded', function() {
    11	    // カートバッジ更新
    12	    updateCartBadge();
    13	
    14	    // お気に入りボタンの状態を復元
    15	    restoreFavorites();
    16	
    17	    // スムーズスクロール
    18	    initSmoothScroll();
    19	
    20	    // モバイルメニュー
    21	    initMobileMenu();
    22	
    23	    // 検索機能
    24	    initSearch();
    25	});
    26	
    27	// カートに追加
    28	function addToCart(productId) {
    29	    // カートに既にあるかチェック
    30	    if (cart.find(item => item.id === productId)) {
    31	        showNotification('すでにカートに追加されています', 'info');
    32	        return;
    33	    }
    34	
    35	    // カートに追加
    36	    cart.push({
    37	        id: productId,
    38	        addedAt: Date.now()
    39	    });
    40	
    41	    // ローカルストレージに保存
    42	    localStorage.setItem('cart', JSON.stringify(cart));
    43	
    44	    // UI更新
    45	    updateCartBadge();
    46	    showNotification('カートに追加しました', 'success');
    47	}
    48	
    49	// カートバッジ更新
    50	function updateCartBadge() {
    51	    const badge = document.querySelector('.nav-icon .badge');
    52	    if (badge) {
    53	        const count = cart.length;
    54	        badge.textContent = count;
    55	        badge.style.display = count > 0 ? 'inline-block' : 'none';
    56	    }
    57	}
    58	
    59	// お気に入りトグル
    60	function toggleFavorite(productId, button) {
    61	    const index = favorites.indexOf(productId);
    62	
    63	    if (index > -1) {
    64	        // お気に入りから削除
    65	        favorites.splice(index, 1);
    66	        button.querySelector('i').classList.remove('fas');
    67	        button.querySelector('i').classList.add('far');
    68	        showNotification('お気に入りから削除しました', 'info');
    69	    } else {
    70	        // お気に入りに追加
    71	        favorites.push(productId);
    72	        button.querySelector('i').classList.remove('far');
    73	        button.querySelector('i').classList.add('fas');
    74	        showNotification('お気に入りに追加しました', 'success');
    75	    }
    76	
    77	    // ローカルストレージに保存
    78	    localStorage.setItem('favorites', JSON.stringify(favorites));
    79	}
    80	
    81	// お気に入り状態の復元
    82	function restoreFavorites() {
    83	    const favoriteButtons = document.querySelectorAll('.product-favorite');
    84	
    85	    favoriteButtons.forEach((button, index) => {
    86	        const productId = index + 1; // 仮のID
    87	        
    88	        // イベントリスナー追加
    89	        button.addEventListener('click', function(e) {
    90	            e.preventDefault();
    91	            toggleFavorite(productId, button);
    92	        });
    93	
    94	        // 状態復元
    95	        if (favorites.includes(productId)) {
    96	            button.querySelector('i').classList.remove('far');
    97	            button.querySelector('i').classList.add('fas');
    98	        }
    99	    });
   100	}
   101	
   102	// 通知表示
   103	function showNotification(message, type = 'success') {
   104	    // 既存の通知を削除
   105	    const existing = document.querySelector('.notification');
   106	    if (existing) {
   107	        existing.remove();
   108	    }
   109	
   110	    // 色設定
   111	    let bgColor;
   112	    switch(type) {
   113	        case 'success':
   114	            bgColor = 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)';
   115	            break;
   116	        case 'error':
   117	            bgColor = 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)';
   118	            break;
   119	        case 'info':
   120	            bgColor = 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)';
   121	            break;
   122	        default:
   123	            bgColor = 'linear-gradient(135deg, #6C63FF 0%, #4FACFE 100%)';
   124	    }
   125	
   126	    // アイコン設定
   127	    let icon;
   128	    switch(type) {
   129	        case 'success':
   130	            icon = 'fa-check-circle';
   131	            break;
   132	        case 'error':
   133	            icon = 'fa-times-circle';
   134	            break;
   135	        case 'info':
   136	            icon = 'fa-info-circle';
   137	            break;
   138	        default:
   139	            icon = 'fa-bell';
   140	    }
   141	
   142	    // 通知要素作成
   143	    const notification = document.createElement('div');
   144	    notification.className = 'notification';
   145	    notification.style.cssText = `
   146	        position: fixed;
   147	        top: 100px;
   148	        right: 20px;
   149	        background: ${bgColor};
   150	        color: white;
   151	        padding: 16px 24px;
   152	        border-radius: 12px;
   153	        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
   154	        z-index: 10000;
   155	        display: flex;
   156	        align-items: center;
   157	        gap: 12px;
   158	        font-weight: 600;
   159	        animation: slideInRight 0.4s ease-out;
   160	        max-width: 400px;
   161	    `;
   162	    notification.innerHTML = `
   163	        <i class="fas ${icon}" style="font-size: 20px;"></i>
   164	        <span>${message}</span>
   165	    `;
   166	
   167	    document.body.appendChild(notification);
   168	
   169	    // 3秒後に削除
   170	    setTimeout(() => {
   171	        notification.style.animation = 'slideOutRight 0.4s ease-out';
   172	        setTimeout(() => notification.remove(), 400);
   173	    }, 3000);
   174	}
   175	
   176	// スムーズスクロール初期化
   177	function initSmoothScroll() {
   178	    const links = document.querySelectorAll('a[href^="#"]');
   179	
   180	    links.forEach(link => {
   181	        link.addEventListener('click', function(e) {
   182	            const href = this.getAttribute('href');
   183	            
   184	            // 空のハッシュやJavaScriptハッシュは除外
   185	            if (href === '#' || href === '#!') return;
   186	
   187	            const target = document.querySelector(href);
   188	            
   189	            if (target) {
   190	                e.preventDefault();
   191	                target.scrollIntoView({
   192	                    behavior: 'smooth',
   193	                    block: 'start'
   194	                });
   195	            }
   196	        });
   197	    });
   198	}
   199	
   200	// モバイルメニュー初期化
   201	function initMobileMenu() {
   202	    const menuBtn = document.querySelector('.mobile-menu-btn');
   203	    
   204	    if (menuBtn) {
   205	        menuBtn.addEventListener('click', function() {
   206	            // モバイルメニューの実装（必要に応じて）
   207	            alert('モバイルメニュー機能は開発中です');
   208	        });
   209	    }
   210	}
   211	
   212	// 検索機能初期化
   213	function initSearch() {
   214	    const searchInput = document.querySelector('.search-bar input');
   215	
   216	    if (searchInput) {
   217	        searchInput.addEventListener('keypress', function(e) {
   218	            if (e.key === 'Enter') {
   219	                const query = this.value.trim();
   220	                if (query) {
   221	                    // 検索ページに遷移
   222	                    window.location.href = `marketplace.html?search=${encodeURIComponent(query)}`;
   223	                }
   224	            }
   225	        });
   226	    }
   227	}
   228	
   229	// ページトップへスクロール
   230	function scrollToTop() {
   231	    window.scrollTo({
   232	        top: 0,
   233	        behavior: 'smooth'
   234	    });
   235	}
   236	
   237	// アニメーションCSS（動的に追加）
   238	const style = document.createElement('style');
   239	style.textContent = `
   240	    @keyframes slideInRight {
   241	        from {
   242	            transform: translateX(400px);
   243	            opacity: 0;
   244	        }
   245	        to {
   246	            transform: translateX(0);
   247	            opacity: 1;
   248	        }
   249	    }
   250	
   251	    @keyframes slideOutRight {
   252	        from {
   253	            transform: translateX(0);
   254	            opacity: 1;
   255	        }
   256	        to {
   257	            transform: translateX(400px);
   258	            opacity: 0;
   259	        }
   260	    }
   261	
   262	    /* スクロールバーのスタイリング */
   263	    ::-webkit-scrollbar {
   264	        width: 10px;
   265	    }
   266	
   267	    ::-webkit-scrollbar-track {
   268	        background: #f1f1f1;
   269	    }
   270	
   271	    ::-webkit-scrollbar-thumb {
   272	        background: linear-gradient(135deg, #6C63FF 0%, #4FACFE 100%);
   273	        border-radius: 5px;
   274	    }
   275	
   276	    ::-webkit-scrollbar-thumb:hover {
   277	        background: linear-gradient(135deg, #5753d6 0%, #3d8ade 100%);
   278	    }
   279	
   280	    /* ローディングアニメーション */
   281	    @keyframes spin {
   282	        to {
   283	            transform: rotate(360deg);
   284	        }
   285	    }
   286	
   287	    .loading {
   288	        animation: spin 1s linear infinite;
   289	    }
   290	
   291	    /* フェードイン */
   292	    @keyframes fadeIn {
   293	        from {
   294	            opacity: 0;
   295	        }
   296	        to {
   297	            opacity: 1;
   298	        }
   299	    }
   300	
   301	    .fade-in {
   302	        animation: fadeIn 0.6s ease-out;
   303	    }
   304	`;
   305	document.head.appendChild(style);
   306	
   307	// ユーティリティ関数
   308	const utils = {
   309	    // 価格フォーマット
   310	    formatPrice: (price) => {
   311	        return `¥${price.toLocaleString()}`;
   312	    },
   313	
   314	    // 日付フォーマット
   315	    formatDate: (date) => {
   316	        const d = new Date(date);
   317	        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
   318	    },
   319	
   320	    // URLパラメータ取得
   321	    getUrlParam: (param) => {
   322	        const urlParams = new URLSearchParams(window.location.search);
   323	        return urlParams.get(param);
   324	    },
   325	
   326	    // デバウンス関数
   327	    debounce: (func, wait) => {
   328	        let timeout;
   329	        return function executedFunction(...args) {
   330	            const later = () => {
   331	                clearTimeout(timeout);
   332	                func(...args);
   333	            };
   334	            clearTimeout(timeout);
   335	            timeout = setTimeout(later, wait);
   336	        };
   337	    },
   338	
   339	    // スロットル関数
   340	    throttle: (func, limit) => {
   341	        let inThrottle;
   342	        return function() {
   343	            const args = arguments;
   344	            const context = this;
   345	            if (!inThrottle) {
   346	                func.apply(context, args);
   347	                inThrottle = true;
   348	                setTimeout(() => inThrottle = false, limit);
   349	            }
   350	        };
   351	    }
   352	};
   353	
   354	// グローバルに公開
   355	window.LibreAI = {
   356	    addToCart,
   357	    toggleFavorite,
   358	    showNotification,
   359	    scrollToTop,
   360	    utils
   361	};
   362	
   363	// インタースェクションオブザーバーで要素のフェードイン
   364	if ('IntersectionObserver' in window) {
   365	    const observerOptions = {
   366	        threshold: 0.1,
   367	        rootMargin: '0px 0px -50px 0px'
   368	    };
   369	
   370	    const observer = new IntersectionObserver((entries) => {
   371	        entries.forEach(entry => {
   372	            if (entry.isIntersecting) {
   373	                entry.target.classList.add('fade-in');
   374	                observer.unobserve(entry.target);
   375	            }
   376	        });
   377	    }, observerOptions);
   378	
   379	    // フェードインさせたい要素を監視
   380	    document.addEventListener('DOMContentLoaded', () => {
   381	        const fadeElements = document.querySelectorAll('.product-card, .category-card, .community-card, .article-card');
   382	        fadeElements.forEach(el => {
   383	            observer.observe(el);
   384	        });
   385	    });
   386	}
   387	
   388	// パフォーマンス最適化: 画像の遅延読み込み
   389	if ('loading' in HTMLImageElement.prototype) {
   390	    // ブラウザがネイティブの遅延読み込みをサポートしている場合
   391	    const images = document.querySelectorAll('img[data-src]');
   392	    images.forEach(img => {
   393	        img.src = img.dataset.src;
   394	    });
   395	} else {
   396	    // ポリフィルまたは代替実装
   397	    console.log('Lazy loading not supported');
   398	}
   399	
   400	// エラーハンドリング
   401	window.addEventListener('error', function(e) {
   402	    console.error('エラーが発生しました:', e.error);
   403	    // 本番環境では、エラーログをサーバーに送信
   404	});
   405	
   406	// オフライン検知
   407	window.addEventListener('offline', function() {
   408	    showNotification('インターネット接続が切断されました', 'error');
   409	});
   410	
   411	window.addEventListener('online', function() {
   412	    showNotification('インターネット接続が回復しました', 'success');
   413	});
   414	
   415	console.log('🚀 LibreAI loaded successfully!');
