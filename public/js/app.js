// Initialize default row
document.addEventListener('DOMContentLoaded', () => {
    addRow();
});

function addRow() {
    const tbody = document.getElementById('itemsBody');
    const rowCount = tbody.children.length + 1;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${rowCount}" class="row-no" readonly style="width: 40px;"></td>
        <td><input type="date" class="row-tgl"></td>
        <td><input type="text" class="row-mobil" placeholder="..."></td>
        <td><input type="text" class="row-nopol" placeholder="..."></td>
        <td><input type="text" class="row-driver" placeholder="..."></td>
        <td><input type="text" class="row-tujuan" placeholder="..."></td>
        <td><input type="text" class="row-mulai" placeholder="..."></td>
        <td><input type="text" class="row-selesai" placeholder="..."></td>
        <td><input type="text" class="row-jamot" placeholder="..."></td>
        <td><input type="text" class="row-nominalot" placeholder="..."></td>
        <td><input type="number" class="row-biaya" placeholder="0" onchange="calculateTotal()"></td>
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('tr').remove(); updateRowNumbers(); calculateTotal();">
                <i class="ri-delete-bin-line"></i>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
}

function updateRowNumbers() {
    const rows = document.querySelectorAll('#itemsBody tr');
    rows.forEach((row, index) => {
        const noInput = row.querySelector('.row-no');
        if (noInput) noInput.value = index + 1;
    });
}

function calculateTotal() {
    const biayaInputs = document.querySelectorAll('.row-biaya');
    let total = 0;
    biayaInputs.forEach(input => {
        const val = parseFloat(input.value);
        if(!isNaN(val)) total += val;
    });
    
    // Format as Rupiah (simple format)
    const formatted = new Intl.NumberFormat('id-ID').format(total);
    document.getElementById('totalCost').value = formatted;
}

function generatePreview() {
    // Company Details
    document.getElementById('outCompanyAddress').innerText = document.getElementById('companyAddress').value || 'Jln. Kampung Ngunut, Jeruklegi No.1 Rt 04. Rw 05, Katongan, Nglipar ,Gunungkidul ,DIY 55852';
    document.getElementById('outCompanyPhone').innerText = document.getElementById('companyPhone').value || '081804387025';

    // Basic Details
    const docType = document.getElementById('documentType').value || 'Invoice';
    document.getElementById('outDocTitle').innerText = docType.toUpperCase();
    
    document.getElementById('outInvoiceNo').innerText = document.getElementById('invoiceNo').value || '.......';
    document.getElementById('outCustomerName').innerText = document.getElementById('customerName').value || '.......';
    document.getElementById('outCustomerPhone').innerText = document.getElementById('customerPhone').value || '.......';
    document.getElementById('outCustomerType').innerText = document.getElementById('customerType').value;
    document.getElementById('outCustomerAddress').innerText = document.getElementById('customerAddress').value || '.......';
    
    // Status & Total
    document.getElementById('outTotalCost').innerText = document.getElementById('totalCost').value || '0';
    document.getElementById('outStatus').innerText = document.getElementById('paymentStatus').value;

    // Notes & Bank
    document.getElementById('outInvoiceNotes').innerText = document.getElementById('invoiceNotes').value || 'NB. Biaya Over Time Dihitung 10% Dari Harga, Harga Belum Termasuk Tol, Parkir Luar Kota';
    document.getElementById('outBankInfo').innerText = document.getElementById('bankInfo').value || 'No.Rekening Bank BRI 6981-01-005150-50-7 (An : Widodo)';

    // Signatures
    const sigRental = document.getElementById('sigRental').value || 'Widodo';
    const sigSaksi = document.getElementById('sigSaksi').value || '-';
    const sigPenyewa = document.getElementById('sigPenyewa').value || document.getElementById('customerName').value || 'Nama Penyewa';
    
    document.getElementById('outSigRental').innerText = sigRental;
    document.getElementById('outSigSaksi').innerText = sigSaksi;
    document.getElementById('outSigPenyewa').innerText = sigPenyewa;

    // Table rows
    const tbodyIn = document.getElementById('itemsBody');
    const tbodyOut = document.getElementById('outItemsBody');
    tbodyOut.innerHTML = ''; // Clear existing
    
    // Add minimum empty rows if needed to make the invoice look full
    const minRows = 5;
    let actualRows = tbodyIn.children.length;

    for (let i = 0; i < Math.max(actualRows, minRows); i++) {
        const trOut = document.createElement('tr');
        
        if (i < actualRows) {
            const rowIn = tbodyIn.children[i];
            const getVal = (cls) => rowIn.querySelector(cls).value || '-';
            
            // Format Biaya to Rp string if exists
            let rawBiaya = rowIn.querySelector('.row-biaya').value;
            let strBiaya = rawBiaya ? 'Rp ' + new Intl.NumberFormat('id-ID').format(rawBiaya) : 'Rp -';

            trOut.innerHTML = `
                <td>${getVal('.row-no')}</td>
                <td>${getVal('.row-tgl')}</td>
                <td>${getVal('.row-mobil')}</td>
                <td>${getVal('.row-nopol')}</td>
                <td>${getVal('.row-driver')}</td>
                <td>${getVal('.row-tujuan')}</td>
                <td>${getVal('.row-mulai')}</td>
                <td>${getVal('.row-selesai')}</td>
                <td>${getVal('.row-jamot')}</td>
                <td>${getVal('.row-nominalot')}</td>
                <td>${strBiaya}</td>
            `;
        } else {
            // Empty rows filler
            trOut.innerHTML = `
                <td></td><td></td><td></td><td></td><td></td><td></td>
                <td></td><td></td><td></td><td></td><td></td>
            `;
        }
        tbodyOut.appendChild(trOut);
    }
    
    // Show Preview Section
    document.getElementById('previewSection').style.display = 'flex';
}

