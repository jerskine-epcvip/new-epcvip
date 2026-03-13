(function () {

  /* ── CSS ───────────────────────────────────────────────────────────── */
  var css = [
    '.lm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(14px);',
    'z-index:600;display:flex;align-items:center;justify-content:center;padding:1rem;',
    'opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.16,1,.3,1);}',
    '.lm-overlay.open{opacity:1;pointer-events:all;}',

    '.lm-modal{background:#141414;border:1px solid rgba(255,255,255,.09);border-radius:24px;',
    'width:100%;max-width:760px;max-height:92vh;display:flex;flex-direction:column;',
    'position:relative;box-shadow:0 40px 100px rgba(0,0,0,.8),0 1px 0 rgba(255,255,255,.05) inset;',
    'transform:translateY(24px) scale(.97);transition:transform .4s cubic-bezier(.16,1,.3,1);overflow:hidden;}',
    '.lm-overlay.open .lm-modal{transform:translateY(0) scale(1);}',
    '.lm-modal::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;',
    'border-radius:24px 24px 0 0;',
    'background:linear-gradient(90deg,transparent,rgba(245,197,24,.8),transparent);z-index:1;}',

    '.lm-header{flex-shrink:0;padding:1.75rem 3rem 1.25rem 1.75rem;',
    'border-bottom:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;gap:.4rem;}',

    '.lm-close{position:absolute;top:1.25rem;right:1.25rem;width:32px;height:32px;z-index:10;',
    'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:50%;',
    'color:#4a4a4a;font-size:1rem;cursor:pointer;display:flex;align-items:center;',
    'justify-content:center;transition:all .2s;line-height:1;font-family:inherit;}',
    '.lm-close:hover{background:rgba(255,255,255,.1);color:#f0f0f0;}',

    '.lm-badge{display:inline-flex;align-items:center;background:rgba(245,197,24,.12);',
    'color:#f5c518;border:1px solid rgba(245,197,24,.25);border-radius:50px;',
    'font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;',
    'padding:.2rem .65rem;width:fit-content;}',

    '.lm-title{font-size:1.5rem;font-weight:900;letter-spacing:-.03em;color:#f0f0f0;margin:0;}',

    '.lm-body{flex:1;overflow-y:auto;padding:1.75rem;',
    'scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent;}',
    '.lm-body::-webkit-scrollbar{width:6px;}',
    '.lm-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px;}',

    '.lm-doc h3{font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;',
    'color:#f5c518;margin:1.75rem 0 .6rem;padding-top:1.75rem;',
    'border-top:1px solid rgba(255,255,255,.06);}',
    '.lm-doc h3:first-child{margin-top:0;padding-top:0;border-top:none;}',
    '.lm-doc p{font-size:.875rem;line-height:1.75;color:rgba(240,240,240,.65);margin:0 0 .75rem;}',
    '.lm-doc ul{margin:0 0 .75rem;padding-left:1.25rem;}',
    '.lm-doc ul li{font-size:.875rem;line-height:1.75;color:rgba(240,240,240,.65);margin-bottom:.35rem;}',
    '.lm-doc strong{color:rgba(240,240,240,.9);font-weight:600;}',
    '.lm-doc a{color:#f5c518;text-decoration:none;}',
    '.lm-doc a:hover{text-decoration:underline;}',
    '.lm-doc-meta{font-size:.75rem;color:rgba(240,240,240,.3);margin-bottom:1.5rem;}',

    '.lm-form-intro{font-size:.85rem;line-height:1.7;color:rgba(240,240,240,.6);',
    'background:rgba(245,197,24,.06);border:1px solid rgba(245,197,24,.15);',
    'border-radius:12px;padding:1rem 1.1rem;margin-bottom:1.5rem;}',

    '.lm-fg{margin-bottom:1rem;}',
    '.lm-label{display:block;font-size:.78rem;font-weight:600;letter-spacing:.02em;',
    'color:rgba(240,240,240,.6);margin-bottom:.4rem;}',
    '.lm-label span{color:#f5c518;}',

    '.lm-input,.lm-select,.lm-textarea{width:100%;padding:.7rem .9rem;',
    'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);',
    'border-radius:10px;color:#f0f0f0;font-size:.875rem;font-family:inherit;',
    'transition:border-color .2s,background .2s;box-sizing:border-box;}',
    '.lm-input:focus,.lm-select:focus,.lm-textarea:focus{outline:none;',
    'border-color:rgba(245,197,24,.5);background:rgba(255,255,255,.06);}',
    '.lm-select{-webkit-appearance:none;appearance:none;',
    'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23888\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E");',
    'background-repeat:no-repeat;background-position:right .9rem center;',
    'padding-right:2.5rem;cursor:pointer;}',
    '.lm-select option{background:#1a1a1a;}',
    '.lm-textarea{resize:vertical;min-height:100px;}',

    '.lm-grid2{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}',
    '@media(max-width:500px){.lm-grid2{grid-template-columns:1fr;}}',

    '.lm-submit{width:100%;background:linear-gradient(135deg,#f5c518 0%,#e6b800 100%);',
    'color:#0a0a0a;border:none;border-radius:12px;padding:.85rem;',
    'font-size:.9rem;font-weight:800;letter-spacing:.02em;cursor:pointer;',
    'font-family:inherit;transition:opacity .2s,transform .1s;margin-top:.5rem;}',
    '.lm-submit:hover{opacity:.9;transform:translateY(-1px);}',

    '.lm-ccpa-success{text-align:center;padding:2.5rem 1rem;display:none;}',
    '.lm-ccpa-success.show{display:block;}',
    '.lm-ccpa-form.hidden{display:none;}',
    '.lm-success-icon{font-size:2.5rem;margin-bottom:.75rem;}',
    '.lm-success-title{font-size:1.2rem;font-weight:800;color:#f0f0f0;margin-bottom:.5rem;}',
    '.lm-success-title span{color:#f5c518;}',
    '.lm-success-desc{font-size:.875rem;color:rgba(240,240,240,.55);}',
    '.lm-back-btn{display:inline-block;margin-top:1rem;padding:.65rem 1.5rem;',
    'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);',
    'border-radius:10px;color:#f0f0f0;font-size:.85rem;font-weight:600;',
    'cursor:pointer;font-family:inherit;transition:background .2s;}',
    '.lm-back-btn:hover{background:rgba(255,255,255,.1);}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── State options ─────────────────────────────────────────────────── */
  var stateList = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
    'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
    'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
    'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
    'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
    'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
    'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];
  var stateOpts = '<option value="">Select state\u2026</option>' +
    stateList.map(function(s){ return '<option>' + s + '</option>'; }).join('');

  /* ── HTML ──────────────────────────────────────────────────────────── */
  var modalHTML = '<div class="lm-overlay" id="legalModal">' +
    '<div class="lm-modal" id="lmModalBox">' +
      '<button class="lm-close" id="lmCloseBtn">\u2715</button>' +
      '<div class="lm-header">' +
        '<div class="lm-badge" id="lmBadge">Legal</div>' +
        '<h2 class="lm-title" id="lmTitle"></h2>' +
      '</div>' +
      '<div class="lm-body" id="lmBody">' +

        /* TERMS */
        '<div class="lm-doc" id="lm-terms" style="display:none">' +
          '<p class="lm-doc-meta">Last updated: 2026</p>' +
          '<h3>Agreement</h3>' +
          '<p>EPCVIP, Inc. operates this website and conditions access on acceptance of all stated terms, conditions, policies and notices. These Terms contain <strong>legal obligations including limitations on liability, arbitration provisions, and a class action waiver.</strong> By accessing the site you acknowledge reading and agreeing to be bound by these terms and the Privacy Policy.</p>' +
          '<h3>Modification</h3>' +
          '<p>EPCVIP reserves the right to change these terms at any time. Revised Terms will take effect <strong>seven (7) days</strong> after publication. Material changes trigger email notification, and continued use constitutes acceptance.</p>' +
          '<h3>License</h3>' +
          '<p>Users receive a <strong>limited, non-exclusive, non-transferable, non-sublicensable, and revocable license</strong> for personal or internal business use only. Prohibited activities include copying, reproducing, modifying, reverse engineering, or commercially exploiting the website.</p>' +
          '<h3>Copyrights &amp; Trademark</h3>' +
          '<p>All website content is owned and controlled by EPCVIP or its licensors. You may not reproduce, modify, or distribute content without <strong>express prior written consent</strong> of EPCVIP. Trademark use without permission is prohibited.</p>' +
          '<h3>Affiliate Program</h3>' +
          '<p>An Affiliate relationship is only created once you sign an EPCVIP Affiliate Agreement. Affiliate Agreement terms supersede these terms where conflicts arise.</p>' +
          '<h3>Representations &amp; Warranties</h3>' +
          '<p>By using this site you represent that you are:</p>' +
          '<ul><li>At least 18 years of age</li><li>Authorized to enter this agreement</li><li>Not in violation of any applicable laws</li><li>Providing truthful and accurate information</li></ul>' +
          '<h3>Warranty Disclaimers</h3>' +
          '<p>EPCVIP DOES NOT WARRANT, GUARANTEE OR MAKE REPRESENTATIONS REGARDING YOUR USE regarding availability, accuracy, or reliability. The site is provided <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> without warranties of any kind.</p>' +
          '<h3>Limitation of Liability</h3>' +
          '<p>EPCVIP will not be liable for indirect, incidental, or consequential damages. <strong>Total liability for any reason shall not exceed $100.00 USD.</strong></p>' +
          '<h3>Indemnification</h3>' +
          '<p>You agree to defend and hold harmless EPCVIP and related parties from any breach of these terms, inaccurate information provided, unauthorized use, and any resulting damages or expenses.</p>' +
          '<h3>Binding Arbitration</h3>' +
          '<p>Disputes proceed through binding arbitration under American Arbitration Association rules in <strong>Los Angeles, California</strong>. Discovery completes within 60 days. Decisions are final and binding.</p>' +
          '<h3>No Class Action</h3>' +
          '<p>You and EPCVIP waive rights to class-wide litigation or representative proceedings. <strong>Claims may only be brought in an individual capacity.</strong></p>' +
          '<h3>Governing Law</h3>' +
          '<p>This agreement is governed by the laws of California. Los Angeles County courts have exclusive jurisdiction. All claims must be brought within one year.</p>' +
          '<h3>DMCA Notice</h3>' +
          '<p>Copyright infringement claims: EPCVIP, 26610 Agoura Rd, Suite 209, Calabasas, CA 91302 or <a href="mailto:info@epcvip.com">info@epcvip.com</a>.</p>' +
          '<h3>Termination</h3>' +
          '<p>EPCVIP reserves the right to terminate the agreement for reasonable grounds including fraud, illegal activity, or violations of any term.</p>' +
          '<h3>California Consumer Notice</h3>' +
          '<p>California residents may file complaints with the California Department of Consumer Affairs at 400 R Street, Suite 1080, Sacramento, CA 95814.</p>' +
          '<h3>Contact</h3>' +
          '<p>Questions? Contact us at <a href="mailto:info@epcvip.com">info@epcvip.com</a>.</p>' +
        '</div>' +

        /* PRIVACY */
        '<div class="lm-doc" id="lm-privacy" style="display:none">' +
          '<p class="lm-doc-meta">Last updated: 2026</p>' +
          '<h3>Overview</h3>' +
          '<p>EPCVIP, Inc. respects user privacy and requires visitors to review this policy. This policy may change at our sole discretion. By accessing the website you accept its terms.</p>' +
          '<h3>Information We Collect</h3>' +
          '<p>We gather two main categories of information:</p>' +
          '<ul><li><strong>Personally Identifiable Information (PII):</strong> Name, address, phone number, Social Security Number, email address, date of birth, driver\'s license, and bank details</li>' +
          '<li><strong>Non-PII:</strong> IP addresses, browser type, access times, and cookies used to track browsing patterns and improve your experience</li></ul>' +
          '<h3>How We Use Your Information</h3>' +
          '<p>Collected information supports:</p>' +
          '<ul><li>Service delivery and account management</li><li>Determining affiliate and advertiser eligibility</li><li>Tailored advertising and relevant offers</li><li>Statistical analysis and product improvement</li><li>Enforcement of our terms and legal obligations</li></ul>' +
          '<h3>Information Sharing</h3>' +
          '<p>Generally, EPCVIP does not share your data without consent. We may disclose information <strong>to comply with court orders, laws, legal processes, and government or regulatory requests.</strong></p>' +
          '<h3>Security &amp; Retention</h3>' +
          '<p>We take commercially reasonable steps to protect your personal information. However, <strong>we cannot guarantee the security of information transmitted to and through this website.</strong> Data may be retained indefinitely in accordance with applicable law.</p>' +
          '<h3>California Rights (CCPA)</h3>' +
          '<p>California residents have the right to:</p>' +
          '<ul><li>Request to know what personal data we have collected</li><li>Request deletion of your personal information</li><li>Opt out of the sale of your personal information</li></ul>' +
          '<p>Submit requests to <a href="mailto:info@epcvip.com">info@epcvip.com</a> with subject line "CCPA Right to Know," "CCPA Delete," or "CCPA Opt-Out."</p>' +
          '<h3>Contact</h3>' +
          '<p>Questions? Contact us at <a href="mailto:info@epcvip.com">info@epcvip.com</a>.</p>' +
        '</div>' +

        /* SECURITY */
        '<div class="lm-doc" id="lm-security" style="display:none">' +
          '<p class="lm-doc-meta">Last updated: 2026</p>' +
          '<h3>Our Mission</h3>' +
          '<p>EPCVIP restores trust in internet business by enabling companies to <strong>prove and improve their security and compliance posture</strong> to their customers, prospects, and partners.</p>' +
          '<h3>Data Security</h3>' +
          '<p>We encrypt information <strong>both at rest and during transmission</strong> across all client accounts. We utilize AWS Key Management System (KMS) paired with hardware security modules for encryption key administration, adhering to established industry standards.</p>' +
          '<h3>Application Security</h3>' +
          '<p>EPCVIP engages third-party security specialists to conduct <strong>regular penetration assessments</strong>, examining source code, live applications, and production environments.</p>' +
          '<p>We also implement automated security analysis through <strong>GitHub Advanced Security</strong> tools — including CodeQL, Secrets Scanner, and Dependabot — throughout the development lifecycle.</p>' +
          '<h3>Infrastructure Security</h3>' +
          '<p>Our platform operates on <strong>Amazon Web Services</strong> infrastructure, leveraging embedded security features such as KMS, GuardDuty, and Inspector.</p>' +
          '<p>Applications are containerized and run on AWS managed services, eliminating direct server management and reducing attack surface.</p>' +
          '<h3>Report a Concern</h3>' +
          '<p>To report a security vulnerability, please see our <strong>Responsible Disclosure</strong> policy or contact <a href="mailto:admin@epcvip.com">admin@epcvip.com</a>.</p>' +
        '</div>' +

        /* RESPONSIBLE DISCLOSURE */
        '<div class="lm-doc" id="lm-disclosure" style="display:none">' +
          '<p class="lm-doc-meta">Last updated: January 11, 2023</p>' +
          '<h3>Overview</h3>' +
          '<p>Data security is a top priority for EPCVIP. We believe that <strong>working with skilled security researchers</strong> can identify weaknesses in any technology. If you\'ve discovered a vulnerability, we want to hear from you.</p>' +
          '<h3>How to Report</h3>' +
          '<p>Contact us at <a href="mailto:admin@epcvip.com">admin@epcvip.com</a>. We commit to:</p>' +
          '<ul><li>Acknowledging your report within <strong>one week</strong></li><li>Resolving critical issues within <strong>ten business days</strong></li><li>Working collaboratively with researchers in good faith</li></ul>' +
          '<h3>Researcher Guidelines</h3>' +
          '<p>We ask that researchers:</p>' +
          '<ul><li>Make a good faith effort to avoid violating privacy or destroying data</li><li>Avoid interrupting or degrading the EPCVIP service</li><li>Only test systems they own or have explicit permission to access</li><li>Not publicly disclose vulnerabilities before we have had a chance to address them</li></ul>' +
          '<h3>Prohibited Activities</h3>' +
          '<p>The following actions will result in immediate deactivation and potential legal action:</p>' +
          '<ul><li>Denial-of-Service (DoS) attacks of any kind</li><li>Spamming or unsolicited messaging</li><li>Social engineering or phishing targeting EPCVIP staff or contractors</li><li>Attacks on physical infrastructure or data centers</li></ul>' +
          '<h3>Contact</h3>' +
          '<p>Questions? Reach us at <a href="mailto:admin@epcvip.com">admin@epcvip.com</a>.</p>' +
        '</div>' +

        /* CCPA REQUEST */
        '<div id="lm-ccpa" style="display:none">' +
          '<p class="lm-form-intro">In accordance with the California Consumer Privacy Act (CCPA), please complete the form below so we can verify your identity prior to releasing any information. It is our responsibility to confirm that the consumer making this request is the same consumer about whom we have collected Personal Information.</p>' +
          '<div class="lm-ccpa-form" id="lmCcpaForm">' +
            '<form id="lmCcpaFormEl">' +
              '<div class="lm-grid2">' +
                '<div class="lm-fg"><label class="lm-label" for="lmCcpaFirst">First Name <span>*</span></label><input class="lm-input" id="lmCcpaFirst" type="text" placeholder="Jane" required /></div>' +
                '<div class="lm-fg"><label class="lm-label" for="lmCcpaLast">Last Name <span>*</span></label><input class="lm-input" id="lmCcpaLast" type="text" placeholder="Smith" required /></div>' +
              '</div>' +
              '<div class="lm-fg"><label class="lm-label" for="lmCcpaEmail">Email Address <span>*</span></label><input class="lm-input" id="lmCcpaEmail" type="email" placeholder="jane@example.com" required /></div>' +
              '<div class="lm-fg"><label class="lm-label" for="lmCcpaPhone">Phone Number <span>*</span></label><input class="lm-input" id="lmCcpaPhone" type="tel" placeholder="000-000-0000" maxlength="12" required /></div>' +
              '<div class="lm-fg"><label class="lm-label" for="lmCcpaAddress">Home Address <span>*</span></label><input class="lm-input" id="lmCcpaAddress" type="text" placeholder="123 Main Street" required /></div>' +
              '<div class="lm-grid2">' +
                '<div class="lm-fg"><label class="lm-label" for="lmCcpaPostal">Postal Code <span>*</span></label><input class="lm-input" id="lmCcpaPostal" type="text" placeholder="90001" required /></div>' +
                '<div class="lm-fg"><label class="lm-label" for="lmCcpaState">State <span>*</span></label><select class="lm-select" id="lmCcpaState" required>' + stateOpts + '</select></div>' +
              '</div>' +
              '<div class="lm-fg"><label class="lm-label" for="lmCcpaLicense">Driver\'s License Number <span>*</span></label><input class="lm-input" id="lmCcpaLicense" type="text" placeholder="License number" required /></div>' +
              '<div class="lm-fg"><label class="lm-label" for="lmCcpaSsn">Last Four Digits of SSN <span>*</span></label><input class="lm-input" id="lmCcpaSsn" type="text" placeholder="XXXX" maxlength="4" pattern="[0-9]{4}" required /></div>' +
              '<div class="lm-fg"><label class="lm-label" for="lmCcpaDesc">Request Description <span>*</span></label><textarea class="lm-textarea" id="lmCcpaDesc" placeholder="Please describe what right you want to exercise and the information to which your request relates\u2026" required></textarea></div>' +
              '<button class="lm-submit" type="submit">Submit CCPA Request \u2192</button>' +
            '</form>' +
          '</div>' +
          '<div class="lm-ccpa-success" id="lmCcpaSuccess">' +
            '<div class="lm-success-icon">\u2705</div>' +
            '<div class="lm-success-title">Request <span>Submitted</span></div>' +
            '<p class="lm-success-desc">Your CCPA request has been received. We will verify your identity and respond within 45 days as required by California law.</p>' +
            '<button class="lm-back-btn" onclick="closeLegalModal()">Close</button>' +
          '</div>' +
        '</div>' +

      '</div>' + /* lm-body */
    '</div>' +   /* lm-modal */
  '</div>';      /* lm-overlay */

  var wrapper = document.createElement('div');
  wrapper.innerHTML = modalHTML;
  document.body.appendChild(wrapper);

  /* ── Logic ─────────────────────────────────────────────────────────── */
  var TITLES = {
    terms:      'Terms & Conditions',
    privacy:    'Privacy Policy',
    security:   'Security',
    disclosure: 'Responsible Disclosure',
    ccpa:       'CCPA Request'
  };
  var BADGES = {
    terms:      'Legal',
    privacy:    'Legal',
    security:   'Security',
    disclosure: 'Security',
    ccpa:       'California Privacy'
  };

  window.openLegalModal = function (page) {
    ['terms', 'privacy', 'security', 'disclosure', 'ccpa'].forEach(function (id) {
      document.getElementById('lm-' + id).style.display = 'none';
    });
    document.getElementById('lm-' + page).style.display = 'block';
    document.getElementById('lmTitle').textContent = TITLES[page];
    document.getElementById('lmBadge').textContent = BADGES[page];
    document.getElementById('legalModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('lmBody').scrollTop = 0;
  };

  window.closeLegalModal = function () {
    document.getElementById('legalModal').classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      var form = document.getElementById('lmCcpaFormEl');
      if (form) form.reset();
      var formWrap = document.getElementById('lmCcpaForm');
      if (formWrap) formWrap.classList.remove('hidden');
      var success = document.getElementById('lmCcpaSuccess');
      if (success) success.classList.remove('show');
    }, 400);
  };

  document.getElementById('legalModal').addEventListener('click', function (e) {
    if (e.target === this) window.closeLegalModal();
  });

  document.getElementById('lmCloseBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    window.closeLegalModal();
  });

  document.getElementById('lmCcpaFormEl').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('lmCcpaForm').classList.add('hidden');
    document.getElementById('lmCcpaSuccess').classList.add('show');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('legalModal').classList.contains('open')) {
      window.closeLegalModal();
    }
  });

})();
