// --- BACKGROUND ORBS DRIFT ENGINE ---
const orbs = [
    { el: document.getElementById('orb1'), x: -10, y: -10, targetX: -10, targetY: -10, speed: 0.012 },
    { el: document.getElementById('orb2'), x: 80, y: 80, targetX: 80, targetY: 80, speed: 0.009 },
    { el: document.getElementById('orb3'), x: 50, y: 40, targetX: 50, targetY: 40, speed: 0.015 }
];

setInterval(() => {
    orbs[0].targetX = -20 + Math.random() * 30; orbs[0].targetY = -20 + Math.random() * 30;
    orbs[1].targetX = 65 + Math.random() * 25; orbs[1].targetY = 65 + Math.random() * 25;
    orbs[2].targetX = 35 + Math.random() * 30; orbs[2].targetY = 25 + Math.random() * 30;
}, 3500);

function processOrbDriftEngine() {
    orbs.forEach(orb => {
        orb.x += (orb.targetX - orb.x) * orb.speed; orb.y += (orb.targetY - orb.y) * orb.speed;
        if(orb.el === document.getElementById('orb1') || orb.el === document.getElementById('orb3')) {
            orb.el.style.left = `${orb.x}%`; orb.el.style.top = `${orb.y}%`;
        } else {
            orb.el.style.right = `${100 - orb.x}%`; orb.el.style.bottom = `${100 - orb.y}%`;
        }
    });
    requestAnimationFrame(processOrbDriftEngine);
}
processOrbDriftEngine();

