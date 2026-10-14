/**
 * Supabase Client Configuration & Shared Helpers for GitHub Pages
 * Apple Liquid Glass & HIG Aesthetic System
 */
const SUPABASE_URL = 'https://ptlxplvklocbincxgbpx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HY_HINYy8gRW957JlGoAAQ_EdsSLe0g';

if (!window.supabase) {
    console.error('Supabase JS SDK chưa được nhúng! Hãy nhúng https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
}

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
window.supabaseClient = supabaseClient;

// --- APPLE THEME MANAGER (Dark Mode First / Light Mode) ---
function initAppleTheme() {
    const saved = localStorage.getItem('apple_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeToggleIcons();
}

function toggleAppleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('apple_theme', next);
    updateThemeToggleIcons();
}

function updateThemeToggleIcons() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerHTML = current === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        btn.title = current === 'dark' ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)';
    });
}

// Run immediately to prevent theme flash
initAppleTheme();
document.addEventListener('DOMContentLoaded', initAppleTheme);

// --- AUTHENTICATION HELPERS ---

/**
 * Đăng nhập bằng tài khoản Google
 */
async function signInWithGoogle() {
    if (!supabaseClient) return;
    try {
        const redirectUrl = window.location.origin + window.location.pathname;
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        });
        if (error) {
            alert('Lỗi đăng nhập Google: ' + error.message);
        }
    } catch (err) {
        console.error('Google Sign In Error:', err);
    }
}

/**
 * Đăng nhập bằng tài khoản Facebook
 */
async function signInWithFacebook() {
    if (!supabaseClient) return;
    try {
        const redirectUrl = window.location.origin + window.location.pathname;
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: redirectUrl
            }
        });
        if (error) {
            alert('Lỗi đăng nhập Facebook: ' + error.message);
        }
    } catch (err) {
        console.error('Facebook Sign In Error:', err);
    }
}

/**
 * Đăng nhập bằng Email / Gmail (Magic Link / OTP)
 */
async function signInWithEmailOtp(email) {
    if (!supabaseClient) return;
    if (!email || !email.includes('@')) {
        alert('Vui lòng nhập địa chỉ email/gmail hợp lệ!');
        return;
    }
    try {
        const redirectUrl = window.location.origin + window.location.pathname;
        const { error } = await supabaseClient.auth.signInWithOtp({
            email: email.trim(),
            options: {
                emailRedirectTo: redirectUrl
            }
        });
        if (error) {
            alert('Lỗi gửi email: ' + error.message);
        } else {
            alert('📩 Đã gửi liên kết đăng nhập đến email ' + email + '!\nVui lòng kiểm tra hộp thư đến (và cả hòm thư Spam) để hoàn tất đăng nhập.');
            closeLoginModal();
        }
    } catch (err) {
        console.error('Email OTP Error:', err);
    }
}

/**
 * Đăng xuất
 */
async function signOut() {
    if (!supabaseClient) return;
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            alert('Lỗi đăng xuất: ' + error.message);
        } else {
            window.location.reload();
        }
    } catch (err) {
        console.error('Sign Out Error:', err);
    }
}

/**
 * Hiển thị Hộp thoại Đăng nhập Apple Liquid Glass
 */
