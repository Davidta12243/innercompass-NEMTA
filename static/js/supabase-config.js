/**
 * Supabase Client Configuration & Shared Helpers for GitHub Pages
 */
const SUPABASE_URL = 'https://ptlxplvklocbincxgbpx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HY_HINYy8gRW957JlGoAAQ_EdsSLe0g';

if (!window.supabase) {
    console.error('Supabase JS SDK chưa được nhúng! Hãy nhúng https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
}

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
window.supabaseClient = supabaseClient;

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
 * Cập nhật giao diện thanh điều hướng theo trạng thái đăng nhập
 */
function updateAuthNavbar(user) {
    const authControls = document.querySelector('.auth-controls');
    if (!authControls) return;

    if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Tài khoản';
        const avatar = user.user_metadata?.avatar_url;
        const avatarHtml = avatar 
            ? `<img src="${avatar}" alt="${name}" style="width:24px;height:24px;border-radius:50%;margin-right:6px;vertical-align:middle;object-fit:cover;">`
            : `<i class="fa-solid fa-user" style="margin-right:6px;"></i>`;

        authControls.innerHTML = `
            <a class="account-link" href="javascript:void(0)" onclick="openMyOrdersModal()">Đơn hàng của tôi</a>
            <span class="auth-user" style="cursor:default; display:inline-flex; align-items:center;">
                ${avatarHtml}
                <strong>${name}</strong>
            </span>
            <button type="button" class="auth-action" onclick="signOut()" style="cursor:pointer; background:none; border:1px solid #ccc; border-radius:4px; padding:4px 10px; font-family:inherit;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
            </button>
        `;
    } else {
        authControls.innerHTML = `
            <button type="button" class="auth-action google-btn" onclick="signInWithGoogle()" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; background:#fff; color:#333; border:1px solid #ddd; border-radius:20px; padding:6px 14px; font-weight:600; font-family:inherit; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Đăng nhập Google
            </button>
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
        alert('Vui lòng đăng nhập bằng Google trước khi đặt tour!');
        signInWithGoogle();
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
 * Xem danh sách đơn đã đặt
 */
async function openMyOrdersModal() {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        alert('Vui lòng đăng nhập trước!');
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
