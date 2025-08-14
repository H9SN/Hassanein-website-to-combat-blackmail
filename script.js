// متغيرات عامة
const CORRECT_PASSWORD = "313.313.313";
let currentSection = null;
let isGhostMode = false;
let activityLog = [];
let isRecording = false;
let mediaRecorder = null;
let recordedChunks = [];

// عناصر DOM
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const ghostModeBtn = document.getElementById('ghostModeBtn');
const ghostMode = document.getElementById('ghostMode');
const exitGhostModeBtn = document.getElementById('exitGhostMode');
const sectionsContainer = document.getElementById('sectionsContainer');
const sectionCards = document.querySelectorAll('.section-card');

// الأصوات
const successSound = document.getElementById('successSound');
const errorSound = document.getElementById('errorSound');

// تسجيل الدخول
function initializeLogin() {
    loginBtn.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // التركيز على حقل كلمة المرور
    passwordInput.focus();
}

function handleLogin() {
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === CORRECT_PASSWORD) {
        playSound('success');
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        logActivity('تم تسجيل الدخول بنجاح');
        passwordInput.value = '';
        loginError.style.display = 'none';
    } else {
        playSound('error');
        loginError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        // إخفاء رسالة الخطأ بعد 3 ثوان
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
}

// وضع الشبح
function initializeGhostMode() {
    ghostModeBtn.addEventListener('click', toggleGhostMode);
    exitGhostModeBtn.addEventListener('click', exitGhostMode);
}

function toggleGhostMode() {
    if (!isGhostMode) {
        ghostMode.style.display = 'flex';
        isGhostMode = true;
        logActivity('تم تفعيل وضع الشبح');
        playSound('success');
    }
}

function exitGhostMode() {
    ghostMode.style.display = 'none';
    isGhostMode = false;
    logActivity('تم إلغاء وضع الشبح');
    playSound('success');
}

// إدارة الأقسام
function initializeSections() {
    sectionCards.forEach(card => {
        card.addEventListener('click', () => {
            const sectionName = card.getAttribute('data-section');
            openSection(sectionName);
        });
    });
}

function openSection(sectionName) {
    currentSection = sectionName;
    
    // إخفاء الواجهة الرئيسية
    document.querySelector('.main-content').style.display = 'none';
    sectionsContainer.style.display = 'block';
    
    // تحميل محتوى القسم
    loadSectionContent(sectionName);
    logActivity(`تم فتح قسم: ${getSectionTitle(sectionName)}`);
}

function getSectionTitle(sectionName) {
    const titles = {
        'awareness': 'التوعية والوقاية',
        'evidence': 'توثيق الأدلة',
        'support': 'الدعم والإبلاغ',
        'tools': 'أدوات مساعدة',
        'logs': 'سجل الإجراءات',
        'settings': 'الإعدادات'
    };
    return titles[sectionName] || sectionName;
}

function loadSectionContent(sectionName) {
    let content = '';
    
    switch(sectionName) {
        case 'awareness':
            content = createAwarenessSection();
            break;
        case 'evidence':
            content = createEvidenceSection();
            break;
        case 'support':
            content = createSupportSection();
            break;
        case 'tools':
            content = createToolsSection();
            break;
        case 'logs':
            content = createLogsSection();
            break;
        case 'settings':
            content = createSettingsSection();
            break;
        default:
            content = '<div class="section-content"><h2>القسم قيد التطوير</h2></div>';
    }
    
    sectionsContainer.innerHTML = content + createBackButton();
    
    // إضافة مستمعي الأحداث للقسم الجديد
    initializeSectionEvents(sectionName);
}

function createBackButton() {
    return `
        <div class="back-button-container">
            <button id="backBtn" class="back-btn">
                <span>←</span> العودة للقائمة الرئيسية
            </button>
        </div>
    `;
}

function initializeSectionEvents(sectionName) {
    // زر العودة
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            sectionsContainer.style.display = 'none';
            document.querySelector('.main-content').style.display = 'block';
            currentSection = null;
        });
    }
    
    // أحداث خاصة بكل قسم
    switch(sectionName) {
        case 'evidence':
            initializeEvidenceEvents();
            break;
        case 'support':
            initializeSupportEvents();
            break;
        case 'tools':
            initializeToolsEvents();
            break;
        case 'settings':
            initializeSettingsEvents();
            break;
    }
}

