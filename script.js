// Корзина
let cart = []
const CART_STORAGE_KEY = "poizon_cart"

// Предполагаем, что PRODUCTS импортируется из data.js
// Если нет, то нужно определить его здесь, например:
// const PRODUCTS = [];
// Используем существующий массив PRODUCTS из data.js
if (typeof PRODUCTS === "undefined") {
  console.error("Ошибка: Массив PRODUCTS не найден. Проверьте подключение файла data.js")
}

// Проверяем, что PRODUCTS определен
if (typeof PRODUCTS === "undefined") {
  console.error("Ошибка: Массив PRODUCTS не найден. Проверьте подключение файла data.js")
}

// Функция для форматирования цены
function formatPrice(price) {
  return price.toLocaleString() + " ₽"
}

// Функция для получения текста типа товара
function getTypeText(type) {
  const types = {
    shoes: "Обувь",
    bags: "Сумка",
    belts: "Ремень",
    glasses: "Очки",
    custom: "Индивидуальный заказ",
  }
  return types[type] || type
}

// Функция для загрузки корзины из localStorage
function loadCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartCount()
  }
}

// Функция для сохранения корзины в localStorage
function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  updateCartCount()
}

// Функция для обновления счетчика товаров в корзине
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  cartCount.textContent = totalItems
}

// Функция для добавления товара в корзину
function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    })
  }

  saveCart()

  // Анимация добавления в корзину
  const button = document.querySelector(`.add-to-cart[data-product-id="${productId}"]`)
  if (button) {
    button.textContent = "Добавлено!"
    setTimeout(() => {
      button.textContent = "В корзину"
    }, 1500)
  }
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  renderCartItems()
}

// Функция для изменения количества товара в корзине
function updateCartItemQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      saveCart()
      renderCartItems()
    }
  }
}

// Функция для расчета общей стоимости корзины
function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Функция для отображения товаров в корзине
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cartItems")
  const emptyCartMessage = document.getElementById("emptyCartMessage")
  const cartSummary = document.getElementById("cartSummary")
  const cartTotalPrice = document.getElementById("cartTotalPrice")

  if (cart.length === 0) {
    cartItemsContainer.style.display = "none"
    cartSummary.style.display = "none"
    emptyCartMessage.style.display = "block"
    return
  }

  cartItemsContainer.style.display = "block"
  cartSummary.style.display = "block"
  emptyCartMessage.style.display = "none"

  cartItemsContainer.innerHTML = ""

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"

    cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-brand">${item.brand}</p>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-btn" data-product-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-product-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-product-id="${item.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `

    cartItemsContainer.appendChild(cartItem)
  })

  // Обновляем общую стоимость
  cartTotalPrice.textContent = formatPrice(calculateCartTotal())

  // Добавляем обработчики для кнопок изменения количества
  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      const item = cart.find((item) => item.id === productId)
      if (item) {
        updateCartItemQuantity(productId, item.quantity - 1)
      }
    })
  })

  document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      const item = cart.find((item) => item.id === productId)
      if (item) {
        updateCartItemQuantity(productId, item.quantity + 1)
      }
    })
  })

  // Добавляем обработчики для кнопок удаления
  document.querySelectorAll(".cart-item-remove").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      removeFromCart(productId)
    })
  })
}

// Функция для открытия модального окна корзины
function openCartModal() {
  renderCartItems()
  const modal = document.getElementById("cartModal")
  modal.classList.add("show")
  document.body.style.overflow = "hidden" // Блокируем прокрутку страницы
}

// Функция для закрытия модального окна корзины
function closeCartModal() {
  const modal = document.getElementById("cartModal")
  modal.classList.remove("show")
  document.body.style.overflow = "" // Разблокируем прокрутку страницы
}

// Функция для открытия модального окна индивидуального заказа
function openModal() {
  const modal = document.getElementById("customOrderModal")
  modal.classList.add("show")
  document.body.style.overflow = "hidden" // Блокируем прокрутку страницы
}

