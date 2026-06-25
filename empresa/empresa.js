// 🔐 LOGIN
function loginEmpresa() {
  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if (u === "admin" && p === "1234") {
    localStorage.setItem("empresaLogin", "true");
    window.location.href = "panel.html";
  } else {
    alert("Datos incorrectos");
  }
}

// 🔒 PROTEGER PANEL
if (location.pathname.includes("panel.html")) {
  if (localStorage.getItem("empresaLogin") !== "true") {
    window.location.href = "index.html";
  }
}

// 🚪 CERRAR SESIÓN
function cerrarSesion() {
  localStorage.removeItem("empresaLogin");
  window.location.href = "index.html";
}

// 📂 SECCIONES
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// =======================
// 📦 DATOS
// =======================

let empleados = [
  { nombre: "Juan Pérez", puesto: "Vendedor" },
  { nombre: "Ana López", puesto: "Gerente" }
];

// Productos = LOS DE LA TIENDA
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Ventas y tickets vienen de la tienda
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

// =======================
// 🏢 CARGAR PANEL
// =======================


function actualizarDashboard() {
  let productosDash = JSON.parse(localStorage.getItem("productos")) || [];
  let ventasDash = JSON.parse(localStorage.getItem("ventas")) || [];
  let ticketsDash = JSON.parse(localStorage.getItem("tickets")) || [];

  let stockBajo = productosDash.filter(p => Number(p.stock || 10) < 10).length;

  if (document.getElementById("dashProductos")) {
    document.getElementById("dashProductos").innerText = productosDash.length;
    document.getElementById("dashVentas").innerText = ventasDash.length;
    document.getElementById("dashTickets").innerText = ticketsDash.length;
    document.getElementById("dashStockBajo").innerText = stockBajo;
  }
}

function cargarPanel() {
  if (!document.getElementById("listaProductosEmpresa")) return;

  mostrarProductosEmpresa();
  mostrarVentas();
  mostrarTickets();

  document.getElementById("listaEmpleados").innerHTML =
    empleados.map(e => `<p>${e.nombre} - ${e.puesto}</p>`).join("");

  document.getElementById("datosEmpresa").innerHTML = `
    <p><b>Nombre:</b> SneakerShop</p>
    <p><b>Dueño:</b> Daniel Vargas</p>
    <p><b>Año:</b> 2026</p>
    <p><b>Giro:</b> Venta de calzado deportivo</p>
  `;

  // ===== REPORTES =====
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let productos = JSON.parse(localStorage.getItem("productos")) || [];

let totalVentas = ventas.reduce((acc, v) => acc + Number(v.total || 0), 0);


if (document.getElementById("reporteGeneral")) {
  document.getElementById("reporteGeneral").innerHTML = `
    <p>📦 Productos registrados: ${productos.length}</p>
    <p>🧾 Ventas realizadas: ${ventas.length}</p>
    <p>💰 Ingresos totales: $${totalVentas}</p>
    <p>🎟️ Tickets generados: ${tickets.length}</p>
  `;
}


actualizarDashboard();
verificarStockBajo();
mostrarSeccion("dashboard");

}

// =======================
// 🧾 PRODUCTOS (CRUD)
// =======================