// قسم التوعية والوقاية
function createAwarenessSection() {
    return `
        <div class="section-content awareness-section">
            <div class="section-header">
                <h2>🛡️ التوعية والوقاية</h2>
                <p>دليلك الشامل للحماية من الابتزاز الإلكتروني</p>
            </div>
            
            <div class="awareness-grid">
                <div class="awareness-card">
                    <h3>🔐 تأمين الحسابات</h3>
                    <div class="card-content">
                        <h4>المصادقة الثنائية (2FA)</h4>
                        <p>المصادقة الثنائية هي طبقة حماية إضافية تجعل اختراق حساباتك شبه مستحيل حتى لو سُرقت كلمة المرور.</p>
                        
                        <h5>كيفية تفعيلها:</h5>
                        <ul>
                            <li><strong>فيسبوك:</strong> الإعدادات → الأمان وتسجيل الدخول → المصادقة الثنائية</li>
                            <li><strong>انستغرام:</strong> الإعدادات → الأمان → المصادقة الثنائية</li>
                            <li><strong>تيك توك:</strong> الإعدادات والخصوصية → الأمان → التحقق بخطوتين</li>
                            <li><strong>واتساب:</strong> الإعدادات → الحساب → التحقق بخطوتين</li>
                        </ul>
                        
                        <h4>كلمات المرور القوية</h4>
                        <ul>
                            <li>استخدم 12 حرف على الأقل</li>
                            <li>امزج بين الأحرف الكبيرة والصغيرة والأرقام والرموز</li>
                            <li>تجنب المعلومات الشخصية (الاسم، تاريخ الميلاد)</li>
                            <li>استخدم كلمة مرور مختلفة لكل حساب</li>
                        </ul>
                    </div>
                </div>
                
                <div class="awareness-card">
                    <h3>🎣 التعرف على التصيد</h3>
                    <div class="card-content">
                        <h4>علامات التحذير:</h4>
                        <ul>
                            <li>رسائل تطلب معلومات شخصية أو كلمات مرور</li>
                            <li>روابط مشبوهة من مرسلين غير معروفين</li>
                            <li>رسائل تدعي وجود مشكلة في حسابك</li>
                            <li>عروض مغرية جداً أو جوائز وهمية</li>
                        </ul>
                        
                        <h4>كيفية التحقق من الروابط:</h4>
                        <ul>
                            <li>مرر الماوس فوق الرابط لرؤية العنوان الحقيقي</li>
                            <li>تحقق من صحة اسم الموقع</li>
                            <li>ابحث عن شهادة الأمان (https://)</li>
                            <li>عند الشك، لا تضغط على الرابط</li>
                        </ul>
                    </div>
                </div>
                
                <div class="awareness-card">
                    <h3>🔒 إعدادات الخصوصية</h3>
                    <div class="card-content">
                        <h4>فيسبوك:</h4>
                        <ul>
                            <li>الإعدادات → الخصوصية → من يمكنه رؤية منشوراتك</li>
                            <li>قم بتقييد من يمكنه إرسال طلبات صداقة</li>
                            <li>أخف قائمة الأصدقاء عن العامة</li>
                        </ul>
                        
                        <h4>انستغرام:</h4>
                        <ul>
                            <li>اجعل حسابك خاصاً</li>
                            <li>قيد من يمكنه إرسال رسائل مباشرة</li>
                            <li>أخف حالة النشاط</li>
                        </ul>
                        
                        <h4>تيك توك:</h4>
                        <ul>
                            <li>اجعل حسابك خاصاً</li>
                            <li>قيد من يمكنه إرسال رسائل</li>
                            <li>أخف معلومات الموقع</li>
                        </ul>
                    </div>
                </div>
                
                <div class="awareness-card">
                    <h3>⚠️ علامات الابتزاز</h3>
                    <div class="card-content">
                        <h4>كيف يبدأ الابتزاز:</h4>
                        <ul>
                            <li>طلبات صداقة من حسابات وهمية جذابة</li>
                            <li>محادثات ودية تتطور بسرعة</li>
                            <li>طلبات لصور شخصية أو فيديوهات</li>
                            <li>ادعاءات بالحب السريع</li>
                        </ul>
                        
                        <h4>عند التعرض للابتزاز:</h4>
                        <ul>
                            <li><strong>لا تدفع أي أموال</strong> - هذا يزيد الطلبات</li>
                            <li><strong>لا تحذف الأدلة</strong> - احتفظ بكل شيء</li>
                            <li><strong>أبلغ فوراً</strong> - اتصل بالشرطة المجتمعية 497</li>
                            <li><strong>اطلب المساعدة</strong> - تحدث مع أشخاص تثق بهم</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// قسم توثيق الأدلة (محدث للويب)
function createEvidenceSection() {
    return `
        <div class="section-content evidence-section">
            <div class="section-header">
                <h2>📹 توثيق الأدلة</h2>
                <p>سجل واحفظ الأدلة بشكل آمن</p>
            </div>
            
            <div class="evidence-tools">
                <div class="tool-card">
                    <h3>📸 تسجيل الشاشة</h3>
                    <p>التقط صور أو سجل فيديو للشاشة (يتطلب إذن المتصفح)</p>
                    <div class="tool-buttons">
                        <button id="screenshotBtn" class="tool-btn">التقاط صورة</button>
                        <button id="recordBtn" class="tool-btn">تسجيل فيديو</button>
                        <button id="stopRecordBtn" class="tool-btn" style="display: none;">إيقاف التسجيل</button>
                    </div>
                    <div class="web-note">
                        <p><strong>ملاحظة:</strong> تسجيل الشاشة في المتصفح يتطلب إذن منك. سيطلب المتصفح اختيار الشاشة أو النافذة المراد تسجيلها.</p>
                    </div>
                </div>
                
                <div class="tool-card">
                    <h3>💾 إدارة الأدلة</h3>
                    <p>عرض وإدارة الأدلة المحفوظة محلياً</p>
                    <div class="tool-buttons">
                        <button id="viewEvidenceBtn" class="tool-btn">عرض الأدلة</button>
                        <button id="addNoteBtn" class="tool-btn">إضافة ملاحظة</button>
                        <button id="exportEvidenceBtn" class="tool-btn">تصدير الأدلة</button>
                    </div>
                </div>
                
                <div class="tool-card">
                    <h3>📋 نصائح للتوثيق</h3>
                    <div class="tips-content">
                        <ul>
                            <li>احتفظ بلقطات شاشة للمحادثات كاملة</li>
                            <li>سجل تاريخ ووقت كل دليل</li>
                            <li>احفظ معلومات الحساب المبتز (اسم المستخدم، الرابط)</li>
                            <li>لا تحذف أي محادثات أو رسائل</li>
                            <li>اطبع الأدلة المهمة على الورق كنسخة احتياطية</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div id="evidenceViewer" class="evidence-viewer" style="display: none;">
                <h3>الأدلة المحفوظة</h3>
                <div id="evidenceList" class="evidence-list">
                    <!-- سيتم إضافة الأدلة هنا -->
                </div>
            </div>
            
            <div id="recordingStatus" class="recording-status" style="display: none;">
                <div class="status-indicator">
                    <span class="recording-dot"></span>
                    <span>جاري التسجيل...</span>
                    <span id="recordingTime">00:00</span>
                </div>
            </div>
        </div>
    `;
}

// قسم الدعم والإبلاغ
function createSupportSection() {
    return `
        <div class="section-content support-section">
            <div class="section-header">
                <h2>📞 الدعم والإبلاغ</h2>
                <p>تواصل مع الجهات المختصة واحصل على المساعدة</p>
            </div>
            
            <div class="support-grid">
                <div class="emergency-card urgent">
                    <h3>🚨 أرقام الطوارئ</h3>
                    <div class="emergency-numbers">
                        <div class="emergency-item">
                            <span class="number">497</span>
                            <span class="label">الشرطة المجتمعية</span>
                            <button class="call-btn" onclick="window.open('tel:497')">اتصال</button>
                        </div>
                        <div class="emergency-item">
                            <span class="number">131</span>
                            <span class="label">جهاز الأمن الوطني</span>
                            <button class="call-btn" onclick="window.open('tel:131')">اتصال</button>
                        </div>
                    </div>
                    <p class="privacy-note">🔒 هويتك ستبقى سرية تماماً</p>
                </div>
                
                <div class="support-card">
                    <h3>📝 نموذج البلاغ</h3>
                    <p>اعد بلاغك بشكل منظم قبل التواصل مع السلطات</p>
                    <button id="reportFormBtn" class="support-btn">إعداد البلاغ</button>
                </div>
                
                <div class="support-card">
                    <h3>💚 الدعم النفسي</h3>
                    <p>جهات تقدم الدعم النفسي والاجتماعي</p>
                    <div class="support-contacts">
                        <div class="contact-item">
                            <strong>الهلال الأحمر العراقي</strong>
                            <p>خدمات الدعم النفسي</p>
                        </div>
                        <div class="contact-item">
                            <strong>منظمة الأمل العراقية</strong>
                            <p>دعم الفئات الضعيفة</p>
                        </div>
                        <div class="contact-item">
                            <strong>المنظمة الدولية للهجرة (IOM)</strong>
                            <p>برامج الصحة النفسية</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="reportForm" class="report-form" style="display: none;">
                <h3>📋 نموذج البلاغ</h3>
                <form id="reportFormData">
                    <div class="form-group">
                        <label>نوع الجريمة:</label>
                        <select id="crimeType">
                            <option value="blackmail">ابتزاز إلكتروني</option>
                            <option value="harassment">تحرش إلكتروني</option>
                            <option value="threats">تهديد</option>
                            <option value="fraud">احتيال إلكتروني</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>معلومات المبتز (إن وجدت):</label>
                        <textarea id="suspectInfo" placeholder="اسم المستخدم، رقم الهاتف، أي معلومات أخرى..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>تفاصيل الحادثة:</label>
                        <textarea id="incidentDetails" placeholder="اشرح ما حدث بالتفصيل..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>الأدلة المتوفرة:</label>
                        <textarea id="evidenceList" placeholder="اذكر الأدلة التي لديك (صور، رسائل، فيديوهات...)"></textarea>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="button" id="generateReportBtn" class="generate-btn">إنشاء البلاغ</button>
                        <button type="button" id="closeFormBtn" class="close-btn">إغلاق</button>
                    </div>
                </form>
                
                <div id="generatedReport" class="generated-report" style="display: none;">
                    <h4>البلاغ الجاهز:</h4>
                    <div id="reportContent" class="report-content"></div>
                    <div class="report-actions">
                        <button id="copyReportBtn" class="copy-btn">نسخ البلاغ</button>
                        <button id="downloadReportBtn" class="download-btn">تحميل كملف</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// قسم الأدوات المساعدة
function createToolsSection() {
    return `
        <div class="section-content tools-section">
            <div class="section-header">
                <h2>🔍 أدوات مساعدة</h2>
                <p>أدوات تحليل وتشفير لحماية معلوماتك</p>
            </div>
            
            <div class="tools-grid">
                <div class="tool-card">
                    <h3>🔐 تشفير النصوص</h3>
                    <p>شفر ملاحظاتك الحساسة</p>
                    <div class="encryption-tool">
                        <textarea id="textToEncrypt" placeholder="اكتب النص المراد تشفيره..."></textarea>
                        <div class="tool-buttons">
                            <button id="encryptBtn" class="tool-btn">تشفير</button>
                            <button id="decryptBtn" class="tool-btn">فك التشفير</button>
                            <button id="clearTextBtn" class="tool-btn">مسح</button>
                        </div>
                        <textarea id="encryptedResult" placeholder="النتيجة ستظهر هنا..." readonly></textarea>
                    </div>
                </div>
                
                <div class="tool-card">
                    <h3>🔗 فحص الروابط</h3>
                    <p>تحقق من أمان الروابط قبل فتحها</p>
                    <div class="link-checker">
                        <input type="url" id="linkToCheck" placeholder="الصق الرابط هنا...">
                        <button id="checkLinkBtn" class="tool-btn">فحص الرابط</button>
                        <div id="linkResult" class="link-result"></div>
                    </div>
                </div>
                
                <div class="tool-card">
                    <h3>🔍 تحليل الحسابات</h3>
                    <p>جمع معلومات عامة عن الحسابات المشبوهة</p>
                    <div class="account-analyzer">
                        <input type="text" id="usernameToAnalyze" placeholder="اسم المستخدم أو رابط الحساب...">
                        <button id="analyzeBtn" class="tool-btn">تحليل</button>
                        <div id="analysisResult" class="analysis-result"></div>
                    </div>
                </div>
                
                <div class="tool-card">
                    <h3>📱 مولد كلمات المرور</h3>
                    <p>إنشاء كلمات مرور قوية وآمنة</p>
                    <div class="password-generator">
                        <div class="generator-options">
                            <label><input type="checkbox" id="includeUppercase" checked> أحرف كبيرة</label>
                            <label><input type="checkbox" id="includeLowercase" checked> أحرف صغيرة</label>
                            <label><input type="checkbox" id="includeNumbers" checked> أرقام</label>
                            <label><input type="checkbox" id="includeSymbols" checked> رموز</label>
                            <label>الطول: <input type="range" id="passwordLength" min="8" max="32" value="16"> <span id="lengthValue">16</span></label>
                        </div>
                        <button id="generatePasswordBtn" class="tool-btn">إنشاء كلمة مرور</button>
                        <input type="text" id="generatedPassword" readonly placeholder="كلمة المرور المُنشأة ستظهر هنا...">
                        <button id="copyPasswordBtn" class="tool-btn" style="display: none;">نسخ</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// قسم سجل الإجراءات
function createLogsSection() {
    return `
        <div class="section-content logs-section">
            <div class="section-header">
                <h2>📋 سجل الإجراءات</h2>
                <p>تتبع جميع العمليات التي قمت بها</p>
            </div>
            
            <div class="logs-controls">
                <button id="clearLogsBtn" class="clear-btn">مسح السجل</button>
                <button id="exportLogsBtn" class="export-btn">تصدير السجل</button>
                <button id="refreshLogsBtn" class="refresh-btn">تحديث</button>
            </div>
            
            <div class="logs-container">
                <div id="activityLogs" class="activity-logs">
                    ${generateLogsHTML()}
                </div>
            </div>
        </div>
    `;
}

// قسم الإعدادات
function createSettingsSection() {
    return `
        <div class="section-content settings-section">
            <div class="section-header">
                <h2>⚙️ الإعدادات</h2>
                <p>تخصيص البرنامج حسب احتياجاتك</p>
            </div>
            
            <div class="settings-grid">
                <div class="setting-card">
                    <h3>👻 وضع الشبح</h3>
                    <p>إخفاء البرنامج بسرعة عند الحاجة</p>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" id="ghostModeToggle">
                            <span class="slider"></span>
                        </label>
                        <span>تفعيل الوضع التلقائي</span>
                    </div>
                </div>
                
                <div class="setting-card">
                    <h3>🔤 حجم الخط</h3>
                    <p>اضبط حجم الخط لسهولة القراءة</p>
                    <div class="setting-control">
                        <input type="range" id="fontSizeSlider" min="12" max="24" value="16">
                        <span id="fontSizeValue">16px</span>
                    </div>
                </div>
                
                <div class="setting-card">
                    <h3>🔊 الأصوات</h3>
                    <p>تفعيل أو إلغاء التنبيهات الصوتية</p>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" id="soundToggle" checked>
                            <span class="slider"></span>
                        </label>
                        <span>تفعيل الأصوات</span>
                    </div>
                </div>
                
                <div class="setting-card">
                    <h3>🌙 الوضع الليلي</h3>
                    <p>تبديل بين الوضع الليلي والنهاري</p>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" id="darkModeToggle" checked>
                            <span class="slider"></span>
                        </label>
                        <span>الوضع الليلي</span>
                    </div>
                </div>
                
                <div class="setting-card">
                    <h3>💾 البيانات المحلية</h3>
                    <p>إدارة البيانات المحفوظة محلياً</p>
                    <div class="setting-control">
                        <button id="clearDataBtn" class="clear-data-btn">مسح جميع البيانات</button>
                        <button id="exportDataBtn" class="export-data-btn">تصدير البيانات</button>
                    </div>
                </div>
                
                <div class="setting-card">
                    <h3>🔄 إعادة تعيين</h3>
                    <p>إعادة تعيين جميع الإعدادات للوضع الافتراضي</p>
                    <button id="resetSettingsBtn" class="reset-btn">إعادة تعيين</button>
                </div>
            </div>
        </div>
    `;
}

// وظائف مساعدة
function playSound(type) {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && !soundToggle.checked) return;
    
    try {
        if (type === 'success' && successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => console.log('Could not play success sound'));
        } else if (type === 'error' && errorSound) {
            errorSound.currentTime = 0;
            errorSound.play().catch(e => console.log('Could not play error sound'));
        }
    } catch (e) {
        console.log('Audio playback failed:', e);
    }
}

function logActivity(activity) {
    const timestamp = new Date().toLocaleString('ar-IQ');
    activityLog.push({
        timestamp: timestamp,
        activity: activity
    });
    
    // الاحتفاظ بآخر 100 نشاط فقط
    if (activityLog.length > 100) {
        activityLog.shift();
    }
    
    // حفظ في localStorage
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function generateLogsHTML() {
    if (activityLog.length === 0) {
        return '<div class="no-logs">لا توجد أنشطة مسجلة بعد</div>';
    }
    
    return activityLog.map(log => `
        <div class="log-entry">
            <span class="log-time">${log.timestamp}</span>
            <span class="log-activity">${log.activity}</span>
        </div>
    `).reverse().join('');
}

// تهيئة الأحداث الخاصة بالأقسام
function initializeEvidenceEvents() {
    const screenshotBtn = document.getElementById('screenshotBtn');
    const recordBtn = document.getElementById('recordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const viewEvidenceBtn = document.getElementById('viewEvidenceBtn');
    const exportEvidenceBtn = document.getElementById('exportEvidenceBtn');
    
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', takeScreenshot);
    }
    
    if (recordBtn) {
        recordBtn.addEventListener('click', startRecording);
    }
    
    if (stopRecordBtn) {
        stopRecordBtn.addEventListener('click', stopRecording);
    }
    
    if (viewEvidenceBtn) {
        viewEvidenceBtn.addEventListener('click', viewEvidence);
    }
    
    if (exportEvidenceBtn) {
        exportEvidenceBtn.addEventListener('click', exportEvidence);
    }
}

function initializeSupportEvents() {
    const reportFormBtn = document.getElementById('reportFormBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const copyReportBtn = document.getElementById('copyReportBtn');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    
    if (reportFormBtn) {
        reportFormBtn.addEventListener('click', () => {
            document.getElementById('reportForm').style.display = 'block';
        });
    }
    
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', () => {
            document.getElementById('reportForm').style.display = 'none';
        });
    }
    
    if (copyReportBtn) {
        copyReportBtn.addEventListener('click', copyReport);
    }
    
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', downloadReport);
    }
}

function initializeToolsEvents() {
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const clearTextBtn = document.getElementById('clearTextBtn');
    const checkLinkBtn = document.getElementById('checkLinkBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    
    if (encryptBtn) {
        encryptBtn.addEventListener('click', encryptText);
    }
    
    if (decryptBtn) {
        decryptBtn.addEventListener('click', decryptText);
    }
    
    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', clearText);
    }
    
    if (checkLinkBtn) {
        checkLinkBtn.addEventListener('click', checkLink);
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeAccount);
    }
    
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', generatePassword);
    }
    
    if (copyPasswordBtn) {
        copyPasswordBtn.addEventListener('click', copyPassword);
    }
    
    if (passwordLength && lengthValue) {
        passwordLength.addEventListener('input', (e) => {
            lengthValue.textContent = e.target.value;
        });
    }
}

function initializeSettingsEvents() {
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            fontSizeValue.textContent = size + 'px';
            document.body.style.fontSize = size + 'px';
            logActivity(`تم تغيير حجم الخط إلى ${size}px`);
        });
    }
    
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', resetSettings);
    }
    
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportAllData);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
}

// وظائف توثيق الأدلة (محدثة للويب)
async function takeScreenshot() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' }
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.addEventListener('loadedmetadata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // إضافة علامة مائية
            addWatermark(ctx, canvas.width, canvas.height);
            
            // تحويل إلى blob وحفظ
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `screenshot_${new Date().getTime()}.png`;
                a.click();
                
                logActivity('تم التقاط صورة للشاشة');
                playSound('success');
            });
            
            // إيقاف التدفق
            stream.getTracks().forEach(track => track.stop());
        });
        
    } catch (error) {
        console.error('Error taking screenshot:', error);
        alert('فشل في التقاط الصورة. تأكد من منح الإذن للمتصفح.');
        playSound('error');
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });
        
        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recording_${new Date().getTime()}.webm`;
            a.click();
            
            logActivity('تم حفظ تسجيل الشاشة');
            playSound('success');
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        // إظهار حالة التسجيل
        document.getElementById('recordingStatus').style.display = 'block';
        document.getElementById('recordBtn').style.display = 'none';
        document.getElementById('stopRecordBtn').style.display = 'inline-block';
        
        logActivity('تم بدء تسجيل الشاشة');
        playSound('success');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        alert('فشل في بدء التسجيل. تأكد من منح الإذن للمتصفح.');
        playSound('error');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // إخفاء حالة التسجيل
        document.getElementById('recordingStatus').style.display = 'none';
        document.getElementById('recordBtn').style.display = 'inline-block';
        document.getElementById('stopRecordBtn').style.display = 'none';
        
        logActivity('تم إيقاف تسجيل الشاشة');
    }
}

