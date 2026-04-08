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
      fetch('DATA/tabel_product_rows.json'),
      fetch('DATA/tabel_mitra_rows.json'),
    ]);

    if (!productsRes.ok || !mitrasRes.ok) throw new Error('Failed to load data');

    products = await productsRes.json();
    mitras = await mitrasRes.json();

    products = products.map((p) => ({
      ...p,
      deskripsi: p.deskripsi || `Produk ${p.nama_produk} dari Warung Bu Tutut.`,
    }));

    if (mitras.length === 0) {
      mitras = [defaultMitra];
    }
  } catch (err) {
    console.warn('Gagal memuat JSON, gunakan data lokal:', err);
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

function renderProducts() {
  productList.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.foto_url}" alt="${product.nama_produk}" loading="lazy" />
      <div class="card-body">
        <h3>${product.nama_produk}</h3>
        <p class="card-subtitle">${product.kategori} • ${product.sekolah}</p>
        <div class="card-footer">
          <span class="price-tag">${formatPrice(product.harga)}</span>
          <button class="button button-secondary" data-id="${product.product_id}">Lihat</button>
        </div>
      </div>
    `;
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
  return mitra ? mitra.nama_mitra : 'Mitra tidak diketahui';
}

function showProductDetail(productId) {
  const product = products.find((item) => item.product_id === productId);
  if (!product) return;
  detailImage.src = product.foto_url;
  detailImage.alt = product.nama_produk;
  detailCategory.textContent = product.kategori;
  detailName.textContent = product.nama_produk;
  detailPrice.textContent = formatPrice(product.harga);
  detailDescription.textContent = product.deskripsi || 'Deskripsi lengkap belum tersedia.';
  detailStock.textContent = `${product.stok} pcs`;
  detailMitra.textContent = getMitraName(product.mitra_id);
  showSection('detail');
}

function renderAdminLists() {
  productMitraSelect.innerHTML = '';
  mitras.forEach((mitra) => {
    const option = document.createElement('option');
    option.value = mitra.mitra_id;
    option.textContent = mitra.nama_mitra;
    productMitraSelect.appendChild(option);
  });

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
    item.querySelector('[data-action="delete"]').addEventListener('click', () => deleteProduct(product.product_id));
    adminProducts.appendChild(item);
  });

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

function deleteProduct(productId) {
  products = products.filter((product) => product.product_id !== productId);
  storeData('warungProducts', products);
  renderProducts();
  renderAdminLists();
}

function addProduct(event) {
  event.preventDefault();
  const newProduct = {
    product_id: crypto.randomUUID(),
    mitra_id: productMitraSelect.value || defaultMitra.mitra_id,
    nama_produk: document.getElementById('productName').value.trim(),
    harga: document.getElementById('productPrice').value.trim(),
    stok: document.getElementById('productStock').value.trim(),
    kategori: document.getElementById('productCategory').value.trim(),
    foto_url: document.getElementById('productPhoto').value.trim(),
    sekolah: document.getElementById('productSchool').value.trim(),
    deskripsi: `Produk ${document.getElementById('productName').value.trim()} dari Warung Bu Tutut.`,
  };
  products.unshift(newProduct);
  storeData('warungProducts', products);
  productForm.reset();
  renderProducts();
  renderAdminLists();
  showSection('products');
}

function addMitra(event) {
  event.preventDefault();
  const newMitra = {
    mitra_id: crypto.randomUUID(),
    nama_mitra: document.getElementById('mitraName').value.trim(),
    owner_name: '',
    email: document.getElementById('mitraEmail').value.trim(),
    alamat: document.getElementById('mitraAddress').value.trim(),
    kategori: document.getElementById('mitraDesc').value.trim(),
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
  backButton.addEventListener('click', () => showSection('products'));
  productForm.addEventListener('submit', addProduct);
  mitraForm.addEventListener('submit', addMitra);
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
