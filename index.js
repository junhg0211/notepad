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

function unsetItalic() {
    textarea.style.fontStyle = '';
    setCookie('italic', textarea.style.fontStyle);
}

function setItalic() {
    textarea.style.fontStyle = 'italic';
    setCookie('italic', textarea.style.fontStyle);
}

function unsetBold() {
    textarea.style.fontWeight = '';
    setCookie('bold', textarea.style.fontWeight);
}

function setBold() {
    textarea.style.fontWeight = 'bold';
    setCookie('bold', textarea.style.fontWeight);
}

function unsetUnderline() {
    textarea.style.textDecoration = '';
    setCookie('underline', textarea.style.textDecoration);
}

function setUnderline() {
    textarea.style.textDecoration = 'underline';
    setCookie('underline', textarea.style.textDecoration);
}

function alignLeft() {
    textarea.style.textAlign = 'left';
    setCookie('align', textarea.style.textAlign);
}

function alignJustify() {
    textarea.style.textAlign = 'justify';
    setCookie('align', textarea.style.textAlign);
}

function alignCenter() {
    textarea.style.textAlign = 'center';
    setCookie('align', textarea.style.textAlign);
}

function alignRight() {
    textarea.style.textAlign = 'right';
    setCookie('align', textarea.style.textAlign);
}

function setFont(font) {
    textarea.classList.remove('sans-serif');
    textarea.classList.remove('serif');
    textarea.classList.remove('monospaced');

    textarea.classList.add(font);
    setCookie('font', font);

}

function saveTextFile() {
    const text = textarea.value;
    const link = document.createElement('a');

    link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    link.download = new Date().getTime() + '.txt';
    link.click();

    URL.revokeObjectURL(link.href);
}

function setColorScheme(scheme) {
    document.body.classList.remove(scheme === 'light' ? 'dark' : 'light');
    document.body.classList.add(scheme === 'light' ? 'light' : 'dark');
}

function toggleColorScheme() {
    if (document.body.classList.contains('light')) {
        setColorScheme('dark');
    } else {
        setColorScheme('light');
    }
}

const commands = [
    {keyword: 'bold', command: setBold},
    {keyword: 'unbold', command: unsetBold},
    {keyword: 'italic', command: setItalic},
    {keyword: 'unitalic', command: unsetItalic},
    {keyword: 'underline', command: setUnderline},
    {keyword: 'ununderline', command: unsetUnderline},
    {keyword: 'left', command: alignLeft},
    {keyword: 'justify', command: alignJustify},
    {keyword: 'center', command: alignCenter},
    {keyword: 'right', command: alignRight},
    {keyword: 'serif', command: () => setFont('serif')},
    {keyword: 'sans', command: () => setFont('sans-serif')},
    {keyword: 'mono', command: () => setFont('monospaced')},
    {keyword: 'save', command: saveTextFile},
    {keyword: 'clear', command: () => textarea.value = ''},
    {keyword: 'color', command: toggleColorScheme},
    {keyword: 'dark', command: () => setColorScheme('dark')},
    {keyword: 'light', command: () => setColorScheme('light')},
];


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

    document.addEventListener('keyup', () => {
        // check if command is inserted
        commands.forEach(command => {
            if (textarea.value.endsWith(`/${command.keyword}`)) {
                command.command();
                textarea.value = textarea.value.slice(0, -command.keyword.length - 1);
            }
        });
    })

    document.addEventListener('keydown', e => {
        console.log(e);
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

            if (textarea.style.fontStyle) unsetItalic();
            else setItalic();

            return;
        }
        // toggle bold
        if (compose && e.code === 'KeyB') {
            e.preventDefault();

            if (textarea.style.fontWeight) unsetBold();
            else setBold();

            return;
        }
        // toggle underline
        if (compose && e.code === 'KeyU') {
            e.preventDefault();

            if (textarea.style.textDecoration) unsetUnderline();
            else setUnderline();

            return;
        }

        // align left
        if (compose && e.code === 'KeyH' && e.shiftKey) {
            e.preventDefault();
            alignLeft();
            return;
        }
        // align justify
        if (compose && e.code === 'KeyJ' && e.shiftKey) {
            e.preventDefault();
            alignJustify();
            return;
        }
        // align center
        if (compose && e.code === 'KeyK' && e.shiftKey) {
            e.preventDefault();
            alignCenter();
            return;
        }
        // align right
        if (compose && e.code === 'KeyL' && e.shiftKey) {
            e.preventDefault();
            alignRight();
            return;
        }

        // change font family
        if (compose && e.code === 'KeyS' && e.shiftKey) {
            e.preventDefault();

            if (textarea.classList.contains('sans-serif')) {
                setFont('serif');
            } else if (textarea.classList.contains('serif')) {
                setFont('monospaced');
            } else {
                setFont('sans-serif');
            }

            return;
        }

        // Save as .txt file
        if (compose && e.code === 'KeyS' && !e.shiftKey) {
            e.preventDefault();

            saveTextFile();

            return;
        }

        // change color scheme
        if (compose && e.code === 'KeyP') {
            e.preventDefault();

            toggleColorScheme();

            return;
        }
    });
}