function addWatermark(ctx, width, height) {
    const now = new Date();
    const timestamp = now.toLocaleString('ar-IQ');
    
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    
    const text = `درع العراق الرقمي - ${timestamp}`;
    const textWidth = ctx.measureText(text).width;
    
    const x = width - textWidth - 20;
    const y = height - 30;
    
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}

function viewEvidence() {
    const evidenceViewer = document.getElementById('evidenceViewer');
    if (evidenceViewer) {
        evidenceViewer.style.display = evidenceViewer.style.display === 'none' ? 'block' : 'none';
        logActivity('تم عرض قائمة الأدلة');
    }
}

function exportEvidence() {
    const evidenceData = {
        logs: activityLog,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(evidenceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence_export_${new Date().getTime()}.json`;
    a.click();
    
    logActivity('تم تصدير الأدلة');
    playSound('success');
}

// وظائف الدعم والإبلاغ
function generateReport() {
    const crimeType = document.getElementById('crimeType').value;
    const suspectInfo = document.getElementById('suspectInfo').value;
    const incidentDetails = document.getElementById('incidentDetails').value;
    const evidenceList = document.getElementById('evidenceList').value;
    
    const crimeTypes = {
        'blackmail': 'ابتزاز إلكتروني',
        'harassment': 'تحرش إلكتروني',
        'threats': 'تهديد',
        'fraud': 'احتيال إلكتروني'
    };
    
    const reportContent = `
بلاغ جريمة إلكترونية
====================

تاريخ البلاغ: ${new Date().toLocaleString('ar-IQ')}
نوع الجريمة: ${crimeTypes[crimeType]}

معلومات المشتبه به:
${suspectInfo || 'غير متوفرة'}

تفاصيل الحادثة:
${incidentDetails || 'غير محددة'}

الأدلة المتوفرة:
${evidenceList || 'لا توجد أدلة مذكورة'}

ملاحظات:
- تم إعداد هذا البلاغ باستخدام درع العراق الرقمي
- جميع المعلومات المذكورة صحيحة حسب علم المُبلّغ
- يرجى التعامل مع هذا البلاغ بسرية تامة

للتواصل:
الشرطة المجتمعية: 497
جهاز الأمن الوطني: 131
    `;
    
    document.getElementById('reportContent').textContent = reportContent;
    document.getElementById('generatedReport').style.display = 'block';
    
    logActivity('تم إنشاء بلاغ جديد');
    playSound('success');
}

function copyReport() {
    const reportContent = document.getElementById('reportContent').textContent;
    navigator.clipboard.writeText(reportContent).then(() => {
        alert('تم نسخ البلاغ إلى الحافظة');
        logActivity('تم نسخ البلاغ');
        playSound('success');
    }).catch(() => {
        alert('فشل في نسخ البلاغ');
        playSound('error');
    });
}

function downloadReport() {
    const reportContent = document.getElementById('reportContent').textContent;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${new Date().getTime()}.txt`;
    a.click();
    
    logActivity('تم تحميل البلاغ كملف');
    playSound('success');
}

// وظائف الأدوات
function encryptText() {
    const textToEncrypt = document.getElementById('textToEncrypt');
    const encryptedResult = document.getElementById('encryptedResult');
    
    if (textToEncrypt && encryptedResult) {
        const text = textToEncrypt.value;
        if (text.trim()) {
            // تشفير بسيط (Base64 + تحويل)
            const encrypted = btoa(unescape(encodeURIComponent(text)));
            encryptedResult.value = encrypted;
            logActivity('تم تشفير نص');
            playSound('success');
        }
    }
}

function decryptText() {
    const textToEncrypt = document.getElementById('textToEncrypt');
    const encryptedResult = document.getElementById('encryptedResult');
    
    if (textToEncrypt && encryptedResult) {
        const encryptedText = encryptedResult.value;
        if (encryptedText.trim()) {
            try {
                const decrypted = decodeURIComponent(escape(atob(encryptedText)));
                textToEncrypt.value = decrypted;
                logActivity('تم فك تشفير نص');
                playSound('success');
            } catch (e) {
                alert('فشل في فك التشفير. تأكد من صحة النص المشفر.');
                playSound('error');
            }
        }
    }
}

function clearText() {
    const textToEncrypt = document.getElementById('textToEncrypt');
    const encryptedResult = document.getElementById('encryptedResult');
    
    if (textToEncrypt) textToEncrypt.value = '';
    if (encryptedResult) encryptedResult.value = '';
    
    logActivity('تم مسح النصوص');
}

function checkLink() {
    const linkToCheck = document.getElementById('linkToCheck');
    const linkResult = document.getElementById('linkResult');
    
    if (linkToCheck && linkResult) {
        const url = linkToCheck.value;
        if (url.trim()) {
            let result = '<div class="link-analysis">';
            result += `<h4>تحليل الرابط:</h4>`;
            result += `<p><strong>الرابط:</strong> ${url}</p>`;
            
            try {
                const urlObj = new URL(url);
                
                if (url.startsWith('https://')) {
                    result += `<p class="safe">✅ الرابط يستخدم اتصال آمن (HTTPS)</p>`;
                } else {
                    result += `<p class="warning">⚠️ الرابط لا يستخدم اتصال آمن</p>`;
                }
                
                result += `<p><strong>النطاق:</strong> ${urlObj.hostname}</p>`;
                
                // فحص النطاقات المشبوهة
                const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'short.link'];
                if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
                    result += `<p class="warning">⚠️ هذا رابط مختصر - كن حذراً</p>`;
                }
                
            } catch (e) {
                result += `<p class="warning">⚠️ تنسيق الرابط غير صحيح</p>`;
            }
            
            result += `<p class="note">💡 تأكد من صحة اسم الموقع قبل إدخال أي معلومات شخصية</p>`;
            result += '</div>';
            
            linkResult.innerHTML = result;
            logActivity('تم فحص رابط');
            playSound('success');
        }
    }
}

