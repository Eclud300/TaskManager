// Base de datos de productos clasificada
const menuStore = [
    // Hamburguesas
    { id: 101, nombre: "Classic Burger", precio: 120.00, categoria: "hamburguesas", icono: "🍔" },
    { id: 102, nombre: "Doble Bacon", precio: 165.00, categoria: "hamburguesas", icono: "🥓" },
    { id: 103, nombre: "Chicken Spicy", precio: 140.00, categoria: "hamburguesas", icono: "🍗" },
    // Sushi
    { id: 201, nombre: "California Roll", precio: 110.00, categoria: "sushi", icono: "🍣" },
    { id: 202, nombre: "Spicy Tuna", precio: 145.00, categoria: "sushi", icono: "🍱" },
    { id: 203, nombre: "Dragon Roll", precio: 180.00, categoria: "sushi", icono: "🐉" },
    // Bebidas
    { id: 301, nombre: "Refresco Cola", precio: 35.00, categoria: "bebidas", icono: "🥤" },
    { id: 302, nombre: "Cerveza Artesanal", precio: 75.00, categoria: "bebidas", icono: "🍺" },
    { id: 303, nombre: "Limonada Fresh", precio: 45.00, categoria: "bebidas", icono: "🍋" },
    // Extras
    { id: 401, nombre: "Papas Fritas", precio: 55.00, categoria: "extras", icono: "🍟" },
    { id: 402, nombre: "Aros de Cebolla", precio: 65.00, categoria: "extras", icono: "🧅" },
    { id: 403, nombre: "Salsa Extra", precio: 15.00, categoria: "extras", icono: "🌶️" }
];

let carrito = [];
let categoriaActual = 'todas';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos('todas');
    actualizarVistaCarrito();
    actualizarReloj();
    setInterval(actualizarReloj, 60000);
});

// Filtros visuales
function filtrarCategoria(categoria) {
    categoriaActual = categoria;
    
    // Cambiar estilo de botones
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderizarProductos(categoria);
}

// Mostrar productos en la cuadrícula
function renderizarProductos(filtro) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    const productosFiltrados = filtro === 'todas' 
        ? menuStore 
        : menuStore.filter(p => p.categoria === filtro);

    productosFiltrados.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => agregarAlCarrito(producto);
        
        card.innerHTML = `
            <div class="product-icon">${producto.icono}</div>
            <div class="product-name">${producto.nombre}</div>
            <div class="product-price">$${producto.precio.toFixed(2)}</div>
        `;
        grid.appendChild(card);
    });
}

// --- Lógica del Carrito y Excepciones ---

function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
        // EXCEPCIÓN: Límite máximo por producto (evita errores de dedo)
        if(itemExistente.cantidad >= 50) {
            mostrarToast("Límite máximo por platillo alcanzado", "error");
            return;
        }
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarVistaCarrito();
}

function modificarCantidad(idProducto, cambio) {
    const itemIndex = carrito.findIndex(item => item.id === idProducto);
    
    if (itemIndex > -1) {
        carrito[itemIndex].cantidad += cambio;

        // EXCEPCIÓN: Si la cantidad llega a 0, se elimina automáticamente
        if (carrito[itemIndex].cantidad <= 0) {
            carrito.splice(itemIndex, 1);
        } else if (carrito[itemIndex].cantidad > 50) {
             carrito[itemIndex].cantidad = 50;
             mostrarToast("Límite máximo por platillo", "error");
        }
        actualizarVistaCarrito();
    }
}

function limpiarCarrito() {
    // EXCEPCIÓN: No vaciar si ya está vacío
    if(carrito.length === 0) {
        mostrarToast("La orden ya está vacía", "error");
        return;
    }
    
    if(confirm('¿Seguro que deseas cancelar toda la orden?')) {
        carrito = [];
        actualizarVistaCarrito();
        mostrarToast("Orden cancelada", "success");
    }
}

function actualizarVistaCarrito() {
    const cartContainer = document.getElementById('cartItems');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    cartContainer.innerHTML = '';
    let subtotal = 0;

    if (carrito.length === 0) {
        cartContainer.innerHTML = `<div class="empty-cart-msg">🍽️ <br> Aún no hay platillos en la orden.</div>`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        
        carrito.forEach(item => {
            const subtotalItem = item.precio * item.cantidad;
            subtotal += subtotalItem;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="item-info">
                    <div class="item-title">${item.nombre}</div>
                    <div class="item-total">$${subtotalItem.toFixed(2)}</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn ${item.cantidad === 1 ? 'danger' : ''}" 
                            onclick="modificarCantidad(${item.id}, -1)">-</button>
                    <span class="item-qty-text">${item.cantidad}</span>
                    <button class="qty-btn" onclick="modificarCantidad(${item.id}, 1)">+</button>
                </div>
            `;
            cartContainer.appendChild(div);
        });
    }

    // Cálculos con impuestos (Ejemplo de funcionalidad avanzada)
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    document.getElementById('subtotalAmount').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').innerText = `$${iva.toFixed(2)}`;
    document.getElementById('totalAmount').innerText = `$${total.toFixed(2)}`;
}

function procesarPago() {
    // EXCEPCIÓN: Doble validación de carrito vacío
    if (carrito.length === 0) {
        mostrarToast("No hay productos para cobrar", "error");
        return;
    }
    
    const total = document.getElementById('totalAmount').innerText;
    mostrarToast(`¡Cobro exitoso por ${total}! Imprimiendo ticket...`, "success");
    
    carrito = [];
    actualizarVistaCarrito();
}

// --- Utilidades ---

function mostrarToast(mensaje, tipo = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    const icono = tipo === 'success' ? '✅' : '⚠️';
    toast.innerHTML = `<span>${icono}</span> <div>${mensaje}</div>`;
    
    container.appendChild(toast);

    // Desaparecer después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function actualizarReloj() {
    const contenedor = document.getElementById('datetime');
    const ahora = new Date();
    const opciones = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    contenedor.innerText = ahora.toLocaleDateString('es-MX', opciones);
}