function parseNonEmpty(raw) {
  const parsed = JSON.parse(raw || "null");
  return Array.isArray(parsed) && parsed.length === 0 ? null : parsed;
}
let menuCategories = parseNonEmpty(localStorage.getItem("alyazi-categories-v1")) || ["Mandi", "Chicken Mandi", "BBQ", "Extras"];
let menuItems = parseNonEmpty(localStorage.getItem("alyazi-menu-en-v6")) || [
  { id: 1, name: "Mutton Yemeni Mandi - 1 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 395, category: "Mandi", badge: "Signature", image: "mutton 02.jpeg" },
  { id: 2, name: "Mutton Yemeni Mandi - 2 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 790, category: "Mandi", image: "mutton 02.jpeg" },
  { id: 3, name: "Mutton Yemeni Mandi - 3 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 1299, category: "Mandi", image: "mutton 02.jpeg" },
  { id: 4, name: "Mutton Yemeni Mandi - 4 Person", description: "Slow-cooked mutton, fragrant basmati rice", price: 1599, category: "Mandi", image: "mutton 02.jpeg" },
  { id: 5, name: "Mutton Yemeni Mandi - Nalli Part", description: "Mutton mandi with tender bone marrow nalli", price: 1699, category: "Mandi", badge: "Special", image: "mutton 02.jpeg" },
  { id: 6, name: "Chicken Alfaham Mandi - 1 Person", description: "Charcoal chicken, mandi rice, dakous", price: 270, category: "Chicken Mandi", badge: "Popular", image: "Chicken al faham.jpeg" },
  { id: 7, name: "Chicken Alfaham Mandi - 2 Person", description: "Charcoal chicken, mandi rice, dakous", price: 540, category: "Chicken Mandi", image: "Chicken al faham.jpeg" },
  { id: 8, name: "Chicken Alfaham Mandi - 3 Person", description: "Charcoal chicken, mandi rice, dakous", price: 810, category: "Chicken Mandi", image: "Chicken al faham.jpeg" },
  { id: 9, name: "Chicken Alfaham Mandi - 4 Person", description: "Charcoal chicken, mandi rice, dakous", price: 1000, category: "Chicken Mandi", image: "Chicken al faham.jpeg" },
  { id: 10, name: "Chicken Moroccan Mandi - 1 Person", description: "Moroccan-style chicken with mandi rice", price: 290, category: "Chicken Mandi", badge: "New", image: "chicken morrocan mandi.jpeg" },
  { id: 11, name: "Chicken Moroccan Mandi - 2 Person", description: "Moroccan-style chicken with mandi rice", price: 580, category: "Chicken Mandi", image: "chicken morrocan mandi.jpeg" },
  { id: 12, name: "Chicken Moroccan Mandi - 3 Person", description: "Moroccan-style chicken with mandi rice", price: 870, category: "Chicken Mandi", image: "chicken morrocan mandi.jpeg" },
  { id: 13, name: "Chicken Moroccan Mandi - 4 Person", description: "Moroccan-style chicken with mandi rice", price: 1100, category: "Chicken Mandi", image: "chicken morrocan mandi.jpeg" },
  { id: 14, name: "BBQ Chicken - 1/4", description: "Smoky grilled chicken quarter", price: 160, category: "BBQ", image: "BBQ chicken01.png" },
  { id: 15, name: "BBQ Chicken - 1/2", description: "Smoky grilled chicken half", price: 320, category: "BBQ", image: "BBQ chicken01.png" },
  { id: 16, name: "BBQ Chicken - Full", description: "Smoky grilled whole chicken", price: 605, category: "BBQ", badge: "Grilled", image: "BBQ chicken01.png" },
  { id: 17, name: "Extra Rice", description: "Extra portion of fragrant mandi rice", price: 150, category: "Extras", image: "Extra Rice01.jpeg" },
  { id: 18, name: "Extra Mutton", description: "Extra serving of slow-cooked mutton", price: 314, category: "Extras", image: "extra mutton 01.png" },
  { id: 19, name: "Bucket Small", description: "Small serving of mandi rice", price: 39, category: "Extras", image: "BIgbucket 01.jpeg" },
  { id: 20, name: "Bucket Big", description: "Large serving of mandi rice", price: 49, category: "Extras", image: "BIgbucket 01.jpeg" },
  { id: 21, name: "Extra Mayonnaise", description: "Extra side of mayonnaise", price: 20, category: "Extras", image: "mayonnaise.jpeg" }
];
// Every menu item gets a short voice code ("01", "02", ...) so staff can add
// it by number instead of speaking the full name. Existing items keep
// whatever code they already have; anything missing one gets the next
// number in list order.
menuItems = menuItems.map((item, index) => ({ ...item, code: item.code || String(index + 1).padStart(2, "0") }));
function nextMenuCode() {
  return String(menuItems.length + 1).padStart(2, "0");
}

const order = new Map();
let orderMode = "Dine In";
let kotState = "not-sent";
let kitchenPrepStartedAt = null;
let kitchenPrepTimer = null;
let paymentMethod = "Cash";
let billState = "not-printed";
let discountType = "percent";
let discountValue = 0;
let payUpfrontActive = false;
let paymentReminderTimer = null;
let voiceRecognition = null;
let voiceHolding = false;
const voiceHoldV2 = new URLSearchParams(location.search).get("voice-hold") === "v2";
let upiAccounts = JSON.parse(localStorage.getItem("alyazi-upi-accounts-v1") || "null") || [{ id: 1, name: "AL YAZI MANDI", bank: "Primary bank", upiId: "alyazimandi@upi", enabled: true }];
let selectedUpiId = upiAccounts[0]?.id || null;
let printSettings = JSON.parse(localStorage.getItem("alyazi-print-settings-v1") || "null") || { header: "AL YAZI MANDI RESTRAUNT", phone: "", whatsapp: "", address: "", footer: "Thank you for dining with us", showLogo: true, showTax: true, showOrderType: true };
printSettings.whatsapp = printSettings.whatsapp || "";
printSettings.headerAlign = printSettings.headerAlign || "center";
printSettings.footerAlign = printSettings.footerAlign || "center";
let users = JSON.parse(localStorage.getItem("alyazi-users-v1") || "null") || [{ id: 1, name: "abu", email: "owner@alyazi.com", phone: "", role: "Super Admin", password: "admin123" }];
users = users.map(user => ({ ...user, password: user.password || "admin123" }));
// Restore session or redirect to login
let currentUser = (function() {
  const stored = sessionStorage.getItem("alyazi-current-user");
  if (!stored) { window.location.replace("/"); return null; }
  const parsed = JSON.parse(stored);
  // Re-validate against latest users list so password changes (and account
  // locks) take effect on the next page load, not just the next login.
  const freshUser = users.find(u => u.id === parsed.id) || parsed;
  if (freshUser.locked) {
    sessionStorage.removeItem("alyazi-current-user");
    window.location.replace("/");
    return null;
  }
  return freshUser;
})();
if (!currentUser) throw new Error("Not authenticated");
let currentOrderGuestName = "";
let currentOrderGuestPhone = "";
let printedBills = JSON.parse(localStorage.getItem("alyazi-printed-bills") || "[]");
let sales = JSON.parse(localStorage.getItem("alyazi-sales-v1") || "[]");
let reportExportSales = [];

let currentCabinId = 1;
const makeCabin = (id, name, orderMode, type = "cabin", token = null) => ({
  id,
  name,
  type,
  token,
  paidUpfront: false,
  order: new Map(),
  guestName: "",
  guestPhone: "",
  billState: "not-printed",
  kotState: "not-sent",
  kotSentQuantities: {},
  orderNumber: null,
  discountType: "percent",
  discountValue: 0,
  orderMode,
  createdAt: new Date().toISOString()
});
let nextOrderNumber = Number(localStorage.getItem("alyazi-order-counter-v1") || "1001");
function saveOrderCounter() {
  localStorage.setItem("alyazi-order-counter-v1", String(nextOrderNumber));
}
let nextTakeawayNumber = Number(localStorage.getItem("alyazi-takeaway-counter-v1") || "101");
function saveTakeawayCounter() {
  localStorage.setItem("alyazi-takeaway-counter-v1", String(nextTakeawayNumber));
}
let cabins = JSON.parse(localStorage.getItem("alyazi-cabins-v1") || "null") || Array.from({ length: 5 }, (_, i) => makeCabin(i + 1, `Cabin ${i + 1}`, "Dine In"));
cabins = cabins.map(cabin => ({ ...cabin, type: cabin.type || "cabin", paidUpfront: cabin.paidUpfront || false, kotSentQuantities: cabin.kotSentQuantities || {}, orderNumber: cabin.orderNumber || null, discountType: cabin.discountType || "percent", discountValue: cabin.discountValue || 0, order: new Map(cabin.order || []) }));
// Older versions had a single fixed "Take Away" cabin (id 6). The dynamic
// token queue replaces it — carry over any in-progress order as the first
// takeaway ticket instead of silently discarding it.
const legacyTakeaway = cabins.find(cabin => cabin.id === 6 && cabin.type === "cabin" && cabin.name === "Take Away");
if (legacyTakeaway) {
  cabins = cabins.filter(cabin => cabin !== legacyTakeaway);
  if (legacyTakeaway.order.size || legacyTakeaway.kotState !== "not-sent") {
    const token = `TA-${nextTakeawayNumber}`;
    nextTakeawayNumber += 1;
    saveTakeawayCounter();
    cabins.push({ ...legacyTakeaway, type: "takeaway", token, name: token });
  }
  if (currentCabinId === 6) currentCabinId = cabins.some(cabin => cabin.id === 6) ? 6 : 1;
  saveCabins();
}

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

function getKots() {
  return JSON.parse(localStorage.getItem("alyazi-kots-v1") || "{}");
}

function saveKots(kots) {
  localStorage.setItem("alyazi-kots-v1", JSON.stringify(kots));
}

// Each cabin runs its own kitchen order independently. This reads the
// shared kots map (written by kitchen.html) and updates every cabin's own
// kotState, so switching cabins never inherits another cabin's status.
function syncKotStatusFromStorage() {
  const kots = getKots();
  let purged = false;
  cabins.forEach(cabin => {
    const kot = kots[cabin.id];
    if (!kot) return;
    if (!kot.items || !kot.items.length) {
      delete kots[cabin.id];
      purged = true;
      if (cabin.kotState !== "not-sent") {
        cabin.kotState = "not-sent";
        if (cabin.id === currentCabinId) {
          kotState = "not-sent";
          stopKitchenPrepTimer();
          kitchenPrepStartedAt = null;
          renderOrder();
        }
      }
      return;
    }
    const derivedState = kot.status === "ready" ? "completed" : kot.status;
    if (derivedState === cabin.kotState) return;
    const wasReady = cabin.kotState === "completed";
    cabin.kotState = derivedState;
    if (derivedState === "completed" && cabin.paidUpfront) {
      cabin.billState = "paid-awaiting-confirmation";
    }

    if (cabin.id === currentCabinId) {
      kotState = derivedState;
      billState = cabin.billState;
      if (derivedState === "accepted") {
        kitchenPrepStartedAt = kot.acceptedAt || Date.now();
        startKitchenPrepTimer();
      } else if (derivedState === "completed") {
        stopKitchenPrepTimer();
      }
      renderOrder();
    } else if (derivedState === "completed" && !wasReady) {
      showToast(`${cabin.name}'s order is ready`);
    }
  });
  if (purged) saveKots(kots);
  saveCabins();
  renderCabinTabs();
  if (!document.querySelector("#takeaway-board-modal")?.hidden) renderTakeawayBoard();
}

function applyOrderModeUI() {
  document.querySelectorAll(".order-mode").forEach(button => button.classList.toggle("active", button.dataset.mode === orderMode));
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
    currentCabin.discountType = discountType;
    currentCabin.discountValue = discountValue;
    // Leaving an untouched takeaway ticket behind — drop it instead of
    // letting empty drafts pile up in the queue forever.
    if (currentCabin.id !== cabinId && currentCabin.type === "takeaway" && !currentCabin.order.size && currentCabin.kotState === "not-sent") {
      cabins = cabins.filter(cabin => cabin.id !== currentCabin.id);
    }
    saveCabins();
  }
  currentCabinId = cabinId;
  syncKotStatusFromStorage();
  const newCabin = getCabinData(cabinId);
  order.clear();
  newCabin.order.forEach((value, key) => order.set(key, value));
  currentOrderGuestName = newCabin.guestName;
  currentOrderGuestPhone = newCabin.guestPhone;
  kotState = newCabin.kotState;
  billState = newCabin.billState;
  orderMode = newCabin.orderMode;
  discountType = newCabin.discountType;
  discountValue = newCabin.discountValue;
  if (kotState === "accepted") {
    const kot = getKots()[cabinId];
    kitchenPrepStartedAt = (kot && kot.acceptedAt) || Date.now();
    startKitchenPrepTimer();
  } else {
    stopKitchenPrepTimer();
    kitchenPrepStartedAt = null;
  }
  document.querySelectorAll(".cabin-tab").forEach(tab => tab.classList.remove("active"));
  document.querySelector(`[data-cabin="${cabinId}"]`)?.classList.add("active");
  document.querySelector("#guest-name").value = currentOrderGuestName;
  document.querySelector("#guest-phone").value = currentOrderGuestPhone;
  document.querySelector("#discount-value").value = discountValue;
  document.querySelector("#discount-type").value = discountType;
  applyOrderModeUI();
  renderOrder();
  renderCabinTabs();
}

function restoreActiveCabin() {
  syncKotStatusFromStorage();
  const cabin = getCabinData(currentCabinId);
  if (!cabin) return;
  order.clear();
  cabin.order.forEach((value, key) => order.set(key, value));
  currentOrderGuestName = cabin.guestName;
  currentOrderGuestPhone = cabin.guestPhone;
  kotState = cabin.kotState;
  billState = cabin.billState;
  orderMode = cabin.orderMode;
  discountType = cabin.discountType;
  discountValue = cabin.discountValue;
  if (kotState === "accepted") {
    const kot = getKots()[currentCabinId];
    kitchenPrepStartedAt = (kot && kot.acceptedAt) || Date.now();
    startKitchenPrepTimer();
  }
  document.querySelector("#guest-name").value = currentOrderGuestName;
  document.querySelector("#guest-phone").value = currentOrderGuestPhone;
  document.querySelector("#discount-value").value = discountValue;
  document.querySelector("#discount-type").value = discountType;
  applyOrderModeUI();
}

function takeawayStatusLabel(cabin) {
  if (cabin.kotState === "not-sent") return "New";
  if (cabin.kotState === "sent") return "Preparing";
  if (cabin.kotState === "accepted") return "Cooking";
  if (cabin.kotState === "completed") return cabin.paidUpfront ? "Ready · Paid" : "Ready";
  if (cabin.kotState === "paid") return "Paid ✓";
  return cabin.kotState;
}

function renderCabinTabs() {
  const container = document.querySelector(".cabin-tabs");
  const takeawayContainer = document.querySelector(".takeaway-tabs");
  if (!container) return;
  const dineInCabins = cabins.filter(cabin => cabin.type !== "takeaway");
  const takeawayTickets = cabins.filter(cabin => cabin.type === "takeaway" && (cabin.order.size > 0 || cabin.kotState !== "not-sent"));
  container.innerHTML = dineInCabins.map(cabin => {
    const itemCount = cabin.order.size || cabin.order.length || 0;
    const isActive = cabin.id === currentCabinId ? "active" : "";
    const isReady = cabin.kotState === "completed" ? "ready-alert" : "";
    return `<button class="cabin-tab ${isActive} ${isReady}" data-cabin="${cabin.id}" title="${cabin.name}">
      ${cabin.name}
      ${itemCount > 0 ? `<span class="item-count">${itemCount}</span>` : ""}
    </button>`;
  }).join("");
  if (takeawayContainer) {
    takeawayContainer.innerHTML = takeawayTickets.map(cabin => {
      const isActive = cabin.id === currentCabinId ? "active" : "";
      const isReady = cabin.kotState === "completed" ? "ready-alert" : "";
      return `<button class="cabin-tab takeaway-tab ${isActive} ${isReady}" data-cabin="${cabin.id}" title="${cabin.token}">
        #${cabin.token} <span class="takeaway-status">${takeawayStatusLabel(cabin)}</span>
      </button>`;
    }).join("") || `<p class="takeaway-empty">No active takeaway tickets</p>`;
  }
  document.querySelectorAll(".cabin-tab[data-cabin]").forEach(tab => {
    tab.addEventListener("click", () => switchCabin(Number(tab.dataset.cabin)));
  });
  const currentCabinLabel = document.querySelector("#current-cabin-label");
  const cabinBillingName = document.querySelector("#cabin-billing-name");
  const activeCabin = getCabinData(currentCabinId);
  if (currentCabinLabel && activeCabin) currentCabinLabel.textContent = activeCabin.name;
  if (cabinBillingName && activeCabin) cabinBillingName.textContent = activeCabin.name;
}

function renderTakeawayBoard() {
  const pendingList = document.querySelector("#board-pending-list");
  const readyList = document.querySelector("#board-ready-list");
  if (!pendingList || !readyList) return;
  const tickets = cabins.filter(cabin => cabin.type === "takeaway");
  const pending = tickets.filter(cabin => cabin.kotState === "sent" || cabin.kotState === "accepted");
  const ready = tickets.filter(cabin => cabin.kotState === "completed" || cabin.kotState === "paid");
  const itemSummary = cabin => [...cabin.order.values()].map(item => `${item.quantity} × ${item.name}`).join(", ") || "No items";
  pendingList.innerHTML = pending.length ? pending.map(cabin => `
    <div class="board-card">
      <div class="board-card-head"><strong>#${cabin.token}</strong><span>${takeawayStatusLabel(cabin)}</span></div>
      <div class="board-card-items">${itemSummary(cabin)}</div>
      <button class="board-card-action" data-board-action="view" data-board-cabin="${cabin.id}">View ticket</button>
    </div>`).join("") : `<p class="board-empty">Nothing cooking right now</p>`;
  readyList.innerHTML = ready.length ? ready.map(cabin => {
    const canHandover = cabin.billState === "paid-awaiting-confirmation";
    return `
    <div class="board-card">
      <div class="board-card-head"><strong>#${cabin.token}</strong><span>${takeawayStatusLabel(cabin)}</span></div>
      <div class="board-card-items">${itemSummary(cabin)}</div>
      <button class="board-card-action" data-board-action="${canHandover ? "handover" : "collect"}" data-board-cabin="${cabin.id}">${canHandover ? "Confirm handover" : "Collect payment & handover"}</button>
    </div>`;
  }).join("") : `<p class="board-empty">Nothing ready for pickup</p>`;
}

function openTakeawayBoard() {
  renderTakeawayBoard();
  document.querySelector("#takeaway-board-modal").hidden = false;
}

function closeTakeawayBoard() {
  document.querySelector("#takeaway-board-modal").hidden = true;
}

function createTakeawayTicket() {
  const token = `TA-${nextTakeawayNumber}`;
  nextTakeawayNumber += 1;
  saveTakeawayCounter();
  const id = Date.now();
  cabins.push(makeCabin(id, token, "Take Away", "takeaway", token));
  saveCabins();
  switchCabin(id);
  showToast(`${token} started`);
}

function cancelTakeawayTicket(cabinId) {
  const cabin = getCabinData(cabinId);
  if (!cabin || cabin.type !== "takeaway" || cabin.kotState !== "not-sent") return;
  const isActive = cabinId === currentCabinId;
  cabins = cabins.filter(c => c.id !== cabinId);
  saveCabins();
  showToast(`${cabin.name} cancelled`);
  if (isActive) {
    switchCabin(1);
  } else {
    renderCabinTabs();
  }
}

function closeCabin(cabinId) {
  const cabin = getCabinData(cabinId);
  if (!cabin || cabin.billState !== "paid-awaiting-confirmation") {
    showToast("Ticket can only be closed after payment is complete");
    return;
  }
  const isActive = cabinId === currentCabinId;
  const defaultMode = cabin.type === "takeaway" ? "Take Away" : "Dine In";
  // Paid-upfront tickets never print a receipt at payment time — only
  // the token/KOT does. The receipt prints here, at handover.
  if (isActive && cabin.type === "takeaway" && cabin.paidUpfront) {
    printTicket("bill");
  }
  cabin.order.clear();
  cabin.guestName = "";
  cabin.guestPhone = "";
  cabin.billState = "not-printed";
  cabin.kotState = "not-sent";
  cabin.kotSentQuantities = {};
  cabin.orderNumber = null;
  cabin.discountType = "percent";
  cabin.discountValue = 0;
  cabin.orderMode = defaultMode;
  cabin.paidUpfront = false;
  if (isActive) {
    order.clear();
    currentOrderGuestName = "";
    currentOrderGuestPhone = "";
    billState = "not-printed";
    kotState = "not-sent";
    orderMode = defaultMode;
    discountType = "percent";
    discountValue = 0;
  }
  const kots = getKots();
  delete kots[cabinId];
  saveKots(kots);
  if (cabin.type === "takeaway") {
    cabins = cabins.filter(c => c.id !== cabinId);
  }
  saveCabins();
  showToast(`${cabin.name} closed`);
  if (isActive) {
    switchCabin(1);
  } else {
    renderCabinTabs();
  }
}

const menuGrid = document.querySelector("#menu-grid");
const orderList = document.querySelector("#order-list");
const money = value => `₹${value.toFixed(2)}`;
const escapeHtml = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function renderMenu(category = "All") {
  const visible = category === "All" ? menuItems : menuItems.filter(item => item.category === category);
  menuGrid.innerHTML = visible.map((item, index) => `
    <article class="menu-card" style="animation-delay: ${index * 35}ms">
      <div class="food-image" style="background-image: url('${item.image}')">${item.badge ? `<span class="badge">${item.badge}</span>` : ""}<span class="menu-code-badge" title="Say this code to add it by voice">#${item.code}</span></div>
      <div class="card-content">
        <h3>${item.name}</h3><p>${item.description}</p>
        <div class="card-bottom"><span class="price">${money(item.price)}</span><button class="add-button" data-add="${item.id}" aria-label="Add ${item.name}">+</button></div>
      </div>
    </article>`).join("");
}

function renderMenuTable() {
  document.querySelector("#menu-table-body").innerHTML = menuItems.map(item => `<tr><td>${item.name}</td><td><span class="table-category">${item.category}</span></td><td><label class="price-editor"><span>₹</span><input data-price-id="${item.id}" value="${item.price.toFixed(2)}" type="number" min="0" step="0.01" aria-label="Price for ${item.name}"></label></td><td><div class="image-input-group"><input class="image-editor" data-image-id="${item.id}" type="text" placeholder="Image URL or upload" value="${item.image && !item.image.startsWith('data:') ? item.image : ''}" aria-label="Image URL for ${item.name}"><label class="file-upload-btn"><span>📁</span><input type="file" data-file-upload="${item.id}" accept="image/*" style="display:none;" aria-label="Upload image for ${item.name}"></label></div></td><td><button class="delete-menu" data-delete-id="${item.id}" aria-label="Delete ${item.name}">×</button></td></tr>`).join("");
}

function saveMenu() {
  localStorage.setItem("alyazi-menu-en-v6", JSON.stringify(menuItems));
  const activeCategory = document.querySelector(".category-tab.active")?.dataset.category || "All";
  renderMenu(activeCategory);
  renderMenuTable();
  renderCategoryTabs();
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

let pendingCategorySelect = null;
function renderCategorySelect() {
  const selects = document.querySelectorAll("#new-menu-category");
  selects.forEach(select => {
    select.innerHTML = menuCategories.map(cat => `<option value="${cat}">${cat}</option>`).join("") + `<option value="__new__">+ Add new category</option>`;
    if (select.dataset.categoryBound) return;
    select.dataset.categoryBound = "true";
    select.addEventListener("change", (e) => {
      if (e.target.value !== "__new__") return;
      pendingCategorySelect = e.target;
      const input = document.querySelector("#new-category-input");
      input.value = "";
      document.querySelector("#new-category-modal").hidden = false;
      input.focus();
    });
  });
}

function renderUsers() {
  const access = { "Super Admin": "Full access", Admin: "Operations + settings", User: "Orders + payments" };
  const canDelete = hasSettingsActionAccess(currentUser.role, "users", "delete");
  const canLock = hasSettingsActionAccess(currentUser.role, "users", "lock");
  document.querySelector("#user-table-body").innerHTML = users.map(user => {
    const lockable = user.role !== "Super Admin";
    const lockButton = lockable && canLock ? `<button class="secondary-action" data-toggle-lock="${user.id}" style="padding:4px 9px;font-size:9px;margin:0 6px 0 0;">${user.locked ? "🔓 Unlock" : "🔒 Lock"}</button>` : "";
    const deleteButton = user.id === 1 || !canDelete ? "" : `<button class="delete-menu" data-delete-user="${user.id}" aria-label="Delete ${user.name}">×</button>`;
    return `<tr><td><div class="user-cell"><span class="user-avatar">${user.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}</span><div><strong>${user.name}</strong><small>${user.email}${user.phone ? ` · ${user.phone}` : ""}</small></div></div></td><td><span class="role-badge role-${user.role.toLowerCase().replace(" ", "-")}">${user.role}</span>${user.locked ? ` <span class="lock-badge">🔒 Locked</span>` : ""}</td><td><span class="access-copy">${access[user.role]}</span></td><td>${lockButton}${deleteButton}</td></tr>`;
  }).join("");
}

function saveUsers() {
  localStorage.setItem("alyazi-users-v1", JSON.stringify(users));
  renderUsers();
}

const MANAGED_SETTINGS_PAGES = [
  { key: "printers", label: "Printers", actions: [
      { key: "edit-printer", label: "Edit printer settings" },
      { key: "edit-workflow", label: "Edit workflow settings" },
      { key: "edit-upi", label: "Edit UPI settings" },
    ] },
  { key: "menu-settings", label: "Menu & pricing", actions: [
      { key: "add", label: "Add menu items" },
      { key: "edit-price", label: "Edit prices" },
      { key: "delete", label: "Delete menu items" },
    ] },
  { key: "users", label: "Users", actions: [
      { key: "create", label: "Create accounts" },
      { key: "delete", label: "Delete accounts" },
      { key: "lock", label: "Lock / unlock accounts" },
    ] },
  { key: "sales", label: "Sales reports", actions: [
      { key: "export", label: "Export Excel" },
    ] },
  { key: "receipts", label: "Receipt History", actions: [
      { key: "reprint", label: "Reprint receipts" },
    ] },
  { key: "bookings", label: "Booking Management", actions: [
      { key: "edit", label: "Edit bookings" },
      { key: "cancel", label: "Cancel bookings" },
    ] },
];

function buildDefaultRolePermissions() {
  // Mirrors the app's pre-existing hardcoded behavior: Admin could already do
  // everything except edit prices / delete menu items (that was Super Admin
  // only); User couldn't open Settings at all. Nothing changes until Super
  // Admin actually flips a toggle.
  const adminDenied = { "menu-settings": ["edit-price", "delete"], users: ["lock"] };
  const perms = { Admin: {}, User: {} };
  MANAGED_SETTINGS_PAGES.forEach(page => {
    const adminActions = {};
    const userActions = {};
    page.actions.forEach(action => {
      adminActions[action.key] = !(adminDenied[page.key] || []).includes(action.key);
      userActions[action.key] = false;
    });
    perms.Admin[page.key] = { view: true, actions: adminActions };
    perms.User[page.key] = { view: false, actions: userActions };
  });
  return perms;
}
const DEFAULT_ROLE_PERMISSIONS = buildDefaultRolePermissions();

function getRolePermissions() {
  const stored = JSON.parse(localStorage.getItem("alyazi-role-permissions-v1") || "null");
  const isValid = stored && ["Admin", "User"].every(role =>
    MANAGED_SETTINGS_PAGES.every(page => stored[role] && stored[role][page.key] && typeof stored[role][page.key].view === "boolean" && stored[role][page.key].actions)
  );
  if (!isValid) return DEFAULT_ROLE_PERMISSIONS;
  // The Printers page used to have a single "edit" toggle covering printer,
  // workflow, and UPI settings — now split into three. Carry forward
  // whatever was already granted instead of silently resetting it.
  const printerActions = stored.Admin.printers.actions;
  if (printerActions.edit !== undefined && printerActions["edit-printer"] === undefined) {
    ["Admin", "User"].forEach(role => {
      const actions = stored[role].printers.actions;
      actions["edit-printer"] = actions["edit-workflow"] = actions["edit-upi"] = actions.edit;
      delete actions.edit;
    });
    saveRolePermissions(stored);
  }
  return stored;
}

function saveRolePermissions(permissions) {
  localStorage.setItem("alyazi-role-permissions-v1", JSON.stringify(permissions));
}

function hasSettingsPageAccess(role, page) {
  if (role === "Super Admin") return true;
  const permissions = getRolePermissions();
  return !!(permissions[role] && permissions[role][page] && permissions[role][page].view);
}

function hasSettingsActionAccess(role, page, action) {
  if (role === "Super Admin") return true;
  const permissions = getRolePermissions();
  return !!(permissions[role] && permissions[role][page] && permissions[role][page].actions[action]);
}

function renderRolePermissionsTable() {
  const card = document.querySelector("#role-permissions-card");
  if (!card) return;
  card.hidden = currentUser.role !== "Super Admin";
  if (card.hidden) return;
  const permissions = getRolePermissions();
  const switchCell = (role, page, action, checked) => `<td><label class="switch"><input type="checkbox" data-role="${role}" data-page="${page}" data-action="${action}" ${checked ? "checked" : ""}><span></span></label></td>`;
  const rows = [];
  MANAGED_SETTINGS_PAGES.forEach(page => {
    rows.push(`<tr class="role-permission-page-row"><td><strong>${page.label}</strong><small>Page access</small></td>${switchCell("Admin", page.key, "view", permissions.Admin[page.key].view)}${switchCell("User", page.key, "view", permissions.User[page.key].view)}</tr>`);
    page.actions.forEach(action => {
      rows.push(`<tr class="role-permission-action-row"><td>↳ ${action.label}</td>${switchCell("Admin", page.key, action.key, permissions.Admin[page.key].actions[action.key])}${switchCell("User", page.key, action.key, permissions.User[page.key].actions[action.key])}</tr>`);
    });
  });
  document.querySelector("#role-permissions-body").innerHTML = rows.join("");
}

document.querySelector("#role-permissions-body").addEventListener("change", event => {
  const input = event.target;
  if (input.type !== "checkbox") return;
  const role = input.dataset.role;
  const pageKey = input.dataset.page;
  const actionKey = input.dataset.action;
  const page = MANAGED_SETTINGS_PAGES.find(item => item.key === pageKey);
  const permissions = getRolePermissions();
  let label;
  if (actionKey === "view") {
    permissions[role][pageKey].view = input.checked;
    label = `${page.label} page access`;
  } else {
    permissions[role][pageKey].actions[actionKey] = input.checked;
    label = page.actions.find(item => item.key === actionKey).label;
  }
  saveRolePermissions(permissions);
  showToast(`${role} ${input.checked ? "granted" : "revoked"}: ${label}`);
});

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
  document.querySelector("#print-whatsapp").value = printSettings.whatsapp;
  document.querySelector("#print-address").value = printSettings.address;
  document.querySelector("#print-footer").value = printSettings.footer;
  document.querySelector("#print-show-logo").checked = printSettings.showLogo;
  document.querySelector("#print-show-tax").checked = printSettings.showTax;
  document.querySelector("#print-show-order-type").checked = printSettings.showOrderType;
}

function buildReceiptPreviewHtml(headerAlign, footerAlign) {
  return `<div style="text-align:${headerAlign}">${printSettings.showLogo ? '<img src="al-yazi-mandi-logo.png" alt="">' : ""}<h1>${printSettings.header || "AL YAZI MANDI RESTRAUNT"}</h1>${printSettings.address ? `<p>${printSettings.address}</p>` : ""}${printSettings.phone ? `<p>Ph: ${printSettings.phone}</p>` : ""}</div><hr><div style="text-align:center"><h2>RECEIPT</h2></div><div class="print-line"><span>Guest</span><span>Sample Guest 9999999999</span></div><div class="print-line"><span>Order type</span><span>Dine In</span></div><div class="print-line"><span>Table</span><span>Cabin 1</span></div><div class="print-line"><span>Order #</span><span>1001</span></div><div class="print-line"><span>Date</span><span>${new Date().toLocaleString()}</span></div><hr><div class="print-line"><span>1 x Mutton Yemeni Mandi</span><strong>₹395.00</strong></div><div class="print-line"><span>1 x Chicken Alfaham Mandi</span><strong>₹270.00</strong></div><hr><div class="print-line"><span>Subtotal</span><strong>₹665.00</strong></div><div class="print-line print-total"><span>Total</span><strong>₹719.86</strong></div>${printSettings.footer ? `<hr><div style="text-align:${footerAlign}"><p>${printSettings.footer}</p></div>` : ""}`;
}

function getReceiptLayoutDraft() {
  const draft = {};
  document.querySelectorAll("#receipt-layout-card .align-group").forEach(group => {
    const activeBtn = group.querySelector(".align-buttons button.active");
    draft[group.dataset.zone] = activeBtn ? activeBtn.dataset.align : "center";
  });
  return draft;
}

function renderReceiptLayoutPreview() {
  const draft = getReceiptLayoutDraft();
  document.querySelector("#receipt-layout-preview").innerHTML =
    buildReceiptPreviewHtml(draft.headerAlign, draft.footerAlign);
}

function renderReceiptLayoutEditor() {
  const card = document.querySelector("#receipt-layout-card");
  if (!card) return;
  card.hidden = currentUser.role !== "Super Admin";
  if (card.hidden) return;
  document.querySelectorAll("#receipt-layout-card .align-group").forEach(group => {
    group.querySelectorAll(".align-buttons button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.align === printSettings[group.dataset.zone]);
    });
  });
  renderReceiptLayoutPreview();
}

document.querySelectorAll("#receipt-layout-card .align-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderReceiptLayoutPreview();
  });
});

