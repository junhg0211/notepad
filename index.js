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
        } else if (key === 'align') {
            textarea.style.textAlign = value;
        }
    });

    textarea.addEventListener('input', e => {
        setCookie('content', e.target.value);
    });

    document.addEventListener('keydown', e => {
        let compose = e.metaKey || e.ctrlKey;

        if (compose && e.code === 'KeyI') {
            e.preventDefault();
            textarea.style.fontStyle = textarea.style.fontStyle ? '' : 'italic';
            setCookie('italic', textarea.style.fontStyle);
        } else if (compose && e.code === 'KeyB') {
            e.preventDefault();
            textarea.style.fontWeight = textarea.style.fontWeight ? '' : 'bold';
            setCookie('bold', textarea.style.fontWeight);
        } else if (compose && e.code === 'KeyU') {
            e.preventDefault();
            textarea.style.textDecoration = textarea.style.textDecoration ? '' : 'underline';
            setCookie('underline', textarea.style.textDecoration);
        }

        if (compose && e.code === 'KeyH') {
            e.preventDefault();
            textarea.style.textAlign = 'left';
            setCookie('align', textarea.style.textAlign);
        } else if (compose && e.code === 'KeyJ') {
            e.preventDefault();
            textarea.style.textAlign = 'justify';
            setCookie('align', textarea.style.textAlign);
        } else if (compose && e.code === 'KeyK') {
            e.preventDefault();
            textarea.style.textAlign = 'center';
            setCookie('align', textarea.style.textAlign);
        } else if (compose && e.code === 'KeyL') {
            e.preventDefault();
            textarea.style.textAlign = 'right';
            setCookie('align', textarea.style.textAlign);
        }
    });
}
