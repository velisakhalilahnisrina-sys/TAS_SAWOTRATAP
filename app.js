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

const defaultProducts = [
  {
    product_id: '008ab3f2-8492-4963-81da-fca10c27baee',
    mitra_id: '079c2f92-564f-49a1-8768-cc7c59c58e2b',
    nama_produk: 'Es Teh Manis',
    harga: '3.000',
    stok: '20',
    kategori: 'Minuman',
    foto_url: 'https://images.unsplash.com/photo-1544025162-58ec5c3a7f3a?auto=format&fit=crop&w=800&q=80',
    sekolah: 'SMA HANG TUAH 2 SIDOARJO',
    deskripsi: 'Minuman segar manis khas warung dengan es teh pilihan.',
  },
  {
    product_id: '02885576-08e8-46d6-abec-6d6ae6bad1bc',
    mitra_id: '2a12fcc2-92e2-4eee-a974-36b55014d0a2',
    nama_produk: 'Nasi Goreng',
    harga: '12.000',
    stok: '15',
    kategori: 'Makanan',
    foto_url: 'https://images.unsplash.com/photo-1604908176821-5c4b41bfa4e6?auto=format&fit=crop&w=800&q=80',
    sekolah: 'SMA HANG TUAH 2 SIDOARJO',
    deskripsi: 'Nasi goreng lezat dengan sayuran dan telur, cocok untuk sarapan atau makan siang cepat.',
  },
  {
    product_id: '2db8f790-a746-46da-a625-c77495cb5f77',
    mitra_id: '1597bbb4-52df-406d-ae69-0a9e105bedf1',
    nama_produk: 'Batagor',
    harga: '10.000',
    stok: '30',
    kategori: 'Makanan',
    foto_url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
    sekolah: 'SMA HANG TUAH 2 SIDOARJO',
    deskripsi: 'Batagor panas dengan saus kacang gurih, favorit pelajar dan warga sekitar.',
  },
];

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
  products = getStoredData('warungProducts', defaultProducts);
}

function initEvents() {
  navButtons.forEach((button) => {
    button.addEventListener('click', () => showSection(button.dataset.section));
  });
  backButton.addEventListener('click', () => showSection('products'));
  productForm.addEventListener('submit', addProduct);
  mitraForm.addEventListener('submit', addMitra);
}

function initApp() {
  initData();
  renderProducts();
  renderMitras();
  renderAdminLists();
  initEvents();
}

initApp();
