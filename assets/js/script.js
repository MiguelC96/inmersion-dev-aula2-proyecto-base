class Gasto { // Clase Gasto, donde estan las variables
    constructor(nombre, valor, descripcion) {
        this.nombre = nombre;
        this.valor = valor;
        this.descripcion = descripcion;
    }
}

class ControlDeGastos { //Clase ControlDeGastos, encargada de toda la gestion del programa
    constructor() {
        this.gastos = [];
    }

    agregarGasto(gasto) { //Funcion para agregar gastos, con un alert si supera los usd150
        if (this.validarGasto(gasto)) {

            if (gasto.valor > 150) {
                this.mostrarAlerta("Advertencia ¡Controla tus gastos!: ¡El monto registrado es mayor a $150!");
            }

            this.gastos.push(gasto);
            this.actualizarVista();

        } else {
            this.mostrarAlerta("El nombre del gasto no puede estar vacío y el valor debe ser mayor a 0");
        }
    }

    validarGasto(gasto) { // Funcion para validar que los campos no esten vacios o sean mayores que 0
        return gasto.nombre.trim() !== "" && !isNaN(gasto.valor) && gasto.valor > 0;
    }

    editarGasto(indice) {// Funcion para modificar los gastos en el formulario, luego de ser agregados
        const gasto = this.gastos[indice];
        document.getElementById("nombreGasto").value = gasto.nombre;
        document.getElementById("valorGasto").value = gasto.valor;
        document.getElementById("descripcionGasto").value = gasto.descripcion;
        document.getElementById("botonFormulario").setAttribute("data-indice", indice);
        document.getElementById("botonFormulario").textContent = "Guardar Cambios"; 
    }

    modificarGasto(indice, gastoModificado) {// Funcion para validar los valores del formulario.
        if (this.validarGasto(gastoModificado)) {

            if (gastoModificado.valor > 150) {
                this.mostrarAlerta("¡Controla tus gastos!: ¡El monto registrado es mayor a $150!");
            }

            this.gastos[indice] = gastoModificado;
            this.actualizarVista();

        } else {
            this.mostrarAlerta("El nombre del gasto no puede estar vacío y el valor debe ser mayor a 0");
        }
    }

    eliminarGasto(indice) {//Funcion para eliminar un gasto luego de ser agregado

        this.gastos.splice(indice, 1);
        this.actualizarVista();
    }

    calcularTotal() { // Funcion para calcular total, con 2 decimales
        return this.gastos.reduce((total, gasto) => total + gasto.valor, 0).toFixed(2);
    }


    actualizarVista() {
        actualizarListaDeGastos(this.gastos);
        actualizarTotalGastos(this.calcularTotal());
    }

    mostrarAlerta(mensaje, tipo) {// Funcion para mostrar alertas
        const alerta = document.getElementById("alerta");
        alerta.textContent = mensaje;
        alerta.className = `alerta ${tipo}`; 
        alerta.style.display = "block";
        setTimeout(() => {
            alerta.style.display = "none";
        }, 4000); 
    }

}

function actualizarListaDeGastos(gastos) {
    const listaDeGastos = document.getElementById("listaDeGastos");
    listaDeGastos.innerHTML = ""; 

    gastos.forEach((gasto, indice) => {
        const li = document.createElement("li");
        li.textContent = `${gasto.nombre}: US$ ${gasto.valor.toFixed(2)} - ${gasto.descripcion}`;

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = () => controlDeGastos.eliminarGasto(indice);

        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        botonModificar.onclick = () => controlDeGastos.editarGasto(indice); 

        li.appendChild(botonEliminar);
        li.appendChild(botonModificar);
        listaDeGastos.appendChild(li);
    });
}

function actualizarTotalGastos(total) {
    document.getElementById("totalGastos").textContent = total;
}

const controlDeGastos = new ControlDeGastos();

document.getElementById("botonFormulario").addEventListener("click", () => {
    const nombreGasto = document.getElementById("nombreGasto").value;
    const valorGasto = parseFloat(document.getElementById("valorGasto").value);
    const descripcionGasto = document.getElementById("descripcionGasto").value;
    const indice = document.getElementById("botonFormulario").getAttribute("data-indice");

    const gasto = new Gasto(nombreGasto, valorGasto, descripcionGasto);

    if (indice === null) {
        // Si no hay un índice, estamos agregando un nuevo gasto
        controlDeGastos.agregarGasto(gasto);
    } else {
        // Si hay un índice, estamos modificando un gasto existente
        controlDeGastos.modificarGasto(indice, gasto);
        document.getElementById("botonFormulario").removeAttribute("data-indice");
        document.getElementById("botonFormulario").textContent = "Agregar Gasto";
    }

    // Limpiar los campos del formulario
    document.getElementById("nombreGasto").value = "";
    document.getElementById("valorGasto").value = "";
    document.getElementById("descripcionGasto").value = "";
});
