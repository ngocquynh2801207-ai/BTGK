// ==================== DATA ====================
const devices = [
  { id: 'TB-001', name: 'Máy lạnh Daikin 2HP', type: 'Điện lạnh', loc: 'P.101 - Tòa A',  status: 'Bảo trì',   date: '05/2023', warranty: 'Còn 4 tháng', views: 0 },
  { id: 'TB-002', name: 'Router Cisco AX',       type: 'Mạng',       loc: 'P.201 - Tòa B',  status: 'Hoạt động', date: '03/2023', warranty: 'Hết hạn',    views: 1 },
  { id: 'TB-003', name: 'Máy chiếu Epson',       type: 'Trình chiếu', loc: 'Hội trường',    status: 'Hoạt động', date: '03/2023', warranty: 'Hết hạn',    views: 0 },
  { id: 'TB-004', name: 'Máy in HP Laser',       type: 'Văn phòng',  loc: 'Phòng Giám đốc', status: 'Hoạt động', date: '04/2023', warranty: 'Còn 4 tháng', views: 3 },
  { id: 'TB-005', name: 'Camera Hikvision',      type: 'An ninh',    loc: 'Sân sau',        status: 'Bảo trì',   date: '05/2023', warranty: 'Hết hạn',    views: 4 },
  { id: 'TB-006', name: 'Máy lạnh Daikin 2HP',   type: 'Điện lạnh',  loc: 'P.101 - Tòa A',  status: 'Bảo trì',   date: '07/2023', warranty: 'Hết hạn',    views: 5 },
  { id: 'TB-007', name: 'Router Cisco AX',       type: 'Mạng',       loc: 'P.201 - Tòa B',  status: 'Hoạt động', date: '07/2023', warranty: 'Còn 3 tháng', views: 0 },
  { id: 'TB-008', name: 'Máy chiếu Epson',       type: 'Trình chiếu', loc: 'Hội trường',    status: 'Hoạt động', date: '08/2023', warranty: 'Hết hạn',    views: 1 },
  { id: 'TB-009', name: 'Máy in HP Laser',       type: 'Văn phòng',  loc: 'Phòng Giám đốc', status: 'Bảo trì',   date: '01/2023', warranty: 'Hết hạn',    views: 2 },
  { id: 'TB-010', name: 'Camera Hikvision',      type: 'An ninh',    loc: 'Sân sau',        status: 'Hoạt động', date: '02/2023', warranty: 'Còn 4 tháng', views: 3 },
  { id: 'TB-011', name: 'Máy lạnh Daikin 2HP',   type: 'Điện lạnh',  loc: 'P.101 - Tòa A',  status: 'Hoạt động', date: '03/2023', warranty: 'Hết hạn',    views: 4 }
];

let activeTabFilter = 'Hoạt động';
let editingDeviceId = null;

function nextDeviceId() {
  const lastId = devices.reduce((max, device) => {
    const number = Number(device.id.slice(3));
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 0);
  return `TB-${String(lastId + 1).padStart(3, '0')}`;
}

function renderStatusCounts() {
  const statusCounts = devices.reduce((counts, device) => {
    counts[device.status] = (counts[device.status] || 0) + 1;
    return counts;
  }, {});

  document.querySelectorAll('.dem-trang-thai').forEach(count => {
    count.textContent = statusCounts[count.dataset.status] || 0;
  });
  document.getElementById('totalDeviceCount').textContent = devices.length;
}

function getFilteredDevices() {
  let data = devices;
  const search = document.getElementById('deviceSearch').value.toLowerCase().trim();
  const type = document.getElementById('filterType').value;
  const status = document.getElementById('filterStatus').value;
  const location = document.getElementById('filterLocation').value;

  if (activeTabFilter) data = data.filter(device => device.status === activeTabFilter);
  if (search) {
    data = data.filter(device =>
      device.name.toLowerCase().includes(search) || device.id.toLowerCase().includes(search)
    );
  }
  if (type) data = data.filter(device => device.type === type);
  if (status) data = data.filter(device => device.status === status);
  if (location) data = data.filter(device => device.loc === location);

  return data;
}

function renderDevices() {
  const data = getFilteredDevices();
  renderTable(data);
  renderCards(data);
}

// ==================== RENDER TABLE ====================
function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  data.forEach(d => {
    const badgeClass = d.status === 'Bảo trì' ? 'cam' :
      d.status === 'Ngừng hoạt động' ? 'do' : 'xanh';

    const tr = document.createElement('tr');
    [`${d.id} · ${d.name}`, d.type, d.loc].forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `nhan-trang-thai ${badgeClass}`;
    statusBadge.textContent = d.status;
    statusCell.appendChild(statusBadge);
    tr.appendChild(statusCell);

    [d.date, d.warranty, d.views].forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');
    actionButton.className = 'nut-chinh-sua';
    actionButton.type = 'button';
    actionButton.textContent = '⋯';
    actionButton.setAttribute('aria-label', `Chỉnh sửa thiết bị ${d.id}`);
    actionButton.title = 'Chỉnh sửa thiết bị';
    actionButton.dataset.deviceId = d.id;
    actionCell.appendChild(actionButton);
    tr.appendChild(actionCell);
    tbody.appendChild(tr);
  });
}

