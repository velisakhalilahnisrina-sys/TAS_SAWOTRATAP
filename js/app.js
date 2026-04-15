const sections = {
  home: document.getElementById('homeSection'),
  products: document.getElementById('productsSection'),
  mitra: document.getElementById('mitraSection'),
  detail: document.getElementById('detailSection'),
  admin: document.getElementById('adminSection'),
};

const navButtons = document.querySelectorAll('.nav-button');
const productList = document.getElementById('productsList');
const productCount = document.getElementById('productCount');
const mitraList = document.getElementById('mitraList');
const detailSection = document.getElementById('detailSection');
const backButton = document.getElementById('backToProducts');
const detailImage = document.getElementById('detailImage');
const detailCategory = document.getElementById('detailCategory');
const detailName = document.getElementById('detailName');
const detailPrice = document.getElementById('detailPrice');
const detailDescription = document.getElementById('detailDescription');
const detailStock = document.getElementById('detailStock');
const detailMitra = document.getElementById('detailMitra');
const productForm = document.getElementById('productForm');
const mitraForm = document.getElementById('mitraForm');
const productMitraSelect = document.getElementById('productMitra');
const adminProducts = document.getElementById('adminProducts');
const adminMitras = document.getElementById('adminMitras');

let products = [];
let mitras = [];

const defaultMitra = {
  mitra_id: '3a14e3b5-8398-45a7-86a2-c9eb0d4d224c',
  nama_mitra: 'KANTIN BU TUTUT',
  owner_name: 'Retno Maya Nita',
  email: 'rmayanita@gmail.com',
  alamat: 'Griya Permata Gedangan Blok J3 No 31',
  kategori: 'Makanan, Makanan Ringan, Dan Minuman',
  sekolah: 'SMA HANG TUAH 2 SIDOARJO',
};

async function loadDataFromJSON() {
  try {
    const [productsRes, mitrasRes] = await Promise.all([
      fetch('DATA/tabel_product_rows-2.json'),
      fetch('DATA/tabel_mitra_rows.json'),
    ]);

    if (!productsRes.ok || !mitrasRes.ok) throw new Error('Failed to load data');

    products = await productsRes.json();
    mitras = await mitrasRes.json();

    console.log('✅ Data dimuat:', products.length, 'produk,', mitras.length, 'mitra');

    products = products.map((p) => ({
      ...p,
      deskripsi: p.deskripsi || `Produk ${p.nama_produk} dari Warung Bu Tutut.`,
    }));

    if (mitras.length === 0) {
      mitras = [defaultMitra];
    }
  } catch (err) {
    console.warn('⚠️ Gagal memuat JSON, gunakan data lokal:', err);
    products = getStoredData('warungProducts', []);
    mitras = getStoredData('warungMitras', [defaultMitra]);
  }
}

function getStoredData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (err) {
    return fallback;
  }
}

function storeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showSection(name) {
  Object.values(sections).forEach((section) => {
    section.classList.remove('active');
  });
  detailSection.classList.add('detail-hidden');

  if (name === 'detail') {
    detailSection.classList.remove('detail-hidden');
    detailSection.classList.add('active');
  } else {
    sections[name].classList.add('active');
  }

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.section === name);
  });
}

function formatPrice(price) {
  if (!price) return 'Rp0';
  const numeric = String(price).replace(/\D/g, '');
  return numeric ? `Rp${Number(numeric).toLocaleString('id-ID')}` : 'Rp0';
}

function convertGoogleDriveLink(url) {
  if (!url || typeof url !== 'string') return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="266"%3E%3Crect fill="%23f0e6d2" width="400" height="266"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="%236f4327" text-anchor="middle" dy=".3em"%3EFoto Produk%3C/text%3E%3C/svg%3E';
  
  // Step 1: Cari ID dari berbagai format Google Drive URL
  let fileId = null;
  
  // Format: /d/ID/ atau /id=ID
  const match1 = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match1) fileId = match1[1];
  
  // Format: id=ID
  const match2 = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (match2 && !fileId) fileId = match2[1];
  
  if (fileId) {
    console.log('📸 Loading gambar dengan ID:', fileId);
    return `https://lh3.googleusercontent.com/uc?export=view&id=${fileId}`;
  }
  
  // Jika URL tidak cocok, cek apakah sudah dalam format lh3
  if (url.includes('lh3.googleusercontent.com')) {
    return url;
  }
  
  console.warn('⚠️ URL tidak valid:', url);
  return url;
}

