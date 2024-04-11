document.addEventListener("DOMContentLoaded", function() {
  const menBtn = document.getElementById("menBtn");
  const womenBtn = document.getElementById("womenBtn");
  const kidsBtn = document.getElementById("kidsBtn");
  const searchInput = document.getElementById("searchInput");
  const clothingItemsContainer = document.getElementById("clothingItems");
  const cartItemsContainer = document.getElementById("cartItems");

  let data = []; // To store fetched data
  let cartItems = []; // To store cart items

  // Fetch data from the provided URL
  fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData.categories;
      displayAllItems(data); // Display all items initially
    })
    .catch(error => console.error('Error fetching data:', error));

  // Function to display all items
  function displayAllItems(data) {
    clothingItemsContainer.innerHTML = ''; // Clear previous items
    data.forEach(category => {
      category.category_products.forEach(product => {
        renderProduct(product);
      });
    });
  }

  // Function to render a single product
  function renderProduct(product) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('clothing-item');
    itemDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>Price: ${product.price}</p>
      <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Add to Cart</button>
    `;
    clothingItemsContainer.appendChild(itemDiv);
  }

  // Event listeners for category buttons
  menBtn.addEventListener('click', () => filterItems('Men'));
  womenBtn.addEventListener('click', () => filterItems('Women'));
  kidsBtn.addEventListener('click', () => filterItems('Kids'));

  // Function to filter items by category
  function filterItems(category) {
    const filteredItems = data.find(cat => cat.category_name === category);
    if (filteredItems) {
      displayAllItems([filteredItems]);
    }
  }

  // Event listener for search input
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = data.flatMap(category => category.category_products)
                              .filter(product => 
                                product.title.toLowerCase().includes(searchTerm) ||
                                product.vendor.toLowerCase().includes(searchTerm) ||
                                product.badge_text?.toLowerCase().includes(searchTerm)
                              );
    displayAllItems([{ category_name: 'Search Results', category_products: filteredItems }]);
  });

  // Event delegation for add to cart button
  clothingItemsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
      const product = JSON.parse(event.target.getAttribute('data-product'));
      cartItems.push(product);
      renderCartItems();
    }
  });

  // Function to render cart items
  function renderCartItems() {
    cartItemsContainer.innerHTML = ''; // Clear previous cart items
    cartItems.forEach(product => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Price: ${product.price}</p>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });
  }
});
