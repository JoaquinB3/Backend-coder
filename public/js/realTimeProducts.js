const  socket = io()
const productContainer = document.getElementById("productsContainer");

socket.on('addProduct', function(product) {
    const productList = document.getElementById('productList');
    const productItem = document.createElement('li');
    productItem.id = `product-${product.id}`;
    productItem.dataset.id = product.id;    
    
    
    productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>${product.price}</p>
        ${product.thumbnails.map(thumbnail => `<img src="${thumbnail}" alt="">`).join('')}
        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
    `;
    productList.appendChild(productItem);
});

socket.on('deleteProduct', (productId) => {
    const productList = document.getElementById('productList');
    const buttonItem = productList.querySelector(`button[data-id="${productId}"]`);
    const listItem = buttonItem.parentElement; 
    
    if (listItem) {
        productList.removeChild(listItem);
    }
});


document.getElementById('addProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    
    console.log(formData);

    try {
        await fetch('/api/products', {
            method: 'POST',
            body: formData,
        });
        

        const result = await response.json();
        console.log(result);

    } catch (error) {
        console.error('Error:', error);
    }
});



document.getElementById('productList').addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.dataset.id;

        try {
            await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }
});