function analyzeAccount() {
    const usernameToAnalyze = document.getElementById('usernameToAnalyze');
    const analysisResult = document.getElementById('analysisResult');
    
    if (usernameToAnalyze && analysisResult) {
        const username = usernameToAnalyze.value;
        if (username.trim()) {
            let result = '<div class="account-analysis">';
            result += `<h4>تحليل الحساب:</h4>`;
            result += `<p><strong>اسم المستخدم:</strong> ${username}</p>`;
            
            // تحليل بسيط للاسم
            if (username.length < 3) {
                result += `<p class="warning">⚠️ اسم المستخدم قصير جداً - قد يكون مشبوهاً</p>`;
            }
            
            if (/^\d+$/.test(username)) {
                result += `<p class="warning">⚠️ اسم المستخدم يحتوي على أرقام فقط - قد يكون حساب وهمي</p>`;
            }
            
            if (username.includes('fake') || username.includes('bot')) {
                result += `<p class="warning">⚠️ اسم المستخدم يحتوي على كلمات مشبوهة</p>`;
            }
            
            result += `<p class="note">💡 هذه الأداة تجمع المعلومات المتاحة للعامة فقط</p>`;
            result += `<p class="warning">⚠️ لا تعتمد على هذه المعلومات وحدها في اتخاذ قرارات مهمة</p>`;
            result += '</div>';
            
            analysisResult.innerHTML = result;
            logActivity(`تم تحليل حساب: ${username}`);
            playSound('success');
        }
    }
}