document.querySelector("#save-receipt-layout").addEventListener("click", () => {
  const draft = getReceiptLayoutDraft();
  printSettings.headerAlign = draft.headerAlign;
  printSettings.footerAlign = draft.footerAlign;
  localStorage.setItem("alyazi-print-settings-v1", JSON.stringify(printSettings));
  showToast("Receipt layout saved");
});

function renderLoginUsers() {
  document.querySelector("#login-user").innerHTML = users.filter(user => !user.locked).map(user => `<option value="${user.id}">${user.name} · ${user.role}</option>`).join("");
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
  const startTime = kitchenPrepStartedAt || Date.now();
  kitchenPrepStartedAt = startTime;
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  const timerValue = formatDuration(elapsedSeconds);
  const paidUpfront = getCabinData(currentCabinId)?.paidUpfront;
  if (workflowBanner) {
    workflowBanner.hidden = false;
    workflowBanner.textContent = paidUpfront ? `PAID · PREPARING FOR PICKUP · ${timerValue}` : `YOUR ORDER IS PREPARING · ${timerValue}`;
  }
  if (kotStatus) {
    kotStatus.textContent = paidUpfront ? `Paid — kitchen is cooking • ${timerValue}` : `Preparing order - kitchen is cooking • ${timerValue}`;
  }
}

