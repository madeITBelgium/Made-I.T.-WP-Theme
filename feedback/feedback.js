document.addEventListener('DOMContentLoaded', function () {
    const feedbackContainer = document.getElementById('feedBee-cntr');
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackCloseBtn = document.getElementById('closeFeedbackForm');
    const overlay = document.getElementById('clickOverlay');
    const form = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitFeedback');
    const textarea = document.getElementById('feedbackText');
    const input = document.getElementById('feedbackTitle');
  
    let screenshotData = '';
    let startX, startY, rect;
  
    if (!feedbackContainer || !overlay || !form || !submitBtn || !textarea || !feedbackCloseBtn) return;
  
    feedbackBtn.addEventListener('click', () => {
        overlay.style.display = 'block';
        overlay.style.cursor = 'crosshair';
        feedbackContainer.classList.add('expand');
    });
  
    // Teken een rechthoek op het overlay
    overlay.addEventListener('mousedown', e => {
        startX = e.pageX;
        startY = e.pageY;
    
        rect = document.createElement('div');
        rect.style.position = 'absolute';
        rect.style.border = '2px solid red';
        rect.style.zIndex = '10000';
        rect.style.pointerEvents = 'none';
        document.body.appendChild(rect);
  
        function onMouseMove(ev) {
            const width = ev.pageX - startX;
            const height = ev.pageY - startY;
            rect.style.left = `${Math.min(startX, ev.pageX)}px`;
            rect.style.top = `${Math.min(startY, ev.pageY)}px`;
            rect.style.width = `${Math.abs(width)}px`;
            rect.style.height = `${Math.abs(height)}px`;
        }
  
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            setTimeout(() => captureScreenshot(rect), 0);
            //? verberg even de feedback button, zodat deze niet op de screenshot komt
            // feedbackContainer.classList.add('d-none');
        }
  
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
  
    function captureScreenshot(highlight) {
        overlay.style.display = 'none';
        
        html2canvas(document.body, {
            ignoreElements: (element) => element.id === 'feedbackContainer',
            width: window.innerWidth,
            height: window.innerHeight,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            scrollX: window.scrollX,
            scrollY: window.scrollY
        })
        .then(canvas => {      
        // html2canvas(document.body).then(canvas => {
            if (highlight) {
                const ctx = canvas.getContext('2d');
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 4;
                ctx.strokeRect(highlight.offsetLeft, highlight.offsetTop, highlight.offsetWidth, highlight.offsetHeight);
                // highlight.remove(); //? Highlight verwijderen wanneer screenshot is gemaakt
            }
            screenshotData = canvas.toDataURL('image/png');
            //? Als de screenshot is gemaakt, laat dan het formulier terug zien, zodat het formulier niet mee op de screenshot komt
            // feedbackContainer.classList.add('d-block');
            // feedbackContainer.classList.remove('d-none');
            // feedbackContainer.classList.add('expand');
        });
    }
  
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
    
        const title = document.getElementById('feedbackTitle').value;
        const type = document.getElementById('feedbackType').value;
        const feedback = textarea.value;
    
        if (!feedback.trim()) {
            alert('Vul eerst een omschrijving in.');
            return;
        }
    
        submitBtn.disabled = true;
        submitBtn.innerText = 'Versturen...';
  
        const payload = {
            website: website,
            feedback: feedback,
            screenshot: screenshotData,
            title: title,
            type: type
        };

        fetch('https://n8n.madeit.be/webhook/ddb2a741-0e08-4603-b799-e2ff819a6c95', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(() => {
            form.innerHTML = '<p class="FeedBee_success">Bedankt voor je feedback!</p>';
            setTimeout(() => {
                form.style.opacity = '1';
                Object.assign(form.style, {
                    position: 'fixed',
                    zIndex: '9999',
                    backgroundColor: '#4CAF50',
                    border: '1px solid #4CAF50',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    marginTop: '10px',
                    fontSize: '16px',
                    transition: 'top 0.3s ease, right 0.3s ease',
                    pointerEvents: 'none'
                });
                location.reload();
            }, 2500);
        })
        .catch(() => {
            alert('Er ging iets mis bij het versturen.');
        });
    });

    document.getElementById('feedbackForm').addEventListener('click', (e) => {
        const closeBtn = e.target.closest('#closeFeedbackForm');
        if (closeBtn) {
            feedbackContainer.classList.remove('expand');
            overlay.style.display = 'none';
            overlay.style.cursor = 'default';

            if (rect) {
                rect.remove();
                rect = null;
            }
        
            document.getElementById('feedbackTitle').value = '';
            document.getElementById('feedbackType').value = '';
            textarea.value = '';
        
            submitBtn.disabled = false;
            submitBtn.innerText = 'Verstuur';
        }
    });
});