function openLoginModal() {
    let modal = document.getElementById('unifiedAuthModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'unifiedAuthModal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:99999; backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%);';
        modal.innerHTML = `
            <div class="liquid-glass" style="width:90%; max-width:420px; padding:32px 28px; position:relative; animation:appleModalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1);">
                <button type="button" onclick="closeLoginModal()" style="position:absolute; top:18px; right:18px; width:32px; height:32px; border-radius:50%; background:var(--bg-tertiary); border:1px solid var(--border-subtle); color:var(--text-muted); font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;">&times;</button>
                <div style="text-align:center; margin-bottom:24px;">
                    <div style="font-size:2.2rem; color:var(--accent-purple); filter:drop-shadow(0 0 16px var(--accent-purple-glow)); margin-bottom:8px;">
                        <i class="fa-solid fa-compass"></i>
                    </div>
                    <h3 style="margin:0 0 6px 0; font-size:1.4rem; color:var(--text-main); font-weight:800; letter-spacing:-0.02em;">Đăng nhập Innercompass</h3>
                    <p style="font-size:0.88rem; color:var(--text-muted); margin:0;">Trải nghiệm các tour du lịch & ẩm thực cao cấp</p>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <!-- Google Button -->
                    <button type="button" onclick="signInWithGoogle()" style="display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px 18px; background:rgba(255,255,255,0.95); border:none; border-radius:var(--radius-md); font-weight:600; font-size:0.95rem; color:#1a1a1a; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.15); transition:transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);">
                        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                        Tiếp tục với Google
                    </button>
                    
                    <!-- Facebook Button -->
                    <button type="button" onclick="signInWithFacebook()" style="display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px 18px; background:#1877F2; color:#fff; border:none; border-radius:var(--radius-md); font-weight:600; font-size:0.95rem; cursor:pointer; box-shadow:0 4px 12px rgba(24,119,242,0.35); transition:transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);">
                        <i class="fa-brands fa-facebook" style="font-size:18px;"></i>
                        Tiếp tục với Facebook
                    </button>
                </div>

                <div style="display:flex; align-items:center; margin:22px 0; color:var(--text-subtle); font-size:0.8rem;">
                    <div style="flex:1; height:1px; background:var(--separator);"></div>
                    <span style="padding:0 12px; text-transform:uppercase; letter-spacing:0.06em;">hoặc dùng Gmail / Email</span>
                    <div style="flex:1; height:1px; background:var(--separator);"></div>
                </div>

                <form onsubmit="handleEmailOtpSubmit(event)" style="display:flex; flex-direction:column; gap:12px;">
                    <div style="position:relative;">
                        <input type="email" id="authEmailInput" placeholder="nhap-email@gmail.com" required style="width:100%; padding:12px 14px 12px 40px; background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:var(--radius-md); color:var(--text-main); font-size:0.95rem; box-sizing:border-box; outline:none; font-family:inherit;">
                        <i class="fa-regular fa-envelope" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted);"></i>
                    </div>
                    <button type="submit" class="btn-primary" style="width:100%; padding:13px; font-weight:700;">
                        <i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i> Gửi liên kết đăng nhập OTP
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Add keyframe for modal
        if (!document.getElementById('appleModalKeyframes')) {
            const style = document.createElement('style');
            style.id = 'appleModalKeyframes';
            style.innerHTML = `
                @keyframes appleModalPop {
                    0% { transform: scale(0.92) translateY(12px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('unifiedAuthModal');
    if (modal) modal.style.display = 'none';
}

function handleEmailOtpSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('authEmailInput')?.value;
    signInWithEmailOtp(email);
}

/**
 * Cập nhật giao diện thanh điều hướng theo chuẩn Apple
 */
function updateAuthNavbar(user) {
    const authControls = document.querySelector('.auth-controls');
    if (!authControls) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeIcon = currentTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    const themeBtnHtml = `<button type="button" class="theme-toggle-btn" onclick="toggleAppleTheme()" title="Đổi giao diện">${themeIcon}</button>`;

    if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Tài khoản';
        const avatar = user.user_metadata?.avatar_url;
        const avatarHtml = avatar 
            ? `<img src="${avatar}" alt="${name}" style="width:26px;height:26px;border-radius:50%;margin-right:8px;vertical-align:middle;object-fit:cover;border:1px solid var(--border-highlight);">`
            : `<i class="fa-solid fa-user" style="margin-right:8px; color:var(--accent-purple);"></i>`;

        authControls.innerHTML = `
            ${themeBtnHtml}
            <a class="account-link" href="javascript:void(0)" onclick="openMyOrdersModal()">
                <i class="fa-solid fa-receipt" style="margin-right:6px;"></i> Đơn của tôi
            </a>
            <span class="auth-user" style="cursor:default; display:inline-flex; align-items:center;">
                ${avatarHtml}
                <strong>${name}</strong>
            </span>
            <button type="button" class="auth-action" onclick="signOut()" style="cursor:pointer;" title="Đăng xuất">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        `;
    } else {
        authControls.innerHTML = `
            ${themeBtnHtml}
            <div style="display:flex; align-items:center; gap:8px;">
                <button type="button" class="auth-action google-btn" onclick="signInWithGoogle()" title="Đăng nhập Google">
                    <svg width="15" height="15" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                    Google
                </button>
                <button type="button" class="auth-action facebook-btn" onclick="signInWithFacebook()" title="Đăng nhập Facebook">
                    <i class="fa-brands fa-facebook"></i>
                    Facebook
                </button>
                <button type="button" class="auth-action email-btn" onclick="openLoginModal()" title="Đăng nhập Gmail / Email">
                    <i class="fa-regular fa-envelope"></i>
                    Email
                </button>
            </div>
        `;
    }
}

// Khởi chạy lắng nghe trạng thái đăng nhập
if (supabaseClient) {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        updateAuthNavbar(session ? session.user : null);
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateAuthNavbar(session ? session.user : null);
    });
}

