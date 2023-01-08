let textarea;

function setCookie(key, value) {
    let expire = new Date(new Date().getTime() + 24*60*60*1000);
    value = encodeURIComponent(value);
    document.cookie = `${key}=${value}; expires=${expire}; path=/`;
}

function onload() {
    textarea = document.querySelector('textarea');

    document.cookie.split('; ').forEach(cookie => {
        let [key, value] = cookie.split('=');

        if (key === 'content') {
            textarea.value = decodeURIComponent(value);
        }
    });

    textarea.addEventListener('input', e => {
        setCookie('content', e.target.value);
    });

    document.addEventListener('keydown', e => {
        let compose = e.metaKey || e.ctrlKey;

        if (compose && e.key === 'i') {
            textarea.style.fontStyle = textarea.style.fontStyle ? '' : 'italic';
        } else if (compose && e.key === 'b') {
            textarea.style.fontWeight = textarea.style.fontWeight ? '' : 'bold';
        }
    });
}