// --- CAROUSEL TRACK SLIDER MECHANICS ---
let currentSlideIndex = 0;
function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const totalSlides = 3;
    
    currentSlideIndex = (currentSlideIndex + direction + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlideIndex * 33.333}%)`;
    
    const indicators = document.querySelectorAll('#carouselIndicators .ind-bar');
    indicators.forEach((bar, idx) => {
        if(idx === currentSlideIndex) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
}
setInterval(() => moveCarousel(1), 7000);

// --- GLOBAL APPLICATION STATE MANAGEMENT ---
let activeUser = { name: "Guest User", email: "", university: "Global Library", isPremiumTier: false, wallet: 0 };
let activePaymentIntent = { type: "", targetId: null, numericPrice: 0 };

let localRepositoryRegistry = {
    1: { title: "Automata & Compiler Blueprints", tag: "B.Tech CSE", premium: false, price: 0, textData: "Compiler structures leverage deep tokenizers. Lexical scanning maps strings to targeted binary enum arrays.", summary: "Examines notes on software structure.", size: "2.4 MB", date: "12 June 2026", upiId: "platform@upi", qrSource: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=platform@upi%26pn=Notify" },
    2: { title: "Advanced Linear Algebra & Matrix Proofs", tag: "Mathematics", premium: true, price: 150, textData: "Vector transformations retain operational identity via matrix manipulation chains.", summary: "A step-by-step breakdown of university maths proofs.", size: "5.1 MB", date: "18 June 2026", upiId: "professor@okaxis", qrSource: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=professor@okaxis%26pn=Professor%26am=150%26cu=INR" }
};

let simulatedCreatorMetrics = { views: 184, downloads: 52, earnings: 0 };

// --- RECENT UPDATES FEED STREAM ---
const sampleLogs = [
    "Someone downloaded the Mathematics proof file.",
    "Database security check successful.",
    "New user joined from Mumbai University.",
    "Study guide #2 received a high rating from a student."
];
setInterval(() => {
    if(document.getElementById('main-dashboard').style.display === 'block') {
        const stream = document.getElementById('liveLogsStream');
        let randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        let newLog = document.createElement('div');
        newLog.className = "log-item";
        newLog.innerHTML = `• ${randomLog}`;
        stream.prepend(newLog);
        if(stream.children.length > 5) stream.removeChild(stream.lastChild);
    }
}, 5000);

// --- USER AUTH MANAGEMENT CONTROLLERS ---
function toggleAuth(m) {
    document.getElementById('registerToggle').classList.toggle('active', m==='register');
    document.getElementById('loginToggle').classList.toggle('active', m==='login');
}

function handleAuth(e) {
    e.preventDefault();
    activeUser.name = document.getElementById('uName').value;
    activeUser.email = document.getElementById('uEmail').value;
    activeUser.university = document.getElementById('uUni').value;

    document.getElementById('nodeVectorTitle').innerText = `Location: ${activeUser.university.toUpperCase()}`;
    document.getElementById('mUser').innerText = activeUser.name;
    document.getElementById('mEmail').innerText = activeUser.email;
    document.getElementById('mUni').innerText = activeUser.university;

    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';
    
    syncRegistryGridUI();
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
window.openModal = openModal;

function closeModal(id) { document.getElementById(id).style.display = 'none'; }
window.closeModal = closeModal;

// Toggle dynamic input views based on note pricing types
function togglePricingInput(val) { 
    const isPaid = (val === 'paid');
    document.getElementById('assetPriceInput').style.display = isPaid ? 'block' : 'none'; 
    document.getElementById('creatorUpiPaymentSection').style.display = isPaid ? 'flex' : 'none'; 
}

// --- RENDER REPOSITORY VAULT GRID ---
function syncRegistryGridUI() {
    const container = document.getElementById('notesVaultGrid');
    container.innerHTML = "";
    let keys = Object.keys(localRepositoryRegistry);
    document.getElementById('totalObjectsCount').innerText = `${keys.length} Files`;

    keys.forEach(k => {
        let obj = localRepositoryRegistry[k];
        let isAssetPaid = obj.premium;
        
        let card = document.createElement('div');
        card.className = "note-card";
        card.setAttribute('data-premium', isAssetPaid);
        card.setAttribute('data-branch', obj.tag);

        card.innerHTML = `
            ${isAssetPaid ? '<div class="premium-badge">PAID PREMIUM</div>' : ''}
            <div class="card-badge-row">
                <span class="card-tag">${obj.tag}</span>
                <span style="color: ${isAssetPaid ? 'var(--accent-orange)' : 'var(--accent-green)'}; font-weight: 800; font-size: 0.8rem;">
                    ${isAssetPaid ? `Price: ₹${obj.price}` : 'Free Access'}
                </span>
            </div>
            <h3 class="note-title">${obj.title}</h3>
            <p style="color: var(--text-dim); font-size: 0.85rem; line-height: 1.5; margin: 8px 0;">
                ${obj.textData.substring(0, 90)}...
            </p>
            <div class="card-meta-details">
                <span>Size: ${obj.size || '1.8 MB'}</span>
                <span>Uploaded: ${obj.date || 'Today'}</span>
            </div>
            <div class="card-meta">
                <span style="font-weight: 700; color: var(--accent-orange)">★ 4.9</span>
                <span class="view-preview-btn" style="color: ${isAssetPaid ? 'var(--accent-orange)' : 'var(--accent-glow)'}" 
                    onclick="${isAssetPaid ? `handlePremiumAccessTrigger(${k}, ${obj.price})` : `launchWorkspaceView(${k})`}">
                    ${isAssetPaid ? 'Buy Notes' : 'Open Document'}
                </span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- FILTERING LOGIC PIPELINES ---
