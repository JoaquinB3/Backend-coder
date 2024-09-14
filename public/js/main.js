const productList = document.querySelector("ul");

const getProducts = async () => {

    let params = new URLSearchParams(location.search);
    let page = params.get("page");
    let limit = params.get("limit");
    let sort = params.get("sort");
    let query = params.get("query");
    if (!page || isNaN(Number(page))) {
        page=1
    }
    if (!limit || isNaN(Number(limit))) {
        limit=10
    }
    if (!sort || (sort !== "asc" && sort !== "desc")) {
        sort = "";
    }
    if (!query) {
        query=""
    }
    

    let respuesta = await fetch(`/api/products?page=${page}&limit=${limit}&sort=${sort}&query=${query}`);
    let datos = await respuesta.json();
    console.log(datos);

    productList.innerHTML= "";

    datos.payload.forEach(product=>{
        let productItem = document.createElement('li');
        productItem.id = `product-${product.id}`;
        productItem.dataset.id = product.id;    
        
        productItem.innerHTML = `
            
            <div class="product-card">
                <div class="containerImagen">
                ${product.thumbnails.map(thumbnail => `<img src="${thumbnail}" alt="${product.title}">`).join('')}
                </div>
                <div class="product-info">
                    <h2>${product.title}</h2>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">$${product.price}</p>
                
                    <div class="product-actions">
                        <button class="favorite-btn" data-id="${product.id}">Añadir al carrito</button>
                        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                    </div>
                </div>
            </div>

        `;

        productList.append(productItem);
    });

    paginationContainer = document.getElementById("paginationContainer")    
    paginationContainer.innerHTML = "";

    const aFirstPage = document.createElement("a");
    aFirstPage.textContent = `Pag.1`;
    aFirstPage.href = `/products?page=1`;
    aFirstPage.classList.add('pagination-link', 'first-page');
    paginationContainer.append(aFirstPage);

    const aPrevPage = document.createElement("a");
    aPrevPage.textContent = `Pag.Anterior`;
    aPrevPage.href = `/products?page=${datos.prevPage}`;
    aPrevPage.classList.add('pagination-link', 'prev-page');
    if (!datos.hasPrevPage) {
        aPrevPage.classList.add('disabled');
    }
    paginationContainer.append(aPrevPage);

    const aNextPage = document.createElement("a");
    aNextPage.textContent = `Pag.Siguiente`;
    aNextPage.href = `/products?page=${datos.nextPage}`;
    aNextPage.classList.add('pagination-link', 'next-page');
    if (!datos.hasNextPage) {
        aNextPage.classList.add('disabled');
    }
    paginationContainer.append(aNextPage);

    const aLastPage = document.createElement("a");
    aLastPage.textContent = `Ult.Pag`;
    aLastPage.href = `/products?page=${datos.totalPages}`;
    aLastPage.classList.add('pagination-link', 'last-page');
    paginationContainer.append(aLastPage);

}   

document.getElementById('filter-category-btn').addEventListener('click', () => {
    let query = document.getElementById('category').value;
    let params = new URLSearchParams(location.search);
    params.set('query', query);
    history.pushState({}, '', '?' + params.toString());
    getProducts();
});

document.getElementById('filter-sort-btn').addEventListener('click', () => {
    let sort = document.getElementById('sort').value;
    let params = new URLSearchParams(location.search);
    params.set('sort', sort);
    history.pushState({}, '', '?' + params.toString());
    getProducts();
});

document.getElementById('filter-limit-btn').addEventListener('click', () => {
    let limit = document.getElementById('limit').value;
    let params = new URLSearchParams(location.search);
    params.set('limit', limit);
    history.pushState({}, '', '?' + params.toString());
    getProducts();
});

const addToCart = async (productId) => {
    try {
        let response = await fetch(`/api/carts/66e52da8999edc73fbbd1dc1/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let result = await response.json();
        if (response.ok) {
            alert(result.message || 'Producto añadido al carrito');
        } else {
            alert(result.error || 'Error al añadir el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al añadir el producto al carrito');
    }
};

getProducts().then(()=>{
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id;
            addToCart(productId);
        });
    });
});







