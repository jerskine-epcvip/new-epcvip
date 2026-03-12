/* ============================================================
   EPCVIP Signup Modal — signup-modal.js
   Self-contained: injects CSS + HTML, exposes openSignupModal()
   ============================================================ */

(function () {

  /* ── CSS ─────────────────────────────────────────────────── */
  const css = `
    /* Overlay */
    .sm-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.82);
      backdrop-filter: blur(14px);
      z-index: 600;
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
      opacity: 0; pointer-events: none;
      transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1);
    }
    .sm-overlay.open { opacity: 1; pointer-events: all; }

    /* Modal shell */
    .sm-modal {
      background: #141414;
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 24px;
      width: 100%;
      max-width: 560px;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      position: relative;
      box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05) inset;
      transform: translateY(24px) scale(0.97);
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
      overflow: hidden;
    }
    .sm-overlay.open .sm-modal { transform: translateY(0) scale(1); }

    /* Yellow top bar */
    .sm-modal::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      border-radius: 24px 24px 0 0;
      background: linear-gradient(90deg, transparent, rgba(245,197,24,0.8), transparent);
      z-index: 1;
    }

    /* Header (fixed) */
    .sm-header {
      flex-shrink: 0;
      padding: 1.75rem 1.75rem 0;
      position: relative;
    }
    .sm-close {
      position: absolute; top: 1.25rem; right: 1.25rem;
      width: 32px; height: 32px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 50%;
      color: #4a4a4a; font-size: 1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; line-height: 1;
      font-family: inherit;
      z-index: 10;
    }
    .sm-close:hover { background: rgba(255,255,255,0.1); color: #f0f0f0; }

    /* Logo */
    .sm-logo { display: flex; justify-content: center; margin-bottom: 1.25rem; }
    .sm-logo img { height: 26px; }

    /* Progress bar */
    .sm-progress-track {
      height: 2px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 1.25rem;
    }
    .sm-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #C9A012, #F5C518, #FFE066);
      border-radius: 2px;
      transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
      width: 0%;
    }

    /* Step dots */
    .sm-dots {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      margin-bottom: 1.5rem;
    }
    .sm-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      transition: all 0.3s;
    }
    .sm-dot.active { background: #F5C518; width: 20px; border-radius: 3px; }
    .sm-dot.done   { background: rgba(245,197,24,0.4); }

    /* Scrollable body */
    .sm-body {
      flex: 1;
      overflow-y: auto;
      padding: 0 1.75rem 1.75rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(245,197,24,0.2) transparent;
    }
    .sm-body::-webkit-scrollbar { width: 4px; }
    .sm-body::-webkit-scrollbar-track { background: transparent; }
    .sm-body::-webkit-scrollbar-thumb { background: rgba(245,197,24,0.2); border-radius: 2px; }

    /* Footer (fixed) */
    .sm-footer {
      flex-shrink: 0;
      padding: 1rem 1.75rem 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .sm-btn-back {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 18px; border-radius: 999px;
      background: transparent; border: 1px solid rgba(255,255,255,0.1);
      color: #888; font-family: inherit; font-size: 0.82rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em;
    }
    .sm-btn-back:hover { background: rgba(255,255,255,0.05); color: #f0f0f0; }
    .sm-btn-back:disabled { opacity: 0.3; pointer-events: none; }
    .sm-step-counter {
      font-size: 0.72rem; font-weight: 700; color: #4a4a4a;
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .sm-btn-next {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 24px; border-radius: 999px;
      background: #F5C518; border: none;
      color: #0a0a0a; font-family: inherit; font-size: 0.85rem; font-weight: 800;
      cursor: pointer; letter-spacing: 0.01em;
      box-shadow: 0 4px 20px rgba(245,197,24,0.35);
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    }
    .sm-btn-next:hover { background: #FFE066; transform: translateY(-1px); box-shadow: 0 6px 26px rgba(245,197,24,0.5); }

    /* ── STEP PANELS ─────────────────────────────────────── */
    .sm-step { display: none; }
    .sm-step.active { display: block; }

    @keyframes smSlideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes smSlideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .sm-step.enter-right { animation: smSlideInRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
    .sm-step.enter-left  { animation: smSlideInLeft  0.35s cubic-bezier(0.16,1,0.3,1) forwards; }

    /* Step header */
    .sm-step-tag {
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: #F5C518; margin-bottom: 0.5rem;
    }
    .sm-step-title {
      font-size: 1.25rem; font-weight: 900; letter-spacing: -0.03em;
      color: #F0F0F0; line-height: 1.2; margin-bottom: 0.4rem;
    }
    .sm-step-title span { color: #F5C518; }
    .sm-step-sub {
      font-size: 0.8rem; color: #4a4a4a; line-height: 1.6;
      margin-bottom: 1.5rem; font-weight: 400;
    }

    /* ── ROLE SELECTOR (Step 0) ─────────────────────────── */
    .sm-role-cards {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 0.85rem; margin-bottom: 0.5rem;
    }
    .sm-role-card {
      border: 1.5px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 1.5rem 1.25rem;
      cursor: pointer;
      background: rgba(255,255,255,0.03);
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .sm-role-card:hover {
      border-color: rgba(245,197,24,0.4);
      background: rgba(245,197,24,0.04);
      transform: translateY(-3px);
    }
    .sm-role-card.selected {
      border-color: #F5C518;
      background: rgba(245,197,24,0.07);
    }
    .sm-role-card.selected::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, #F5C518, transparent);
    }
    .sm-role-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .sm-role-name {
      font-size: 0.95rem; font-weight: 800; color: #F0F0F0;
      letter-spacing: -0.02em; margin-bottom: 0.35rem;
    }
    .sm-role-desc {
      font-size: 0.72rem; color: #888; line-height: 1.5; font-weight: 400;
    }
    .sm-role-check {
      position: absolute; top: 0.75rem; right: 0.75rem;
      width: 20px; height: 20px; border-radius: 50%;
      background: rgba(245,197,24,0.12); border: 1.5px solid rgba(245,197,24,0.3);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.2s;
    }
    .sm-role-card.selected .sm-role-check { opacity: 1; }
    .sm-role-hint {
      font-size: 0.72rem; color: #4a4a4a; text-align: center;
      margin-top: 0.75rem; font-weight: 400;
    }

    /* ── FORM FIELDS ─────────────────────────────────────── */
    .sm-field-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }
    .sm-field { display: flex; flex-direction: column; }
    .sm-field.span-2 { grid-column: span 2; }
    .sm-field-label {
      font-size: 0.72rem; font-weight: 700; color: #888;
      margin-bottom: 0.35rem; letter-spacing: 0.02em;
    }
    .sm-field-label .req { color: #F5C518; }
    .sm-input, .sm-select {
      width: 100%; padding: 10px 13px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 10px;
      color: #F0F0F0; font-family: inherit;
      font-size: 0.85rem; font-weight: 500;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    .sm-input::placeholder { color: #4a4a4a; font-weight: 400; }
    .sm-input:focus, .sm-select:focus {
      border-color: rgba(245,197,24,0.5);
      background: rgba(245,197,24,0.04);
    }
    .sm-input.error { border-color: rgba(239,68,68,0.6); }
    .sm-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
    .sm-select option { background: #1a1a1a; }
    .sm-hint {
      font-size: 0.68rem; color: #ef4444;
      margin-top: 3px; display: none; font-weight: 500;
    }
    .sm-hint.visible { display: block; }

    /* Password toggle */
    .sm-input-wrap { position: relative; }
    .sm-input-wrap .sm-input { padding-right: 42px; }
    .sm-pw-toggle {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: #4a4a4a; cursor: pointer;
      padding: 0; display: flex; align-items: center;
      transition: color 0.2s;
    }
    .sm-pw-toggle:hover { color: #888; }

    /* Section label */
    .sm-section-label {
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: #4a4a4a;
      margin: 1.25rem 0 0.85rem;
    }

    /* Channels grid */
    .sm-channels {
      display: grid; grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    .sm-channel {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px; cursor: pointer;
      transition: all 0.2s; user-select: none;
    }
    .sm-channel:hover { border-color: rgba(245,197,24,0.25); background: rgba(245,197,24,0.03); }
    .sm-channel.checked { border-color: rgba(245,197,24,0.45); background: rgba(245,197,24,0.07); }
    .sm-channel input { display: none; }
    .sm-channel-box {
      width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
      border: 1.5px solid rgba(255,255,255,0.15);
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .sm-channel.checked .sm-channel-box {
      background: #F5C518; border-color: #F5C518;
    }
    .sm-channel-name { font-size: 0.78rem; font-weight: 600; color: #888; transition: color 0.2s; }
    .sm-channel.checked .sm-channel-name { color: #F0F0F0; }

    /* Divider */
    .sm-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1.25rem 0; }

    /* Terms accordion */
    .sm-terms-acc {
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px; overflow: hidden; margin-bottom: 0.75rem;
    }
    .sm-terms-trigger {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: 0.85rem 1rem; background: rgba(255,255,255,0.03);
      border: none; color: #888; font-family: inherit; font-size: 0.82rem;
      font-weight: 600; cursor: pointer; transition: color 0.2s;
    }
    .sm-terms-trigger:hover { color: #F0F0F0; }
    .sm-terms-arrow { width: 14px; height: 14px; transition: transform 0.3s; flex-shrink: 0; }
    .sm-terms-acc.open .sm-terms-arrow { transform: rotate(180deg); }
    .sm-terms-body {
      max-height: 0; overflow: hidden;
      transition: max-height 0.35s cubic-bezier(0.16,1,0.3,1);
    }
    .sm-terms-acc.open .sm-terms-body { max-height: 300px; }
    .sm-terms-text {
      padding: 0.85rem 1rem; font-size: 0.75rem; color: #4a4a4a;
      line-height: 1.65; border-top: 1px solid rgba(255,255,255,0.06);
    }
    .sm-terms-text a { color: #F5C518; text-decoration: none; }
    .sm-terms-text a:hover { color: #FFE066; }

    /* Agree row */
    .sm-agree {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 0.85rem; background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;
      cursor: pointer; margin-bottom: 1rem; user-select: none;
    }
    .sm-agree input { display: none; }
    .sm-agree-box {
      width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0; margin-top: 1px;
      border: 1.5px solid rgba(255,255,255,0.15);
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .sm-agree.checked .sm-agree-box { background: #F5C518; border-color: #F5C518; }
    .sm-agree-text { font-size: 0.75rem; color: #888; line-height: 1.55; font-weight: 400; }
    .sm-agree-text a { color: #F5C518; text-decoration: none; }
    .sm-agree-text a:hover { color: #FFE066; }
    .sm-agree-hint { font-size: 0.68rem; color: #ef4444; display: none; margin-top: 0.35rem; }
    .sm-agree-hint.visible { display: block; }

    /* reCAPTCHA placeholder */
    .sm-recaptcha {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px;
      background: #f9f9f9; border: 1px solid #d3d3d3; border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .sm-recaptcha-check {
      width: 24px; height: 24px; border: 2px solid #c1c1c1; border-radius: 3px;
      background: #fff; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .sm-recaptcha-check.checked { background: #4285f4; border-color: #4285f4; }
    .sm-recaptcha-label { font-size: 0.85rem; color: #333; flex: 1; }
    .sm-recaptcha-logo { text-align: center; flex-shrink: 0; }
    .sm-recaptcha-logo-icon { font-size: 1.4rem; }
    .sm-recaptcha-logo-text { font-size: 0.5rem; color: #999; letter-spacing: 0.02em; }
    .sm-recaptcha-note { font-size: 0.65rem; color: #4a4a4a; margin-bottom: 0.5rem; }

    /* ── SUCCESS SCREEN ──────────────────────────────────── */
    .sm-success { display: none; text-align: center; padding: 3rem 1.75rem 2.5rem; }
    .sm-success.show { display: block; }
    .sm-success-circle {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(245,197,24,0.1); border: 1px solid rgba(245,197,24,0.3);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem;
    }
    .sm-success-title {
      font-size: 1.5rem; font-weight: 900; letter-spacing: -0.04em;
      line-height: 1.2; margin-bottom: 0.75rem; color: #F0F0F0;
    }
    .sm-success-title span {
      background: linear-gradient(135deg, #F5C518, #FFE066, #fff);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .sm-success-sub {
      font-size: 0.85rem; color: #888; line-height: 1.65;
      max-width: 340px; margin: 0 auto 2rem; font-weight: 400;
    }
    .sm-success-close {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px; border-radius: 999px;
      background: #F5C518; border: none; color: #0a0a0a;
      font-family: inherit; font-size: 0.875rem; font-weight: 800;
      cursor: pointer; box-shadow: 0 4px 20px rgba(245,197,24,0.4);
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    }
    .sm-success-close:hover { background: #FFE066; transform: translateY(-1px); }

    /* Mobile */
    @media (max-width: 600px) {
      .sm-modal { max-height: 96vh; border-radius: 18px 18px 0 0; align-self: flex-end; }
      .sm-overlay { align-items: flex-end; padding: 0; }
      .sm-role-cards { grid-template-columns: 1fr; }
      .sm-field-grid { grid-template-columns: 1fr; }
      .sm-field.span-2 { grid-column: span 1; }
      .sm-channels { grid-template-columns: 1fr; }
    }
  `;

  /* ── HTML ─────────────────────────────────────────────────── */
  const html = `
    <div class="sm-overlay" id="smOverlay" onclick="smHandleOverlay(event)">
      <div class="sm-modal" id="smModal">
        <button class="sm-close" onclick="closeSignupModal()">✕</button>

        <!-- Header -->
        <div class="sm-header" id="smHeader">
          <div class="sm-logo">
            <img src="logo.png" alt="EPCVIP" onerror="this.style.display='none'" />
          </div>
          <div class="sm-progress-track">
            <div class="sm-progress-fill" id="smProgress"></div>
          </div>
          <div class="sm-dots" id="smDots"></div>
        </div>

        <!-- Scrollable body -->
        <div class="sm-body" id="smBody">

          <!-- ─── STEP 0 — Role Selector ─────────────────── -->
          <div class="sm-step active enter-right" id="sm-step-0">
            <div class="sm-step-tag">Get Started</div>
            <div class="sm-step-title">Which path would <span>you like to join?</span></div>
            <div class="sm-step-sub">Choose your role to get started. You can always contact us if you're unsure.</div>
            <div class="sm-role-cards">
              <div class="sm-role-card" id="rolePublisher" onclick="smSelectRole('publisher')">
                <div class="sm-role-check">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="sm-role-icon">📈</div>
                <div class="sm-role-name">Publisher</div>
                <div class="sm-role-desc">I drive traffic and want to earn the highest EPCs on my financial audience.</div>
              </div>
              <div class="sm-role-card" id="roleAdvertiser" onclick="smSelectRole('advertiser')">
                <div class="sm-role-check">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="sm-role-icon">🎯</div>
                <div class="sm-role-name">Advertiser</div>
                <div class="sm-role-desc">I want to buy premium, verified financial leads to grow my business.</div>
              </div>
            </div>
            <div class="sm-role-hint">Select your role above to continue →</div>
          </div>

          <!-- ─── STEP 1 — Company Info ──────────────────── -->
          <div class="sm-step" id="sm-step-1">
            <div class="sm-step-tag">Step 1 of 5</div>
            <div class="sm-step-title">Tell us about your <span>company</span></div>
            <div class="sm-step-sub">We'll use this to set up your account and match you with the right opportunities.</div>
            <div class="sm-field-grid">
              <div class="sm-field span-2">
                <label class="sm-field-label">Company Name <span class="req">*</span></label>
                <input class="sm-input" type="text" id="sm-companyName" placeholder="Acme Financial LLC" />
                <span class="sm-hint" id="sm-companyName-hint">Company name is required</span>
              </div>
              <div class="sm-field">
                <label class="sm-field-label">Website</label>
                <input class="sm-input" type="url" id="sm-website" placeholder="https://yoursite.com" />
              </div>
              <div class="sm-field">
                <label class="sm-field-label">EIN / VAT Number</label>
                <input class="sm-input" type="text" id="sm-einVat" placeholder="12-3456789" />
              </div>
            </div>
          </div>

          <!-- ─── STEP 2 — Contact Info ──────────────────── -->
          <div class="sm-step" id="sm-step-2">
            <div class="sm-step-tag">Step 2 of 5</div>
            <div class="sm-step-title">Primary <span>contact info</span></div>
            <div class="sm-step-sub">This person will be the main point of contact for your account.</div>
            <div class="sm-field-grid">
              <div class="sm-field">
                <label class="sm-field-label">First Name <span class="req">*</span></label>
                <input class="sm-input" type="text" id="sm-firstName" placeholder="Jane" />
                <span class="sm-hint" id="sm-firstName-hint">First name is required</span>
              </div>
              <div class="sm-field">
                <label class="sm-field-label">Last Name <span class="req">*</span></label>
                <input class="sm-input" type="text" id="sm-lastName" placeholder="Smith" />
                <span class="sm-hint" id="sm-lastName-hint">Last name is required</span>
              </div>
              <div class="sm-field span-2">
                <label class="sm-field-label">Email Address <span class="req">*</span></label>
                <input class="sm-input" type="email" id="sm-email" placeholder="jane@company.com" />
                <span class="sm-hint" id="sm-email-hint">A valid email is required</span>
              </div>
              <div class="sm-field span-2">
                <label class="sm-field-label">Phone Number <span class="req">*</span></label>
                <input class="sm-input" type="tel" id="sm-phone" placeholder="+1 (555) 000-0000" />
                <span class="sm-hint" id="sm-phone-hint">Phone number is required</span>
              </div>
              <div class="sm-field">
                <label class="sm-field-label">Password <span class="req">*</span></label>
                <div class="sm-input-wrap">
                  <input class="sm-input" type="password" id="sm-password" placeholder="Min. 8 characters" />
                  <button class="sm-pw-toggle" type="button" onclick="smTogglePw('sm-password', this)" tabindex="-1">
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M1.5 9C1.5 9 4 3.5 9 3.5C14 3.5 16.5 9 16.5 9C16.5 9 14 14.5 9 14.5C4 14.5 1.5 9 1.5 9Z" stroke="currentColor" stroke-width="1.3"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.3"/></svg>
                  </button>
                </div>
                <span class="sm-hint" id="sm-password-hint">Min. 8 characters required</span>
              </div>
              <div class="sm-field">
                <label class="sm-field-label">Confirm Password <span class="req">*</span></label>
                <div class="sm-input-wrap">
                  <input class="sm-input" type="password" id="sm-confirmPassword" placeholder="Re-enter password" />
                  <button class="sm-pw-toggle" type="button" onclick="smTogglePw('sm-confirmPassword', this)" tabindex="-1">
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M1.5 9C1.5 9 4 3.5 9 3.5C14 3.5 16.5 9 16.5 9C16.5 9 14 14.5 9 14.5C4 14.5 1.5 9 1.5 9Z" stroke="currentColor" stroke-width="1.3"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.3"/></svg>
                  </button>
                </div>
                <span class="sm-hint" id="sm-confirmPassword-hint">Passwords do not match</span>
              </div>
            </div>
          </div>

          <!-- ─── STEP 3 — Address ───────────────────────── -->
          <div class="sm-step" id="sm-step-3">
            <div class="sm-step-tag">Step 3 of 5</div>
            <div class="sm-step-title">Your business <span>address</span></div>
            <div class="sm-step-sub">Required for verification and payment processing.</div>
            <div class="sm-field-grid">
              <div class="sm-field span-2">
                <label class="sm-field-label">Address Line 1 <span class="req">*</span></label>
                <input class="sm-input" type="text" id="sm-address1" placeholder="123 Main Street" />
                <span class="sm-hint" id="sm-address1-hint">Address is required</span>
              </div>
              <div class="sm-field span-2">
                <label class="sm-field-label">Address Line 2</label>
                <input class="sm-input" type="text" id="sm-address2" placeholder="Suite 400" />
              </div>
              <div class="sm-field">
                <label class="sm-field-label">City <span class="req">*</span></label>
                <input class="sm-input" type="text" id="sm-city" placeholder="New York" />
                <span class="sm-hint" id="sm-city-hint">City is required</span>
              </div>
              <div class="sm-field">
                <label class="sm-field-label">State / Province <span class="req">*</span></label>
                <input class="sm-input" type="text" id="sm-state" placeholder="NY" />
                <span class="sm-hint" id="sm-state-hint">State is required</span>
              </div>
              <div class="sm-field">
                <label class="sm-field-label">ZIP / Postal Code <span class="req">*</span></label>
                <input class="sm-input" type="text" id="sm-zip" placeholder="10001" />
                <span class="sm-hint" id="sm-zip-hint">ZIP code is required</span>
              </div>
              <div class="sm-field">
                <label class="sm-field-label">Country <span class="req">*</span></label>
                <select class="sm-select" id="sm-country">
                  <option value="" disabled selected>Select country</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Netherlands</option>
                  <option>Other</option>
                </select>
                <span class="sm-hint" id="sm-country-hint">Country is required</span>
              </div>
            </div>
          </div>

          <!-- ─── STEP 4 — Online Presence ──────────────── -->
          <div class="sm-step" id="sm-step-4">
            <div class="sm-step-tag">Step 4 of 5</div>
            <div class="sm-step-title">Online <span>presence</span></div>
            <div class="sm-step-sub">Help your account manager reach you. All fields optional.</div>
            <div class="sm-field-grid">
              <div class="sm-field span-2">
                <label class="sm-field-label">LinkedIn Profile URL</label>
                <input class="sm-input" type="url" id="sm-linkedin" placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              <div class="sm-field">
                <label class="sm-field-label">Microsoft Teams</label>
                <input class="sm-input" type="text" id="sm-teams" placeholder="jane@company.com" />
              </div>
              <div class="sm-field">
                <label class="sm-field-label">Telegram Handle</label>
                <input class="sm-input" type="text" id="sm-telegram" placeholder="@yourhandle" />
              </div>
            </div>
            <div class="sm-divider"></div>
            <div class="sm-section-label">Marketing Channels You Use</div>
            <div class="sm-channels" id="smChannels">
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="search" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">Search (SEO / SEM)</span>
              </div>
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="social" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">Social Media</span>
              </div>
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="email" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">Email Marketing</span>
              </div>
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="display" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">Display Advertising</span>
              </div>
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="native" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">Native Advertising</span>
              </div>
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="sms" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">SMS Marketing</span>
              </div>
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="affiliate" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">Affiliate Marketing</span>
              </div>
              <div class="sm-channel" onclick="smToggleChannel(this)">
                <input type="checkbox" value="content" /><div class="sm-channel-box"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <span class="sm-channel-name">Content Marketing</span>
              </div>
            </div>
          </div>

          <!-- ─── STEP 5 — Terms & Submit ────────────────── -->
          <div class="sm-step" id="sm-step-5">
            <div class="sm-step-tag">Step 5 of 5</div>
            <div class="sm-step-title">Almost there — <span>agree &amp; finish</span></div>
            <div class="sm-step-sub">Review our terms to complete your registration.</div>

            <div class="sm-terms-acc" id="smTermsAcc">
              <button class="sm-terms-trigger" type="button" onclick="smToggleTerms('smTermsAcc')">
                <span>Terms &amp; Conditions</span>
                <svg class="sm-terms-arrow" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="sm-terms-body"><div class="sm-terms-text">By registering with EPCVIP you agree to comply with all applicable laws and regulations, including the Telephone Consumer Protection Act (TCPA) and CAN-SPAM Act. You agree that all traffic you send must be compliant with our <a href="#">Publisher Guidelines</a> and that you will not use deceptive, fraudulent, or prohibited methods. EPCVIP reserves the right to suspend or terminate accounts that violate these terms. Revenue share and payment terms are governed by the separate <a href="#">Publisher/Advertiser Agreement</a> executed upon account activation. All disputes are subject to binding arbitration in Florida, USA. Visit <a href="#">epcvip.com/terms</a> for full terms.</div></div>
            </div>

            <div class="sm-terms-acc" id="smMktAcc">
              <button class="sm-terms-trigger" type="button" onclick="smToggleTerms('smMktAcc')">
                <span>Marketing Communication Agreement</span>
                <svg class="sm-terms-arrow" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="sm-terms-body"><div class="sm-terms-text">By submitting, you consent to receive marketing communications from EPCVIP including network updates, promotional offers, and campaign performance reports via email and SMS. You may opt out at any time by contacting <a href="mailto:support@epcvip.com">support@epcvip.com</a> or clicking unsubscribe. Standard messaging rates may apply.</div></div>
            </div>

            <div class="sm-agree" id="smAgreeRow" onclick="smToggleAgree()">
              <input type="checkbox" id="smAgreeCheck" />
              <div class="sm-agree-box">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="sm-agree-text">
                I have read and agree to the <a href="#" onclick="smToggleTerms('smTermsAcc');return false;">Terms &amp; Conditions</a> and <a href="#" onclick="smToggleTerms('smMktAcc');return false;">Marketing Agreement</a>. I confirm all information is accurate.
              </span>
            </div>
            <div class="sm-agree-hint" id="smAgreeHint">You must agree to the terms to continue</div>

            <div class="sm-recaptcha">
              <div class="sm-recaptcha-check" id="smRecaptchaCheck" onclick="smToggleRecaptcha()"></div>
              <span class="sm-recaptcha-label">I'm not a robot</span>
              <div class="sm-recaptcha-logo">
                <div class="sm-recaptcha-logo-icon">🔒</div>
                <div class="sm-recaptcha-logo-text">reCAPTCHA</div>
              </div>
            </div>
            <div class="sm-recaptcha-note">Replace the placeholder above with your Google reCAPTCHA widget.</div>
          </div>

        </div><!-- /sm-body -->

        <!-- Footer nav (hidden on success) -->
        <div class="sm-footer" id="smFooter">
          <button class="sm-btn-back" id="smBtnBack" onclick="smPrevStep()" disabled>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <span class="sm-step-counter" id="smStepCounter"></span>
          <button class="sm-btn-next" id="smBtnNext" onclick="smNextStep()">
            Continue
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <!-- Success screen -->
        <div class="sm-success" id="smSuccess">
          <div class="sm-success-circle">
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none"><path d="M10 22L18 30L34 14" stroke="#F5C518" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="sm-success-title">You're all set —<br><span>Welcome to EPCVIP</span></div>
          <p class="sm-success-sub">Your application has been received. Our team reviews all applications within 24 hours — we'll email you as soon as your account is approved.</p>
          <button class="sm-success-close" onclick="closeSignupModal()">Back to Site</button>
        </div>

      </div><!-- /sm-modal -->
    </div><!-- /sm-overlay -->
  `;

  /* ── Inject CSS ───────────────────────────────────────────── */
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Inject HTML ──────────────────────────────────────────── */
  document.body.insertAdjacentHTML('afterbegin', html);

  /* ── State ────────────────────────────────────────────────── */
  const TOTAL_STEPS = 5;  // Steps 1–5 (step 0 is the role selector)
  let smCurrent = 0;
  let smRole = null;
  let smAgreed = false;
  let smRecaptchaDone = false;

  /* ── Render dots ─────────────────────────────────────────── */
  function smRenderDots() {
    const dotsEl = document.getElementById('smDots');
    dotsEl.innerHTML = '';
    // dot for role (step 0) + dots for steps 1–5
    for (let i = 0; i <= TOTAL_STEPS; i++) {
      const d = document.createElement('div');
      d.className = 'sm-dot';
      if (i === smCurrent) d.classList.add('active');
      else if (i < smCurrent) d.classList.add('done');
      dotsEl.appendChild(d);
    }
  }

  /* ── Update progress + UI ─────────────────────────────────── */
  function smUpdateUI() {
    const pct = (smCurrent / TOTAL_STEPS) * 100;
    document.getElementById('smProgress').style.width = pct + '%';
    smRenderDots();

    const backBtn = document.getElementById('smBtnBack');
    const nextBtn = document.getElementById('smBtnNext');
    const counter = document.getElementById('smStepCounter');

    backBtn.disabled = smCurrent === 0;

    if (smCurrent === 0) {
      counter.textContent = 'Choose your role';
      nextBtn.textContent = 'Continue';
      nextBtn.innerHTML = 'Continue <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (smCurrent === TOTAL_STEPS) {
      counter.textContent = `Step ${smCurrent} of ${TOTAL_STEPS}`;
      nextBtn.innerHTML = 'Submit Application <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      counter.textContent = `Step ${smCurrent} of ${TOTAL_STEPS}`;
      nextBtn.innerHTML = 'Continue <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    // Scroll body to top on step change
    document.getElementById('smBody').scrollTop = 0;
  }

  /* ── Go to step ───────────────────────────────────────────── */
  function smGoTo(next, dir) {
    const cur = document.getElementById(`sm-step-${smCurrent}`);
    const nxt = document.getElementById(`sm-step-${next}`);
    cur.classList.remove('active', 'enter-right', 'enter-left');
    cur.style.display = 'none';
    nxt.style.display = 'block';
    nxt.offsetHeight; // reflow
    nxt.classList.add('active', dir === 'forward' ? 'enter-right' : 'enter-left');
    smCurrent = next;
    smUpdateUI();
  }

  /* ── Role select ──────────────────────────────────────────── */
  window.smSelectRole = function (role) {
    smRole = role;
    document.getElementById('rolePublisher').classList.toggle('selected', role === 'publisher');
    document.getElementById('roleAdvertiser').classList.toggle('selected', role === 'advertiser');
    // Auto-advance after brief delay
    setTimeout(() => smGoTo(1, 'forward'), 320);
  };

  /* ── Validation helpers ───────────────────────────────────── */
  const smIsEmail  = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const smIsPhone  = v => /^[\d\s\-\+\(\)\.]{7,20}$/.test(v.replace(/\s/g, ''));
  const smIsZip    = v => /^[A-Z0-9\s\-]{3,10}$/i.test(v.trim());

  function smValidate(step) {
    let ok = true;

    // Generic required-field check
    const req = (id, hintId, customMsg) => {
      const el = document.getElementById(id);
      const hint = document.getElementById(hintId);
      const empty = !el || !el.value.trim();
      if (empty) {
        if (el) el.classList.add('error');
        if (hint) hint.classList.add('visible');
        ok = false;
      } else {
        if (el) el.classList.remove('error');
        if (hint) hint.classList.remove('visible');
      }
    };

    // Check with custom rule
    const check = (id, hintId, testFn, msg) => {
      const el = document.getElementById(id);
      const hint = document.getElementById(hintId);
      const val = el ? el.value.trim() : '';
      if (!val || !testFn(val)) {
        if (el) el.classList.add('error');
        if (hint) { hint.textContent = msg; hint.classList.add('visible'); }
        ok = false;
      } else {
        if (el) el.classList.remove('error');
        if (hint) hint.classList.remove('visible');
      }
    };

    if (step === 0) {
      if (!smRole) { ok = false; }
    }

    if (step === 1) {
      req('sm-companyName', 'sm-companyName-hint');
    }

    if (step === 2) {
      req('sm-firstName', 'sm-firstName-hint');
      req('sm-lastName',  'sm-lastName-hint');
      check('sm-email', 'sm-email-hint', smIsEmail, 'Please enter a valid email address.');
      check('sm-phone', 'sm-phone-hint', smIsPhone, 'Please enter a valid phone number.');
      // Password: min 8 chars
      const pw = document.getElementById('sm-password');
      const pwHint = document.getElementById('sm-password-hint');
      if (!pw.value || pw.value.length < 8) {
        pw.classList.add('error');
        pwHint.textContent = 'Password must be at least 8 characters.';
        pwHint.classList.add('visible');
        ok = false;
      } else {
        pw.classList.remove('error');
        pwHint.classList.remove('visible');
      }
      // Confirm password
      const cpw = document.getElementById('sm-confirmPassword');
      const cHint = document.getElementById('sm-confirmPassword-hint');
      if (!cpw.value || cpw.value !== pw.value) {
        cpw.classList.add('error');
        cHint.textContent = cpw.value ? 'Passwords do not match.' : 'Please confirm your password.';
        cHint.classList.add('visible');
        ok = false;
      } else {
        cpw.classList.remove('error');
        cHint.classList.remove('visible');
      }
    }

    if (step === 3) {
      req('sm-address1', 'sm-address1-hint');
      req('sm-city',     'sm-city-hint');
      req('sm-state',    'sm-state-hint');
      check('sm-zip', 'sm-zip-hint', smIsZip, 'Please enter a valid postal / ZIP code.');
      req('sm-country',  'sm-country-hint');
    }

    if (step === 5) {
      if (!smAgreed) {
        document.getElementById('smAgreeHint').classList.add('visible');
        ok = false;
      } else {
        document.getElementById('smAgreeHint').classList.remove('visible');
      }
    }

    return ok;
  }

  /* ── Next / Prev ──────────────────────────────────────────── */
  window.smNextStep = function () {
    if (!smValidate(smCurrent)) return;
    if (smCurrent === TOTAL_STEPS) { smSubmit(); return; }
    smGoTo(smCurrent + 1, 'forward');
  };

  window.smPrevStep = function () {
    if (smCurrent === 0) return;
    smGoTo(smCurrent - 1, 'back');
  };

  /* ── Submit ───────────────────────────────────────────────── */
  function smSubmit() {
    // Collect data
    const data = {
      role: smRole,
      companyName: document.getElementById('sm-companyName').value,
      website: document.getElementById('sm-website').value,
      ein: document.getElementById('sm-einVat').value,
      firstName: document.getElementById('sm-firstName').value,
      lastName: document.getElementById('sm-lastName').value,
      email: document.getElementById('sm-email').value,
      phone: document.getElementById('sm-phone').value,
      address1: document.getElementById('sm-address1').value,
      address2: document.getElementById('sm-address2').value,
      city: document.getElementById('sm-city').value,
      state: document.getElementById('sm-state').value,
      zip: document.getElementById('sm-zip').value,
      country: document.getElementById('sm-country').value,
      linkedin: document.getElementById('sm-linkedin').value,
      channels: [...document.querySelectorAll('#smChannels .sm-channel.checked input')].map(i => i.value),
    };
    console.log('EPCVIP Signup Submission:', data);
    // TODO: replace console.log with actual fetch/POST to your backend

    // Show success
    document.getElementById('smBody').style.display = 'none';
    document.getElementById('smFooter').style.display = 'none';
    document.getElementById('smSuccess').classList.add('show');
    document.getElementById('smProgress').style.width = '100%';
    document.getElementById('smDots').querySelectorAll('.sm-dot').forEach(d => { d.classList.remove('active'); d.classList.add('done'); });
  }

  /* ── Terms accordions ─────────────────────────────────────── */
  window.smToggleTerms = function (id) {
    document.getElementById(id).classList.toggle('open');
  };

  /* ── Agree checkbox ───────────────────────────────────────── */
  window.smToggleAgree = function () {
    smAgreed = !smAgreed;
    const row = document.getElementById('smAgreeRow');
    row.classList.toggle('checked', smAgreed);
    if (smAgreed) document.getElementById('smAgreeHint').classList.remove('visible');
  };

  /* ── Recaptcha placeholder ────────────────────────────────── */
  window.smToggleRecaptcha = function () {
    smRecaptchaDone = !smRecaptchaDone;
    const el = document.getElementById('smRecaptchaCheck');
    el.classList.toggle('checked', smRecaptchaDone);
    if (smRecaptchaDone) {
      el.innerHTML = '<svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M1 6L5.5 10.5L13 1" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      el.innerHTML = '';
    }
  };

  /* ── Channel toggles ──────────────────────────────────────── */
  window.smToggleChannel = function (el) {
    el.classList.toggle('checked');
    el.querySelector('input').checked = el.classList.contains('checked');
  };

  /* ── Password toggle ──────────────────────────────────────── */
  window.smTogglePw = function (inputId, btn) {
    const inp = document.getElementById(inputId);
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.style.color = inp.type === 'text' ? '#F5C518' : '#4a4a4a';
  };

  /* ── Reset modal state ────────────────────────────────────── */
  function smReset() {
    // Reset step
    const cur = document.getElementById(`sm-step-${smCurrent}`);
    if (cur) { cur.classList.remove('active', 'enter-right', 'enter-left'); cur.style.display = 'none'; }
    smCurrent = 0;
    smRole = null;
    smAgreed = false;
    smRecaptchaDone = false;

    // Show step 0
    const step0 = document.getElementById('sm-step-0');
    step0.style.display = 'block';
    step0.classList.add('active', 'enter-right');

    // Deselect roles
    document.getElementById('rolePublisher').classList.remove('selected');
    document.getElementById('roleAdvertiser').classList.remove('selected');

    // Reset form fields
    ['sm-companyName','sm-website','sm-einVat','sm-firstName','sm-lastName','sm-email',
     'sm-phone','sm-password','sm-confirmPassword','sm-address1','sm-address2',
     'sm-city','sm-state','sm-zip','sm-linkedin','sm-teams','sm-telegram'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error'); }
    });
    const country = document.getElementById('sm-country');
    if (country) country.selectedIndex = 0;

    // Reset hints
    document.querySelectorAll('.sm-hint').forEach(h => h.classList.remove('visible'));

    // Reset channels
    document.querySelectorAll('#smChannels .sm-channel').forEach(c => {
      c.classList.remove('checked');
      c.querySelector('input').checked = false;
    });

    // Reset agree
    document.getElementById('smAgreeRow').classList.remove('checked');
    document.getElementById('smAgreeHint').classList.remove('visible');

    // Reset recaptcha
    document.getElementById('smRecaptchaCheck').classList.remove('checked');
    document.getElementById('smRecaptchaCheck').innerHTML = '';

    // Reset terms
    document.querySelectorAll('.sm-terms-acc').forEach(a => a.classList.remove('open'));

    // Reset success screen
    document.getElementById('smBody').style.display = '';
    document.getElementById('smFooter').style.display = '';
    document.getElementById('smSuccess').classList.remove('show');

    smUpdateUI();
  }

  /* ── Public API ───────────────────────────────────────────── */
  window.openSignupModal = function (role) {
    smReset();
    if (role === 'publisher') {
      smSelectRole('publisher');
    } else if (role === 'advertiser') {
      smSelectRole('advertiser');
    }
    document.getElementById('smOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeSignupModal = function () {
    document.getElementById('smOverlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.smHandleOverlay = function (e) {
    if (e.target === document.getElementById('smOverlay')) closeSignupModal();
  };

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('smOverlay').classList.contains('open')) {
      closeSignupModal();
    }
  });

  // Wire close button via event listener (belt-and-suspenders alongside onclick attr)
  document.querySelector('.sm-close').addEventListener('click', function (e) {
    e.stopPropagation();
    closeSignupModal();
  });

  // Initial render
  smUpdateUI();

})();
