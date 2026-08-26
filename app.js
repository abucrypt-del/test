let menuCategories = JSON.parse(localStorage.getItem("alyazi-categories-v1") || "null") || ["Mandi", "Chicken Mandi", "BBQ", "Extras"];
let menuItems = JSON.parse(localStorage.getItem("alyazi-menu-en-v6") || "null") || [
  { id: 1, name: "Mutton Yemeni Mandi - 1 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 395, category: "Mandi", badge: "Signature", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Mutton Yemeni Mandi - 2 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 790, category: "Mandi", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Mutton Yemeni Mandi - 3 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 1299, category: "Mandi", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "Mutton Yemeni Mandi - 4 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 1599, category: "Mandi", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "Mutton Yemeni Mandi - Nalli Part", description: "Mutton mandi with tender bone marrow nalli", price: 1699, category: "Mandi", badge: "Special", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80" },
  { id: 6, name: "Chicken Alfaham Mandi - 1 Person", description: "Charcoal chicken, mandi rice, dakous", price: 270, category: "Chicken Mandi", badge: "Popular", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80" },
  { id: 7, name: "Chicken Alfaham Mandi - 2 Person", description: "Charcoal chicken, mandi rice, dakous", price: 540, category: "Chicken Mandi", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80" },
  { id: 8, name: "Chicken Alfaham Mandi - 3 Person", description: "Charcoal chicken, mandi rice, dakous", price: 810, category: "Chicken Mandi", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80" },
  { id: 9, name: "Chicken Alfaham Mandi - 4 Person", description: "Charcoal chicken, mandi rice, dakous", price: 1000, category: "Chicken Mandi", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80" },
  { id: 10, name: "Chicken Moroccan Mandi - 1 Person", description: "Moroccan-style chicken with mandi rice", price: 290, category: "Chicken Mandi", badge: "New", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80" },
  { id: 11, name: "Chicken Moroccan Mandi - 2 Person", description: "Moroccan-style chicken with mandi rice", price: 580, category: "Chicken Mandi", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80" },
  { id: 12, name: "Chicken Moroccan Mandi - 3 Person", description: "Moroccan-style chicken with mandi rice", price: 870, category: "Chicken Mandi", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80" },
  { id: 13, name: "Chicken Moroccan Mandi - 4 Person", description: "Moroccan-style chicken with mandi rice", price: 1100, category: "Chicken Mandi", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80" },
  { id: 14, name: "BBQ Chicken - 1/4", description: "Smoky grilled chicken quarter", price: 160, category: "BBQ", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80" },
  { id: 15, name: "BBQ Chicken - 1/2", description: "Smoky grilled chicken half", price: 320, category: "BBQ", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80" },
  { id: 16, name: "BBQ Chicken - Full", description: "Smoky grilled whole chicken", price: 605, category: "BBQ", badge: "Grilled", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80" },
  { id: 17, name: "Extra Rice", description: "Extra portion of fragrant mandi rice", price: 150, category: "Extras", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80" },
  { id: 18, name: "Extra Mutton", description: "Extra serving of slow-cooked mutton", price: 314, category: "Extras", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80" },
  { id: 19, name: "Bucket Small", description: "Small serving of mandi rice", price: 39, category: "Extras", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80" },
  { id: 20, name: "Bucket Big", description: "Large serving of mandi rice", price: 49, category: "Extras", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80" }
];

const order = new Map();
let orderMode = "Dine In";
let kotState = "not-sent";
let kotReadyPending = localStorage.getItem("alyazi-kot-status") === "ready";
let kitchenPrepStartedAt = null;
let kitchenPrepTimer = null;
let paymentMethod = "Cash";
let billState = "not-printed";
let paymentReminderTimer = null;
let voiceRecognition = null;
let voiceHolding = false;
const voiceHoldV2 = new URLSearchParams(location.search).get("voice-hold") === "v2";
let upiAccounts = JSON.parse(localStorage.getItem("alyazi-upi-accounts-v1") || "null") || [{ id: 1, name: "AL YAZI MANDI", bank: "Primary bank", upiId: "alyazimandi@upi", enabled: true }];
let selectedUpiId = upiAccounts[0]?.id || null;
let printSettings = JSON.parse(localStorage.getItem("alyazi-print-settings-v1") || "null") || { header: "AL YAZI MANDI RESTRAUNT", phone: "", address: "", footer: "Thank you for dining with us", showLogo: true, showTax: true, showOrderType: true };
let users = JSON.parse(localStorage.getItem("alyazi-users-v1") || "null") || [{ id: 1, name: "Restaurant Owner", email: "owner@alyazi.com", phone: "", role: "Super Admin", password: "admin123" }];
users = users.map(user => ({ ...user, password: user.password || "admin123" }));
// Restore session or redirect to login
let currentUser = (function() {
  const stored = sessionStorage.getItem("alyazi-current-user");
  if (!stored) { window.location.replace("/"); return null; }
  const parsed = JSON.parse(stored);
  // Re-validate against latest users list so password changes take effect
  return users.find(u => u.id === parsed.id) || parsed;
})();
if (!currentUser) throw new Error("Not authenticated");
let currentOrderGuestName = "";
let currentOrderGuestPhone = "";
let printedBills = JSON.parse(localStorage.getItem("alyazi-printed-bills") || "[]");
let sales = JSON.parse(localStorage.getItem("alyazi-sales-v1") || "[]");
let reportExportSales = [];

let currentCabinId = 1;
let cabins = JSON.parse(localStorage.getItem("alyazi-cabins-v1") || "null") || Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `Cabin ${i + 1}`,
  order: new Map(),
  guestName: "",
  guestPhone: "",
  billState: "not-printed",
  kotState: "not-sent",
  orderMode: "Dine In",
  createdAt: new Date().toISOString()
}));
cabins = cabins.map(cabin => ({ ...cabin, order: new Map(cabin.order || []) }));

function saveCabins() {
  const cabinData = cabins.map(cabin => ({
    ...cabin,
    order: Array.from(cabin.order.entries())
  }));
  localStorage.setItem("alyazi-cabins-v1", JSON.stringify(cabinData));
}

function getCabinData(cabinId) {
  return cabins.find(c => c.id === cabinId);
}

function syncCurrentCabinOrder() {
  const cabin = getCabinData(currentCabinId);
  if (!cabin) return;
  cabin.order = new Map(order);
  saveCabins();
}

function switchCabin(cabinId) {
  const currentCabin = getCabinData(currentCabinId);
  if (currentCabin) {
    currentCabin.order = new Map(order);
    currentCabin.guestName = currentOrderGuestName;
    currentCabin.guestPhone = currentOrderGuestPhone;
    currentCabin.billState = billState;
    currentCabin.kotState = kotState;
    currentCabin.orderMode = orderMode;
    saveCabins();
  }
  currentCabinId = cabinId;
  const newCabin = getCabinData(cabinId);
  order.clear();
  newCabin.order.forEach((value, key) => order.set(key, value));
  currentOrderGuestName = newCabin.guestName;
  currentOrderGuestPhone = newCabin.guestPhone;
  const persistedKotState = localStorage.getItem("alyazi-kot-status");
  kotState = persistedKotState === "accepted" || persistedKotState === "ready" || persistedKotState === "sent" ? persistedKotState : newCabin.kotState;
  billState = newCabin.billState;
  orderMode = newCabin.orderMode;
  if (kotState === "accepted") {
    const acceptedAt = Number(localStorage.getItem("alyazi-kot-accepted-at") || Date.now());
    kitchenPrepStartedAt = acceptedAt;
    startKitchenPrepTimer();
  } else {
    stopKitchenPrepTimer();
    kitchenPrepStartedAt = null;
  }
  document.querySelectorAll(".cabin-tab").forEach(tab => tab.classList.remove("active"));
  document.querySelector(`[data-cabin="${cabinId}"]`).classList.add("active");
  document.querySelector("#guest-name").value = currentOrderGuestName;
  document.querySelector("#guest-phone").value = currentOrderGuestPhone;
  renderOrder();
  renderCabinTabs();
}

function restoreActiveCabin() {
  const cabin = getCabinData(currentCabinId);
  if (!cabin) return;
  order.clear();
  cabin.order.forEach((value, key) => order.set(key, value));
  currentOrderGuestName = cabin.guestName;
  currentOrderGuestPhone = cabin.guestPhone;
  const persistedKotState = localStorage.getItem("alyazi-kot-status");
  kotState = persistedKotState === "accepted" || persistedKotState === "ready" || persistedKotState === "sent" ? persistedKotState : cabin.kotState;
  billState = cabin.billState;
  orderMode = cabin.orderMode;
  if (kotState === "accepted") {
    const acceptedAt = Number(localStorage.getItem("alyazi-kot-accepted-at") || Date.now());
    kitchenPrepStartedAt = acceptedAt;
    startKitchenPrepTimer();
  }
  document.querySelector("#guest-name").value = currentOrderGuestName;
  document.querySelector("#guest-phone").value = currentOrderGuestPhone;
}

function renderCabinTabs() {
  const container = document.querySelector(".cabin-tabs");
  if (!container) return;
  container.innerHTML = cabins.map(cabin => {
    const itemCount = cabin.order.size || cabin.order.length || 0;
    const isActive = cabin.id === currentCabinId ? "active" : "";
    return `<button class="cabin-tab ${isActive}" data-cabin="${cabin.id}" title="${cabin.name}">
      ${cabin.name}
      ${itemCount > 0 ? `<span class="item-count">${itemCount}</span>` : ""}
    </button>`;
  }).join("");
  document.querySelectorAll(".cabin-tab").forEach(tab => {
    tab.addEventListener("click", () => switchCabin(Number(tab.dataset.cabin)));
  });
}

function closeCabin(cabinId) {
  const cabin = getCabinData(cabinId);
  if (cabin.billState !== "paid-awaiting-confirmation") {
    showToast("Cabin can only be closed after payment is complete");
    return;
  }
  cabin.order.clear();
  order.clear();
  cabin.guestName = "";
  cabin.guestPhone = "";
  cabin.billState = "not-printed";
  cabin.kotState = "not-sent";
  cabin.orderMode = "Dine In";
  saveCabins();
  showToast(`${cabin.name} closed`);
  switchCabin(1);
}

const menuGrid = document.querySelector("#menu-grid");
const orderList = document.querySelector("#order-list");
const money = value => `₹${value.toFixed(2)}`;

function renderMenu(category = "All") {
  const visible = category === "All" ? menuItems : menuItems.filter(item => item.category === category);
  menuGrid.innerHTML = visible.map((item, index) => `
    <article class="menu-card" style="animation-delay: ${index * 35}ms">
      <div class="food-image" style="background-image: url('${item.image}')">${item.badge ? `<span class="badge">${item.badge}</span>` : ""}</div>
      <div class="card-content">
        <h3>${item.name}</h3><p>${item.description}</p>
        <div class="card-bottom"><span class="price">${money(item.price)}</span><button class="add-button" data-add="${item.id}" aria-label="Add ${item.name}">+</button></div>
      </div>
    </article>`).join("");
}

function renderMenuTable() {
  document.querySelector("#menu-table-body").innerHTML = menuItems.map(item => `<tr><td>${item.name}</td><td><span class="table-category">${item.category}</span></td><td><label class="price-editor"><span>₹</span><input data-price-id="${item.id}" value="${item.price.toFixed(2)}" type="number" min="0" step="0.01" aria-label="Price for ${item.name}"></label></td><td><div class="image-input-group"><input class="image-editor" data-image-id="${item.id}" type="text" placeholder="Image URL or upload" value="${item.image && !item.image.startsWith('data:') ? item.image : ''}" aria-label="Image URL for ${item.name}"><label class="file-upload-btn"><span>📁</span><input type="file" data-file-upload="${item.id}" accept="image/*" style="display:none;" aria-label="Upload image for ${item.name}"></label></div></td><td><button class="delete-menu" data-delete-id="${item.id}" aria-label="Delete ${item.name}">×</button></td></tr>`).join("");
}

function saveCategories() {
  localStorage.setItem("alyazi-categories-v1", JSON.stringify(menuCategories));
}

function renderCategoryTabs() {
  const totalItems = menuItems.length;
  const tabs = `<button class="category-tab active" data-category="All">All items <span>${totalItems}</span></button>` +
    menuCategories.map(cat => {
      const count = menuItems.filter(item => item.category === cat).length;
      return `<button class="category-tab" data-category="${cat}">${cat} <span>${count}</span></button>`;
    }).join("");
  document.querySelector(".category-tabs").innerHTML = tabs;
  document.querySelectorAll(".category-tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelector(".category-tab.active").classList.remove("active"); tab.classList.add("active"); renderMenu(tab.dataset.category);
  }));
}

function renderCategorySelect() {
  const selects = document.querySelectorAll("#new-menu-category");
  selects.forEach(select => {
    select.innerHTML = menuCategories.map(cat => `<option value="${cat}">${cat}</option>`).join("") + `<option value="__new__">+ Add new category</option>`;
    select.addEventListener("change", (e) => {
      if (e.target.value === "__new__") {
        const newCategory = prompt("Enter new category name:");
        if (newCategory && newCategory.trim() && !menuCategories.includes(newCategory.trim())) {
          menuCategories.push(newCategory.trim());
          saveCategories();
          renderCategorySelect();
          e.target.value = newCategory.trim();
          showToast(`Category "${newCategory.trim()}" added`);
        } else {
          e.target.value = menuCategories[0];
        }
      }
    });
  });
}

function renderUsers() {
  const access = { "Super Admin": "Full access", Admin: "Operations + settings", User: "Orders + payments" };
  document.querySelector("#user-table-body").innerHTML = users.map(user => `<tr><td><div class="user-cell"><span class="user-avatar">${user.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}</span><div><strong>${user.name}</strong><small>${user.email}${user.phone ? ` · ${user.phone}` : ""}</small></div></div></td><td><span class="role-badge role-${user.role.toLowerCase().replace(" ", "-")}">${user.role}</span></td><td><span class="access-copy">${access[user.role]}</span></td><td>${user.id === 1 ? "" : `<button class="delete-menu" data-delete-user="${user.id}" aria-label="Delete ${user.name}">×</button>`}</td></tr>`).join("");
}

function saveUsers() {
  localStorage.setItem("alyazi-users-v1", JSON.stringify(users));
  renderUsers();
}

function getResetRequests() {
  return JSON.parse(localStorage.getItem("alyazi-password-reset-requests") || "[]");
}

function saveResetRequests(requests) {
  localStorage.setItem("alyazi-password-reset-requests", JSON.stringify(requests));
}

function renderResetRequests() {
  const button = document.querySelector("#notifications-button");
  const dot = document.querySelector("#notification-dot");
  const list = document.querySelector("#reset-requests-list");
  if (currentUser.role !== "Super Admin") {
    button.hidden = true;
    document.querySelector("#notifications-panel").hidden = true;
    return;
  }
  button.hidden = false;
  const requests = getResetRequests();
  dot.hidden = requests.length === 0;
  list.innerHTML = requests.length
    ? requests.map(req => `<div class="reset-request-row" data-request-id="${req.id}" data-user-id="${req.userId}"><div class="reset-request-info"><strong>${req.userName}</strong><small>${req.role}</small></div><button class="reset-request-action" data-action="start" type="button">Reset password</button></div>`).join("")
    : `<small>No pending requests.</small>`;
}

function renderUpiAccounts() {
  const list = document.querySelector("#upi-accounts-list");
  list.innerHTML = upiAccounts.length ? upiAccounts.map(account => `<div class="upi-account-row"><span class="upi-bank-icon">₹</span><div><strong>${account.name}</strong><small>${account.bank} · ${account.upiId}</small></div><label class="switch"><input type="checkbox" data-upi-toggle="${account.id}" ${account.enabled ? "checked" : ""}><span></span></label>${upiAccounts.length > 1 ? `<button class="delete-menu" data-delete-upi="${account.id}" aria-label="Delete ${account.name}">×</button>` : ""}</div>`).join("") : `<div class="upi-empty">No linked UPI accounts yet.</div>`;
  const enabledAccounts = upiAccounts.filter(account => account.enabled);
  const paymentSelect = document.querySelector("#payment-upi-account");
  paymentSelect.innerHTML = enabledAccounts.map(account => `<option value="${account.id}">${account.name} · ${account.upiId}</option>`).join("");
  if (!enabledAccounts.some(account => account.id === selectedUpiId)) selectedUpiId = enabledAccounts[0]?.id || null;
  if (selectedUpiId) paymentSelect.value = selectedUpiId;
}

function saveUpiAccounts() { localStorage.setItem("alyazi-upi-accounts-v1", JSON.stringify(upiAccounts)); renderUpiAccounts(); }

function loadPrintSettings() {
  document.querySelector("#print-header").value = printSettings.header;
  document.querySelector("#print-phone").value = printSettings.phone;
  document.querySelector("#print-address").value = printSettings.address;
  document.querySelector("#print-footer").value = printSettings.footer;
  document.querySelector("#print-show-logo").checked = printSettings.showLogo;
  document.querySelector("#print-show-tax").checked = printSettings.showTax;
  document.querySelector("#print-show-order-type").checked = printSettings.showOrderType;
}

function renderLoginUsers() {
  document.querySelector("#login-user").innerHTML = users.map(user => `<option value="${user.id}">${user.name} · ${user.role}</option>`).join("");
}

function updateSession() {
  const initials = currentUser.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
  document.querySelector("#profile-button").textContent = initials;
  document.querySelector("#account-name").textContent = currentUser.name;
  document.querySelector("#account-role").textContent = currentUser.role;
  sessionStorage.setItem("alyazi-current-user", JSON.stringify(currentUser));
  renderResetRequests();
}

function renderSales(range = "day", fromDate = "", toDate = "") {
  if (currentUser.role !== "Super Admin") return;
  const now = new Date();
  let from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  if (range === "week") from.setDate(from.getDate() - 6);
  if (range === "month") from.setDate(1);
  if (range === "custom" && fromDate && toDate) { from = new Date(`${fromDate}T00:00:00`); to = new Date(`${toDate}T23:59:59`); }
  const filtered = sales.filter(sale => { const date = new Date(sale.createdAt); return date >= from && date <= to; });
  reportExportSales = filtered;
  const total = filtered.reduce((sum, sale) => sum + sale.total, 0);
  document.querySelector("#report-total").textContent = money(total);
  document.querySelector("#report-orders").textContent = filtered.length;
  document.querySelector("#report-average").textContent = money(filtered.length ? total / filtered.length : 0);
  const bucketCount = range === "day" ? 1 : range === "week" ? 7 : range === "month" ? new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() : 1;
  const buckets = Array.from({ length: bucketCount }, (_, index) => {
    const date = new Date(from); date.setDate(from.getDate() + index);
    const dayTotal = filtered.filter(sale => new Date(sale.createdAt).toDateString() === date.toDateString()).reduce((sum, sale) => sum + sale.total, 0);
    return { label: range === "day" || range === "custom" ? "Sales" : range === "month" ? date.getDate() : date.toLocaleDateString([], { weekday: "short" }), total: dayTotal };
  });
  const maximum = Math.max(...buckets.map(bucket => bucket.total), 1);
  document.querySelector("#sales-chart").innerHTML = buckets.map(bucket => `<div class="chart-column"><strong>${money(bucket.total)}</strong><div class="chart-bar" style="height:${Math.max(bucket.total / maximum * 100, bucket.total ? 8 : 2)}%"></div><span>${bucket.label}</span></div>`).join("");
  const itemTotals = new Map();
    filtered.forEach(sale => sale.items?.forEach(item => {
      const current = itemTotals.get(item.name) || { quantity: 0, revenue: 0 };
      itemTotals.set(item.name, { quantity: current.quantity + item.quantity, revenue: current.revenue + item.price * item.quantity });
    }));
  const rankedItems = [...itemTotals.entries()].sort((first, second) => second[1].quantity - first[1].quantity || second[1].revenue - first[1].revenue);
  const bestSellers = document.querySelector("#best-sellers");
  if (!rankedItems.length) { bestSellers.innerHTML = `<div class="best-sellers-empty">Complete a payment to see menu sales rankings.</div>`; return; }
  const highestQuantity = rankedItems[0][1].quantity;
  bestSellers.innerHTML = rankedItems.map(([name, stats], index) => `<div class="best-seller-row"><span class="rank">${index + 1}</span><div class="best-seller-info"><strong>${name}</strong><div class="rank-bar"><i style="width:${stats.quantity / highestQuantity * 100}%"></i></div></div><span class="sold-count">${stats.quantity} sold</span><strong class="sold-revenue">${money(stats.revenue)}</strong></div>`).join("");
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateKitchenPrepTimer() {
  const workflowBanner = document.querySelector("#workflow-banner");
  const kotStatus = document.querySelector("#kot-status");
  if (kotState !== "accepted") {
    if (workflowBanner) workflowBanner.hidden = kotState !== "completed" && kotState !== "accepted";
    return;
  }
  const startTime = Number(localStorage.getItem("alyazi-kot-accepted-at") || kitchenPrepStartedAt || Date.now());
  kitchenPrepStartedAt = startTime;
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  const timerValue = formatDuration(elapsedSeconds);
  if (workflowBanner) {
    workflowBanner.hidden = false;
    workflowBanner.textContent = `YOUR ORDER IS PREPARING · ${timerValue}`;
  }
  if (kotStatus) {
    kotStatus.textContent = `Preparing order - kitchen is cooking • ${timerValue}`;
  }
}

function startKitchenPrepTimer() {
  stopKitchenPrepTimer();
  const acceptedAt = Number(localStorage.getItem("alyazi-kot-accepted-at") || Date.now());
  kitchenPrepStartedAt = acceptedAt;
  updateKitchenPrepTimer();
  kitchenPrepTimer = setInterval(updateKitchenPrepTimer, 1000);
}

function stopKitchenPrepTimer() {
  if (kitchenPrepTimer) clearInterval(kitchenPrepTimer);
  kitchenPrepTimer = null;
}

function renderOrder() {
  if (!order.size) {
    orderList.innerHTML = `<div class="empty-ticket"><div class="empty-icon">＋</div><strong>Your ticket is empty</strong><p>Select an item from the menu<br>to start this order.</p></div>`;
  } else {
    orderList.innerHTML = [...order.values()].map(item => `
      <div class="order-item"><div><div class="order-name">${item.name}</div><div class="order-controls"><button data-decrease="${item.id}">−</button><span>${item.quantity}</span><button data-increase="${item.id}">＋</button><button class="remove-item" data-remove="${item.id}">Remove</button></div></div><span class="order-price">${money(item.price * item.quantity)}</span></div>`).join("");
  }
  const subtotal = [...order.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * .0825;
  const total = subtotal + tax;
  document.querySelector("#subtotal").textContent = money(subtotal);
  document.querySelector("#tax").textContent = money(tax);
  document.querySelector("#total").textContent = money(total);
  document.querySelector("#charge-total").textContent = money(total);
  document.querySelector("#checkout-button").disabled = !order.size || kotState !== "completed";
  document.querySelector("#send-kot").disabled = !order.size || kotState !== "not-sent";
  if (kotState === "accepted") {
    updateKitchenPrepTimer();
  } else if (kotState === "completed") {
    document.querySelector("#workflow-banner").hidden = false;
    document.querySelector("#workflow-banner").textContent = "YOUR ORDER READY · Kitchen completed this order · Payment is now available";
    document.querySelector("#kot-status").textContent = "Your order is ready";
  }
  const locked = billState === "paid-awaiting-confirmation";
  document.querySelectorAll(".add-button").forEach(button => { button.disabled = locked; });
  document.querySelector("#next-order-button").hidden = !locked;
}

function addItem(id) {
  if (billState === "paid-awaiting-confirmation") { showToast("Confirm the printed bill before starting a new order"); return; }
  const item = menuItems.find(menuItem => menuItem.id === Number(id));
  const current = order.get(item.id);
  order.set(item.id, { ...item, quantity: current ? current.quantity + 1 : 1 });
  syncCurrentCabinOrder();
  renderOrder();
  showToast(`${item.name} added to ticket`);
}

function printTicket(type) {
  if (!order.size) { showToast(`Add items before printing ${type}`); return; }
  renderPrintSheet(type);
  document.body.classList.add("print-ticket");
  window.print();
  document.body.classList.remove("print-ticket");
  showToast(`${type} sent to configured printer`);
}

function renderPrintSheet(type, isReprint = false) {
  const subtotal = [...order.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * .0825;
  const total = subtotal + tax;
  const safe = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const guestInfo = currentOrderGuestName || currentOrderGuestPhone ? `<p>Guest: ${safe(currentOrderGuestName)} ${currentOrderGuestPhone ? `| ${safe(currentOrderGuestPhone)}` : ""}</p>` : "";
  const receiptType = type === "bill" ? (isReprint ? "--- COPY ---" : "--- ORIGINAL ---") : "";
  const html = `${printSettings.showLogo ? '<img src="al-yazi-mandi-logo.png" alt="">' : ""}<h1>${safe(printSettings.header)}</h1>${printSettings.address ? `<p>${safe(printSettings.address)}</p>` : ""}${printSettings.phone ? `<p>${safe(printSettings.phone)}</p>` : ""}<hr><h2>${type === "KOT" ? "KITCHEN ORDER / KOT" : "RECEIPT"}</h2>${receiptType ? `<p style="text-align:center; font-weight:bold;">${receiptType}</p>` : ""}${guestInfo}${printSettings.showOrderType ? `<p>Order type: ${safe(orderMode)}</p>` : ""}<p>Table 14 · ${new Date().toLocaleString()}</p><hr>${[...order.values()].map(item => `<div class="print-line"><span>${item.quantity} x ${safe(item.name)}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join("")}${type === "KOT" ? "" : `<hr><div class="print-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>${printSettings.showTax ? `<div class="print-line"><span>Tax (8.25%)</span><strong>${money(tax)}</strong></div>` : ""}<div class="print-line print-total"><span>Total</span><strong>${money(total)}</strong></div>`}${printSettings.footer ? `<hr><p>${safe(printSettings.footer)}</p>` : ""}`;
  document.querySelector("#print-sheet").innerHTML = html;
  if (type === "bill" && !isReprint) {
    printedBills.push({ html: html.replace("--- ORIGINAL ---", "--- COPY ---"), createdAt: new Date().toISOString(), guest: currentOrderGuestName, phone: currentOrderGuestPhone, total, originalHtml: html });
    localStorage.setItem("alyazi-printed-bills", JSON.stringify(printedBills));
  }
}

function buildOrderMessage(label) {
  const lines = [...order.values()].map(item => `${item.quantity} x ${item.name} - ${money(item.price * item.quantity)}`);
  return [`AL YAZI MANDI RESTRAUNT`, label, `Order type: ${orderMode}`, ...lines, `Total: ${document.querySelector("#total").textContent}`].join("\n");
}

function openWhatsApp(number, message) {
  const cleanNumber = number.replace(/[^\d]/g, "");
  if (!cleanNumber || cleanNumber === "919999999999") { showToast("Add a real WhatsApp number in Settings"); return false; }
  window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  return true;
}

function sendKot() {
  if (!order.size || kotState !== "not-sent") return;
  const settings = JSON.parse(localStorage.getItem("alyazi-printers") || "{}");
  const integrations = JSON.parse(localStorage.getItem("alyazi-integrations") || "{}");
  localStorage.setItem("alyazi-kot-current", JSON.stringify({ items: [...order.values()], mode: orderMode, createdAt: new Date().toISOString() }));
  printTicket("KOT");
  openWhatsApp(integrations.kitchenWhatsapp || "", buildOrderMessage("KITCHEN ORDER / KOT"));
  kotState = "sent";
  localStorage.setItem("alyazi-kot-status", "sent");
  document.querySelector("#kot-status").textContent = "KOT sent - waiting for kitchen";
  document.querySelector("#send-kot span").textContent = "KOT sent & printed";
  document.querySelector("#kot-status").insertAdjacentHTML("afterend", `<button class="complete-kot" id="complete-kot">Mark KOT complete</button>`);
  renderOrder();
  showToast(settings.network?.enabled || settings.wired?.enabled ? "KOT printed and sent to kitchen" : "KOT sent to WhatsApp and display");
}

function completeKot() {
  if (kotState !== "sent") return;
  kotState = "completed";
  localStorage.setItem("alyazi-kot-status", "completed");
  localStorage.removeItem("alyazi-kot-accepted-at");
  document.querySelector("#kot-status").textContent = "KOT completed - ready for billing";
  document.querySelector("#complete-kot")?.remove();
  document.querySelector("#checkout-label").textContent = "Collect payment";
  document.querySelector("#workflow-banner").hidden = false;
  document.querySelector("#workflow-banner").textContent = "KOT READY · Kitchen completed this order · Payment is now available";
  document.body.classList.add("kot-ready");
  stopKitchenPrepTimer();
  startPaymentReminder();
  renderOrder();
  const integrations = JSON.parse(localStorage.getItem("alyazi-integrations") || "{}");
  openWhatsApp(integrations.billingWhatsapp || "", buildOrderMessage("KOT COMPLETED - READY FOR PAYMENT"));
  showToast("Billing user notified");
}

function openPayment() {
  document.querySelector("#payment-total").textContent = document.querySelector("#total").textContent;
  document.querySelector("#upi-payment-confirmed").checked = false;
  document.querySelector("#complete-payment").disabled = false;
  document.querySelector("#reprint-receipt-btn").hidden = printedBills.length === 0;
  document.querySelector("#payment-modal").hidden = false;
}

function updateUpiQr() {
  const upiPanel = document.querySelector("#upi-payment");
  if (paymentMethod !== "UPI") { upiPanel.hidden = true; document.querySelector("#complete-payment").disabled = false; return; }
  const total = document.querySelector("#total").textContent.replace(/[^\d.]/g, "");
  const account = upiAccounts.find(item => item.id === Number(selectedUpiId)) || upiAccounts.find(item => item.enabled);
  if (!account) { document.querySelector("#upi-details").textContent = "Link an enabled UPI account in Settings"; document.querySelector("#complete-payment").disabled = true; return; }
  const upiId = account.upiId;
  const paymentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("AL YAZI MANDI RESTRAUNT")}&am=${total}&cu=INR`;
  upiPanel.hidden = false;
  document.querySelector("#upi-qr").innerHTML = "";
  if (window.QRCode) new QRCode(document.querySelector("#upi-qr"), { text: paymentUrl, width: 148, height: 148, colorDark: "#2d2924", colorLight: "#fffaf2" });
  document.querySelector("#upi-details").textContent = `${account.name} · ${upiId} · ${money(Number(total))}`;
  document.querySelector("#complete-payment").disabled = !document.querySelector("#upi-payment-confirmed").checked;
}

function finishPayment() {
  const integrations = JSON.parse(localStorage.getItem("alyazi-integrations") || "{}");
  document.querySelector("#payment-modal").hidden = true;
  printTicket("bill");
  showToast(`Payment received by ${paymentMethod}. Confirm the printed bill to continue.`);
  kotState = "paid";
  stopPaymentReminder();
  billState = "paid-awaiting-confirmation";
  const total = Number(document.querySelector("#total").textContent.replace(/[^\d.]/g, ""));
  sales.push({ id: Date.now(), total, method: paymentMethod, mode: orderMode, createdAt: new Date().toISOString(), user: currentUser.name, items: [...order.values()].map(item => ({ name: item.name, quantity: item.quantity, price: item.price })) });
  localStorage.setItem("alyazi-sales-v1", JSON.stringify(sales));
  document.querySelector("#kot-status").textContent = `Paid by ${paymentMethod} - confirm bill printed`;
  document.querySelector("#checkout-label").textContent = "Bill printing...";
  document.querySelector("#workflow-banner").hidden = false;
  document.querySelector("#workflow-banner").textContent = "BILL PRINTED? Confirm below before starting the next order";
  document.querySelector("#next-order-button").textContent = "Confirm bill printed · Start next order";
  document.body.classList.remove("kot-ready");
  renderOrder();
  openWhatsApp(integrations.billingWhatsapp || "", buildOrderMessage(`PAYMENT COMPLETE - ${paymentMethod}`));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function speakPaymentPending() {
  if (!window.speechSynthesis || kotState === "paid" || kotState === "not-sent") return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance("Payment pending. Please complete payment."));
}

function startPaymentReminder() {
  stopPaymentReminder(); speakPaymentPending(); paymentReminderTimer = setInterval(speakPaymentPending, 9000);
}

function stopPaymentReminder() {
  if (paymentReminderTimer) clearInterval(paymentReminderTimer);
  paymentReminderTimer = null; window.speechSynthesis?.cancel();
}

function addMenuFromVoice(command) {
  const match = command.match(/add menu (.+?)(?:,?\s+price)\s+([\d,]+(?:\.\d{1,2})?)(?:,?\s+category\s+(.+))?$/i);
  if (!match) { showToast("Try: Add menu Chicken Mandi, price 270, category Mandi"); return; }
  const name = match[1].trim(); const price = Number(match[2].replace(/,/g, ""));
  const category = ["Mandi", "Chicken Mandi", "BBQ", "Extras"].find(item => item.toLowerCase() === (match[3] || "Extras").trim().toLowerCase()) || "Extras";
  menuItems.push({ id: Date.now(), name, description: "Freshly added menu item", price, category, badge: "New", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80" });
  saveMenu(); showToast(`${name} added to menu`);
}

function resolveBillingItem(text) {
  const normalized = text.toLowerCase().replace(/[.,]/g, " ").trim();
  const quantityWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const quantityMatch = normalized.match(/(?:x|quantity|qty)?\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*$/i);
  const quantity = quantityMatch ? Number(quantityMatch[1]) || quantityWords[quantityMatch[1].toLowerCase()] : 1;
  const itemText = quantityMatch ? normalized.slice(0, quantityMatch.index).trim() : normalized;
  if (!itemText) return null;
  const item = menuItems.find(menuItem => itemText.includes(menuItem.name.toLowerCase()) || menuItem.name.toLowerCase().includes(itemText));
  return item ? { item, quantity } : null;
}

function addBillingItemFromVoice(command) {
  const resolved = resolveBillingItem(command);
  if (!resolved) { showToast(`Menu item not found: ${command}`); return; }
  for (let index = 0; index < resolved.quantity; index += 1) addItem(resolved.item.id);
}

function addBillingItemsFromVoice(command) {
  const segments = command.split(/\s*(?:,|;|\band\b|\bplus\b)\s*/i).map(segment => segment.trim()).filter(Boolean);
  const added = []; const missed = [];
  segments.forEach(segment => {
    const resolved = resolveBillingItem(segment);
    if (!resolved) { missed.push(segment); return; }
    for (let index = 0; index < resolved.quantity; index += 1) addItem(resolved.item.id);
    added.push(`${resolved.quantity}x ${resolved.item.name}`);
  });
  if (added.length) showToast(`Added ${added.join(", ")}`);
  if (missed.length) showToast(`Menu item not found: ${missed.join(", ")}`);
  if (!added.length && !missed.length) showToast(`Menu item not found: ${command}`);
}

function handleVoiceCommand(command) {
  if (/^\s*(add menu|new menu)/i.test(command)) { addMenuFromVoice(command.replace(/^\s*new menu/i, "Add menu")); return; }
  const itemCommand = command.replace(/^\s*add\s+/i, "");
  if (voiceHoldV2) addBillingItemsFromVoice(itemCommand);
  else addBillingItemFromVoice(itemCommand);
}

function startVoiceMenuCommand() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    const command = window.prompt("Enter an item and quantity to add:", "Chicken Mandi two");
    if (command && command.trim()) handleVoiceCommand(command.trim());
    return;
  }
  voiceHolding = true;
  voiceRecognition?.abort();
  voiceRecognition = new Recognition();
  voiceRecognition.lang = "en-IN";
  voiceRecognition.interimResults = false;
  voiceRecognition.maxAlternatives = 1;
  voiceRecognition.continuous = false;
  document.querySelector("#voice-menu-button").classList.add("listening");
  showToast("Listening... hold the button while you speak");
  voiceRecognition.onresult = event => {
    const finalTranscript = Array.from(event.results)
      .filter(result => result.isFinal)
      .map(result => result[0].transcript)
      .join(" ")
      .trim();
    if (finalTranscript) handleVoiceCommand(finalTranscript);
  };
  voiceRecognition.onerror = () => showToast("Could not hear the menu command");
  voiceRecognition.onend = () => {
    if (voiceHolding) {
      try { voiceRecognition.start(); } catch (error) {}
      return;
    }
    document.querySelector("#voice-menu-button").classList.remove("listening");
  };
  try { voiceRecognition.start(); } catch (error) {}
}

function stopVoiceMenuCommand() {
  voiceHolding = false;
  if (voiceRecognition && typeof voiceRecognition.stop === "function") {
    voiceRecognition.stop();
  }
  document.querySelector("#voice-menu-button").classList.remove("listening");
}

menuGrid.addEventListener("click", event => { if (event.target.dataset.add) addItem(event.target.dataset.add); });
orderList.addEventListener("click", event => {
  const id = Number(event.target.dataset.increase || event.target.dataset.decrease || event.target.dataset.remove);
  if (!id) return;
  const item = order.get(id);
  if (event.target.dataset.remove || (event.target.dataset.decrease && item.quantity === 1)) order.delete(id);
  else order.set(id, { ...item, quantity: item.quantity + (event.target.dataset.increase ? 1 : -1) });
  syncCurrentCabinOrder();
  renderOrder();
});
document.querySelectorAll(".category-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelector(".category-tab.active").classList.remove("active"); tab.classList.add("active"); renderMenu(tab.dataset.category);
}));
document.querySelectorAll(".order-mode").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".order-mode.active").classList.remove("active"); button.classList.add("active"); orderMode = button.dataset.mode;
  document.querySelector(".ticket-header h2").innerHTML = orderMode === "Take Away" ? "Take Away <span>·</span> Guest order" : orderMode === "KOT" ? "Kitchen order <span>·</span> Table 14" : "Table 14 <span>·</span> 4 guests";
  document.querySelector("#checkout-label").textContent = orderMode === "KOT" ? "Send to kitchen" : orderMode === "Take Away" ? "Print receipt" : "Charge";
}));
document.querySelector("#send-kot").addEventListener("click", sendKot);
const ticketFooter = document.querySelector(".ticket-footer");
if (ticketFooter) ticketFooter.addEventListener("click", event => { if (event.target.id === "complete-kot") completeKot(); });
document.querySelector("#checkout-button").addEventListener("click", openPayment);
document.querySelector("#next-order-button").addEventListener("click", () => {
  stopPaymentReminder();
  closeCabin(currentCabinId);
});
const outlineButton = document.querySelector(".outline-button");
if (outlineButton) outlineButton.addEventListener("click", () => showToast("Search is ready for your next item"));
const voiceMenuButton = document.querySelector("#voice-menu-button");
if (voiceHoldV2) {
  voiceMenuButton.title = "Press and hold to add multiple menu items by voice";
  const voiceHelp = document.querySelector(".voice-help");
  if (voiceHelp) voiceHelp.textContent = "Hold “Hold to add item” and say: “Chicken Mandi two and BBQ Chicken Full”. Keep holding to add more items in the same order.";
}
voiceMenuButton.addEventListener("pointerdown", event => {
  if (event.button !== undefined && event.button !== 0) return;
  event.preventDefault();
  if (voiceMenuButton.setPointerCapture) voiceMenuButton.setPointerCapture(event.pointerId);
  startVoiceMenuCommand();
});
voiceMenuButton.addEventListener("pointerup", stopVoiceMenuCommand);
voiceMenuButton.addEventListener("pointerleave", stopVoiceMenuCommand);
voiceMenuButton.addEventListener("pointercancel", stopVoiceMenuCommand);
voiceMenuButton.addEventListener("keydown", event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); startVoiceMenuCommand(); } });
voiceMenuButton.addEventListener("keyup", event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); stopVoiceMenuCommand(); } });
document.querySelector("#open-kitchen-display").addEventListener("click", () => { const integrations = JSON.parse(localStorage.getItem("alyazi-integrations") || "{}"); localStorage.setItem("alyazi-kot-current", JSON.stringify({ items: [...order.values()], mode: orderMode, createdAt: new Date().toISOString() })); window.open(integrations.kitchenDisplayUrl || "kitchen.html", "_blank", "noopener"); });

document.querySelector("#close-payment").addEventListener("click", () => { document.querySelector("#payment-modal").hidden = true; });
document.querySelectorAll(".payment-method").forEach(button => button.addEventListener("click", () => { document.querySelector(".payment-method.active").classList.remove("active"); button.classList.add("active"); paymentMethod = button.dataset.payment; updateUpiQr(); }));
document.querySelector("#payment-upi-account").addEventListener("change", event => { selectedUpiId = Number(event.target.value); updateUpiQr(); });
document.querySelector("#guest-name").addEventListener("input", (e) => { currentOrderGuestName = e.target.value; });
document.querySelector("#guest-phone").addEventListener("input", (e) => { currentOrderGuestPhone = e.target.value; });
document.querySelector("#complete-payment").addEventListener("click", finishPayment);
document.querySelector("#upi-payment-confirmed").addEventListener("change", event => { document.querySelector("#complete-payment").disabled = !event.target.checked; });
document.querySelector("#reprint-receipt-btn").addEventListener("click", () => {
  if (printedBills.length === 0) { showToast("No previous bills to reprint"); return; }
  const lastBill = printedBills[printedBills.length - 1];
  document.querySelector("#print-sheet").innerHTML = lastBill.html;
  document.body.classList.add("print-ticket");
  window.print();
  document.body.classList.remove("print-ticket");
  showToast("Receipt reprinted (marked as COPY)");
});

function renderReceiptHistory() {
  const list = document.querySelector("#receipt-history-list");
  if (printedBills.length === 0) {
    list.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--muted);">No receipts yet</div>`;
    return;
  }
  list.innerHTML = printedBills.map((bill, idx) => {
    const date = new Date(bill.createdAt);
    return `<div class="receipt-item"><div><strong>${bill.guest || "Guest " + (idx + 1)}</strong><small>${date.toLocaleString()}</small></div><div class="receipt-total">₹${bill.total.toFixed(2)}</div><button class="secondary-action" data-print-bill="${idx}" style="padding:5px 10px;font-size:10px;">🖨️ Print</button></div>`;
  }).join("");
  document.querySelectorAll("[data-print-bill]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.target.dataset.printBill);
      const bill = printedBills[idx];
      document.querySelector("#print-sheet").innerHTML = bill.html;
      document.body.classList.add("print-ticket");
      window.print();
      document.body.classList.remove("print-ticket");
      showToast("Receipt printed");
    });
  });
}

