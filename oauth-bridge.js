// GitHub OAuth Bridge for Subscribers Explorer
// Runs after the bundled React app renders
(function () {
  var CONFIG = {
    clientId: 'Ov23liPTjQi5F2bNMeiC',
    apiBase: 'https://subscribers-api-eta.vercel.app',
    redirectUri: 'https://seunghyeon1004.github.io/subscribers.html',
    xHandle: 'baegseungh7061'
  };

  // ── 1. OAuth Callback ──────────────────────────────────
  var params = new URLSearchParams(window.location.search);
  var code = params.get('code');
  if (code) {
    window.history.replaceState({}, '', window.location.pathname);
    fetch(CONFIG.apiBase + '/api/github-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.error) {
          sessionStorage.setItem('gh_auth_error', data.error);
          return;
        }
        if (data.is_collaborator) {
          sessionStorage.setItem('gh_token', data.access_token);
          sessionStorage.setItem('gh_user', JSON.stringify(data.user));
          sessionStorage.removeItem('gh_auth_error');
        } else {
          sessionStorage.setItem('gh_auth_error', 'no_access');
          sessionStorage.setItem('gh_user', JSON.stringify(data.user));
        }
      })
      .catch(function () {
        sessionStorage.setItem('gh_auth_error', 'network');
      });
  }

  // ── 2. Persistent watcher ──────────────────────────────
  // Keeps demo UI intact, only patches OAuth and file preview
  var _bridgeReady = false;

  setInterval(function () {
    if (!document.body) return;
    if (!document.querySelector('.item') && !document.querySelector('.icon-grid')) return;

    // One-time init
    if (!_bridgeReady) {
      _bridgeReady = true;
      initBridge();
    }

    // Re-apply if React overwrites
    if (_gridRealItems) {
      // Re-apply grid items
      var grids = document.querySelectorAll('.icon-grid');
      grids.forEach(function (g) {
        if (g.querySelector('.lock-badge') && !g.dataset.oauthGrid) {
          injectGridItems(_gridRealItems);
        }
      });
      // Re-apply sidebar category items
      var sidebar = document.querySelector('.sidebar');
      if (sidebar && !sidebar.dataset.oauthCat) {
        replaceSidebarCategoryItems(_gridRealItems);
      }
    }

    // Always patch login modal if it appears
    patchLoginModalIfPresent();
  }, 500);

  // ── 3. Main Bridge ────────────────────────────────────
  function initBridge() {
    var token = sessionStorage.getItem('gh_token');
    var user = sessionStorage.getItem('gh_user');

    // Show user badge if logged in
    if (token && user) showLoggedInBadge(JSON.parse(user));

    // Replace ONLY the icon-grid items (파일/폴더 카테고리) with real repo data
    replaceGridWithRealData('');

    // Intercept double-clicks on locked items for real GitHub data
    document.addEventListener('dblclick', function (e) {
      var item = e.target.closest('.item');
      if (!item) return;
      var lock = item.querySelector('.lock-badge');
      if (!lock) return;

      var tk = sessionStorage.getItem('gh_token');
      if (!tk) return; // Let app's login modal appear, it gets patched

      e.stopPropagation();
      e.preventDefault();
      var nameEl = item.querySelector('.item-name');
      if (!nameEl) return;
      var itemPath = item.dataset.path || nameEl.textContent.trim();

      if (item.dataset.type === 'dir') {
        fetchAndShowFolder(itemPath, tk);
      } else {
        fetchFileContent(itemPath, tk);
      }
    }, true);
  }

  // ── 3b. Replace grid items with real data ─────────────
  var _gridRealItems = null;

  function replaceGridWithRealData(dirPath) {
    var url = CONFIG.apiBase + '/api/subscribers-list';
    if (dirPath) url += '?path=' + encodeURIComponent(dirPath);

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.items && data.items.length > 0) {
          _gridRealItems = data.items;
          injectGridItems(data.items);
          replaceSidebarCategoryItems(data.items);
        }
      })
      .catch(function () { /* keep demo on error */ });
  }

  function injectGridItems(items) {
    // Find the icon-grid that has lock badges (구독자 전용 카테고리)
    var grids = document.querySelectorAll('.icon-grid');
    var targetGrid = null;
    grids.forEach(function (g) {
      if (g.querySelector('.lock-badge')) targetGrid = g;
    });
    if (!targetGrid && grids.length) targetGrid = grids[grids.length - 1];
    if (!targetGrid) return;

    // Mark as replaced
    targetGrid.dataset.oauthGrid = 'true';

    // Clear ONLY this grid's items
    while (targetGrid.firstChild) targetGrid.removeChild(targetGrid.firstChild);

    // Insert real items
    items.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'item';
      div.dataset.path = item.path;
      div.dataset.type = item.type;

      var iconWrap = document.createElement('div');
      iconWrap.className = 'item-icon';

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 48 48');

      if (item.type === 'dir') {
        var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('d', 'M4 8h16l4 4h20v28H4z');
        p1.setAttribute('fill', '#f9c74f');
        p1.setAttribute('stroke', '#e5a800');
        p1.setAttribute('stroke-width', '1.5');
        svg.appendChild(p1);
      } else {
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '8'); rect.setAttribute('y', '4');
        rect.setAttribute('width', '32'); rect.setAttribute('height', '40');
        rect.setAttribute('rx', '3');
        rect.setAttribute('fill', '#e8eaed'); rect.setAttribute('stroke', '#bbb');
        rect.setAttribute('stroke-width', '1.2');
        svg.appendChild(rect);
        ['M14 16h20', 'M14 22h20', 'M14 28h14'].forEach(function (d) {
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          line.setAttribute('d', d); line.setAttribute('stroke', '#888');
          line.setAttribute('stroke-width', '1.5'); line.setAttribute('stroke-linecap', 'round');
          svg.appendChild(line);
        });
      }
      iconWrap.appendChild(svg);

      // Lock badge
      var lock = document.createElement('div');
      lock.className = 'lock-badge';
      var lockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lockSvg.setAttribute('viewBox', '0 0 24 24'); lockSvg.setAttribute('fill', 'none');
      var lockR = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      lockR.setAttribute('x','5'); lockR.setAttribute('y','11');
      lockR.setAttribute('width','14'); lockR.setAttribute('height','10'); lockR.setAttribute('rx','2');
      lockR.setAttribute('stroke','currentColor'); lockR.setAttribute('stroke-width','2');
      lockSvg.appendChild(lockR);
      var lockP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      lockP.setAttribute('d','M8 11V7a4 4 0 018 0v4');
      lockP.setAttribute('stroke','currentColor'); lockP.setAttribute('stroke-width','2');
      lockSvg.appendChild(lockP);
      lock.appendChild(lockSvg);
      iconWrap.appendChild(lock);
      div.appendChild(iconWrap);

      var nameEl = document.createElement('div');
      nameEl.className = 'item-name';
      nameEl.textContent = item.name;
      div.appendChild(nameEl);

      if (item.size > 0 && item.type === 'file') {
        var sub = document.createElement('div');
        sub.className = 'item-sub';
        sub.textContent = formatSize(item.size);
        div.appendChild(sub);
      }

      targetGrid.appendChild(div);
    });
  }

  // ── 4. Login Modal Patch ──────────────────────────────
  function patchLoginModalIfPresent() {
    var card = document.querySelector('.login-card');
    if (!card || card.dataset.oauthPatched) return;
    card.dataset.oauthPatched = 'true';

    var authError = sessionStorage.getItem('gh_auth_error');
    if (authError) sessionStorage.removeItem('gh_auth_error');

    // Replace login body
    var body = card.querySelector('.login-body');
    if (body) {
      while (body.firstChild) body.removeChild(body.firstChild);

      var wrap = document.createElement('div');
      wrap.style.cssText = 'text-align:center;padding:16px 0';

      var icon = document.createElement('div');
      icon.style.cssText = 'margin-bottom:12px';
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '40');
      svg.setAttribute('height', '40');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'currentColor');
      svg.style.opacity = '0.8';
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z');
      svg.appendChild(path);
      icon.appendChild(svg);
      wrap.appendChild(icon);

      var title = document.createElement('p');
      title.style.cssText = 'margin:0 0 8px;font-size:14px;font-weight:600';
      title.textContent = 'GitHub 계정으로 로그인';
      wrap.appendChild(title);

      var desc = document.createElement('p');
      desc.style.cssText = 'margin:0;font-size:12px;color:var(--text-dim)';
      desc.textContent = 'Collaborator로 초대된 계정만 접근 가능합니다.';
      wrap.appendChild(desc);

      body.appendChild(wrap);

      // Auth error message
      if (authError) {
        var errDiv = document.createElement('div');
        errDiv.className = 'login-error';
        if (authError === 'no_access') {
          errDiv.textContent = '권한이 없습니다. X(@' + CONFIG.xHandle + ')에서 DM 주세요.';
        } else {
          errDiv.textContent = '인증에 실패했습니다. 다시 시도해주세요.';
        }
        body.appendChild(errDiv);
      }
    }

    // Replace primary button
    var primaryBtn = card.querySelector('.btn.primary');
    if (primaryBtn) {
      primaryBtn.textContent = 'GitHub으로 로그인';
      var newBtn = primaryBtn.cloneNode(true);
      primaryBtn.parentNode.replaceChild(newBtn, primaryBtn);
      newBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href =
          'https://github.com/login/oauth/authorize?client_id=' +
          CONFIG.clientId +
          '&redirect_uri=' + encodeURIComponent(CONFIG.redirectUri) +
          '&scope=repo';
      });
    }
  }

  // ── 5. Logged-in Badge ────────────────────────────────
  function showLoggedInBadge(user) {
    var badge = document.createElement('div');
    badge.style.cssText =
      'position:fixed;top:12px;right:12px;z-index:3000;display:flex;align-items:center;gap:8px;' +
      'background:rgba(0,0,0,0.6);backdrop-filter:blur(12px);padding:6px 12px 6px 6px;' +
      'border-radius:20px;color:white;font-size:12px;font-family:system-ui;cursor:pointer;';

    var img = document.createElement('img');
    img.src = user.avatar_url;
    img.style.cssText = 'width:24px;height:24px;border-radius:50%';
    badge.appendChild(img);

    var name = document.createElement('span');
    name.textContent = user.name || user.login;
    badge.appendChild(name);

    badge.title = '클릭하여 로그아웃';
    badge.addEventListener('click', function () {
      sessionStorage.removeItem('gh_token');
      sessionStorage.removeItem('gh_user');
      window.location.reload();
    });

    var waitBody = setInterval(function () {
      if (document.body) {
        clearInterval(waitBody);
        document.body.appendChild(badge);
      }
    }, 100);
  }

  // ── 5b. Sidebar Category Items ─────────────────────────
  function replaceSidebarCategoryItems(items) {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Find the section containing demo items (AI Trading ~ Misc)
    var sections = sidebar.querySelectorAll('.side-section');
    var catSection = null;

    sections.forEach(function (sec) {
      var sideItems = sec.querySelectorAll('.side-item');
      sideItems.forEach(function (si) {
        var txt = (si.textContent || '').toLowerCase();
        if (txt.indexOf('trading') >= 0 || txt.indexOf('misc') >= 0 ||
            txt.indexOf('signal') >= 0 || txt.indexOf('llm') >= 0 ||
            txt.indexOf('alpha') >= 0 || txt.indexOf('research') >= 0) {
          catSection = sec;
        }
      });
    });

    // Fallback: use last section if no demo items found
    if (!catSection && sections.length) catSection = sections[sections.length - 1];
    if (!catSection) return;

    // Mark as replaced
    sidebar.dataset.oauthCat = 'true';

    // Keep the section title (.side-title), remove only .side-item elements
    var existingItems = catSection.querySelectorAll('.side-item');
    existingItems.forEach(function (el) { el.remove(); });

    // Add real items (folders first)
    var sorted = items.slice().sort(function (a, b) {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.name.localeCompare(b.name);
    });

    sorted.forEach(function (item) {
      var sideItem = document.createElement('div');
      sideItem.className = 'side-item';

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '16');
      svg.setAttribute('height', '16');
      svg.setAttribute('fill', 'none');
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      if (item.type === 'dir') {
        p.setAttribute('d', 'M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z');
        p.setAttribute('fill', 'rgba(249,201,79,0.3)');
      } else {
        p.setAttribute('d', 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z');
        p.setAttribute('fill', 'rgba(200,200,210,0.3)');
      }
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', '1.5');
      svg.appendChild(p);
      sideItem.appendChild(svg);

      var span = document.createElement('span');
      span.textContent = item.name;
      sideItem.appendChild(span);

      sideItem.addEventListener('click', function () {
        var token = sessionStorage.getItem('gh_token');
        if (item.type === 'dir') {
          if (token) fetchAndShowFolder(item.path, token);
          else showOAuthModal();
        } else {
          if (token) fetchFileContent(item.path, token);
          else showOAuthModal();
        }
      });

      catSection.appendChild(sideItem);
    });
  }

  // ── 6. Folder Navigation (real GitHub data) ────────────
  function fetchAndShowFolder(folderName, token) {
    fetch(CONFIG.apiBase + '/api/subscribers-list?path=' + encodeURIComponent(folderName))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.items && data.items.length > 0) {
          showFolderContents(data.items, folderName, token);
        }
      })
      .catch(function () {
        // Try fetching as a file instead
        fetchFileContent(folderName, token);
      });
  }

  function showFolderContents(items, folderPath, token) {
    // Find the grid with lock badges
    var grids = document.querySelectorAll('.icon-grid');
    var targetGrid = null;
    grids.forEach(function (g) {
      if (g.querySelector('.lock-badge')) targetGrid = g;
    });
    if (!targetGrid && grids.length) targetGrid = grids[grids.length - 1];
    if (!targetGrid) return;

    // Clear and show real folder contents
    while (targetGrid.firstChild) targetGrid.removeChild(targetGrid.firstChild);

    // Create real items
    items.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'item';
      div.dataset.path = item.path;
      div.dataset.type = item.type;

      // Icon
      var iconWrap = document.createElement('div');
      iconWrap.className = 'item-icon';

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 48 48');
      svg.setAttribute('width', '48');
      svg.setAttribute('height', '48');

      if (item.type === 'dir') {
        var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('d', 'M4 8h16l4 4h20v28H4z');
        p1.setAttribute('fill', '#f9c74f');
        p1.setAttribute('stroke', '#e5a800');
        p1.setAttribute('stroke-width', '1.5');
        svg.appendChild(p1);
      } else {
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '8'); rect.setAttribute('y', '4');
        rect.setAttribute('width', '32'); rect.setAttribute('height', '40');
        rect.setAttribute('rx', '3');
        rect.setAttribute('fill', '#e8eaed'); rect.setAttribute('stroke', '#bbb');
        rect.setAttribute('stroke-width', '1.2');
        svg.appendChild(rect);
        ['M14 16h20', 'M14 22h20', 'M14 28h14'].forEach(function (d) {
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          line.setAttribute('d', d);
          line.setAttribute('stroke', '#888');
          line.setAttribute('stroke-width', '1.5');
          line.setAttribute('stroke-linecap', 'round');
          svg.appendChild(line);
        });
      }
      iconWrap.appendChild(svg);

      // Lock badge
      var lock = document.createElement('div');
      lock.className = 'lock-badge';
      var lockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lockSvg.setAttribute('viewBox', '0 0 24 24');
      lockSvg.setAttribute('fill', 'none');
      lockSvg.setAttribute('width', '10');
      lockSvg.setAttribute('height', '10');
      var lockR = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      lockR.setAttribute('x', '5'); lockR.setAttribute('y', '11');
      lockR.setAttribute('width', '14'); lockR.setAttribute('height', '10');
      lockR.setAttribute('rx', '2');
      lockR.setAttribute('stroke', 'currentColor'); lockR.setAttribute('stroke-width', '2');
      lockSvg.appendChild(lockR);
      var lockP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      lockP.setAttribute('d', 'M8 11V7a4 4 0 018 0v4');
      lockP.setAttribute('stroke', 'currentColor'); lockP.setAttribute('stroke-width', '2');
      lockSvg.appendChild(lockP);
      lock.appendChild(lockSvg);
      iconWrap.appendChild(lock);

      div.appendChild(iconWrap);

      // Name
      var nameEl = document.createElement('div');
      nameEl.className = 'item-name';
      nameEl.textContent = item.name;
      div.appendChild(nameEl);

      // Size
      if (item.size > 0 && item.type === 'file') {
        var sub = document.createElement('div');
        sub.className = 'item-sub';
        sub.textContent = formatSize(item.size);
        div.appendChild(sub);
      }

      // Double-click: navigate folder or open file
      div.addEventListener('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (item.type === 'dir') {
          fetchAndShowFolder(item.path, token);
        } else {
          fetchFileContent(item.path, token);
        }
      });

      targetGrid.appendChild(div);
    });

    // Update status bar item count
    var statusBar = document.querySelector('.status-bar');
    if (statusBar) {
      var first = statusBar.firstElementChild;
      if (first) first.textContent = items.length + '개 항목';
    }
  }

  // ── 7. File Content ────────────────────────────────────
  function fetchFileContent(filePath, token) {
    fetch('https://api.github.com/repos/seunghyeon1004/Subscribers/contents/' + filePath, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github.v3.raw'
      }
    })
      .then(function (r) {
        if (r.status === 403 || r.status === 404) {
          // Not a collaborator or file not found
          sessionStorage.removeItem('gh_token');
          sessionStorage.removeItem('gh_user');
          showAccessDeniedModal();
          throw new Error('access_denied');
        }
        if (!r.ok) throw new Error('fetch_failed');
        return r.text();
      })
      .then(function (content) {
        showFilePreview(filePath, content);
      })
      .catch(function (err) {
        if (err.message !== 'access_denied') {
          showAccessDeniedModal();
        }
      });
  }

  // ── 8. File Preview ───────────────────────────────────
  function showFilePreview(filePath, content) {
    // Remove any existing preview
    var old = document.querySelector('.preview-window[data-oauth]');
    if (old) old.remove();

    var filename = filePath.split('/').pop();
    var preview = document.createElement('div');
    preview.className = 'preview-window';
    preview.dataset.oauth = 'true';
    preview.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1500;width:820px;height:560px;';

    // Title bar
    var titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    var titleText = document.createElement('span');
    titleText.className = 'title-bar-text';
    titleText.textContent = filename + ' \u2014 Subscribers/' + filePath;
    titleBar.appendChild(titleText);

    var controls = document.createElement('div');
    controls.className = 'window-controls';
    var closeBtn = document.createElement('div');
    closeBtn.className = 'wctl close';
    closeBtn.addEventListener('click', function () { preview.remove(); });
    var closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeSvg.setAttribute('viewBox', '0 0 10 10');
    closeSvg.setAttribute('width', '10');
    closeSvg.setAttribute('height', '10');
    var closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    closePath.setAttribute('d', 'M1 1l8 8M9 1l-8 8');
    closePath.setAttribute('stroke', 'currentColor');
    closePath.setAttribute('stroke-width', '1.2');
    closeSvg.appendChild(closePath);
    closeBtn.appendChild(closeSvg);
    controls.appendChild(closeBtn);
    titleBar.appendChild(controls);
    preview.appendChild(titleBar);

    // Code body
    var codeBody = document.createElement('div');
    codeBody.className = 'code-body';

    var lines = content.split('\n');
    var gutter = document.createElement('div');
    gutter.className = 'code-gutter';
    gutter.textContent = lines.map(function (_, i) { return i + 1; }).join('\n');
    codeBody.appendChild(gutter);

    var codeContent = document.createElement('div');
    codeContent.className = 'code-content';
    codeContent.textContent = content;
    codeBody.appendChild(codeContent);

    preview.appendChild(codeBody);
    document.body.appendChild(preview);
  }

  // ── 9. Modals ──────────────────────────────────────────
  function showOAuthModal() {
    if (document.querySelector('.modal-backdrop')) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) backdrop.remove();
    });

    var card = document.createElement('div');
    card.className = 'login-card';
    card.dataset.oauthPatched = 'true';

    // Head
    var head = document.createElement('div');
    head.className = 'login-head';
    var logo = document.createElement('div');
    logo.className = 'login-logo';
    var ghSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ghSvg.setAttribute('width', '24');
    ghSvg.setAttribute('height', '24');
    ghSvg.setAttribute('viewBox', '0 0 24 24');
    ghSvg.setAttribute('fill', 'currentColor');
    var ghPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ghPath.setAttribute('d', 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z');
    ghSvg.appendChild(ghPath);
    logo.appendChild(ghSvg);
    head.appendChild(logo);

    var headText = document.createElement('div');
    var h3 = document.createElement('h3');
    h3.textContent = 'GitHub 로그인';
    headText.appendChild(h3);
    var p = document.createElement('p');
    p.textContent = '구독자 전용 콘텐츠 접근';
    headText.appendChild(p);
    head.appendChild(headText);
    card.appendChild(head);

    // Body
    var body = document.createElement('div');
    body.className = 'login-body';
    body.style.cssText = 'text-align:center;padding:20px 28px';
    var bodyP = document.createElement('p');
    bodyP.style.cssText = 'font-size:13px;color:var(--text-dim);margin:0';
    bodyP.textContent = 'Collaborator로 초대된 GitHub 계정만 접근 가능합니다.';
    body.appendChild(bodyP);
    card.appendChild(body);

    // Footer
    var foot = document.createElement('div');
    foot.className = 'login-foot';

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn';
    cancelBtn.textContent = '취소';
    cancelBtn.addEventListener('click', function () { backdrop.remove(); });
    foot.appendChild(cancelBtn);

    var loginBtn = document.createElement('button');
    loginBtn.className = 'btn primary';
    loginBtn.textContent = 'GitHub으로 로그인';
    loginBtn.addEventListener('click', function () {
      window.location.href =
        'https://github.com/login/oauth/authorize?client_id=' +
        CONFIG.clientId +
        '&redirect_uri=' + encodeURIComponent(CONFIG.redirectUri) +
        '&scope=repo';
    });
    foot.appendChild(loginBtn);

    card.appendChild(foot);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
  }

  function showAccessDeniedModal() {
    if (document.querySelector('.modal-backdrop')) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) backdrop.remove();
    });

    var card = document.createElement('div');
    card.className = 'login-card';

    var head = document.createElement('div');
    head.className = 'login-head';
    var h3 = document.createElement('h3');
    h3.textContent = '접근 권한 없음';
    head.appendChild(h3);
    card.appendChild(head);

    var body = document.createElement('div');
    body.className = 'login-body';
    body.style.padding = '20px 28px';
    var errDiv = document.createElement('div');
    errDiv.className = 'login-error';
    errDiv.textContent = '이 레포의 Collaborator가 아닙니다. X(@' + CONFIG.xHandle + ')에서 DM으로 문의해주세요.';
    body.appendChild(errDiv);
    card.appendChild(body);

    var foot = document.createElement('div');
    foot.className = 'login-foot';
    var okBtn = document.createElement('button');
    okBtn.className = 'btn primary';
    okBtn.textContent = '확인';
    okBtn.addEventListener('click', function () { backdrop.remove(); });
    foot.appendChild(okBtn);
    card.appendChild(foot);

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
  }

  // ── Helpers ───────────────────────────────────────────
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
})();
