const containerCarrito = document.getElementById("containerCarrito")


const getCart = async () => {

    let respuesta = await fetch(`/api/carts/66e52da8999edc73fbbd1dc1`);
    let datos = await respuesta.json();
    console.log(datos);


    datos.products.forEach(item => {
        // Verifica si el producto no es null
        if (item.product) {
            const product = item.product;
            const quantity = item.quantity; // Cantidad del producto en el carrito

            // Crea un elemento para el producto
            let productItem = document.createElement('li');
            productItem.id = `product-${product._id}`;
            productItem.dataset.id = product._id;

            // Establece el contenido del producto
            productItem.innerHTML = `
                <div class="product-card">
                    <div class="containerImagen">
                        ${product.thumbnails.map(thumbnail => `<img src="${thumbnail}" alt="${product.title}">`).join('')}
                    </div>
                    <div class="product-info">
                        <h2>${product.title}</h2>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <span>Quantity: ${quantity}</span>
                    </div>
                </div>
            `;

            // Agrega el producto al contenedor
            containerCarrito.append(productItem);
        }
    });

}   

getCart()