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

        value = decodeURIComponent(value);
        if (key === 'content') {
            textarea.value = value;
        } else if (key === 'italic') {
            textarea.style.fontStyle = value;
        } else if (key === 'bold') {
            textarea.style.fontWeight = value;
        } else if (key === 'underline') {
            textarea.style.textDecoration = value;
        }
    });

    textarea.addEventListener('input', e => {
        setCookie('content', e.target.value);
    });

    document.addEventListener('keydown', e => {
        let compose = e.metaKey || e.ctrlKey;

        if (compose && e.code === 'KeyI') {
            textarea.style.fontStyle = textarea.style.fontStyle ? '' : 'italic';
            setCookie('italic', textarea.style.fontStyle);
        } else if (compose && e.code === 'KeyB') {
            textarea.style.fontWeight = textarea.style.fontWeight ? '' : 'bold';
            setCookie('bold', textarea.style.fontWeight);
        } else if (compose && e.code === 'KeyU') {
            e.preventDefault();
            textarea.style.textDecoration = textarea.style.textDecoration ? '' : 'underline';
            setCookie('underline', textarea.style.textDecoration);
        }
    });
}
