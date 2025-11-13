const PRODUCTS = {
  apple: {
    emoji: "🍏",
    name: {
      en: "Apple",
      ja: "りんご"
    }
  },
  banana: {
    emoji: "🍌",
    name: {
      en: "Banana",
      ja: "バナナ"
    }
  },
  lemon: {
    emoji: "🍋",
    name: {
      en: "Lemon",
      ja: "レモン"
    }
  },
  strawberry: {
    emoji: "🍓",
    name: {
      en: "Strawberry",
      ja: "いちご"
    }
  }
};

let currentLanguage = document.documentElement.lang || "en";

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("lang", lang);
  renderBasket();
}

function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return {};
    const parsed = JSON.parse(basket);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return {};
  }
}

function addToBasket(product) {
  const basket = getBasket();
  basket[product] = (basket[product] || 0) + 1;
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";

  const productKeys = Object.keys(basket);
  if (productKeys.length === 0) {
    const emptyMessages = {
  en: "No products in basket.",
  ja: "バスケットに商品がありません。"
};
basketList.innerHTML = `<li>${emptyMessages[currentLanguage]}</li>`;
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }

  productKeys.forEach((product) => {
    const item = PRODUCTS[product];
    const quantity = basket[product];
    if (item && quantity > 0) {
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${quantity}x ${item.name[currentLanguage]}</span>`;
      basketList.appendChild(li);
    }
  });

  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  const totalItems = Object.values(basket).reduce((sum, qty) => sum + qty, 0);
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (totalItems > 0) {
    indicator.textContent = totalItems;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};

const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