const settingsModal = document.querySelector("#settings-modal");
document.querySelector("#settings-button").addEventListener("click", () => { if (currentUser.role === "User") return; settingsModal.hidden = false; renderMenuTable(); renderUsers(); renderUpiAccounts(); loadPrintSettings(); updateSession(); });
document.querySelector("#close-settings").addEventListener("click", () => { settingsModal.hidden = true; });
settingsModal.addEventListener("click", event => { if (event.target === settingsModal) settingsModal.hidden = true; });
document.querySelectorAll(".settings-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelector(".settings-tab.active").classList.remove("active"); tab.classList.add("active");
  document.querySelectorAll(".settings-view").forEach(view => view.classList.remove("active"));
  document.querySelector(`#${tab.dataset.settingsTab}-view`).classList.add("active");
  if (tab.dataset.settingsTab === "sales") renderSales();
  if (tab.dataset.settingsTab === "receipts") renderReceiptHistory();
}));
document.querySelectorAll(".report-range").forEach(button => button.addEventListener("click", () => { document.querySelector(".report-range.active").classList.remove("active"); button.classList.add("active"); document.querySelector("#custom-range").hidden = button.dataset.range !== "custom"; if (button.dataset.range !== "custom") renderSales(button.dataset.range); }));
document.querySelector("#apply-custom-report").addEventListener("click", () => renderSales("custom", document.querySelector("#report-from").value, document.querySelector("#report-to").value));
document.querySelector("#export-sales").addEventListener("click", () => {
  if (!reportExportSales.length) { showToast("No sales in this report range"); return; }
  const rows = [["Date", "Order type", "Payment method", "Cashier", "Menu items", "Total"]];
  reportExportSales.forEach(sale => rows.push([new Date(sale.createdAt).toLocaleString(), sale.mode || "Restaurant order", sale.method, sale.user, sale.items?.map(item => `${item.quantity} x ${item.name}`).join("; ") || "", money(sale.total)]));
  const table = `<table><tr>${rows[0].map(cell => `<th>${cell}</th>`).join("")}</tr>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${String(cell).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`).join("")}</tr>`).join("")}</table>`;
  const blob = new Blob([`<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `alyazi-sales-${new Date().toISOString().slice(0, 10)}.xls`; link.click(); URL.revokeObjectURL(link.href); showToast("Sales report exported to Excel");
});
document.querySelector("#user-form").addEventListener("submit", event => {
  event.preventDefault();
  users.push({ id: Date.now(), name: document.querySelector("#new-user-name").value.trim(), email: document.querySelector("#new-user-email").value.trim(), phone: document.querySelector("#new-user-phone").value.trim(), role: document.querySelector("#new-user-role").value, password: document.querySelector("#new-user-password").value });
  saveUsers(); event.target.reset(); showToast("User account created");
});
document.querySelector("#user-table-body").addEventListener("click", event => {
  if (!event.target.dataset.deleteUser) return;
  users = users.filter(user => user.id !== Number(event.target.dataset.deleteUser)); saveUsers(); showToast("User account removed");
});
document.querySelector("#printer-form").addEventListener("submit", event => { event.preventDefault(); localStorage.setItem("alyazi-printers", JSON.stringify({ network: { name: document.querySelector("#network-name").value, ip: document.querySelector("#network-ip").value, port: document.querySelector("#network-port").value, enabled: document.querySelector("#network-enabled").checked }, wired: { name: document.querySelector("#wired-name").value, device: document.querySelector("#wired-device").value, enabled: document.querySelector("#wired-enabled").checked } })); showToast("Printer settings saved"); });
document.querySelector("#print-settings-form").addEventListener("submit", event => { event.preventDefault(); printSettings = { header: document.querySelector("#print-header").value.trim(), phone: document.querySelector("#print-phone").value.trim(), address: document.querySelector("#print-address").value.trim(), footer: document.querySelector("#print-footer").value.trim(), showLogo: document.querySelector("#print-show-logo").checked, showTax: document.querySelector("#print-show-tax").checked, showOrderType: document.querySelector("#print-show-order-type").checked }; localStorage.setItem("alyazi-print-settings-v1", JSON.stringify(printSettings)); showToast("Print settings saved"); });
document.querySelector("#save-integrations").addEventListener("click", () => { localStorage.setItem("alyazi-integrations", JSON.stringify({ kitchenWhatsapp: document.querySelector("#kitchen-whatsapp").value, billingWhatsapp: document.querySelector("#billing-whatsapp").value, kitchenDisplayUrl: document.querySelector("#kitchen-display-url").value })); showToast("Workflow settings saved"); });
document.querySelector("#upi-account-form").addEventListener("submit", event => { event.preventDefault(); const account = { id: Date.now(), name: document.querySelector("#new-upi-name").value.trim(), bank: document.querySelector("#new-upi-bank").value.trim(), upiId: document.querySelector("#new-upi-id").value.trim(), enabled: true }; upiAccounts.push(account); selectedUpiId = account.id; saveUpiAccounts(); event.target.reset(); showToast(`${account.name} linked`); });
document.querySelector("#upi-accounts-list").addEventListener("change", event => { if (!event.target.dataset.upiToggle) return; const account = upiAccounts.find(item => item.id === Number(event.target.dataset.upiToggle)); account.enabled = event.target.checked; saveUpiAccounts(); });
document.querySelector("#upi-accounts-list").addEventListener("click", event => { if (!event.target.dataset.deleteUpi) return; upiAccounts = upiAccounts.filter(item => item.id !== Number(event.target.dataset.deleteUpi)); selectedUpiId = upiAccounts.find(item => item.enabled)?.id || null; saveUpiAccounts(); showToast("UPI account removed"); });
function syncKotStatusFromStorage() {
  const kitchenStatus = localStorage.getItem("alyazi-kot-status");
  if (!kitchenStatus) return;

  if (kitchenStatus === "accepted") {
    kotState = "accepted";
    const acceptedAt = Number(localStorage.getItem("alyazi-kot-accepted-at") || Date.now());
    kitchenPrepStartedAt = acceptedAt;
    startKitchenPrepTimer();
    renderOrder();
    return;
  }

  if (kitchenStatus === "ready") {
    kotState = "completed";
    stopKitchenPrepTimer();
    localStorage.removeItem("alyazi-kot-accepted-at");
    document.querySelector("#checkout-label").textContent = "Collect payment";
    document.querySelector("#workflow-banner").hidden = false;
    document.querySelector("#workflow-banner").textContent = "YOUR ORDER READY · Kitchen completed this order · Payment is now available";
    document.querySelector("#kot-status").textContent = "Your order is ready";
    renderOrder();
    return;
  }

  if (kitchenStatus === "sent" && kotState === "accepted") {
    kotState = "sent";
    stopKitchenPrepTimer();
    kitchenPrepStartedAt = null;
    renderOrder();
  }
}

window.addEventListener("storage", event => {
  if (event.key === "alyazi-kot-status") {
    syncKotStatusFromStorage();
    if (event.newValue === "completed" && kotState === "sent") completeKot();
  }
});
document.querySelectorAll(".test-button").forEach(button => button.addEventListener("click", () => showToast(`${button.dataset.printer === "network" ? "Network" : "Wired"} test print sent`)));
const addMenuForm = document.querySelector("#add-menu-form");
if (addMenuForm) {
  addMenuForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.querySelector("#new-menu-name").value.trim();
    const price = Number(document.querySelector("#new-menu-price").value);
    let image = document.querySelector("#new-menu-image").value.trim() || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80";
    const fileInput = document.querySelector("#new-menu-image-file");
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        image = e.target.result;
        menuItems.push({ id: Date.now(), name, description: "Freshly added menu item", price, category: document.querySelector("#new-menu-category").value, badge: "New", image });
        saveMenu(); event.target.reset(); fileInput.value = ""; showToast(`${name} added to menu`);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      menuItems.push({ id: Date.now(), name, description: "Freshly added menu item", price, category: document.querySelector("#new-menu-category").value, badge: "New", image });
      saveMenu(); event.target.reset(); showToast(`${name} added to menu`);
    }
  });
}
document.addEventListener("change", event => {
  if (event.target.dataset.priceId) {
    if (currentUser.role !== "Super Admin") { showToast("Only Super Admin can change prices"); event.target.value = menuItems.find(m => m.id === Number(event.target.dataset.priceId)).price.toFixed(2); return; }
    const item = menuItems.find(menuItem => menuItem.id === Number(event.target.dataset.priceId));
    if (item) { item.price = Number(event.target.value) || 0; saveMenu(); showToast(`${item.name} price updated`); }
  }
  if (event.target.dataset.imageId) {
    const item = menuItems.find(menuItem => menuItem.id === Number(event.target.dataset.imageId));
    if (item) { item.image = event.target.value.trim() || item.image; saveMenu(); showToast(`${item.name} image updated`); }
  }
  if (event.target.dataset.fileUpload) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const itemId = Number(event.target.dataset.fileUpload);
      const item = menuItems.find(menuItem => menuItem.id === itemId);
      if (item) { item.image = e.target.result; saveMenu(); showToast(`${item.name} image uploaded`); renderMenuTable(); }
    };
    reader.readAsDataURL(file);
  }
});
document.addEventListener("click", event => {
  if (event.target.dataset.deleteId && event.target.closest("#menu-table-body")) {
    if (currentUser.role !== "Super Admin") {
      showToast("Only Super Admin can delete menu items");
      return;
    }
    const confirmed = confirm("⚠️ Are you sure you want to delete this menu item? This action cannot be undone.");
    if (confirmed) {
      menuItems = menuItems.filter(item => item.id !== Number(event.target.dataset.deleteId));
      saveMenu();
      showToast("Menu item removed");
    }
  }
});

const accountMenu = document.querySelector("#account-menu");
const loginModal = document.querySelector("#login-modal");
const changePasswordModal = document.querySelector("#change-password-modal");
document.querySelector("#profile-button").addEventListener("click", () => { accountMenu.hidden = !accountMenu.hidden; document.querySelector("#notifications-panel").hidden = true; });
document.querySelector("#logout-button").addEventListener("click", () => { accountMenu.hidden = true; sessionStorage.removeItem("alyazi-current-user"); window.location.replace("/"); });
document.querySelector("#switch-user").addEventListener("click", () => { accountMenu.hidden = true; renderLoginUsers(); loginModal.hidden = false; });
document.querySelector("#change-password-btn").addEventListener("click", () => { accountMenu.hidden = true; changePasswordModal.hidden = false; document.querySelector("#current-password").value = ""; document.querySelector("#new-password").value = ""; document.querySelector("#confirm-password").value = ""; document.querySelector("#password-change-error").textContent = ""; });
document.querySelector("#close-change-password").addEventListener("click", () => { changePasswordModal.hidden = true; });
document.querySelector("#change-password-form").addEventListener("submit", event => {
  event.preventDefault();
  const currentPassword = document.querySelector("#current-password").value;
  const newPassword = document.querySelector("#new-password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;
  const errorElement = document.querySelector("#password-change-error");
  if (currentUser.password !== currentPassword) { errorElement.textContent = "Current password is incorrect."; return; }
  if (newPassword.length < 6) { errorElement.textContent = "New password must be at least 6 characters."; return; }
  if (newPassword !== confirmPassword) { errorElement.textContent = "Passwords do not match."; return; }
  currentUser.password = newPassword;
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) users[userIndex].password = newPassword;
  localStorage.setItem("alyazi-users-v1", JSON.stringify(users));
  sessionStorage.setItem("alyazi-current-user", JSON.stringify(currentUser));
  changePasswordModal.hidden = true;
  showToast("Password updated successfully");
});
document.querySelector("#login-form").addEventListener("submit", event => {
  event.preventDefault();
  const user = users.find(item => item.id === Number(document.querySelector("#login-user").value));
  const password = document.querySelector("#login-password").value;
  if (!user || user.password !== password) { document.querySelector("#login-error").textContent = "Incorrect password. Please try again."; return; }
  currentUser = user; sessionStorage.setItem("alyazi-current-user", JSON.stringify(currentUser)); updateSession(); loginModal.hidden = true; document.querySelector("#login-error").textContent = ""; document.querySelector("#login-password").value = ""; showToast(`Welcome, ${user.name}`);
});

const notificationsPanel = document.querySelector("#notifications-panel");
document.querySelector("#notifications-button").addEventListener("click", () => {
  accountMenu.hidden = true;
  notificationsPanel.hidden = !notificationsPanel.hidden;
  if (!notificationsPanel.hidden) renderResetRequests();
});
document.querySelector("#reset-requests-list").addEventListener("click", event => {
  const row = event.target.closest(".reset-request-row");
  if (!row || event.target.dataset.action !== "start") return;
  const requestId = Number(row.dataset.requestId);
  const userId = Number(row.dataset.userId);
  row.innerHTML = `<form class="reset-request-form"><input type="password" class="reset-new-password" placeholder="New password" required minlength="6"><button type="submit" class="save-button">Save</button></form>`;
  row.querySelector("form").addEventListener("submit", submitEvent => {
    submitEvent.preventDefault();
    const newPassword = row.querySelector(".reset-new-password").value;
    const user = users.find(u => u.id === userId);
    if (user) { user.password = newPassword; saveUsers(); }
    saveResetRequests(getResetRequests().filter(r => r.id !== requestId));
    showToast(`Password reset for ${user ? user.name : "user"}`);
    renderResetRequests();
  });
});

renderMenu();
renderCategoryTabs();
renderCategorySelect();
restoreActiveCabin();
renderOrder();
renderCabinTabs();
renderLoginUsers();
updateSession();
renderUpiAccounts();