// Функция для закрытия модального окна индивидуального заказа
function closeModal() {
  const modal = document.getElementById("customOrderModal")
  modal.classList.remove("show")
  document.body.style.overflow = "" // Разблокируем прокрутку страницы
}

// Функция для отображения деталей товара в основном контенте

let lastScrollPosition = 0

function showProductDetails(productId) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) return

  // Сохраняем текущую позицию прокрутки
  lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

  // Скрываем сетку товаров
  const productGrid = document.getElementById("productGrid")
  productGrid.style.display = "none"

  // Создаем контейнер для деталей товара
  const productDetailsContainer = document.getElementById("productDetails") || document.createElement("div")
  productDetailsContainer.id = "productDetails"
  productDetailsContainer.className = "product-details-container"

  // Формируем HTML для изображений товара
  let imagesHTML = ""
  product.images.forEach((image, index) => {
    imagesHTML += `<img src="${image}" alt="${product.name} - изображение ${index + 1}" class="product-detail-image">`
  })

  productDetailsContainer.innerHTML = `
    <div class="product-details-header">
      <button class="back-to-products-btn" id="backToProducts">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Назад к товарам
      </button>
      <h2 class="product-details-title">${product.brand} ${product.name}</h2>
    </div>
    
    <div class="product-details-content">
      <div class="product-details-info">
        <p class="product-details-type">${getTypeText(product.type)}</p>
        <p class="product-details-material"><strong>Материал:</strong> ${product.material || "Не указан"}</p>
        <p class="product-details-price"><strong>Цена:</strong> от ${formatPrice(product.price)}</p>
        <button class="add-to-cart-large" data-product-id="${product.id}">Добавить в корзину</button>
      </div>
      
      <div class="product-details-images">
        ${imagesHTML}
      </div>
    </div>
  `

  // Добавляем контейнер с деталями товара в DOM
  const mainContent = document.querySelector(".main-content .container")
  if (!document.getElementById("productDetails")) {
    mainContent.appendChild(productDetailsContainer)
  }

  // Прокручиваем страницу к началу блока подробностей без плавного скролла
  const detailsTop = productDetailsContainer.getBoundingClientRect().top + window.pageYOffset
  window.scrollTo(0, detailsTop - 100)

  // Добавляем обработчик для кнопки "Назад к товарам"
  document.getElementById("backToProducts").addEventListener("click", hideProductDetails)

  // Добавляем обработчик для кнопки "Добавить в корзину"
  document.querySelector(".add-to-cart-large").addEventListener("click", function () {
    const productId = Number.parseInt(this.dataset.productId)
    addToCart(productId)

    // Анимация кнопки
    const button = this
    button.textContent = "Добавлено!"
    setTimeout(() => {
      button.textContent = "В корзину"
    }, 1500)
  })

  // Убираем автоматическую прокрутку страницы вверх
  // window.scrollTo({
  //   top: 0,
  //   behavior: "smooth",
  // })
}

// Функция для скрытия деталей товара и возврата к сетке товаров
function hideProductDetails() {
  const productDetailsContainer = document.getElementById("productDetails")
  if (productDetailsContainer) {
    productDetailsContainer.remove() // Полностью удаляем контейнер из DOM
  }

  const productGrid = document.getElementById("productGrid")
  productGrid.style.display = "grid"

  // Восстанавливаем позицию прокрутки при возврате к сетке товаров
  window.scrollTo(0, lastScrollPosition)
}

// Функция для показа уведомления
function showNotification(title, message) {
  const notification = document.getElementById("notification")
  const notificationTitle = document.getElementById("notificationTitle")
  const notificationMessage = document.getElementById("notificationMessage")

  notificationTitle.textContent = title
  notificationMessage.textContent = message
  notification.classList.add("show")

  // Автоматически скрываем уведомление через 5 секунд
  setTimeout(() => {
    notification.classList.remove("show")
  }, 5000)
}

// Функция для закрытия уведомления
function closeNotification() {
  const notification = document.getElementById("notification")
  notification.classList.remove("show")
}

