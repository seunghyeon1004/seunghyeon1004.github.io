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

  // ── 2. Wait for React app ──────────────────────────────
  var check = setInterval(function () {
    var root = document.getElementById('root');
    if (root && root.children.length > 0) {
      clearInterval(check);
      // Wait for .item elements (explorer rendered)
      waitForItems();
    }
  }, 200);

  function waitForItems() {
    var obs = new MutationObserver(function (_, me) {
      if (document.querySelector('.item') || document.querySelector('.icon-grid')) {
        me.disconnect();
        setTimeout(initBridge, 300);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    // Also check immediately
    if (document.querySelector('.item') || document.querySelector('.icon-grid')) {
      obs.disconnect();
      setTimeout(initBridge, 300);
    }
  }

  // ── 3. Main Bridge ────────────────────────────────────
  function initBridge() {
    var token = sessionStorage.getItem('gh_token');
    var user = sessionStorage.getItem('gh_user');

    // Show user badge if logged in
    if (token && user) showLoggedInBadge(JSON.parse(user));

    // Patch any existing LoginModal
    patchLoginModalIfPresent();

    // Watch for LoginModal appearing
    new MutationObserver(patchLoginModalIfPresent)
      .observe(document.body, { childList: true, subtree: true });

    // Fetch real directory listing and inject
    fetchAndInjectListing('');
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

  // ── 6. Real Directory Listing ─────────────────────────
  function fetchAndInjectListing(dirPath) {
    var url = CONFIG.apiBase + '/api/subscribers-list';
    if (dirPath) url += '?path=' + encodeURIComponent(dirPath);

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.items && data.items.length > 0) {
          injectRealItems(data.items, dirPath);
        }
      })
      .catch(function () { /* show demo data on error */ });
  }

  function injectRealItems(items, currentPath) {
    // Update sidebar with real folders
    updateSidebar(items, currentPath);

    // Find the grid with lock badges (구독자 전용 section)
    var grids = document.querySelectorAll('.icon-grid');
    var targetGrid = null;
    grids.forEach(function (g) {
      if (g.querySelector('.lock-badge')) targetGrid = g;
    });
    if (!targetGrid && grids.length) targetGrid = grids[grids.length - 1];
    if (!targetGrid) return;

    // Clear existing items
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

      // Double-click: auth check
      div.addEventListener('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var token = sessionStorage.getItem('gh_token');
        if (!token) {
          showOAuthModal();
          return;
        }

        if (item.type === 'dir') {
          fetchAndInjectListingAuth(item.path, token);
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

    // Update address bar
    updateAddressBar(currentPath);
  }

  // ── 7. Authenticated Navigation ───────────────────────
  function fetchAndInjectListingAuth(dirPath, token) {
    var url = CONFIG.apiBase + '/api/subscribers-list';
    if (dirPath) url += '?path=' + encodeURIComponent(dirPath);

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.items) injectRealItems(data.items, dirPath);
      });
  }

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

  // ── 8b. Sidebar Update ─────────────────────────────────
  function updateSidebar(items, currentPath) {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Clear ALL existing sections (즐겨찾기, 데모 등 전부 제거)
    while (sidebar.firstChild) sidebar.removeChild(sidebar.firstChild);

    // Create single section for Subscribers
    var targetSection = document.createElement('div');
    targetSection.className = 'side-section';
    sidebar.appendChild(targetSection);

    var sideTitle = document.createElement('div');
    sideTitle.className = 'side-title';
    sideTitle.textContent = 'Subscribers';
    targetSection.appendChild(sideTitle);

    // Add root item
    var rootItem = document.createElement('div');
    rootItem.className = 'side-item' + (!currentPath ? ' active' : '');
    var rootSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rootSvg.setAttribute('viewBox', '0 0 24 24');
    rootSvg.setAttribute('width', '16');
    rootSvg.setAttribute('height', '16');
    rootSvg.setAttribute('fill', 'none');
    var rootPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rootPath.setAttribute('d', 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z');
    rootPath.setAttribute('stroke', 'currentColor');
    rootPath.setAttribute('stroke-width', '2');
    rootSvg.appendChild(rootPath);
    rootItem.appendChild(rootSvg);
    var rootSpan = document.createElement('span');
    rootSpan.textContent = 'Root';
    rootItem.appendChild(rootSpan);
    rootItem.addEventListener('click', function () { fetchAndInjectListing(''); });
    targetSection.appendChild(rootItem);

    // Add all items (folders first, then files)
    var sorted = items.slice().sort(function (a, b) {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.name.localeCompare(b.name);
    });
    sorted.forEach(function (folder) {
      var sideItem = document.createElement('div');
      sideItem.className = 'side-item' + (currentPath === folder.path ? ' active' : '');

      var itemSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      itemSvg.setAttribute('viewBox', '0 0 24 24');
      itemSvg.setAttribute('width', '16');
      itemSvg.setAttribute('height', '16');
      itemSvg.setAttribute('fill', 'none');
      var itemPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      if (folder.type === 'dir') {
        itemPath.setAttribute('d', 'M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z');
        itemPath.setAttribute('stroke', 'currentColor');
        itemPath.setAttribute('stroke-width', '1.5');
        itemPath.setAttribute('fill', 'rgba(249,201,79,0.3)');
      } else {
        itemPath.setAttribute('d', 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z');
        itemPath.setAttribute('stroke', 'currentColor');
        itemPath.setAttribute('stroke-width', '1.5');
        itemPath.setAttribute('fill', 'rgba(200,200,210,0.3)');
      }
      itemSvg.appendChild(itemPath);
      sideItem.appendChild(itemSvg);

      var span = document.createElement('span');
      span.textContent = folder.name;
      sideItem.appendChild(span);

      sideItem.addEventListener('click', function () {
        var token = sessionStorage.getItem('gh_token');
        if (folder.type === 'dir') {
          if (token) {
            fetchAndInjectListingAuth(folder.path, token);
          } else {
            showOAuthModal();
          }
        } else {
          if (token) {
            fetchFileContent(folder.path, token);
          } else {
            showOAuthModal();
          }
        }
      });

      targetSection.appendChild(sideItem);
    });
  }

  // ── 9. Address Bar ────────────────────────────────────
  function updateAddressBar(currentPath) {
    var addrBar = document.querySelector('.addr-bar');
    if (!addrBar) return;

    while (addrBar.firstChild) addrBar.removeChild(addrBar.firstChild);

    var rootCrumb = document.createElement('span');
    rootCrumb.className = 'addr-crumb';
    rootCrumb.textContent = 'Subscribers';
    rootCrumb.addEventListener('click', function () { fetchAndInjectListing(''); });
    addrBar.appendChild(rootCrumb);

    if (currentPath) {
      var parts = currentPath.split('/');
      var cumPath = '';
      parts.forEach(function (part) {
        cumPath += (cumPath ? '/' : '') + part;

        var sep = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        sep.setAttribute('width', '14');
        sep.setAttribute('height', '14');
        sep.setAttribute('viewBox', '0 0 24 24');
        sep.style.opacity = '0.4';
        var sepPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sepPath.setAttribute('d', 'M9 18l6-6-6-6');
        sepPath.setAttribute('stroke', 'currentColor');
        sepPath.setAttribute('stroke-width', '2');
        sepPath.setAttribute('fill', 'none');
        sep.appendChild(sepPath);
        addrBar.appendChild(sep);

        var crumb = document.createElement('span');
        crumb.className = 'addr-crumb';
        crumb.textContent = part;
        var p = cumPath;
        crumb.addEventListener('click', function () {
          var token = sessionStorage.getItem('gh_token');
          if (token) fetchAndInjectListingAuth(p, token);
          else fetchAndInjectListing(p);
        });
        addrBar.appendChild(crumb);
      });
    }
  }

  // ── 10. Modals ────────────────────────────────────────
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
