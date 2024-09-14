const productList = document.querySelector("ul");

const getProducts = async () => {

    let params = new URLSearchParams(location.search);
    let page = params.get("page");
    if (!page || isNaN(Number(page))) {
        page=1
    }

    let respuesta = await fetch(`/api/products?page=${page}`);
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
                        <button class="favorite-btn" data-id="${product.id}">Añadir a favoritos</button>
                        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                    </div>
                </div>
            </div>

        `;

        productList.append(productItem);
    });

    const aFirstPage = document.createElement("a");
    aFirstPage.textContent = `Pag.1`;
    aFirstPage.href = `/products?page=1`;
    aFirstPage.classList.add('pagination-link', 'first-page');
    document.body.append(aFirstPage);

    const aPrevPage = document.createElement("a");
    aPrevPage.textContent = `Pag.Anterior`;
    aPrevPage.href = `/products?page=${datos.prevPage}`;
    aPrevPage.classList.add('pagination-link', 'prev-page');
    if (!datos.hasPrevPage) {
        aPrevPage.classList.add('disabled');
    }
    document.body.append(aPrevPage);

    const aNextPage = document.createElement("a");
    aNextPage.textContent = `Pag.Siguiente`;
    aNextPage.href = `/products?page=${datos.nextPage}`;
    aNextPage.classList.add('pagination-link', 'next-page');
    if (!datos.hasNextPage) {
        aNextPage.classList.add('disabled');
    }
    document.body.append(aNextPage);

    const aLastPage = document.createElement("a");
    aLastPage.textContent = `Ult.Pag`;
    aLastPage.href = `/products?page=${datos.totalPages}`;
    aLastPage.classList.add('pagination-link', 'last-page');
    document.body.append(aLastPage);

}   

getProducts()