function startKitchenPrepTimer() {
  stopKitchenPrepTimer();
  if (!kitchenPrepStartedAt) kitchenPrepStartedAt = Date.now();
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
  const discountAmount = Math.min(discountType === "amount" ? discountValue : subtotal * (discountValue / 100), subtotal);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * .0825;
  const total = taxableAmount + tax;
  document.querySelector("#subtotal").textContent = money(subtotal);
  document.querySelector("#discount-amount-row").hidden = discountAmount <= 0;
  document.querySelector("#discount-amount").textContent = `-${money(discountAmount)}`;
  document.querySelector("#tax").textContent = money(tax);
  document.querySelector("#total").textContent = money(total);
  document.querySelector("#charge-total").textContent = money(total);
  const activeCabin = getCabinData(currentCabinId);
  const isTakeaway = !!activeCabin && activeCabin.type === "takeaway";
  const paidUpfront = !!activeCabin && activeCabin.paidUpfront;
  document.querySelector("#checkout-button").disabled = !order.size || kotState !== "completed" || paidUpfront;
  const sendKotButton = document.querySelector("#send-kot");
  sendKotButton.hidden = isTakeaway;
  const hasPendingKotItems = !!activeCabin && pendingKotItems(activeCabin).length > 0;
  sendKotButton.disabled = !order.size || !hasPendingKotItems;
  document.querySelector("#send-kot span").textContent = hasPendingKotItems ? "Send & print KOT" : "KOT sent & printed";
  document.querySelector("#complete-kot").hidden = kotState !== "sent";
  const payUpfrontButton = document.querySelector("#pay-upfront-button");
  if (payUpfrontButton) {
    payUpfrontButton.hidden = !(isTakeaway && kotState === "not-sent");
    payUpfrontButton.disabled = !order.size;
  }
  const cancelTakeawayButton = document.querySelector("#cancel-takeaway-button");
  if (cancelTakeawayButton) {
    cancelTakeawayButton.hidden = !(isTakeaway && kotState === "not-sent" && order.size > 0);
  }
  document.querySelector("#checkout-label").textContent = paidUpfront ? (kotState === "completed" ? "Confirm handover" : "Paid — preparing") : kotState === "completed" ? "Collect payment" : kotState === "paid" ? "Bill printing..." : orderMode === "KOT" ? "Send to kitchen" : orderMode === "Take Away" ? "Print receipt" : "Charge";
  const workflowBanner = document.querySelector("#workflow-banner");
  const kotStatusEl = document.querySelector("#kot-status");
  if (kotState === "accepted") {
    updateKitchenPrepTimer();
  } else if (kotState === "completed") {
    workflowBanner.hidden = false;
    if (paidUpfront) {
      workflowBanner.textContent = "READY FOR PICKUP · Already paid — confirm handover below";
      kotStatusEl.textContent = "Ready for pickup (paid)";
    } else {
      workflowBanner.textContent = "YOUR ORDER READY · Kitchen completed this order · Payment is now available";
      kotStatusEl.textContent = "Your order is ready";
    }
  } else if (kotState === "paid") {
    workflowBanner.hidden = false;
    workflowBanner.textContent = "BILL PRINTED? Confirm below before starting the next order";
    kotStatusEl.textContent = `Paid by ${paymentMethod} - confirm bill printed`;
  } else if (paidUpfront) {
    workflowBanner.hidden = false;
    workflowBanner.textContent = "PAID UPFRONT · Preparing for pickup";
    kotStatusEl.textContent = "Paid — waiting for kitchen";
  } else {
    workflowBanner.hidden = true;
    kotStatusEl.textContent = kotState === "sent" ? "KOT sent - waiting for kitchen" : "KOT not sent";
  }
  const readyToArchive = billState === "paid-awaiting-confirmation";
  const locked = readyToArchive || (paidUpfront && kotState !== "not-sent");
  document.querySelectorAll(".add-button").forEach(button => { button.disabled = locked; });
  document.querySelector("#discount-value").disabled = locked;
  document.querySelector("#discount-type").disabled = locked;
  document.querySelector("#next-order-button").hidden = !readyToArchive;
  document.querySelector("#next-order-button").textContent = paidUpfront ? "Confirm handover · Start next ticket" : "Confirm bill printed · Start next order";
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

function printTicket(type, isReprint = false, itemsOverride = null) {
  const items = itemsOverride || [...order.values()];
  if (!items.length) { showToast(`Add items before printing ${type}`); return; }
  renderPrintSheet(type, isReprint, itemsOverride);
  document.body.classList.add("print-ticket");
  window.print();
  document.body.classList.remove("print-ticket");
  showToast(`${type} sent to configured printer`);
}

function renderPrintSheet(type, isReprint = false, itemsOverride = null) {
  const items = itemsOverride || [...order.values()];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = type === "bill" ? Math.min(discountType === "amount" ? discountValue : subtotal * (discountValue / 100), subtotal) : 0;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * .0825;
  const total = taxableAmount + tax;
  const safe = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const guestInfo = currentOrderGuestName || currentOrderGuestPhone ? `<div class="print-line"><span>Guest</span><span>${safe(currentOrderGuestName)}${currentOrderGuestPhone ? ` ${safe(currentOrderGuestPhone)}` : ""}</span></div>` : "";
  const receiptType = type === "bill" ? (isReprint ? "--- COPY ---" : "--- ORIGINAL ---") : "";
  const activeCabin = getCabinData(currentCabinId);
  const locationLine = activeCabin && activeCabin.type === "takeaway" ? `<div class="print-line"><span>Token</span><strong style="font-size:16px;">#${safe(activeCabin.token)}</strong></div>` : `<div class="print-line"><span>Table</span><span>${activeCabin ? safe(activeCabin.name) : "Dine In"}</span></div>`;
  let orderNumberLine = "";
  if (type === "bill" && activeCabin) {
    if (!activeCabin.orderNumber) {
      activeCabin.orderNumber = nextOrderNumber;
      nextOrderNumber += 1;
      saveOrderCounter();
      saveCabins();
    }
    orderNumberLine = `<div class="print-line"><span>Order #</span><span>${activeCabin.orderNumber}</span></div>`;
  }
  const orderTypeLine = printSettings.showOrderType ? `<div class="print-line"><span>Order type</span><span>${safe(orderMode)}</span></div>` : "";
  const dateLine = `<div class="print-line"><span>Date</span><span>${new Date().toLocaleString()}</span></div>`;
  const html = `<div style="text-align:${printSettings.headerAlign}">${printSettings.showLogo ? '<img src="al-yazi-mandi-logo.png" alt="">' : ""}<h1>${safe(printSettings.header)}</h1>${printSettings.address ? `<p>${safe(printSettings.address)}</p>` : ""}${printSettings.phone ? `<p>Ph: ${safe(printSettings.phone)}</p>` : ""}${printSettings.whatsapp ? `<p>WhatsApp: ${safe(printSettings.whatsapp)}</p>` : ""}</div><hr><div style="text-align:center"><h2>${type === "KOT" ? (itemsOverride ? "ADDITIONAL ITEMS / KOT" : "KITCHEN ORDER / KOT") : "RECEIPT"}</h2>${receiptType ? `<p style="font-weight:bold;">${receiptType}</p>` : ""}</div>${guestInfo}${orderTypeLine}${locationLine}${orderNumberLine}${dateLine}<hr>${items.map(item => `<div class="print-line"><span>${item.quantity} x ${safe(item.name)}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join("")}${type === "KOT" ? "" : `<hr><div class="print-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>${discountAmount > 0 ? `<div class="print-line"><span>Discount</span><strong>-${money(discountAmount)}</strong></div>` : ""}${printSettings.showTax ? `<div class="print-line"><span>Tax (8.25%)</span><strong>${money(tax)}</strong></div>` : ""}<div class="print-line print-total"><span>Total</span><strong>${money(total)}</strong></div>`}${printSettings.footer ? `<hr><div style="text-align:${printSettings.footerAlign}"><p>${safe(printSettings.footer)}</p></div>` : ""}`;
  document.querySelector("#print-sheet").innerHTML = html;
  if (type === "bill" && !isReprint) {
    printedBills.push({ html: html.replace("--- ORIGINAL ---", "--- COPY ---"), createdAt: new Date().toISOString(), guest: currentOrderGuestName, phone: currentOrderGuestPhone, total, originalHtml: html });
    localStorage.setItem("alyazi-printed-bills", JSON.stringify(printedBills));
  }
}

function buildOrderMessage(label, itemsOverride = null) {
  const items = itemsOverride || [...order.values()];
  const lines = items.map(item => `${item.quantity} x ${item.name} - ${money(item.price * item.quantity)}`);
  const total = itemsOverride ? money(items.reduce((sum, item) => sum + item.price * item.quantity, 0)) : document.querySelector("#total").textContent;
  return [`AL YAZI MANDI RESTRAUNT`, label, `Order type: ${orderMode}`, ...lines, `Total: ${total}`].join("\n");
}

function openWhatsApp(number, message) {
  const cleanNumber = number.replace(/[^\d]/g, "");
  if (!cleanNumber || cleanNumber === "919999999999") { showToast("Add a real WhatsApp number in Settings"); return false; }
  window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  return true;
}

function pendingKotItems(cabin) {
  const sentQuantities = cabin.kotSentQuantities || {};
  return [...order.values()].reduce((items, item) => {
    const alreadySent = sentQuantities[item.id] || 0;
    const pendingQty = item.quantity - alreadySent;
    if (pendingQty > 0) items.push({ ...item, quantity: pendingQty });
    return items;
  }, []);
}

function sendKot() {
  if (!requireGuestPhone()) return;
  const cabin = getCabinData(currentCabinId);
  const newItems = pendingKotItems(cabin);
  if (!newItems.length) return;
  const isAdditionalRound = Object.values(cabin.kotSentQuantities || {}).some(qty => qty > 0);
  const settings = JSON.parse(localStorage.getItem("alyazi-printers") || "{}");
  const integrations = JSON.parse(localStorage.getItem("alyazi-integrations") || "{}");
  const kots = getKots();
  kots[currentCabinId] = { cabinId: currentCabinId, cabinName: cabin.name, items: newItems, mode: orderMode, status: "sent", isAdditional: isAdditionalRound, createdAt: new Date().toISOString() };
  saveKots(kots);
  printTicket("KOT", false, newItems);
  openWhatsApp(integrations.kitchenWhatsapp || "", buildOrderMessage(isAdditionalRound ? "ADDITIONAL ITEMS / KOT" : "KITCHEN ORDER / KOT", newItems));
  cabin.kotSentQuantities = Object.fromEntries([...order.values()].map(item => [item.id, item.quantity]));
  kotState = "sent";
  cabin.kotState = "sent";
  saveCabins();
  renderOrder();
  showToast(settings.network?.enabled || settings.wired?.enabled ? "KOT printed and sent to kitchen" : "KOT sent to WhatsApp and display");
}

function completeKot() {
  if (kotState !== "sent") return;
  kotState = "completed";
  const cabin = getCabinData(currentCabinId);
  cabin.kotState = "completed";
  if (cabin.paidUpfront) {
    cabin.billState = "paid-awaiting-confirmation";
    billState = "paid-awaiting-confirmation";
  }
  saveCabins();
  const kots = getKots();
  delete kots[currentCabinId];
  saveKots(kots);
  document.body.classList.add("kot-ready");
  stopKitchenPrepTimer();
  renderOrder();
  renderCabinTabs();
  const integrations = JSON.parse(localStorage.getItem("alyazi-integrations") || "{}");
  if (cabin.paidUpfront) {
    showToast(`${cabin.name} is ready for pickup`);
  } else {
    startPaymentReminder();
    openWhatsApp(integrations.billingWhatsapp || "", buildOrderMessage("KOT COMPLETED - READY FOR PAYMENT"));
    showToast("Billing user notified");
  }
}

function openPayment() {
  if (!requireGuestPhone()) return;
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
  const cabin = getCabinData(currentCabinId);
  const total = Number(document.querySelector("#total").textContent.replace(/[^\d.]/g, ""));

  if (payUpfrontActive) {
    payUpfrontActive = false;
    sales.push({ id: Date.now(), total, method: paymentMethod, mode: orderMode, paidUpfront: true, createdAt: new Date().toISOString(), user: currentUser.name, items: [...order.values()].map(item => ({ name: item.name, quantity: item.quantity, price: item.price })) });
    localStorage.setItem("alyazi-sales-v1", JSON.stringify(sales));
    const kots = getKots();
    kots[currentCabinId] = { cabinId: currentCabinId, cabinName: cabin.name, items: [...order.values()], mode: orderMode, status: "sent", paid: true, createdAt: new Date().toISOString() };
    saveKots(kots);
    openWhatsApp(integrations.kitchenWhatsapp || "", buildOrderMessage("KITCHEN ORDER / KOT [PAID]"));
    cabin.paidUpfront = true;
    cabin.kotState = "sent";
    kotState = "sent";
    saveCabins();
    renderOrder();
    renderCabinTabs();
    printTicket("KOT");
    showToast(`Payment received by ${paymentMethod}. Sent to kitchen — starting next ticket.`);
    createTakeawayTicket();
    return;
  }

  printTicket("bill");
  showToast(`Payment received by ${paymentMethod}. Confirm the printed bill to continue.`);
  kotState = "paid";
  stopPaymentReminder();
  billState = "paid-awaiting-confirmation";
  cabin.kotState = kotState;
  cabin.billState = billState;
  saveCabins();
  sales.push({ id: Date.now(), total, method: paymentMethod, mode: orderMode, createdAt: new Date().toISOString(), user: currentUser.name, items: [...order.values()].map(item => ({ name: item.name, quantity: item.quantity, price: item.price })) });
  localStorage.setItem("alyazi-sales-v1", JSON.stringify(sales));
  document.body.classList.remove("kot-ready");
  renderOrder();
  openWhatsApp(integrations.billingWhatsapp || "", buildOrderMessage(`PAYMENT COMPLETE - ${paymentMethod}`));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function requireGuestPhone() {
  if (currentOrderGuestPhone.trim()) return true;
  showToast("Enter the guest's phone number before continuing");
  document.querySelector("#guest-phone").focus();
  return false;
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
  menuItems.push({ id: Date.now(), code: nextMenuCode(), name, description: "Freshly added menu item", price, category, badge: "New", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80" });
  saveMenu(); showToast(`${name} added to menu`);
}

const VOICE_DIGIT_WORDS = { zero: "0", oh: "0", o: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9" };
// Speech recognition renders "zero one" / "oh one" / "01" all sorts of ways.
// This only matches when the WHOLE phrase is digits/number-words, so it
// never misfires on a real item name like "BBQ Chicken - 1/2".
function resolveVoiceCode(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  const digits = words.map(word => VOICE_DIGIT_WORDS[word] ?? (/^\d+$/.test(word) ? word : null));
  if (digits.some(digit => digit === null)) return null;
  const joined = digits.join("");
  return /^\d{1,2}$/.test(joined) ? joined.padStart(2, "0") : null;
}

function resolveBillingItem(text) {
  const normalized = text.toLowerCase().replace(/[.,]/g, " ").trim();
  const code = resolveVoiceCode(normalized);
  if (code) {
    const codedItem = menuItems.find(menuItem => menuItem.code === code);
    if (codedItem) return { item: codedItem, quantity: 1 };
  }
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
    const command = window.prompt("Enter an item code (e.g. 01) or a name and quantity to add:", "01");
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
  orderMode = button.dataset.mode;
  applyOrderModeUI();
  document.querySelector("#checkout-label").textContent = orderMode === "KOT" ? "Send to kitchen" : orderMode === "Take Away" ? "Print receipt" : "Charge";
}));
document.querySelector("#send-kot").addEventListener("click", sendKot);
const payUpfrontButtonEl = document.querySelector("#pay-upfront-button");
if (payUpfrontButtonEl) payUpfrontButtonEl.addEventListener("click", () => {
  if (!order.size || kotState !== "not-sent") return;
  if (!requireGuestPhone()) return;
  payUpfrontActive = true;
  openPayment();
});
const newTakeawayBtn = document.querySelector("#new-takeaway-btn");
if (newTakeawayBtn) newTakeawayBtn.addEventListener("click", createTakeawayTicket);
const cancelTakeawayButtonEl = document.querySelector("#cancel-takeaway-button");
if (cancelTakeawayButtonEl) cancelTakeawayButtonEl.addEventListener("click", () => cancelTakeawayTicket(currentCabinId));
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
  if (voiceHelp) voiceHelp.textContent = "Hold “Hold to add item” and say an item's code (e.g. “01”) or its name: “Chicken Mandi two and BBQ Chicken Full”. Keep holding to add more items in the same order.";
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
document.querySelector("#open-kitchen-display").addEventListener("click", () => {
  const integrations = JSON.parse(localStorage.getItem("alyazi-integrations") || "{}");
  const cabin = getCabinData(currentCabinId);
  const kots = getKots();
  const existing = kots[currentCabinId];
  // A takeaway ticket must never reach the kitchen before it's paid. And an
  // in-flight KOT is never overwritten here — that would blow away the
  // delta-only items a real "Send & print KOT" round already queued.
  const isUnpaidTakeaway = cabin.type === "takeaway" && cabin.kotState === "not-sent";
  if (!existing && !isUnpaidTakeaway) {
    const newItems = pendingKotItems(cabin);
    if (newItems.length) {
      kots[currentCabinId] = { cabinId: currentCabinId, cabinName: cabin.name, items: newItems, mode: orderMode, status: "sent", createdAt: new Date().toISOString() };
      saveKots(kots);
    }
  }
  window.open(integrations.kitchenDisplayUrl || "kitchen.html", "_blank", "noopener");
});

document.querySelector("#close-payment").addEventListener("click", () => { payUpfrontActive = false; document.querySelector("#payment-modal").hidden = true; });
document.querySelector("#takeaway-board-btn")?.addEventListener("click", openTakeawayBoard);
document.querySelector("#close-takeaway-board")?.addEventListener("click", closeTakeawayBoard);
document.querySelector("#takeaway-board-modal")?.addEventListener("click", event => {
  if (event.target.id === "takeaway-board-modal") { closeTakeawayBoard(); return; }
  const actionBtn = event.target.closest("[data-board-action]");
  if (!actionBtn) return;
  const id = Number(actionBtn.dataset.boardCabin);
  const action = actionBtn.dataset.boardAction;
  if (action === "view") {
    switchCabin(id);
    closeTakeawayBoard();
  } else if (action === "handover") {
    switchCabin(id);
    closeCabin(id);
    renderTakeawayBoard();
  } else if (action === "collect") {
    switchCabin(id);
    closeTakeawayBoard();
    openPayment();
  }
});
document.querySelectorAll(".payment-method").forEach(button => button.addEventListener("click", () => { document.querySelector(".payment-method.active").classList.remove("active"); button.classList.add("active"); paymentMethod = button.dataset.payment; updateUpiQr(); }));
document.querySelector("#payment-upi-account").addEventListener("change", event => { selectedUpiId = Number(event.target.value); updateUpiQr(); });
document.querySelector("#guest-name").addEventListener("input", (e) => { currentOrderGuestName = e.target.value; });
document.querySelector("#guest-phone").addEventListener("input", (e) => { currentOrderGuestPhone = e.target.value; });
document.querySelector("#discount-value").addEventListener("input", event => {
  discountValue = Math.max(0, Number(event.target.value) || 0);
  const cabin = getCabinData(currentCabinId);
  if (cabin) { cabin.discountType = discountType; cabin.discountValue = discountValue; saveCabins(); }
  renderOrder();
});
document.querySelector("#discount-type").addEventListener("change", event => {
  discountType = event.target.value;
  const cabin = getCabinData(currentCabinId);
  if (cabin) { cabin.discountType = discountType; cabin.discountValue = discountValue; saveCabins(); }
  renderOrder();
});
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
  const canReprint = hasSettingsActionAccess(currentUser.role, "receipts", "reprint");
  list.innerHTML = printedBills.map((bill, idx) => {
    const date = new Date(bill.createdAt);
    return `<div class="receipt-item"><div><strong>${bill.guest || "Guest " + (idx + 1)}</strong><small>${date.toLocaleString()}</small></div><div class="receipt-total">₹${bill.total.toFixed(2)}</div>${canReprint ? `<button class="secondary-action" data-print-bill="${idx}" style="padding:5px 10px;font-size:10px;">🖨️ Print</button>` : ""}</div>`;
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
function applySettingsAccessForRole() {
  const role = currentUser.role;
  let firstVisibleTab = null;
  document.querySelectorAll(".settings-tab[data-settings-tab]").forEach(tab => {
    const page = tab.dataset.settingsTab;
    if (page === "guests") return;
    const allowed = hasSettingsPageAccess(role, page);
    tab.hidden = !allowed;
    if (allowed && !firstVisibleTab) firstVisibleTab = tab;
  });
  if (firstVisibleTab) firstVisibleTab.click();
  return !!firstVisibleTab;
}
document.querySelector("#settings-button").addEventListener("click", () => {
  if (!applySettingsAccessForRole()) { showToast("You don't have access to any settings pages"); return; }
  settingsModal.hidden = false;
  renderMenuTable(); renderUsers(); renderUpiAccounts(); loadPrintSettings(); updateSession(); renderRolePermissionsTable(); renderReceiptLayoutEditor();
});
document.querySelector("#close-settings").addEventListener("click", () => { settingsModal.hidden = true; });
settingsModal.addEventListener("click", event => { if (event.target === settingsModal) settingsModal.hidden = true; });
document.querySelectorAll(".settings-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelector(".settings-tab.active").classList.remove("active"); tab.classList.add("active");
  document.querySelectorAll(".settings-view").forEach(view => view.classList.remove("active"));
  document.querySelector(`#${tab.dataset.settingsTab}-view`).classList.add("active");
  if (tab.dataset.settingsTab === "sales") renderSales();
  if (tab.dataset.settingsTab === "receipts") renderReceiptHistory();
  if (tab.dataset.settingsTab === "bookings") renderBookingsList();
}));
document.querySelectorAll(".report-range").forEach(button => button.addEventListener("click", () => { document.querySelector(".report-range.active").classList.remove("active"); button.classList.add("active"); document.querySelector("#custom-range").hidden = button.dataset.range !== "custom"; if (button.dataset.range !== "custom") renderSales(button.dataset.range); }));
document.querySelector("#apply-custom-report").addEventListener("click", () => renderSales("custom", document.querySelector("#report-from").value, document.querySelector("#report-to").value));
document.querySelector("#export-sales").addEventListener("click", () => {
  if (!hasSettingsActionAccess(currentUser.role, "sales", "export")) { showToast("You don't have permission to export sales reports"); return; }
  if (!reportExportSales.length) { showToast("No sales in this report range"); return; }
  const rows = [["Date", "Order type", "Payment method", "Cashier", "Menu items", "Total"]];
  reportExportSales.forEach(sale => rows.push([new Date(sale.createdAt).toLocaleString(), sale.mode || "Restaurant order", sale.method, sale.user, sale.items?.map(item => `${item.quantity} x ${item.name}`).join("; ") || "", money(sale.total)]));
  const table = `<table><tr>${rows[0].map(cell => `<th>${cell}</th>`).join("")}</tr>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${String(cell).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`).join("")}</tr>`).join("")}</table>`;
  const blob = new Blob([`<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `alyazi-sales-${new Date().toISOString().slice(0, 10)}.xls`; link.click(); URL.revokeObjectURL(link.href); showToast("Sales report exported to Excel");
});
document.querySelector("#user-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!hasSettingsActionAccess(currentUser.role, "users", "create")) { showToast("You don't have permission to create accounts"); return; }
  users.push({ id: Date.now(), name: document.querySelector("#new-user-name").value.trim(), email: document.querySelector("#new-user-email").value.trim(), phone: document.querySelector("#new-user-phone").value.trim(), role: document.querySelector("#new-user-role").value, password: document.querySelector("#new-user-password").value, locked: false });
  saveUsers(); event.target.reset(); showToast("User account created");
});
document.querySelector("#user-table-body").addEventListener("click", event => {
  if (event.target.dataset.toggleLock) {
    if (!hasSettingsActionAccess(currentUser.role, "users", "lock")) { showToast("You don't have permission to lock accounts"); return; }
    const user = users.find(item => item.id === Number(event.target.dataset.toggleLock));
    if (user && user.role !== "Super Admin") {
      user.locked = !user.locked;
      saveUsers();
      renderLoginUsers();
      showToast(`${user.name} ${user.locked ? "locked — they can no longer sign in" : "unlocked"}`);
    }
    return;
  }
  if (!event.target.dataset.deleteUser) return;
  if (!hasSettingsActionAccess(currentUser.role, "users", "delete")) { showToast("You don't have permission to delete accounts"); return; }
  users = users.filter(user => user.id !== Number(event.target.dataset.deleteUser)); saveUsers(); showToast("User account removed");
});
document.querySelector("#printer-form").addEventListener("submit", event => { event.preventDefault(); if (!hasSettingsActionAccess(currentUser.role, "printers", "edit-printer")) { showToast("You don't have permission to edit printer settings"); return; } localStorage.setItem("alyazi-printers", JSON.stringify({ network: { name: document.querySelector("#network-name").value, ip: document.querySelector("#network-ip").value, port: document.querySelector("#network-port").value, enabled: document.querySelector("#network-enabled").checked }, wired: { name: document.querySelector("#wired-name").value, device: document.querySelector("#wired-device").value, enabled: document.querySelector("#wired-enabled").checked } })); showToast("Printer settings saved"); });
document.querySelector("#print-settings-form").addEventListener("submit", event => { event.preventDefault(); if (!hasSettingsActionAccess(currentUser.role, "printers", "edit-printer")) { showToast("You don't have permission to edit printer settings"); return; } printSettings = { header: document.querySelector("#print-header").value.trim(), phone: document.querySelector("#print-phone").value.trim(), whatsapp: document.querySelector("#print-whatsapp").value.trim(), address: document.querySelector("#print-address").value.trim(), footer: document.querySelector("#print-footer").value.trim(), showLogo: document.querySelector("#print-show-logo").checked, showTax: document.querySelector("#print-show-tax").checked, showOrderType: document.querySelector("#print-show-order-type").checked }; localStorage.setItem("alyazi-print-settings-v1", JSON.stringify(printSettings)); showToast("Print settings saved"); });
document.querySelector("#save-integrations").addEventListener("click", () => { if (!hasSettingsActionAccess(currentUser.role, "printers", "edit-workflow")) { showToast("You don't have permission to edit workflow settings"); return; } localStorage.setItem("alyazi-integrations", JSON.stringify({ kitchenWhatsapp: document.querySelector("#kitchen-whatsapp").value, billingWhatsapp: document.querySelector("#billing-whatsapp").value, kitchenDisplayUrl: document.querySelector("#kitchen-display-url").value })); showToast("Workflow settings saved"); });
document.querySelector("#upi-account-form").addEventListener("submit", event => { event.preventDefault(); if (!hasSettingsActionAccess(currentUser.role, "printers", "edit-upi")) { showToast("You don't have permission to edit UPI settings"); return; } const account = { id: Date.now(), name: document.querySelector("#new-upi-name").value.trim(), bank: document.querySelector("#new-upi-bank").value.trim(), upiId: document.querySelector("#new-upi-id").value.trim(), enabled: true }; upiAccounts.push(account); selectedUpiId = account.id; saveUpiAccounts(); event.target.reset(); showToast(`${account.name} linked`); });
document.querySelector("#upi-accounts-list").addEventListener("change", event => { if (!event.target.dataset.upiToggle) return; if (!hasSettingsActionAccess(currentUser.role, "printers", "edit-upi")) { showToast("You don't have permission to edit UPI settings"); renderUpiAccounts(); return; } const account = upiAccounts.find(item => item.id === Number(event.target.dataset.upiToggle)); account.enabled = event.target.checked; saveUpiAccounts(); });
document.querySelector("#upi-accounts-list").addEventListener("click", event => { if (!event.target.dataset.deleteUpi) return; if (!hasSettingsActionAccess(currentUser.role, "printers", "edit-upi")) { showToast("You don't have permission to edit UPI settings"); return; } upiAccounts = upiAccounts.filter(item => item.id !== Number(event.target.dataset.deleteUpi)); selectedUpiId = upiAccounts.find(item => item.enabled)?.id || null; saveUpiAccounts(); showToast("UPI account removed"); });
window.addEventListener("storage", event => {
  if (event.key === "alyazi-kots-v1") syncKotStatusFromStorage();
});
document.querySelectorAll(".test-button").forEach(button => button.addEventListener("click", () => showToast(`${button.dataset.printer === "network" ? "Network" : "Wired"} test print sent`)));
const addMenuForm = document.querySelector("#add-menu-form");
if (addMenuForm) {
  addMenuForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!hasSettingsActionAccess(currentUser.role, "menu-settings", "add")) { showToast("You don't have permission to add menu items"); return; }
    const name = document.querySelector("#new-menu-name").value.trim();
    const price = Number(document.querySelector("#new-menu-price").value);
    let image = document.querySelector("#new-menu-image").value.trim() || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80";
    const fileInput = document.querySelector("#new-menu-image-file");
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        image = e.target.result;
        menuItems.push({ id: Date.now(), code: nextMenuCode(), name, description: "Freshly added menu item", price, category: document.querySelector("#new-menu-category").value, badge: "New", image });
        saveMenu(); event.target.reset(); fileInput.value = ""; showToast(`${name} added to menu`);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      menuItems.push({ id: Date.now(), code: nextMenuCode(), name, description: "Freshly added menu item", price, category: document.querySelector("#new-menu-category").value, badge: "New", image });
      saveMenu(); event.target.reset(); showToast(`${name} added to menu`);
    }
  });
}
document.addEventListener("change", event => {
  if (event.target.dataset.priceId) {
    if (!hasSettingsActionAccess(currentUser.role, "menu-settings", "edit-price")) { showToast("You don't have permission to edit prices"); event.target.value = menuItems.find(m => m.id === Number(event.target.dataset.priceId)).price.toFixed(2); return; }
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
    if (!hasSettingsActionAccess(currentUser.role, "menu-settings", "delete")) {
      showToast("You don't have permission to delete menu items");
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
  if (user && user.locked) { document.querySelector("#login-error").textContent = "This account has been locked. Contact your Super Admin."; return; }
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

function getBookings() {
  return JSON.parse(localStorage.getItem("alyazi-bookings-v1") || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem("alyazi-bookings-v1", JSON.stringify(bookings));
}

const bookingModal = document.querySelector("#booking-modal");
const reminderModal = document.querySelector("#reminder-modal");

const BOOKING_WINDOW_START_MINUTES = 11 * 60 + 30;
const BOOKING_WINDOW_END_MINUTES = 22 * 60;
function isWithinBookingHours(datetimeValue) {
  const date = new Date(datetimeValue);
  const minutesOfDay = date.getHours() * 60 + date.getMinutes();
  return minutesOfDay >= BOOKING_WINDOW_START_MINUTES && minutesOfDay <= BOOKING_WINDOW_END_MINUTES;
}
document.querySelector("#booking-datetime").addEventListener("change", event => { event.target.blur(); });

function openBookingModal(editBooking) {
  const form = document.querySelector("#booking-form");
  form.reset();
  document.querySelector("#booking-error").textContent = "";
  if (editBooking) {
    form.dataset.editId = String(editBooking.id);
    document.querySelector("#booking-title").textContent = "Edit booking";
    document.querySelector("#booking-submit").textContent = "Save changes";
    document.querySelector("#booking-cabin").value = String(editBooking.cabinId);
    document.querySelector("#booking-name").value = editBooking.name;
    document.querySelector("#booking-phone").value = editBooking.phone;
    document.querySelector("#booking-guests").value = editBooking.guests;
    document.querySelector("#booking-datetime").value = editBooking.datetime;
  } else {
    delete form.dataset.editId;
    document.querySelector("#booking-title").textContent = "Book a cabin";
    document.querySelector("#booking-submit").textContent = "Confirm booking";
    document.querySelector("#booking-cabin").value = String(currentCabinId <= 5 ? currentCabinId : 1);
  }
  bookingModal.hidden = false;
}

document.querySelector("#book-cabin-btn").addEventListener("click", () => openBookingModal(null));
document.querySelector("#close-booking").addEventListener("click", () => { bookingModal.hidden = true; });
bookingModal.addEventListener("click", event => {
  if (event.target.id === "booking-modal") bookingModal.hidden = true;
});
document.querySelector("#booking-form").addEventListener("submit", event => {
  event.preventDefault();
  const datetimeValue = document.querySelector("#booking-datetime").value;
  const errorEl = document.querySelector("#booking-error");
  if (!datetimeValue || !isWithinBookingHours(datetimeValue)) {
    errorEl.textContent = "Bookings are only allowed between 11:30 AM and 10:00 PM.";
    return;
  }
  const cabinId = Number(document.querySelector("#booking-cabin").value);
  const cabin = getCabinData(cabinId);
  const cabinName = cabin ? cabin.name : `Cabin ${cabinId}`;
  const name = document.querySelector("#booking-name").value.trim();
  const phone = document.querySelector("#booking-phone").value.trim();
  const guests = Number(document.querySelector("#booking-guests").value);
  const form = event.target;
  const editId = form.dataset.editId ? Number(form.dataset.editId) : null;
  const bookings = getBookings();
  const conflict = bookings.find(item => !item.cancelled && item.id !== editId && item.cabinId === cabinId && item.datetime === datetimeValue);
  if (conflict) {
    errorEl.textContent = `${cabinName} is already booked for that time. Cancel the existing booking first.`;
    return;
  }
  errorEl.textContent = "";
  if (editId) {
    const booking = bookings.find(item => item.id === editId);
    if (!booking) { bookingModal.hidden = true; return; }
    booking.cabinId = cabinId;
    booking.cabinName = cabinName;
    booking.name = name;
    booking.phone = phone;
    booking.guests = guests;
    booking.datetime = datetimeValue;
    booking.notifiedHour = false;
    booking.notifiedHalfHour = false;
    saveBookings(bookings);
    bookingModal.hidden = true;
    delete form.dataset.editId;
    renderCabinTabs();
    renderBookingsList();
    showToast(`${cabinName} booking updated`);
    return;
  }
  const booking = {
    id: Date.now(),
    cabinId,
    cabinName,
    name,
    phone,
    guests,
    datetime: datetimeValue,
    confirmed: false,
    cancelled: false,
    notifiedHour: false,
    notifiedHalfHour: false,
  };
  bookings.push(booking);
  saveBookings(bookings);
  bookingModal.hidden = true;
  renderCabinTabs();
  renderBookingsList();
  showToast(`${booking.cabinName} booked for ${booking.name} · ${new Date(booking.datetime).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}`);
});

function formatBookingWhen(datetime) {
  return new Date(datetime).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" });
}

function renderBookingsList() {
  const list = document.querySelector("#bookings-list");
  if (!list) return;
  const bookings = getBookings();
  if (!bookings.length) {
    list.innerHTML = `<div class="guest-directory-empty">No bookings yet</div>`;
    return;
  }
  const now = Date.now();
  const canEdit = hasSettingsActionAccess(currentUser.role, "bookings", "edit");
  const canCancel = hasSettingsActionAccess(currentUser.role, "bookings", "cancel");
  const row = booking => {
    const isPast = new Date(booking.datetime).getTime() < now;
    const statusLabel = booking.cancelled ? "Cancelled" : booking.confirmed ? "Confirmed" : isPast ? "Past" : "Upcoming";
    const canModify = !booking.cancelled && !isPast;
    const actions = canModify ? `${canEdit ? ` <button class="secondary-action" data-edit-booking="${booking.id}" style="padding:3px 8px;font-size:9px;margin-left:6px;margin-top:0;">✎ Edit</button>` : ""}${canCancel ? ` <button class="secondary-action" data-cancel-booking="${booking.id}" style="padding:3px 8px;font-size:9px;margin-left:6px;margin-top:0;">✕ Cancel</button>` : ""}` : "";
    const reasonLine = booking.cancelled && booking.cancelReason ? `<small>Reason: ${escapeHtml(booking.cancelReason)}</small>` : "";
    return `<div class="guest-directory-row"><div><strong>${escapeHtml(booking.cabinName)} · ${escapeHtml(booking.name)}</strong><small>${booking.guests} guest${booking.guests === 1 ? "" : "s"} · ${escapeHtml(booking.phone)} · ${formatBookingWhen(booking.datetime)}</small>${reasonLine}</div><span>${statusLabel}${actions}</span></div>`;
  };
  const upcoming = bookings.filter(booking => !booking.cancelled && new Date(booking.datetime).getTime() >= now).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  const past = bookings.filter(booking => booking.cancelled || new Date(booking.datetime).getTime() < now).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  list.innerHTML = `${upcoming.length ? `<div class="guest-directory-row" style="background:#f5f7ef;"><strong>Upcoming (${upcoming.length})</strong></div>${upcoming.map(row).join("")}` : ""}${past.length ? `<div class="guest-directory-row" style="background:#f5f7ef;"><strong>Past (${past.length})</strong></div>${past.map(row).join("")}` : ""}`;
}

document.querySelector("#bookings-list").addEventListener("click", event => {
  const editId = event.target.dataset.editBooking;
  if (editId) {
    if (!hasSettingsActionAccess(currentUser.role, "bookings", "edit")) { showToast("You don't have permission to edit bookings"); return; }
    const booking = getBookings().find(item => item.id === Number(editId));
    if (booking) openBookingModal(booking);
    return;
  }
  const cancelId = event.target.dataset.cancelBooking;
  if (!cancelId) return;
  if (!hasSettingsActionAccess(currentUser.role, "bookings", "cancel")) { showToast("You don't have permission to cancel bookings"); return; }
  const booking = getBookings().find(item => item.id === Number(cancelId));
  if (!booking) return;
  openCancelReasonModal(booking);
});

const cancelReasonModal = document.querySelector("#cancel-reason-modal");
function openCancelReasonModal(booking) {
  cancelReasonModal.dataset.bookingId = String(booking.id);
  document.querySelector("#cancel-reason-context").textContent = `${booking.cabinName} · ${booking.name} · ${formatBookingWhen(booking.datetime)}`;
  document.querySelector("#cancel-reason-input").value = "";
  document.querySelector("#cancel-reason-error").textContent = "";
  cancelReasonModal.hidden = false;
  document.querySelector("#cancel-reason-input").focus();
}
document.querySelector("#close-cancel-reason").addEventListener("click", () => { cancelReasonModal.hidden = true; });
cancelReasonModal.addEventListener("click", event => {
  if (event.target.id === "cancel-reason-modal") cancelReasonModal.hidden = true;
});
document.querySelector("#cancel-reason-form").addEventListener("submit", event => {
  event.preventDefault();
  const reason = document.querySelector("#cancel-reason-input").value.trim();
  if (!reason) {
    document.querySelector("#cancel-reason-error").textContent = "Enter a reason to cancel this booking.";
    return;
  }
  const bookingId = Number(cancelReasonModal.dataset.bookingId);
  const bookings = getBookings();
  const booking = bookings.find(item => item.id === bookingId);
  if (booking) {
    booking.cancelled = true;
    booking.cancelReason = reason;
    saveBookings(bookings);
    renderBookingsList();
    renderCabinTabs();
    showToast(`${booking.cabinName} booking cancelled`);
  }
  cancelReasonModal.hidden = true;
});

const newCategoryModal = document.querySelector("#new-category-modal");
function closeNewCategoryModal(committed) {
  newCategoryModal.hidden = true;
  if (!committed && pendingCategorySelect) pendingCategorySelect.value = menuCategories[0];
  pendingCategorySelect = null;
}
document.querySelector("#close-new-category").addEventListener("click", () => closeNewCategoryModal(false));
newCategoryModal.addEventListener("click", event => {
  if (event.target.id === "new-category-modal") closeNewCategoryModal(false);
});
document.querySelector("#new-category-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.querySelector("#new-category-input").value.trim();
  if (!name || menuCategories.includes(name)) {
    if (menuCategories.includes(name)) showToast(`Category "${name}" already exists`);
    return;
  }
  menuCategories.push(name);
  saveCategories();
  renderCategorySelect();
  if (pendingCategorySelect) pendingCategorySelect.value = name;
  showToast(`Category "${name}" added`);
  closeNewCategoryModal(true);
});

document.querySelector("#close-reminder").addEventListener("click", () => { reminderModal.hidden = true; });
document.querySelector("#confirm-reminder-booking").addEventListener("click", () => {
  const bookingId = Number(reminderModal.dataset.bookingId);
  const bookings = getBookings();
  const booking = bookings.find(item => item.id === bookingId);
  if (booking) {
    booking.confirmed = true;
    saveBookings(bookings);
    renderBookingsList();
    showToast(`${booking.cabinName} booking confirmed`);
  }
  reminderModal.hidden = true;
});
document.querySelector("#cancel-reminder-booking").addEventListener("click", () => {
  const bookingId = Number(reminderModal.dataset.bookingId);
  const bookings = getBookings();
  const booking = bookings.find(item => item.id === bookingId);
  if (booking) {
    booking.cancelled = true;
    saveBookings(bookings);
    renderBookingsList();
    renderCabinTabs();
    showToast(`${booking.cabinName} booking cancelled`);
  }
  reminderModal.hidden = true;
});

const BOOKING_REMINDER_HOUR_MS = 60 * 60 * 1000;
const BOOKING_REMINDER_HALF_HOUR_MS = 30 * 60 * 1000;
function checkBookingReminders() {
  if (!reminderModal.hidden) return;
  const bookings = getBookings();
  const now = Date.now();
  let due = null;
  let stage = "";
  for (const booking of bookings) {
    if (booking.cancelled) continue;
    const remaining = new Date(booking.datetime).getTime() - now;
    if (!booking.notifiedHalfHour && remaining <= BOOKING_REMINDER_HALF_HOUR_MS) {
      due = booking; stage = "30 minutes"; break;
    }
    if (!booking.notifiedHour && remaining <= BOOKING_REMINDER_HOUR_MS) {
      due = booking; stage = "1 hour"; break;
    }
  }
  if (!due) return;
  if (stage === "30 minutes") { due.notifiedHalfHour = true; due.notifiedHour = true; }
  else { due.notifiedHour = true; }
  saveBookings(bookings);
  reminderModal.dataset.bookingId = String(due.id);
  document.querySelector("#reminder-message").textContent = `${due.cabinName} — guest arriving in ${stage}, please confirm`;
  document.querySelector("#reminder-details").innerHTML = `<strong>${escapeHtml(due.name)}</strong>${due.guests} guest${due.guests === 1 ? "" : "s"} · ${escapeHtml(due.phone)}<br>${formatBookingWhen(due.datetime)}`;
  reminderModal.hidden = false;
  renderCabinTabs();
}
setInterval(checkBookingReminders, 30000);
checkBookingReminders();

renderMenu();
renderCategoryTabs();
renderCategorySelect();
restoreActiveCabin();
renderOrder();
renderCabinTabs();
renderLoginUsers();
updateSession();
renderUpiAccounts();

// --- Sync: snapshots all alyazi-* localStorage keys into IndexedDB every
// 20s and on demand, then best-effort mirrors the same snapshot to the
// AUTH_KV-backed cloud endpoint. Cloud failures never block the local save.
const SYNC_DB_NAME = "alyazi-sync";
const SYNC_STORE_NAME = "snapshots";
const SYNC_RECORD_KEY = "latest";
let lastSyncedSnapshot = null;
let syncInFlight = false;

function collectSyncSnapshot() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("alyazi-")) data[key] = localStorage.getItem(key);
  }
  return data;
}

function openSyncDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(SYNC_STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveSnapshotLocally(data, updatedAt) {
  const db = await openSyncDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE_NAME, "readwrite");
    tx.objectStore(SYNC_STORE_NAME).put({ data, updatedAt }, SYNC_RECORD_KEY);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function saveSnapshotToCloud(data, updatedAt) {
  const resp = await fetch("/api/sync/d1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data, updatedAt }),
  });
  if (!resp.ok) throw new Error("cloud sync failed");
}

function formatSyncTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function runSync({ manual = false } = {}) {
  if (syncInFlight) return;
  const snapshot = collectSyncSnapshot();
  const snapshotString = JSON.stringify(snapshot);
  if (!manual && snapshotString === lastSyncedSnapshot) return;

  syncInFlight = true;
  const syncButton = document.querySelector("#sync-button");
  const syncStatus = document.querySelector("#sync-status");
  syncButton?.classList.add("syncing");
  try {
    const updatedAt = Date.now();
    await saveSnapshotLocally(snapshot, updatedAt);
    lastSyncedSnapshot = snapshotString;

    let cloudOk = true;
    try {
      await saveSnapshotToCloud(snapshot, updatedAt);
    } catch (err) {
      cloudOk = false;
    }

    if (syncStatus) {
      syncStatus.textContent = cloudOk
        ? `Synced ${formatSyncTime(updatedAt)}`
        : `Saved locally ${formatSyncTime(updatedAt)} — cloud unreachable`;
    }
    if (manual) showToast(cloudOk ? "Synced to cloud and saved locally" : "Saved locally — couldn't reach the cloud");
  } catch (err) {
    if (manual) showToast("Sync failed — check your browser storage");
  } finally {
    syncInFlight = false;
    syncButton?.classList.remove("syncing");
  }
}

document.querySelector("#sync-button")?.addEventListener("click", () => runSync({ manual: true }));
setInterval(() => runSync({ manual: false }), 20000);
runSync({ manual: false });
