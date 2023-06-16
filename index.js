let textarea;

function setCookie(key, value) {
    let expire = new Date(new Date().getTime() + 24*60*60*1000);
    value = encodeURIComponent(value);
    document.cookie = `${key}=${value}; expires=${expire}; path=/`;
}

function typeInTextarea(newText, el = document.activeElement) {
    const [start, end] = [el.selectionStart, el.selectionEnd];
    el.setRangeText(newText, start, end, 'end');
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
        } else if (key === 'font') {
            textarea.classList.remove('sans-serif');
            textarea.classList.add(value);
        }
    });

    textarea.addEventListener('input', e => {
        setCookie('content', e.target.value);
    });

    document.addEventListener('keydown', e => {
        let compose = e.metaKey || e.ctrlKey;

        // insert tab if tag is pressed
        if (e.code === 'Tab') {
            e.preventDefault();
            typeInTextarea('\t');
            return;
        }

        // toggle italic
        if (compose && e.code === 'KeyI') {
            e.preventDefault();
            textarea.style.fontStyle = textarea.style.fontStyle ? '' : 'italic';
            setCookie('italic', textarea.style.fontStyle);
            return;
        }
        // toggle bold
        if (compose && e.code === 'KeyB') {
            e.preventDefault();
            textarea.style.fontWeight = textarea.style.fontWeight ? '' : 'bold';
            setCookie('bold', textarea.style.fontWeight);
            return;
        }
        // toggle underline
        if (compose && e.code === 'KeyU') {
            e.preventDefault();
            textarea.style.textDecoration = textarea.style.textDecoration ? '' : 'underline';
            setCookie('underline', textarea.style.textDecoration);
            return;
        }

        // align left
        if (compose && e.code === 'KeyH' && e.shiftKey) {
            e.preventDefault();
            textarea.style.textAlign = 'left';
            setCookie('align', textarea.style.textAlign);
            return;
        }
        // align justify
        if (compose && e.code === 'KeyJ' && e.shiftKey) {
            e.preventDefault();
            textarea.style.textAlign = 'justify';
            setCookie('align', textarea.style.textAlign);
            return;
        }
        // align center
        if (compose && e.code === 'KeyK' && e.shiftKey) {
            e.preventDefault();
            textarea.style.textAlign = 'center';
            setCookie('align', textarea.style.textAlign);
            return;
        }
        // align right
        if (compose && e.code === 'KeyL' && e.shiftKey) {
            e.preventDefault();
            textarea.style.textAlign = 'right';
            setCookie('align', textarea.style.textAlign);
            return;
        }

        console.log(e.code);
        // change font family
        if (compose && e.code === 'KeyS' && e.shiftKey) {
            e.preventDefault();
            let font;

            if (textarea.classList.contains('sans-serif')) {
                textarea.classList.remove('sans-serif');
                font = 'serif';
            } else if (textarea.classList.contains('serif')) {
                textarea.classList.remove('serif');
                font = 'monospaced';
            } else {
                textarea.classList.remove('monospaced');
                font = 'sans-serif';
            }

            textarea.classList.add(font);
            setCookie('font', font);
        }

        // Save as .txt file
        if (compose && e.code === 'KeyS' && !e.shiftKey) {
            e.preventDefault();

            const text = textarea.value;
            const link = document.createElement('a');

            link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
            link.download = new Date().getTime() + '.txt';
            link.click();

            URL.revokeObjectURL(url);
        }

    });
}