// ==================== RENDER CARDS ====================
function renderCards(data) {
  const grid = document.getElementById('cardView');
  grid.innerHTML = '';

  data.forEach(d => {
    const badgeClass = d.status === 'Bảo trì' ? 'cam' :
      d.status === 'Ngừng hoạt động' ? 'do' : 'xanh';

    const card = document.createElement('div');
    card.className = 'the-thiet-bi';
    const cardTop = document.createElement('div');
    cardTop.className = 'dau-the-thiet-bi';
    const name = document.createElement('h4');
    name.textContent = d.name;
    const statusBadge = document.createElement('span');
    statusBadge.className = `nhan-trang-thai ${badgeClass}`;
    statusBadge.textContent = d.status;
    cardTop.append(name, statusBadge);

    const meta = document.createElement('p');
    meta.className = 'thong-tin-thiet-bi';
    meta.textContent = `${d.id} · ${d.loc.replace(' - ', ' · ')}`;
    card.append(cardTop, meta);
    grid.appendChild(card);
  });
}

// ==================== VIEW TOGGLE ====================
function initViewToggle() {
  const btnList = document.getElementById('btnList');
  const btnCard = document.getElementById('btnCard');
  const tableView = document.getElementById('tableView');
  const cardView  = document.getElementById('cardView');

  btnList.addEventListener('click', () => {
    btnList.classList.add('dang-chon');
    btnCard.classList.remove('dang-chon');
    tableView.style.display = '';
    cardView.style.display = 'none';
  });

  btnCard.addEventListener('click', () => {
    btnCard.classList.add('dang-chon');
    btnList.classList.remove('dang-chon');
    tableView.style.display = 'none';
    cardView.style.display = '';
  });
}

// ==================== FILTER ====================
function initFilters() {
  document.getElementById('deviceSearch').addEventListener('input', renderDevices);
  document.getElementById('filterType').addEventListener('change', renderDevices);
  document.getElementById('filterStatus').addEventListener('change', renderDevices);
  document.getElementById('filterLocation').addEventListener('change', renderDevices);
}

// ==================== STATUS TABS ====================
function initTabs() {
  document.querySelectorAll('.muc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.muc-tab').forEach(t => t.classList.remove('dang-chon'));
      tab.classList.add('dang-chon');
      activeTabFilter = tab.dataset.filter;
      renderDevices();
    });
  });
}

// ==================== MODAL ====================
function initModal() {
  const overlay  = document.getElementById('modalOverlay');
  const btnAdd   = document.getElementById('btnAdd');
  const btnClose = document.getElementById('modalClose');
  const btnCancel = overlay.querySelector('.nut-huy');
  const form = document.getElementById('deviceForm');
  const idInput = document.getElementById('deviceId');
  const purchaseDateInput = document.getElementById('devicePurchaseDate');
  const modalTitle = overlay.querySelector('.dau-hop-thoai h2');
  const saveButton = form.querySelector('.nut-luu');

  function closeModal() {
    overlay.classList.remove('hien-thi');
    editingDeviceId = null;
  }

  function openEditModal(device) {
    editingDeviceId = device.id;
    idInput.value = device.id;
    document.getElementById('deviceName').value = device.name;
    document.getElementById('deviceType').value = device.type;
    document.getElementById('deviceLocation').value = device.loc;
    document.getElementById('deviceStatus').value = device.status;
    const [month, year] = device.date.split('/');
    purchaseDateInput.value = `${year}-${month.padStart(2, '0')}`;
    document.getElementById('deviceWarranty').value = device.warranty;
    modalTitle.textContent = 'Chỉnh sửa thiết bị';
    saveButton.textContent = 'Cập nhật';
    overlay.classList.add('hien-thi');
  }

  btnAdd.addEventListener('click', () => {
    form.reset();
    editingDeviceId = null;
    idInput.value = nextDeviceId();
    purchaseDateInput.value = new Date().toISOString().slice(0, 7);
    modalTitle.textContent = 'Thêm Thiết Bị Mới';
    saveButton.textContent = 'Lưu';
    overlay.classList.add('hien-thi');
  });
  document.getElementById('tableBody').addEventListener('click', e => {
    const button = e.target.closest('.nut-chinh-sua');
    if (!button) return;
    const device = devices.find(item => item.id === button.dataset.deviceId);
    if (device) openEditModal(device);
  });
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const [year, month] = purchaseDateInput.value.split('-');
    const status = document.getElementById('deviceStatus').value;
    const deviceData = {
      name: document.getElementById('deviceName').value.trim(),
      type: document.getElementById('deviceType').value,
      loc: document.getElementById('deviceLocation').value,
      status,
      date: `${month}/${year}`,
      warranty: document.getElementById('deviceWarranty').value
    };

    if (editingDeviceId) {
      const device = devices.find(item => item.id === editingDeviceId);
      if (!device) return;
      Object.assign(device, deviceData);
    } else {
      devices.push({
        id: idInput.value,
        ...deviceData,
        views: 0
      });
    }
    renderStatusCounts();
    renderDevices();
    form.reset();
    closeModal();
  });
}

// ==================== SIDEBAR NAV ====================
function initSidebar() {
  document.querySelectorAll('.muc-dieu-huong').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.muc-dieu-huong').forEach(l => l.classList.remove('dang-chon'));
      link.classList.add('dang-chon');
    });
  });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  renderStatusCounts();
  renderDevices();
  initViewToggle();
  initFilters();
  initTabs();
  initModal();
  initSidebar();
});