function closePreview() {
    document.getElementById('previewSection').style.display = 'none';
}

// ============== EXPORT FUNCTIONS ==============

async function getCanvas() {
    const element = document.getElementById('invoiceTemplate');
    return await html2canvas(element, { scale: 2, useCORS: true });
}

async function exportToImage() {
    try {
        const canvas = await getCanvas();
        const link = document.createElement('a');
        const docType = document.getElementById('documentType').value || 'Invoice';
        link.download = `${docType}_BTM_${document.getElementById('customerName').value || 'Client'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        alert("Gagal menyimpan gambar: " + err.message);
    }
}

async function exportToPDF() {
    try {
        const canvas = await getCanvas();
        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        // A4 dimension: 210 x 297 mm
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        const docType = document.getElementById('documentType').value || 'Invoice';
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${docType}_BTM_${document.getElementById('customerName').value || 'Client'}.pdf`);
    } catch (err) {
        alert("Gagal menyimpan PDF: " + err.message);
    }
}

async function shareToWhatsApp() {
    // Generate preview first to ensure latest data
    generatePreview();
    
    try {
        const canvas = await getCanvas();
        canvas.toBlob(async (blob) => {
            const docType = document.getElementById('documentType').value || 'Invoice';
            const file = new File([blob], `${docType}_BTM.png`, { type: "image/png" });
            
            // Check if native share exists and supports files (mostly Mobile)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `${docType} BTM`,
                    text: `Berikut adalah ${docType} pesanan Anda.`,
                    files: [file]
                });
            } else {
                // Fallback for Desktop: Save file, alert user, and open WA Web with text message
                alert("Perangkat ini belum mendukung fitur bagi gambar otomatis ke WhatsApp via Web App.\n\nGambar akan diunduh, silakan kirim secara manual melalui WhatsApp.");
                
                // Trigger download
                const link = document.createElement('a');
                link.download = `${docType}_BTM.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                
                // Open WA With text
                const docTypeLower = docType.toLowerCase();
                const textMsg = encodeURIComponent(`Halo ${document.getElementById('customerName').value},\n\nBerikut total tagihan penyewaan Anda di Bagas Trans Mandiri sejumlah Rp ${document.getElementById('totalCost').value}.\nMohon cek gambar ${docTypeLower} terlampir.\n\nTerima kasih.`);
                window.open(`https://api.whatsapp.com/send?text=${textMsg}`, '_blank');
            }
        }, 'image/png');
        
    } catch (err) {
        alert("Gagal memproses berbagi ke WhatsApp.");
        console.error(err);
    }
}
