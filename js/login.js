import { session_set, session_get, session_check } from './session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './jwt_token.js';

function session_set() { // 세션 저장
    let session_id = document.querySelector("#typeEmailX");
    let session_pass = document.querySelector("#typePasswordX");
    if (sessionStorage) {
        let en_text = encrypt_text(session_pass.value);
        sessionStorage.setItem("Session_Storage_id", session_id.value);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } else {
        alert("로컬 스토리지 지원 x");
    }
}

function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
        if (get_id) {
            id.value = get_id;
            check.checked = true;
        }
        session_check(); // 세션 유무 검사
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    checkAuth();
    init_logined();
});

function init_logined() {
    if (sessionStorage) {
        decrypt_text(); // 복호화 함수
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function session_check() { // 세션 검사
    if (sessionStorage.getItem("Session_Storage_test")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../login/index_login.html';
    }
}

function session_del() { // 세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "popupYN") {
                return cookie_name[1];
            }
        }
    }
    return;
}

const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

// 로그인 횟수 쿠키 증가
function login_count() {
    let count = parseInt(getCookie('login_cnt')) || 0;
    count++;
    setCookie('login_cnt', count, 365);
    console.log('로그인 횟수:', count);
}

// 로그아웃 횟수 쿠키 증가
function logout_count() {
    let count = parseInt(getCookie('logout_cnt')) || 0;
    count++;
    setCookie('logout_cnt', count, 365);
    console.log('로그아웃 횟수:', count);
}


const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const c = '아이디, 패스워드를 체크합니다';
    function session_del() { // 세션 삭제 (로그아웃)
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        logout_count(); // 로그아웃 횟수 증가
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}
    alert(c);

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedPassword = check_xss(passwordValue);
    const sanitizedEmail = check_xss(emailValue);

    const idsave_check = document.getElementById('idSaveCheck');
    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
    };
    const jwtToken = generateJWT(payload);

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        return false;
    }
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        return false;
    }
    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        return false;
    }
    if (emailValue.length > 10) {
        alert('아이디는 최대 10글자 이하로 입력해야 합니다.');
        return false;
    }
    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        return false;
    }
    if (passwordValue.length > 15) {
        alert('비밀번호는 최대 15글자 이하로 입력해야 합니다.');
        return false;
    }

    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
    const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;

    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    if (!sanitizedEmail || !sanitizedPassword) {
        return false;
    }

    // 3글자 이상 반복 문자열 검사 (예: 'abcabcabc', '아이디아이디아이디')
    const repeatedSubstringPattern = /(.{3,})\1+/;
    if (repeatedSubstringPattern.test(emailValue) || repeatedSubstringPattern.test(passwordValue)) {
        alert('3글자 이상 반복되는 문자열은 사용할 수 없습니다.');
        return false;
    }

    // 연속되는 숫자 2개 이상 반복 금지 (예: '1212', '3434')
    const repeatedNumberPattern = /(\d{2,})\1+/;
    if (repeatedNumberPattern.test(emailValue) || repeatedNumberPattern.test(passwordValue)) {
        alert('연속되는 숫자 2개 이상 반복되는 패턴은 사용할 수 없습니다.');
        return false;
    }

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    loginForm.submit();

    if (idsave_check.checked === true) {
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1);
        alert("쿠키 값 :" + emailValue);
    } else {
        setCookie("id", emailValue.value, 0);
    }
};

function session_del() { // 세션 삭제 (로그아웃)
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        logout_count(); // 로그아웃 횟수 증가
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function login_failed() {
    // 현재 실패 횟수 가져오기
    let failCount = parseInt(getCookie("login_fail_cnt")) || 0;

    failCount += 1; // 실패 횟수 증가
    setCookie("login_fail_cnt", failCount, 1); // 1일 동안 유지

    // 로그인 제한 상태 확인
    const loginForm = document.getElementById('login_form');
    const statusDiv = document.getElementById('login_status'); // 상태 메시지 출력할 요소

    if (failCount >= 3) {
        alert(`로그인 실패 횟수: ${failCount}회. 로그인 제한 상태입니다.`);
        if (statusDiv) {
            statusDiv.textContent = `로그인 실패 횟수: ${failCount}회. 로그인 제한 상태입니다. 잠시 후 다시 시도하세요.`;
            statusDiv.style.color = 'red';
        }
        // 로그인 폼 비활성화
        if (loginForm) {
            loginForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
        }
        return true; // 로그인 제한 상태임을 알림
    } else {
        alert(`로그인 실패 횟수: ${failCount}회`);
        if (statusDiv) {
            statusDiv.textContent = `로그인 실패 횟수: ${failCount}회`;
            statusDiv.style.color = 'orange';
        }
        return false; // 아직 로그인 가능
    }
}


document.getElementById("login_btn").addEventListener('click', check_input);
