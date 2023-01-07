let textarea;

function setCookie(key, value) {
    let expire = new Date(new Date().getTime() + 24*60*60*1000);
    document.cookie = `${key}=${btoa(value)}; expires=${expire}; path=/`;
}

function onload() {
    textarea = document.querySelector('textarea');

    document.cookie.split('; ').forEach(cookie => {
        let [key, value] = cookie.split('=');

        if (key === 'content') {
            textarea.value = atob(value);
        }
    });

    textarea.addEventListener('input', e => {
        setCookie('content', e.target.value);
    });
}
