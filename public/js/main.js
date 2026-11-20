/* ========================================================
   SIA SEKOLAH - MAIN JAVASCRIPT
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Sidebar Toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (toggleBtn && sidebar && backdrop) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      backdrop.classList.toggle('show');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    });
  }

  // 2. Auto-dismiss flash alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) {
        bsAlert.close();
      }
    }, 5000);
  });

  // 3. Live Nilai Calculator in Score Form
  const tugasInput = document.getElementById('nilai_tugas');
  const utsInput = document.getElementById('nilai_uts');
  const uasInput = document.getElementById('nilai_uas');
  const finalDisplay = document.getElementById('preview_nilai_akhir');
  const predikatDisplay = document.getElementById('preview_predikat');

  function updateGradePreview() {
    if (!tugasInput || !utsInput || !uasInput) return;

    const t = parseFloat(tugasInput.value) || 0;
    const ut = parseFloat(utsInput.value) || 0;
    const ua = parseFloat(uasInput.value) || 0;

    const akhir = (t * 0.3) + (ut * 0.3) + (ua * 0.4);
    const score = Math.round(akhir * 100) / 100;

    let predikat = 'D';
    let badgeClass = 'bg-danger';

    if (score >= 88) {
      predikat = 'A (Istimewa)';
      badgeClass = 'bg-success';
    } else if (score >= 80) {
      predikat = 'B+ (Sangat Baik)';
      badgeClass = 'bg-primary';
    } else if (score >= 75) {
      predikat = 'B (Baik)';
      badgeClass = 'bg-info text-dark';
    } else if (score >= 70) {
      predikat = 'C+ (Cukup Baik)';
      badgeClass = 'bg-warning text-dark';
    } else if (score >= 60) {
      predikat = 'C (Cukup)';
      badgeClass = 'bg-secondary';
    }

    if (finalDisplay) {
      finalDisplay.textContent = score.toFixed(2);
    }
    if (predikatDisplay) {
      predikatDisplay.textContent = predikat;
      predikatDisplay.className = `badge ${badgeClass} fs-6 px-3 py-2`;
    }
  }

  if (tugasInput && utsInput && uasInput) {
    tugasInput.addEventListener('input', updateGradePreview);
    utsInput.addEventListener('input', updateGradePreview);
    uasInput.addEventListener('input', updateGradePreview);
    updateGradePreview();
  }
});

/**
 * SweetAlert2 confirmation before deleting a record
 * @param {string} formId ID of the HTML form to submit
 * @param {string} itemName Description/name of the item to delete
 */
function confirmDelete(formId, itemName = 'data ini') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Konfirmasi Hapus Data',
      html: `Apakah Anda yakin ingin menghapus <b>${itemName}</b>?<br><span class="text-danger small">Tindakan ini tidak dapat dibatalkan.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: '<i class="fas fa-trash-alt me-1"></i> Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4 shadow-lg',
        confirmButton: 'btn btn-danger px-4 py-2 rounded-3 me-2',
        cancelButton: 'btn btn-secondary px-4 py-2 rounded-3'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById(formId).submit();
      }
    });
  } else {
    // Fallback if Swal not loaded
    if (confirm(`Apakah Anda yakin ingin menghapus ${itemName}?`)) {
      document.getElementById(formId).submit();
    }
  }
}