function mostrarProductosEmpresa() {
  let cont = document.getElementById("listaProductosEmpresa");
  cont.innerHTML = "";

  productos.forEach((p, i) => {
    cont.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px; border-radius:10px">
        <b>${p.nombre}</b> - ${p.marca} - $${p.precio}<br>
        <button onclick="eliminarProducto(${i})">❌ Eliminar</button>
        <button onclick="editarPrecio(${i})">✏️ Cambiar precio</button>
      </div>
    `;
  });
}

function agregarProducto() {
  let nombre = document.getElementById("pNombre").value;
  let marca = document.getElementById("pMarca").value;
  let precio = parseFloat(document.getElementById("pPrecio").value);
  let img = document.getElementById("pImg").value;

  if (!nombre || !marca || !precio || !img) {
    alert("Completa todos los campos");
    return;
  }

  productos.push({
    id: Date.now(),
    nombre,
    marca,
    precio,
    img,
    reseñas: []
  });

  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductosEmpresa();
  alert("Producto agregado");
}

function eliminarProducto(i) {
  if (!confirm("¿Eliminar producto?")) return;
  productos.splice(i,1);
  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductosEmpresa();
}

function editarPrecio(i) {
  let nuevo = prompt("Nuevo precio:");
  if (!nuevo) return;
  productos[i].precio = parseFloat(nuevo);
  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductosEmpresa();
}

function reabastecerProducto(id) {
  let productosStock = JSON.parse(localStorage.getItem("productos")) || [];

  let prod = productosStock.find(p => p.id == id);

  if (prod) {
    prod.stock = 15;
    localStorage.setItem("productos", JSON.stringify(productosStock));

    productos = productosStock;

    mostrarProductosEmpresa();
    actualizarDashboard();
    verificarStockBajo();

    alert("Producto reabastecido a 15 piezas.");
  }
}

// =======================
// 📊 VENTAS
// =======================

function mostrarVentas() {
  let cont = document.getElementById("listaVentas");
  cont.innerHTML = "";

  ventas = JSON.parse(localStorage.getItem("ventas")) || [];

  if (ventas.length === 0) {
    cont.innerHTML = "<p>No hay ventas aún</p>";
    return;
  }

  ventas.forEach((v, i) => {
    cont.innerHTML += `
      <div class="venta-card">
        <h3>Venta #${i + 1}</h3>
        <p><b>Total:</b> $${v.total}</p>
        <p><b>Fecha:</b> ${v.fecha}</p>
        <p><b>Método:</b> ${v.metodoPago || "Pago contra entrega"}</p>
        <p><b>Estado:</b> ${v.estado || "Pendiente de entrega"}</p>
      </div>
    `;
  });
}

// =======================
// 🧾 TICKETS
// =======================

function mostrarTickets() {
  let cont = document.getElementById("listaTickets");
  cont.innerHTML = "";

  tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  if (tickets.length === 0) {
    cont.innerHTML = "<p>No hay tickets</p>";
    return;
  }

  tickets.forEach((t, i) => {
    cont.innerHTML += `
      <div class="ticket-card">
        <h3>Ticket #${i + 1}</h3>
        <p><b>Folio:</b> ${t.pedido || "SNK-" + (i + 1)}</p>
        <p><b>Total:</b> $${t.total} MXN</p>
        <p><b>Fecha:</b> ${t.fecha}</p>
        <p><b>Método:</b> ${t.metodoPago || "Pago contra entrega"}</p>
        <p><b>Estado:</b> ${t.estado || "Pendiente de entrega"}</p>
        <button onclick="exportarTicket(${i})">Exportar ticket</button>
      </div>
    `;
  });
}

function exportarTicket(i) {
  let t = tickets[i];

  let texto = "";
  texto += "SNEAKERSHOP - TICKET DE COMPRA\n";
  texto += "====================================\n\n";
  texto += "Folio: " + (t.pedido || "SNK-" + (i + 1)) + "\n";
  texto += "Fecha: " + t.fecha + "\n";
  texto += "Método de pago: " + (t.metodoPago || "Pago contra entrega") + "\n";
  texto += "Estado: " + (t.estado || "Pendiente de entrega") + "\n";
  texto += "Entrega estimada: 3 a 5 días hábiles\n\n";

  texto += "PRODUCTOS\n";
  texto += "------------------------------------\n";

  t.productos.forEach((p, index) => {
    let subtotal = p.precio * p.cantidad;

    texto += (index + 1) + ". " + p.nombre + "\n";
    texto += "   Marca: " + (p.marca || "No especificada") + "\n";
    texto += "   Talla: " + (p.talla || "No especificada") + "\n";
    texto += "   Cantidad: " + p.cantidad + "\n";
    texto += "   Precio unitario: $" + p.precio + " MXN\n";
    texto += "   Subtotal: $" + subtotal + " MXN\n\n";
  });

  texto += "------------------------------------\n";
  texto += "TOTAL A PAGAR: $" + t.total + " MXN\n";
  texto += "------------------------------------\n\n";

  texto += "Gracias por comprar en SneakerShop.\n";
  texto += "Este ticket corresponde a una compra con pago contra entrega.\n";

  let archivo = new Blob([texto], { type: "text/plain" });
  let enlace = document.createElement("a");

  enlace.href = URL.createObjectURL(archivo);
  enlace.download = "ticket_" + (t.pedido || "SNK_" + (i + 1)) + ".txt";
  enlace.click();
}

function borrarDatos() {
  if (confirm("¿Seguro que quieres borrar TODOS los datos del sistema?")) {
    localStorage.clear();
    alert("Sistema reiniciado");
    location.reload();
  }
}

function verificarStockBajo() {
  let productosStock = JSON.parse(localStorage.getItem("productos")) || [];
  let bajos = productosStock.filter(p => Number(p.stock ?? 12) < 10);

  let dash = document.getElementById("dashStockBajo");
  if (dash) {
    dash.innerText = bajos.length;
  }

  let cont = document.getElementById("alertasStock");
  if (!cont) return;

  if (bajos.length === 0) {
    cont.innerHTML = `
      <div class="stock-ok">
        Todos los productos cuentan con inventario suficiente.
      </div>
    `;
    return;
  }

  cont.innerHTML = bajos.map(p => `
    <div class="stock-alerta">
      <h3>Stock bajo</h3>
      <p><b>Producto:</b> ${p.nombre}</p>
      <p><b>Marca:</b> ${p.marca}</p>
      <p><b>Piezas disponibles:</b> ${p.stock}</p>
      <p>Se recomienda reabastecer este producto.</p>
      <button onclick="reabastecerProducto(${p.id})">Reabastecer a 15 piezas</button>
    </div>
    
  `).join("");

  alert("Alerta de inventario: hay productos con menos de 10 piezas.");
}
// =======================
cargarPanel();
verificarStockBajo();
