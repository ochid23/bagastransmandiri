<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BTM Invoice Generator</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <!-- Libraries for Export -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <!-- Icons -->
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
</head>
<body>

    <!-- Header App -->
    <nav class="app-nav">
        <div class="nav-content">
            <i class="ri-car-fill" style="font-size: 24px; color: white;"></i>
            <h1>BTM Invoice App</h1>
        </div>
    </nav>

    <main class="container">
        <!-- FORM SECTION -->
        <section class="form-section">
            <div class="glass-panel">
                <h2 class="section-title">Data Usaha / Perusahaan</h2>
                <div class="form-grid">
                    <div class="input-group full-width">
                        <label>Alamat Perusahaan</label>
                        <textarea id="companyAddress" rows="2">Jln. Kampung Ngunut, Jeruklegi No.1 Rt 04. Rw 05, Katongan, Nglipar ,Gunungkidul ,DIY 55852</textarea>
                    </div>
                    <div class="input-group">
                        <label>Nomor Telepon Perusahaan</label>
                        <input type="text" id="companyPhone" value="081804387025">
                    </div>
                </div>

                <h2 class="section-title mt-4">Data Konsumen</h2>
                <div class="form-grid">
                    <div class="input-group">
                        <label>Jenis Dokumen</label>
                        <select id="documentType">
                            <option value="Invoice">Invoice</option>
                            <option value="Kwitansi">Kwitansi</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Nomor Referensi</label>
                        <input type="text" id="invoiceNo" placeholder="Contoh: INV/2026/001">
                    </div>
                    <div class="input-group">
                        <label>Nama Penyewa</label>
                        <input type="text" id="customerName" placeholder="Nama Lengkap / Instansi">
                    </div>
                    <div class="input-group">
                        <label>No. Telp</label>
                        <input type="text" id="customerPhone" placeholder="0812xxx">
                    </div>
                    <div class="input-group">
                        <label>Pribadi / Perusahaan</label>
                        <select id="customerType">
                            <option value="Pribadi">Pribadi</option>
                            <option value="Perusahaan">Perusahaan</option>
                            <option value="Industry">Industry</option>
                        </select>
                    </div>
                    <div class="input-group full-width">
                        <label>Alamat</label>
                        <textarea id="customerAddress" rows="2" placeholder="Alamat lengkap..."></textarea>
                    </div>
                </div>

                <h2 class="section-title mt-4">Rincian Sewa</h2>
                <div class="table-responsive">
                    <table class="form-table" id="itemsTable">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tgl</th>
                                <th>Mobil</th>
                                <th>No. POL</th>
                                <th>Driver</th>
                                <th>Tujuan</th>
                                <th>Mulai</th>
                                <th>Selesai</th>
                                <th>Jam OT</th>
                                <th>Nominal OT</th>
                                <th>Biaya Bersih</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="itemsBody">
                            <!-- Dynamic Rows Here -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary mt-2" onclick="addRow()">
                    <i class="ri-add-line"></i> Tambah Baris
                </button>

                <div class="form-grid mt-4 total-section">
                    <div class="input-group">
                        <label>Status Pembayaran</label>
                        <select id="paymentStatus">
                            <option value="LUNAS">LUNAS</option>
                            <option value="BELUM LUNAS">BELUM LUNAS</option>
                            <option value="DP">DP</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Total Biaya Keseluruhan (Rp)</label>
                        <input type="text" id="totalCost" readonly placeholder="Otomatis dihitung...">
                    </div>
                </div>

                <h2 class="section-title mt-4">Catatan & Informasi Bank</h2>
                <div class="form-grid">
                    <div class="input-group full-width">
                        <label>Catatan Tambahan (NB)</label>
                        <textarea id="invoiceNotes" rows="2">NB. Biaya Over Time Dihitung 10% Dari Harga, Harga Belum Termasuk Tol, Parkir Luar Kota</textarea>
                    </div>
                    <div class="input-group full-width">
                        <label>Informasi Rekening Bank</label>
                        <input type="text" id="bankInfo" value="No.Rekening Bank BRI 6981-01-005150-50-7 (An : Widodo)">
                    </div>
                </div>

                <h2 class="section-title mt-4">Data Penandatangan</h2>
                <div class="form-grid">
                    <div class="input-group">
                        <label>Pihak Rental</label>
                        <input type="text" id="sigRental" value="Widodo" placeholder="Nama Pihak Rental">
                    </div>
                    <div class="input-group">
                        <label>Saksi (Opsional)</label>
                        <input type="text" id="sigSaksi" placeholder="Tanda (-) jika tidak ada">
                    </div>
                    <div class="input-group">
                        <label>Penyewa</label>
                        <input type="text" id="sigPenyewa" placeholder="Otomatis terisi nama penyewa">
                    </div>
                </div>

                <div class="action-buttons mt-4">
                    <button type="button" class="btn btn-primary" onclick="generatePreview()">
                        <i class="ri-eye-line"></i> Tampilkan Preview
                    </button>
                    <button type="button" class="btn btn-success" onclick="shareToWhatsApp()">
                        <i class="ri-whatsapp-line"></i> Bagikan Data
                    </button>
                </div>
            </div>
        </section>

        <!-- PREVIEW SECTION -->
        <section class="preview-section" id="previewSection" style="display: none;">
            <div class="preview-actions">
                <button class="btn btn-primary" onclick="exportToImage()">
                    <i class="ri-image-line"></i> Simpan PNG
                </button>
                <button class="btn btn-danger" onclick="exportToPDF()">
                    <i class="ri-file-pdf-line"></i> Simpan PDF
                </button>
                <button class="btn btn-secondary" onclick="closePreview()">
                    <i class="ri-close-line"></i> Tutup
                </button>
            </div>

            <div class="invoice-wrapper">
                <!-- ACTUAL INVOICE TEMPLATE (TO BE EXPORTED) -->
                <div id="invoiceTemplate" class="invoice-container">
                    <img src="{{ asset('images/logo.png') }}" class="watermark-bg" alt="Watermark" onerror="this.style.display='none'">
                    
                    <div class="invoice-header">
                        <div class="header-left">
                            <h1 class="brand-title">Bagas Trans Mandiri</h1>
                            <p class="brand-subtitle">Tour & Travel</p>
                            <div class="company-info">
                                <p><strong>Profesional Jasa Transportasi City Tour Yogyakarta</strong></p>
                                <p id="outCompanyAddress">Jln. Kampung Ngunut, Jeruklegi No.1 Rt 04. Rw 05, Katongan, Nglipar ,Gunungkidul ,DIY 55852</p>
                                <p>Tlp <span id="outCompanyPhone">081804387025</span></p>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="invoice-number-box">
                                <span class="no-label">No :</span>
                                <span class="no-value" id="outInvoiceNo">...................................................</span>
                            </div>
                            <h2 class="invoice-word" id="outDocTitle">INVOICE</h2>
                        </div>
                    </div>

                    <div class="customer-info-area">
                        <table class="info-table">
                            <tr>
                                <td class="label-col">Nama Penyewa</td>
                                <td class="colon">:</td>
                                <td class="val-col"><span id="outCustomerName"></span></td>
                                <td class="label-col-right">No. Telp</td>
                                <td class="colon">:</td>
                                <td class="val-col-right"><span id="outCustomerPhone"></span></td>
                            </tr>
                            <tr>
                                <td class="label-col">Perusahaan / industry / Pribadi</td>
                                <td class="colon">:</td>
                                <td colspan="4" class="val-col-full"><span id="outCustomerType"></span></td>
                            </tr>
                            <tr>
                                <td class="label-col">Alamat</td>
                                <td class="colon">:</td>
                                <td colspan="4" class="val-col-full"><span id="outCustomerAddress"></span></td>
                            </tr>
                        </table>
                    </div>

                    <div class="invoice-table-area">
                        <table class="main-table">
                            <thead>
                                <tr>
                                    <th rowspan="2" class="col-no">No</th>
                                    <th rowspan="2" class="col-tgl">Tgl</th>
                                    <th rowspan="2" class="col-mobil">Mobil</th>
                                    <th rowspan="2" class="col-nopol">No. POL</th>
                                    <th rowspan="2" class="col-driver">Driver</th>
                                    <th rowspan="2" class="col-tujuan">Tujuan</th>
                                    <th colspan="2">Waktu pemakaian</th>
                                    <th colspan="2">Overtime</th>
                                    <th rowspan="2" class="col-biaya">Biaya bersih</th>
                                </tr>
                                <tr>
                                    <th class="sub-th">Mulai</th>
                                    <th class="sub-th">Selesai</th>
                                    <th class="sub-th">Jam</th>
                                    <th class="sub-th">Nominal</th>
                                </tr>
                            </thead>
                            <tbody id="outItemsBody">
                                <!-- Populated via JS -->
                            </tbody>
                        </table>
                    </div>

                    <div class="invoice-footer-area">
                        <div class="notes-section">
                            <p><strong id="outInvoiceNotes">NB. Biaya Over Time Dihitung 10% Dari Harga, Harga Belum Termasuk Tol, Parkir Luar Kota</strong></p>
                            <p><strong id="outBankInfo">No.Rekening Bank BRI 6981-01-005150-50-7 (An : Widodo)</strong></p>
                        </div>
                        <div class="summary-section">
                            <table class="summary-table">
                                <tr>
                                    <td class="sum-label">Total Biaya</td>
                                    <td class="sum-val">Rp <span id="outTotalCost"></span></td>
                                </tr>
                                <tr>
                                    <td class="sum-label">Keterangan</td>
                                    <td class="sum-status"><span id="outStatus" class="status-stamp">LUNAS</span></td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div class="signatures-area">
                        <div class="sig-box">
                            <p><strong>PIHAK RENTAL</strong></p>
                            <div class="sig-space"></div>
                            <p><strong id="outSigRental">Widodo</strong></p>
                        </div>
                        <div class="sig-box">
                            <p><strong>Saksi</strong></p>
                            <div class="sig-space"></div>
                            <p><strong id="outSigSaksi">-</strong></p>
                        </div>
                        <div class="sig-box">
                            <p><strong>Penyewa</strong></p>
                            <div class="sig-space"></div>
                            <p><strong id="outSigPenyewa">Nama Penyewa</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
