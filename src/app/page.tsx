'use client';

import { useState, useRef, useCallback } from 'react';

interface InvoiceRow {
  no: number;
  tanggal: string;
  mobil: string;
  nopol: string;
  driver: string;
  tujuan: string;
  waktuMulai: string;
  waktuSelesai: string;
  overtimeJam: string;
  overtimeNominal: string;
  biayaBersih: string;
}

const emptyRow = (no: number): InvoiceRow => ({
  no,
  tanggal: '',
  mobil: '',
  nopol: '',
  driver: '',
  tujuan: '',
  waktuMulai: '',
  waktuSelesai: '',
  overtimeJam: '',
  overtimeNominal: '',
  biayaBersih: '',
});

export default function Home() {
  // Company defaults
  const [companyPhone, setCompanyPhone] = useState('0821 3443 9272');
  const [companyAddress, setCompanyAddress] = useState(
    'Jln. Kampung Ngunut, Jeruklegi No.1 Rt 04. Rw 05, Katongan, Nglipar, Gunungkidul, DIY 55852'
  );
  const [companyTagline, setCompanyTagline] = useState(
    'Profesional Jasa Transportasi City Tour Yogyakarta'
  );

  // Invoice data
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('LUNAS');
  const [notes, setNotes] = useState(
    'NB. Biaya Over Time Dihitung 10% Dari Harga, Harga Belum Termasuk Tol, Parkir Luar Kota\nNo.Rekening Bank BRI 6981-01-005150-50-7 (An : Widodo)'
  );

  // Signatures
  const [sigRenter, setSigRenter] = useState('');
  const [sigWitness, setSigWitness] = useState('');
  const [sigRental, setSigRental] = useState('Widodo');

  // Rows
  const [rows, setRows] = useState<InvoiceRow[]>([emptyRow(1)]);

  // Preview
  const [showPreview, setShowPreview] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Add row
  const addRow = () => {
    setRows((prev) => [...prev, emptyRow(prev.length + 1)]);
  };

  // Remove row
  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, no: i + 1 }))
    );
  };

  // Update row
  const updateRow = (index: number, field: keyof InvoiceRow, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // Calculate total
  const calculateTotal = useCallback(() => {
    return rows.reduce((sum, row) => {
      const biaya = parseInt(row.biayaBersih.replace(/[^0-9]/g, ''), 10) || 0;
      const overtime =
        parseInt(row.overtimeNominal.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + biaya + overtime;
    }, 0);
  }, [rows]);

  // Format currency
  const formatCurrency = (val: number) => {
    if (val === 0) return 'Rp -';
    return (
      'Rp ' +
      new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
      }).format(val)
    );
  };

  // Format currency input
  const formatCurrencyInput = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    if (num === 0) return '';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Generate Invoice
  const handleGenerate = () => {
    setShowPreview(true);
  };

  // Reset form
  const handleReset = () => {
    setInvoiceNumber('');
    setCustomerName('');
    setCustomerCompany('');
    setCustomerAddress('');
    setCustomerPhone('');
    setPaymentStatus('LUNAS');
    setNotes(
      'NB. Biaya Over Time Dihitung 10% Dari Harga, Harga Belum Termasuk Tol, Parkir Luar Kota\nNo.Rekening Bank BRI 6981-01-005150-50-7 (An : Widodo)'
    );
    setSigRenter('');
    setSigWitness('');
    setSigRental('Widodo');
    setRows([emptyRow(1)]);
  };

  // Export as Image
  const exportImage = async () => {
    if (!invoiceRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const link = document.createElement('a');
    link.download = `Invoice-${invoiceNumber || 'BTM'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Export as PDF
  const exportPDF = async () => {
    if (!invoiceRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoiceNumber || 'BTM'}.pdf`);
  };

  // Fill empty rows to minimum 5 for the invoice template
  const getDisplayRows = () => {
    const display = [...rows];
    while (display.length < 5) {
      display.push(emptyRow(display.length + 1));
    }
    return display;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="app-nav">
        <div className="nav-content">
          <i className="ri-file-list-3-fill" style={{ fontSize: '1.5rem' }}></i>
          <h1>BTM Invoice Generator</h1>
        </div>
      </nav>

      {/* Form Section */}
      <div className="container">
        <div className="glass-panel">
          {/* Company Info Section */}
          <h2 className="section-title">Informasi Perusahaan</h2>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="companyPhone">No. Telepon Perusahaan</label>
              <input
                id="companyPhone"
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="Nomor Telepon..."
              />
            </div>
            <div className="input-group">
              <label htmlFor="companyTagline">Tagline Perusahaan</label>
              <input
                id="companyTagline"
                type="text"
                value={companyTagline}
                onChange={(e) => setCompanyTagline(e.target.value)}
                placeholder="Tagline..."
              />
            </div>
            <div className="input-group full-width">
              <label htmlFor="companyAddress">Alamat Perusahaan</label>
              <textarea
                id="companyAddress"
                rows={2}
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Alamat Perusahaan..."
              />
            </div>
          </div>

          {/* Customer Section */}
          <h2 className="section-title mt-4">Data Invoice</h2>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="invoiceNumber">Nomor Invoice</label>
              <input
                id="invoiceNumber"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Contoh: 001/BTM/III/2026"
              />
            </div>
            <div className="input-group">
              <label htmlFor="customerName">Nama Penyewa</label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama penyewa..."
              />
            </div>
            <div className="input-group">
              <label htmlFor="customerPhone">No. Telp Penyewa</label>
              <input
                id="customerPhone"
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Nomor telepon..."
              />
            </div>
            <div className="input-group">
              <label htmlFor="customerCompany">
                Perusahaan / Industry / Pribadi
              </label>
              <input
                id="customerCompany"
                type="text"
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                placeholder="Nama perusahaan atau pribadi..."
              />
            </div>
            <div className="input-group full-width">
              <label htmlFor="customerAddress">Alamat</label>
              <input
                id="customerAddress"
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Alamat penyewa..."
              />
            </div>
          </div>

          {/* Items Table */}
          <h2 className="section-title mt-4">Detail Sewa Kendaraan</h2>
          <div className="table-responsive">
            <table className="form-table">
              <thead>
                <tr>
                  <th style={{ width: '45px' }}>No</th>
                  <th style={{ width: '120px' }}>Tanggal</th>
                  <th style={{ width: '120px' }}>Mobil</th>
                  <th style={{ width: '100px' }}>No. POL</th>
                  <th style={{ width: '120px' }}>Driver</th>
                  <th>Tujuan</th>
                  <th style={{ width: '90px' }}>Mulai</th>
                  <th style={{ width: '90px' }}>Selesai</th>
                  <th style={{ width: '70px' }}>OT Jam</th>
                  <th style={{ width: '120px' }}>OT Nominal</th>
                  <th style={{ width: '130px' }}>Biaya Bersih</th>
                  <th style={{ width: '50px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {row.no}
                    </td>
                    <td>
                      <input
                        type="date"
                        value={row.tanggal}
                        onChange={(e) => updateRow(i, 'tanggal', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.mobil}
                        onChange={(e) => updateRow(i, 'mobil', e.target.value)}
                        placeholder="Avanza..."
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.nopol}
                        onChange={(e) => updateRow(i, 'nopol', e.target.value)}
                        placeholder="AB 1234 CD"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.driver}
                        onChange={(e) => updateRow(i, 'driver', e.target.value)}
                        placeholder="Nama driver"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.tujuan}
                        onChange={(e) => updateRow(i, 'tujuan', e.target.value)}
                        placeholder="Tujuan..."
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={row.waktuMulai}
                        onChange={(e) =>
                          updateRow(i, 'waktuMulai', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={row.waktuSelesai}
                        onChange={(e) =>
                          updateRow(i, 'waktuSelesai', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.overtimeJam}
                        onChange={(e) =>
                          updateRow(i, 'overtimeJam', e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.overtimeNominal}
                        onChange={(e) =>
                          updateRow(
                            i,
                            'overtimeNominal',
                            formatCurrencyInput(e.target.value)
                          )
                        }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.biayaBersih}
                        onChange={(e) =>
                          updateRow(
                            i,
                            'biayaBersih',
                            formatCurrencyInput(e.target.value)
                          )
                        }
                        placeholder="0"
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeRow(i)}
                        title="Hapus baris"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn btn-secondary" onClick={addRow}>
            <i className="ri-add-line"></i> Tambah Baris
          </button>

          {/* Total */}
          <div className="total-section mt-2">
            <div className="input-group">
              <label>Total Biaya</label>
              <input
                id="totalCost"
                type="text"
                readOnly
                value={formatCurrency(calculateTotal())}
              />
            </div>
          </div>

          {/* Payment & Signatures */}
          <h2 className="section-title mt-4">Pembayaran &amp; Tanda Tangan</h2>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="paymentStatus">Status Pembayaran</label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="LUNAS">LUNAS</option>
                <option value="BELUM LUNAS">BELUM LUNAS</option>
                <option value="DP">DP (Uang Muka)</option>
              </select>
            </div>
            <div className="input-group full-width">
              <label htmlFor="notes">Catatan / Info Pembayaran</label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="sigRental">Nama Pihak Rental</label>
              <input
                id="sigRental"
                type="text"
                value={sigRental}
                onChange={(e) => setSigRental(e.target.value)}
                placeholder="Nama pihak rental..."
              />
            </div>
            <div className="input-group">
              <label htmlFor="sigWitness">Nama Saksi</label>
              <input
                id="sigWitness"
                type="text"
                value={sigWitness}
                onChange={(e) => setSigWitness(e.target.value)}
                placeholder="Nama saksi..."
              />
            </div>
            <div className="input-group">
              <label htmlFor="sigRenter">Nama Penyewa</label>
              <input
                id="sigRenter"
                type="text"
                value={sigRenter}
                onChange={(e) => setSigRenter(e.target.value)}
                placeholder="Nama penyewa..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleGenerate}>
              <i className="ri-eye-line"></i> Lihat Invoice
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              <i className="ri-refresh-line"></i> Reset Form
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && (
        <div className="preview-section">
          {/* Action buttons */}
          <div className="preview-actions">
            <button className="btn btn-success" onClick={exportPDF}>
              <i className="ri-file-pdf-2-line"></i> Unduh PDF
            </button>
            <button className="btn btn-primary" onClick={exportImage}>
              <i className="ri-image-line"></i> Unduh Gambar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowPreview(false)}
            >
              <i className="ri-close-line"></i> Tutup
            </button>
          </div>

          {/* The Invoice */}
          <div className="invoice-wrapper" ref={invoiceRef}>
            {/* Watermark Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="" className="watermark-bg" />
            <div className="invoice-container">
              {/* Header */}
              <div className="invoice-header">
                <div className="header-left">
                  <h2 className="brand-title">Bagas Trans Mandiri</h2>
                  <p className="brand-subtitle">Tour &amp; Travel</p>
                  <div className="company-info">
                    <p>
                      <strong>{companyTagline}</strong>
                    </p>
                    <p>{companyAddress}</p>
                    <p>Tlp {companyPhone}</p>
                  </div>
                </div>
                <div className="header-right">
                  <div className="invoice-number-box">
                    <span className="no-label">No :</span>
                    <span className="no-dots">
                      {invoiceNumber || '............................'}
                    </span>
                  </div>
                  <h2 className="invoice-word">INVOICE</h2>
                </div>
              </div>

              {/* Customer Info */}
              <div className="customer-info-area">
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td className="label-col">Nama Penyewa</td>
                      <td className="colon">:</td>
                      <td className="val-col">
                        <span className="dotted-line">{customerName || '\u00A0'}</span>
                      </td>
                      <td className="label-col-right">No. Telp</td>
                      <td className="colon">:</td>
                      <td className="val-col-right">
                        <span className="dotted-line">{customerPhone || '\u00A0'}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="label-col">
                        Perusahaan / industry / Pribadi
                      </td>
                      <td className="colon">:</td>
                      <td className="val-col-full" colSpan={4}>
                        <span className="dotted-line">{customerCompany || '\u00A0'}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="label-col">Alamat</td>
                      <td className="colon">:</td>
                      <td className="val-col-full" colSpan={4}>
                        <span className="dotted-line">{customerAddress || '\u00A0'}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Detail Table */}
              <div className="invoice-table-area">
                <table className="main-table">
                  <thead>
                    <tr>
                      <th className="col-no" rowSpan={2}>
                        No
                      </th>
                      <th className="col-tgl" rowSpan={2}>
                        Tgl
                      </th>
                      <th rowSpan={2}>Mobil</th>
                      <th rowSpan={2}>No. POL</th>
                      <th rowSpan={2}>Driver</th>
                      <th rowSpan={2}>Tujuan</th>
                      <th colSpan={2}>Waktu pemakaian</th>
                      <th colSpan={2}>Overtime</th>
                      <th rowSpan={2} className="col-biaya">
                        Biaya bersih
                      </th>
                    </tr>
                    <tr>
                      <th className="sub-th">Mulai</th>
                      <th className="sub-th">Selesai</th>
                      <th className="sub-th">Jam</th>
                      <th className="sub-th">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDisplayRows().map((row, i) => {
                      const biayaNum =
                        parseInt(row.biayaBersih.replace(/[^0-9]/g, ''), 10) ||
                        0;
                      const otNomNum =
                        parseInt(
                          row.overtimeNominal.replace(/[^0-9]/g, ''),
                          10
                        ) || 0;
                      const hasData =
                        row.tanggal || row.mobil || row.tujuan || row.driver;
                      return (
                        <tr key={i}>
                          <td>{hasData ? row.no : ''}</td>
                          <td>{formatDate(row.tanggal)}</td>
                          <td>{row.mobil || (hasData ? '-' : '')}</td>
                          <td>{row.nopol || (hasData ? '-' : '')}</td>
                          <td>{row.driver || (hasData ? '-' : '')}</td>
                          <td style={{ textAlign: 'left' }}>
                            {row.tujuan || (hasData ? '-' : '')}
                          </td>
                          <td>{row.waktuMulai || (hasData ? '-' : '')}</td>
                          <td>{row.waktuSelesai || (hasData ? '-' : '')}</td>
                          <td>{row.overtimeJam || (hasData ? '-' : '')}</td>
                          <td style={{ textAlign: 'right' }}>
                            {otNomNum > 0
                              ? formatCurrency(otNomNum)
                              : hasData
                              ? '-'
                              : ''}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {biayaNum > 0
                              ? formatCurrency(biayaNum)
                              : hasData
                              ? 'Rp -'
                              : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer: Notes + Summary */}
              <div className="invoice-footer-area">
                <div className="notes-section">
                  {notes.split('\n').map((line, i) => (
                    <p key={i}>
                      <strong>{line}</strong>
                    </p>
                  ))}
                </div>
                <div className="summary-section">
                  <table className="summary-table">
                    <tbody>
                      <tr>
                        <td className="sum-label">Total Biaya</td>
                        <td className="sum-val">
                          {calculateTotal() > 0
                            ? formatCurrency(calculateTotal())
                            : 'Rp'}
                        </td>
                      </tr>
                      <tr>
                        <td className="sum-label">Keterangan</td>
                        <td className="sum-status">
                          <span className="status-stamp">{paymentStatus}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures */}
              <div className="signatures-area">
                <div className="sig-box">
                  <p>
                    <strong>PIHAK RENTAL</strong>
                  </p>
                  <div className="sig-space"></div>
                  <p>
                    <strong>{sigRental || 'Nama'}</strong>
                  </p>
                </div>
                <div className="sig-box">
                  <p>
                    <strong>Saksi</strong>
                  </p>
                  <div className="sig-space"></div>
                  <p>
                    <strong>{sigWitness || 'Nama'}</strong>
                  </p>
                </div>
                <div className="sig-box">
                  <p>
                    <strong>Penyewa</strong>
                  </p>
                  <div className="sig-space"></div>
                  <p>
                    <strong>{sigRenter || 'Nama'}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