// Функция для рендеринга товаров
function renderProducts(products = PRODUCTS) {
  const productGrid = document.getElementById("productGrid")
  const noProductsMessage = document.getElementById("noProductsMessage")

  productGrid.innerHTML = ""

  // Проверяем, есть ли товары для отображения
  if (products.length === 0) {
    productGrid.style.display = "none"
    noProductsMessage.style.display = "block"
    return
  }

  productGrid.style.display = "grid"
  noProductsMessage.style.display = "none"

  // Рендерим обычные товары
  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.dataset.type = product.type

    productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image" data-product-id="${product.id}">
                <div class="product-thumbnails">
                    ${product.images
        .map(
          (_, index) => `
                        <button class="product-thumbnail ${index === 0 ? "active" : ""}" 
                                data-product-id="${product.id}" 
                                data-image-index="${index}"></button>
                    `,
        )
        .join("")}
                </div>
                <div class="product-type">${getTypeText(product.type)}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <p class="product-material">${product.material || "Не указан"}</p>
                <div class="product-footer">
                    <span class="product-price">от ${formatPrice(product.price)}</span>
                    <div class="product-buttons">
                        <button class="view-details" data-product-id="${product.id}">Подробнее</button>
                        <button class="add-to-cart" data-product-id="${product.id}">В корзину</button>
                    </div>
                </div>
            </div>
        `

    productGrid.appendChild(productCard)
  })

  // Добавляем карточку индивидуального заказа (всегда отображается)
  const customOrderCard = document.createElement("div")
  customOrderCard.className = "custom-order-card"
  customOrderCard.innerHTML = `
        <svg class="custom-order-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 class="custom-order-title">Индивидуальный заказ</h3>
        <p class="custom-order-text">Мы привезем любой товар с POIZON по вашему желанию</p>
    `

  // Добавляем обработчик для открытия модального окна
  customOrderCard.addEventListener("click", () => {
    openModal()
  })

  productGrid.appendChild(customOrderCard)

  // Добавляем обработчики для миниатюр
  document.querySelectorAll(".product-thumbnail").forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      const imageIndex = Number.parseInt(this.dataset.imageIndex)

      // Обновляем активную миниатюру
      document.querySelectorAll(`.product-thumbnail[data-product-id="${productId}"]`).forEach((thumb) => {
        thumb.classList.remove("active")
      })
      this.classList.add("active")

      // Обновляем изображение
      const productImage = document.querySelector(`.product-image[data-product-id="${productId}"]`)
      const product = PRODUCTS.find((p) => p.id === productId)
      if (product && productImage) {
        productImage.src = product.images[imageIndex]
      }
    })
  })

  // Добавляем обработчики для кнопок "В корзину"
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      addToCart(productId)
    })
  })

  // Добавляем обработчики для кнопок "Подробнее" и изображений товаров
  document.querySelectorAll(".view-details").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      showProductDetails(productId)
    })
  })

  document.querySelectorAll(".product-image").forEach((image) => {
    image.addEventListener("click", function () {
      const productId = Number.parseInt(this.dataset.productId)
      showProductDetails(productId)
    })
  })
}

// Функция для фильтрации товаров
function filterProducts(type = "all", searchText = "") {
  let filteredProducts = [...PRODUCTS]

  // Фильтрация по типу
  if (type !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.type === type)
  }

  // Фильтрация по поисковому запросу
  if (searchText) {
    const searchLower = searchText.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        getTypeText(product.type).toLowerCase().includes(searchLower) ||
        (product.material && product.material.toLowerCase().includes(searchLower)),
    )
  }

  renderProducts(filteredProducts)
}

// Анимация креста
function animateCross() {
  const cross = document.getElementById("animatedCross")
  if (!cross) return

  let rotation = 0
  let scale = 1
  let increasing = true

  function animate() {
    rotation += 0.5

    if (increasing) {
      scale += 0.005
      if (scale >= 1.1) increasing = false
    } else {
      scale -= 0.005
      if (scale <= 0.9) increasing = true
    }

    cross.style.transform = `rotate(${rotation}deg) scale(${scale})`

    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

// Функция для обновления активного пункта меню
function updateActiveNavLink(category) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.category === category) {
      link.classList.add("active")
    }
  })
}

// Функция для плавного скролла к элементу
function smoothScrollTo(element) {
  const headerHeight = document.querySelector(".header").offsetHeight
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - headerHeight

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  })
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  // Загружаем корзину из localStorage
  loadCart()

  // Рендерим товары
  renderProducts()

  // Анимируем крест
  animateCross()

  // Обработчик для кнопки фильтра
  const filterButton = document.getElementById("filterButton")
  const filterDropdown = document.getElementById("filterDropdown")

  filterButton.addEventListener("click", () => {
    filterDropdown.classList.toggle("show")
  })

  // Закрываем выпадающее меню при клике вне его
  document.addEventListener("click", (event) => {
    if (!filterButton.contains(event.target) && !filterDropdown.contains(event.target)) {
      filterDropdown.classList.remove("show")
    }
  })

  // Обработчики для опций фильтра
  document.querySelectorAll(".filter-option").forEach((option) => {
    option.addEventListener("click", function () {
      const filterType = this.dataset.filter

      // Обновляем активную опцию
      document.querySelectorAll(".filter-option").forEach((opt) => {
        opt.classList.remove("active")
      })
      this.classList.add("active")

      // Обновляем активный пункт меню
      updateActiveNavLink(filterType)

      // Фильтруем товары
      filterProducts(filterType, document.querySelector(".search-input").value)

      // Закрываем выпадающее меню
      filterDropdown.classList.remove("show")
    })
  })

  // Обработчик для поиска
  const searchInputEl = document.querySelector(".search-input")
  searchInputEl.addEventListener("input", function () {
    const activeFilter = document.querySelector(".filter-option.active")
    const filterType = activeFilter ? activeFilter.dataset.filter : "all"
    filterProducts(filterType, this.value)
  })

  // Обработчики для пунктов навигации и плавный скролл
  document.querySelectorAll(".nav-link, .logo, .hero-button").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const category = this.dataset.category || "all"
      const targetId = this.getAttribute("href")

      if (targetId && targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          smoothScrollTo(targetElement)
        }
      }

      // Обновляем активный пункт меню
      updateActiveNavLink(category)

      // Обновляем активную опцию фильтра
      document.querySelectorAll(".filter-option").forEach((opt) => {
        opt.classList.remove("active")
        if (opt.dataset.filter === category) {
          opt.classList.add("active")
        }
      })

      // Фильтруем товары
      filterProducts(category, document.querySelector(".search-input").value)
    })
  })

  // Обработчик для кнопки корзины
  document.getElementById("cartButton").addEventListener("click", (e) => {
    e.preventDefault()
    openCartModal()
  })

  // Обработчики для модальных окон
  document.getElementById("modalClose").addEventListener("click", closeModal)
  document.getElementById("cartModalClose").addEventListener("click", closeCartModal)

  // Закрытие модальных окон при клике вне их содержимого
  document.getElementById("customOrderModal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal()
    }
  })

  document.getElementById("cartModal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeCartModal()
    }
  })

  // Обработчик для формы индивидуального заказа
  const form = document.querySelector(".custom-order-form")
  form.addEventListener("submit", async function (e) {
    e.preventDefault()

    const name = this.querySelector('input[type="text"]').value.trim()
    const phone = this.querySelector('input[type="tel"]').value.trim()
    const description = this.querySelector('textarea').value.trim()

    if (!name || !phone || !description) {
      alert('Пожалуйста, заполните все поля формы.')
      return
    }

    const TELEGRAM_BOT_TOKEN = '7876996095:AAEDmQ3h-JKa2QyZzydej3vFBps6m5OnCxI'
    const TELEGRAM_CHAT_ID = '-1001786155315'

    const message = `
      Новая заявка с формы индивидуального заказа:
      Имя: ${name}
      Телефон: ${phone}
      Описание товара: ${description}
    `

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      })

      const data = await response.json()

      if (data.ok) {
        showNotification(
          "Заказ принят",
          "Ваша заявка на индивидуальный заказ успешно отправлена! Мы свяжемся с вами в ближайшее время.",
        )
        this.reset()
        closeModal()
      } else {
        alert('Ошибка при отправке заявки. Попробуйте позже.')
        console.error('Telegram API error:', data)
      }
    } catch (error) {
      alert('Ошибка сети при отправке заявки. Попробуйте позже.')
      console.error('Fetch error:', error)
    }
  })

  // Обработчик для формы оформления заказа
  document.getElementById("checkoutForm").addEventListener("submit", async function (e) {
    e.preventDefault()

    if (cart.length === 0) {
      showNotification("Ошибка", "В корзине нет товаров!")
      return
    }

    const customerName = document.getElementById("customerName").value.trim()
    const customerPhone = document.getElementById("customerPhone").value.trim()
    const customerEmail = document.getElementById("customerEmail").value.trim()
    const customerAddress = document.getElementById("customerAddress").value.trim()
    const customerComment = document.getElementById("customerComment").value.trim()

    if (!customerName || !customerPhone || !customerEmail || !customerAddress) {
      alert("Пожалуйста, заполните все обязательные поля формы.")
      return
    }

    const TELEGRAM_BOT_TOKEN = '7876996095:AAEDmQ3h-JKa2QyZzydej3vFBps6m5OnCxI'
    const TELEGRAM_CHAT_ID = '-1001786155315'

    let message = `Новый заказ из корзины:\nИмя: ${customerName}\nТелефон: ${customerPhone}\nEmail: ${customerEmail}\nАдрес доставки: ${customerAddress}\nКомментарий: ${customerComment || "Отсутствует"}\n\nТовары:\n`
    cart.forEach((item, index) => {
      message += `ID товара: ${item.id}. ${item.name} - Кол-во: ${item.quantity}, Цена: ${item.price} ₽\n`
    })
    message += `\nОбщая сумма: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)} ₽`

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      })

      const data = await response.json()

      if (data.ok) {
        showNotification(
          "Заказ оформлен",
          "Ваш заказ успешно оформлен! Мы свяжемся с вами в ближайшее время для уточнения деталей."
        )

        // Очищаем корзину
        cart = []
        saveCart()
        renderCartItems()

        // Очищаем форму
        this.reset()
      } else {
        showNotification(
          "Ошибка",
          "Ошибка при отправке заказа. Попробуйте позже."
        )
        console.error("Telegram API error:", data)
      }
    } catch (error) {
      showNotification(
        "Ошибка",
        "сети при отправке заказа. Попробуйте позже."
      )
      console.error("Fetch error:", error)
    }
  })

  // Обработчики для фильтрации и поиска
  // Удалены дублирующие объявления filterButton и filterDropdown
  // Используются уже объявленные переменные filterButtonElement и filterDropdownElement

  filterButtonElement.addEventListener("click", () => {
    filterDropdownElement.classList.toggle("show")
  })

  // Закрываем выпадающее меню при клике вне его
  document.addEventListener("click", (event) => {
    if (!filterButtonElement.contains(event.target) && !filterDropdownElement.contains(event.target)) {
      filterDropdownElement.classList.remove("show")
    }
  })

  // Обработчики для опций фильтра
  document.querySelectorAll(".filter-option").forEach((option) => {
    option.addEventListener("click", function () {
      const filterType = this.dataset.filter

      // Обновляем активную опцию
      document.querySelectorAll(".filter-option").forEach((opt) => {
        opt.classList.remove("active")
      })
      this.classList.add("active")

      // Обновляем активный пункт меню
      updateActiveNavLink(filterType)

      // Фильтруем товары
      filterProducts(filterType, document.querySelector(".search-input").value)

      // Закрываем выпадающее меню
      filterDropdownElement.classList.remove("show")
    })
  })

  // Обработчик для поиска
  const searchInputSecond = document.querySelector(".search-input")
  searchInputSecond.addEventListener("input", function () {
    const activeFilter = document.querySelector(".filter-option.active")
    const filterType = activeFilter ? activeFilter.dataset.filter : "all"
    filterProducts(filterType, this.value)
  })
})