function renderProducts() {
  productList.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    const imgUrl = convertGoogleDriveLink(product.foto_url);
    card.innerHTML = `
      <img src="${imgUrl}" alt="${product.nama_produk}" loading="lazy" />
      <div class="card-body">
        <h3>${product.nama_produk}</h3>
        <p class="card-subtitle">${product.kategori} • ${product.sekolah}</p>
        <div class="card-footer">
          <span class="price-tag">${formatPrice(product.harga)}</span>
          <button class="button button-secondary" data-id="${product.product_id}">Lihat</button>
        </div>
      </div>
    `;
    const img = card.querySelector('img');
    img.onerror = function() {
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="266"%3E%3Crect fill="%23f0e6d2" width="400" height="266"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%236f4327" text-anchor="middle" dy=".3em"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E';
      console.warn('Gambar gagal dimuat:', product.nama_produk);
    };
    const button = card.querySelector('button');
    button.addEventListener('click', () => showProductDetail(product.product_id));
    productList.appendChild(card);
  });
  productCount.textContent = `${products.length} produk tersedia`;
}

function renderMitras() {
  mitraList.innerHTML = '';
  mitras.forEach((mitra) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-body">
        <h3>${mitra.nama_mitra}</h3>
        <p class="card-subtitle">${mitra.kategori}</p>
        <p>${mitra.alamat}</p>
      </div>
    `;
    mitraList.appendChild(card);
  });
}

function getMitraName(id) {
  const mitra = mitras.find((item) => item.mitra_id === id);
  return mitra ? mitra.nama_mitra : 'Mitra Tak Diketahui';
}

function showProductDetail(productId) {
  const product = products.find((item) => item.product_id === productId);
  if (!product) return;
  const imgUrl = convertGoogleDriveLink(product.foto_url);
  detailImage.src = imgUrl;
  detailImage.alt = product.nama_produk;
  detailImage.onerror = function() {
    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0e6d2" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="%236f4327" text-anchor="middle" dy=".3em"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E';
  };
  detailCategory.textContent = product.kategori;
  detailName.textContent = product.nama_produk;
  detailPrice.textContent = formatPrice(product.harga);
  detailDescription.textContent = product.deskripsi || 'Deskripsi lengkap belum tersedia.';
  detailStock.textContent = `${product.stok} pcs`;
  detailMitra.textContent = getMitraName(product.mitra_id);
  showSection('detail');
}

function renderAdminLists() {
  if (!productMitraSelect) return;
  
  productMitraSelect.innerHTML = '';
  mitras.forEach((mitra) => {
    const option = document.createElement('option');
    option.value = mitra.mitra_id;
    option.textContent = mitra.nama_mitra;
    productMitraSelect.appendChild(option);
  });

  if (adminProducts) {
    adminProducts.innerHTML = '';
    products.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';
      item.innerHTML = `
        <h4>${product.nama_produk}</h4>
        <p>${formatPrice(product.harga)} • ${product.kategori}</p>
        <div class="admin-actions">
          <button class="button button-secondary" data-action="edit" data-id="${product.product_id}">Edit</button>
          <button class="button button-secondary" data-action="delete" data-id="${product.product_id}">Hapus</button>
        </div>
      `;
      const editBtn = item.querySelector('[data-action="edit"]');
      const deleteBtn = item.querySelector('[data-action="delete"]');
      if (editBtn) editBtn.addEventListener('click', () => editProduct(product.product_id));
      if (deleteBtn) deleteBtn.addEventListener('click', () => deleteProduct(product.product_id));
      adminProducts.appendChild(item);
    });
  }

  if (adminMitras) {
    adminMitras.innerHTML = '';
    mitras.forEach((mitra) => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';
      item.innerHTML = `
        <h4>${mitra.nama_mitra}</h4>
        <p>${mitra.kategori}</p>
        <p>${mitra.alamat}</p>
      `;
      adminMitras.appendChild(item);
    });
  }
}

function deleteProduct(productId) {
  products = products.filter((product) => product.product_id !== productId);
  storeData('warungProducts', products);
  renderProducts();
  renderAdminLists();
}

function editProduct(productId) {
  const product = products.find((p) => p.product_id === productId);
  if (!product) return;
  
  document.getElementById('productName').value = product.nama_produk;
  document.getElementById('productPrice').value = product.harga;
  document.getElementById('productStock').value = product.stok;
  document.getElementById('productCategory').value = product.kategori;
  document.getElementById('productPhoto').value = product.foto_url;
  document.getElementById('productSchool').value = product.sekolah;
  productMitraSelect.value = product.mitra_id;
  
  productForm.dataset.editId = productId;
  productForm.querySelector('button[type="submit"]').textContent = 'Perbarui Produk';
  
  showSection('admin');
}

function addProduct(event) {
  event.preventDefault();
  
  const editId = productForm.dataset.editId;
  const productName = document.getElementById('productName').value.trim();
  const productPrice = document.getElementById('productPrice').value.trim();
  const productStock = document.getElementById('productStock').value.trim();
  
  // Validation
  if (!productName || !productPrice || !productStock) {
    alert('Harap isi semua field yang wajib');
    return;
  }
  
  const productData = {
    mitra_id: productMitraSelect.value || defaultMitra.mitra_id,
    nama_produk: productName,
    harga: productPrice,
    stok: productStock,
    kategori: document.getElementById('productCategory').value.trim(),
    foto_url: document.getElementById('productPhoto').value.trim(),
    sekolah: document.getElementById('productSchool').value.trim(),
    deskripsi: `Produk ${productName} dari Warung Bu Tutut.`,
  };

  if (editId) {
    // Update existing product
    const productIndex = products.findIndex((p) => p.product_id === editId);
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...productData };
    }
    delete productForm.dataset.editId;
    productForm.querySelector('button[type="submit"]').textContent = 'Simpan Produk';
  } else {
    // Add new product
    const newProduct = {
      product_id: crypto.randomUUID(),
      ...productData,
    };
    products.unshift(newProduct);
  }
  
  storeData('warungProducts', products);
  productForm.reset();
  renderProducts();
  renderAdminLists();
  showSection('products');
}

function addMitra(event) {
  event.preventDefault();
  
  const mitraName = document.getElementById('mitraName').value.trim();
  const mitraEmail = document.getElementById('mitraEmail').value.trim();
  const mitraAddress = document.getElementById('mitraAddress').value.trim();
  const mitraDesc = document.getElementById('mitraDesc').value.trim();
  
  // Validation
  if (!mitraName || !mitraEmail || !mitraAddress || !mitraDesc) {
    alert('Harap isi semua field yang wajib');
    return;
  }
  
  const newMitra = {
    mitra_id: crypto.randomUUID(),
    nama_mitra: mitraName,
    owner_name: '',
    email: mitraEmail,
    alamat: mitraAddress,
    kategori: mitraDesc,
    sekolah: '',
  };
  mitras.unshift(newMitra);
  storeData('warungMitras', mitras);
  mitraForm.reset();
  renderMitras();
  renderAdminLists();
  showSection('mitra');
}

function initData() {
  mitras = getStoredData('warungMitras', [defaultMitra]);
  products = getStoredData('warungProducts', []);
}

function initEvents() {
  navButtons.forEach((button) => {
    button.addEventListener('click', () => showSection(button.dataset.section));
  });
  if (backButton) {
    backButton.addEventListener('click', () => showSection('products'));
  }
  if (productForm) {
    productForm.addEventListener('submit', addProduct);
  }
  if (mitraForm) {
    mitraForm.addEventListener('submit', addMitra);
  }
}

async function initApp() {
  initData();
  await loadDataFromJSON();
  renderProducts();
  renderMitras();
  renderAdminLists();
  initEvents();
}

initApp();