function filterByBranch(branch, element) {
    document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
    let cards = document.getElementsByClassName('note-card');
    for(let card of cards) {
        if(branch === 'all' || card.getAttribute('data-branch') === branch) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}
window.filterByBranch = filterByBranch;

// --- ASSET PUBLISH HANDLER WITH QR PARSING ---
function dispatchAssetToVault(e) {
    e.preventDefault();
    let title = document.getElementById('assetTitle').value;
    let tag = document.getElementById('assetTag').value;
    let textContent = document.getElementById('assetContent').value;
    let pricingMode = document.getElementById('assetPricingType').value;
    let price = parseInt(document.getElementById('assetPriceInput').value) || 0;
    let upiId = document.getElementById('assetUpiId').value || "creator@upi";
    let qrFileField = document.getElementById('assetQrFile').files[0];
    
    let nextId = Object.keys(localRepositoryRegistry).length + 1;

    let buildRegistryEntry = (qrDataUrl) => {
        localRepositoryRegistry[nextId] = {
            title: title, tag: tag, premium: (pricingMode === 'paid'), price: price, textData: textContent,
            summary: `AI file check completed successfully. Document ready to preview.`,
            size: "1.5 MB", date: "Just Now",
            upiId: upiId,
            qrSource: qrDataUrl
        };
        syncRegistryGridUI();
        closeModal('uploadModal');
        e.target.reset();
        togglePricingInput('free');
    };

    if (pricingMode === 'paid' && qrFileField) {
        let reader = new FileReader();
        reader.onload = function(event) {
            buildRegistryEntry(event.target.result); // Stores uploaded image as base64 data string
        };
        reader.readAsDataURL(qrFileField);
    } else {
        let fallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(upiId)}%26pn=NotifyCreator%26am=${price}%26cu=INR`;
        buildRegistryEntry(fallbackQr);
    }
}

function executeFullTextKeywordSearch() {
    let query = document.getElementById('globalSearch').value.toLowerCase();
    let cards = document.getElementsByClassName('note-card');
    Object.keys(localRepositoryRegistry).forEach((key, index) => {
        let data = localRepositoryRegistry[key];
        let matchFound = data.title.toLowerCase().includes(query) || data.tag.toLowerCase().includes(query);
        if(cards[index]) cards[index].style.display = matchFound ? "" : "none";
    });
}

function switchFilter(mode) {
    let cards = document.getElementsByClassName('note-card');
    for(let card of cards) {
        let isPremium = card.getAttribute('data-premium') === "true";
        if(mode === 'all') card.style.display = "";
        if(mode === 'premium') card.style.display = isPremium ? "" : "none";
    }
}

// --- WORKSPACE VIEW CONTROLLER ---
function launchWorkspaceView(id) {
    let asset = localRepositoryRegistry[id];
    document.getElementById('wsTitle').innerText = asset.title;
    document.getElementById('documentBodyText').innerText = asset.textData;
    document.getElementById('aiSummaryBoxText').innerText = asset.summary;
    openModal('workspaceModal');
}

function handlePremiumAccessTrigger(id, cost) {
    if(activeUser.isPremiumTier) { launchWorkspaceView(id); return; }
    triggerUpiQrCheckout('note', id, cost);
}

// --- UPI QR DYNAMIC MODAL ENGINE ---
function triggerUpiQrCheckout(type, targetId, cost) {
    activePaymentIntent.type = type; activePaymentIntent.targetId = targetId; activePaymentIntent.numericPrice = cost;
    
    let currentNote = localRepositoryRegistry[targetId];
    
    document.getElementById('targetPaymentQrCode').src = currentNote.qrSource;
    document.getElementById('qrAmountTag').innerText = `Amount: ₹${cost}.00`;
    document.getElementById('qrUpiRouteTag').innerText = `UPI VPA: ${currentNote.upiId}`;
    
    openModal('upiGatewayModal');
}

function executePaymentSettlement() {
    closeModal('upiGatewayModal');
    alert("Payment confirmed! Your requested premium note is now unlocked.");
    
    simulatedCreatorMetrics.earnings += activePaymentIntent.numericPrice;
    document.getElementById('walletBalance').innerText = `₹${simulatedCreatorMetrics.earnings.toFixed(2)}`;
    
    localRepositoryRegistry[activePaymentIntent.targetId].premium = false;
    syncRegistryGridUI();
    launchWorkspaceView(activePaymentIntent.targetId);
}