// --- DATABASE HELPERS ---

/**
 * Lấy danh sách tour
 */
async function fetchTours() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
        .from('Tours')
        .select('*')
        .order('id', { ascending: true });
    if (error) {
        console.error('Lỗi tải Tours:', error);
        return [];
    }
    return data;
}

/**
 * Lấy danh sách món ăn
 */
async function fetchFoods(category = 'Tat ca') {
    if (!supabaseClient) return [];
    let query = supabaseClient.from('Foods').select('*').eq('is_active', 1);
    if (category && category !== 'Tat ca') {
        query = query.eq('category', category);
    }
    const { data, error } = await query.order('id', { ascending: true });
    if (error) {
        console.error('Lỗi tải Foods:', error);
        return [];
    }
    return data;
}

/**
 * Lấy danh sách blog
 */
async function fetchBlogs() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
        .from('Blogs')
        .select('*, Tours(name)')
        .order('id', { ascending: true });
    if (error) {
        console.error('Lỗi tải Blogs:', error);
        return [];
    }
    return data;
}

/**
 * Đặt tour
 */
async function bookTour(tourId, seats = 1) {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        alert('Vui lòng đăng nhập trước khi đặt tour!');
        openLoginModal();
        return;
    }

    const bookingCode = 'BK' + Date.now().toString().slice(-6);
    const customerName = session.user.user_metadata?.full_name || session.user.email;
    const userEmail = session.user.email;

    const { error } = await supabaseClient
        .from('Bookings')
        .insert([{
            user_id: session.user.id,
            tour_id: tourId,
            customer_name: customerName,
            email: userEmail,
            seats: parseInt(seats, 10) || 1,
            booking_code: bookingCode,
            status: 'confirmed'
        }]);

    if (error) {
        alert('Lỗi đặt tour: ' + error.message);
    } else {
        alert(`🎉 Đặt tour thành công!\nMã đặt chỗ của bạn: ${bookingCode}\nCảm ơn bạn, ${customerName}!`);
    }
}

/**
 * Xem danh sách đơn đã đặt (Apple Sheet Modal)
 */
async function openMyOrdersModal() {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        alert('Vui lòng đăng nhập trước!');
        openLoginModal();
        return;
    }

    const { data: bookings, error } = await supabaseClient
        .from('Bookings')
        .select('*, Tours(name, price)')
        .eq('user_id', session.user.id)
        .order('id', { ascending: false });

    if (error) {
        alert('Lỗi lấy đơn hàng: ' + error.message);
        return;
    }

    if (!bookings || bookings.length === 0) {
        alert('Bạn chưa có đơn đặt tour nào.');
        return;
    }

    let summary = 'DANH SÁCH TOUR ĐÃ ĐẶT:\n\n';
    bookings.forEach((b, idx) => {
        const tourName = b.Tours?.name || `Tour #${b.tour_id}`;
        summary += `${idx + 1}. [${b.booking_code}] ${tourName}\n   - Số chỗ: ${b.seats}\n   - Trạng thái: ${b.status}\n   - Ngày đặt: ${new Date(b.created_at).toLocaleString('vi-VN')}\n\n`;
    });
    alert(summary);
}