function generatePassword() {
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const length = parseInt(document.getElementById('passwordLength').value);
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
        alert('يجب اختيار نوع واحد على الأقل من الأحرف');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('generatedPassword').value = password;
    document.getElementById('copyPasswordBtn').style.display = 'inline-block';
    
    logActivity('تم إنشاء كلمة مرور جديدة');
    playSound('success');
}

function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    passwordField.select();
    navigator.clipboard.writeText(passwordField.value).then(() => {
        alert('تم نسخ كلمة المرور');
        logActivity('تم نسخ كلمة المرور');
        playSound('success');
    });
}

// وظائف الإعدادات
function resetSettings() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
        // إعادة تعيين الإعدادات
        document.body.style.fontSize = '16px';
        
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        const fontSizeValue = document.getElementById('fontSizeValue');
        
        if (fontSizeSlider) fontSizeSlider.value = 16;
        if (fontSizeValue) fontSizeValue.textContent = '16px';
        
        // إعادة تعيين localStorage
        localStorage.removeItem('settings');
        
        logActivity('تم إعادة تعيين الإعدادات');
        playSound('success');
        alert('تم إعادة تعيين الإعدادات بنجاح!');
    }
}

function clearAllData() {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        localStorage.clear();
        activityLog = [];
        logActivity('تم مسح جميع البيانات');
        playSound('success');
        alert('تم مسح جميع البيانات بنجاح!');
        
        // إعادة تحميل الصفحة
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

function exportAllData() {
    const allData = {
        activityLog: activityLog,
        settings: localStorage.getItem('settings'),
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iraq_digital_shield_data_${new Date().getTime()}.json`;
    a.click();
    
    logActivity('تم تصدير جميع البيانات');
    playSound('success');
}

function toggleDarkMode() {
    const isDark = document.getElementById('darkModeToggle').checked;
    document.body.classList.toggle('light-mode', !isDark);
    logActivity(`تم ${isDark ? 'تفعيل' : 'إلغاء'} الوضع الليلي`);
}

// تحميل السجل من localStorage
function loadActivityLog() {
    const savedLog = localStorage.getItem('activityLog');
    if (savedLog) {
        try {
            activityLog = JSON.parse(savedLog);
        } catch (e) {
            activityLog = [];
        }
    }
}

// تهيئة التطبيق
function initializeApp() {
    loadActivityLog();
    initializeLogin();
    initializeGhostMode();
    initializeSections();
    
    // تسجيل بدء التطبيق
    logActivity('تم تشغيل البرنامج (النسخة الويب)');
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);

