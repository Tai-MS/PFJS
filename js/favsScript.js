// Función para agregar una nueva fila a la tabla con los datos proporcionados
function agregarFilaAutorLibro() {
    let savedBooks = JSON.parse(localStorage.getItem('lastSearch')); 
    // Obtener el cuerpo de la tabla donde se agregarán las filas
    let tbody = document.querySelector('tbody');

    // Crear una nueva fila
    
    // Crear las celdas para cada columna
    // Agregar los datos a cada celda
    savedBooks.forEach(info => {
        console.log(info);
        let fila = document.createElement('tr');
        let celdaAutor = document.createElement('td');
        let celdaLibro = document.createElement('td');
        let celdaFecha = document.createElement('td');
        celdaAutor.textContent = info.autor;
        celdaLibro.textContent = info.libro;
        celdaFecha.textContent = info.fecha;

        // Agregar las celdas a la fila
        fila.appendChild(celdaAutor);
        fila.appendChild(celdaLibro);
        fila.appendChild(celdaFecha);
    
        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(fila);
    })

}
agregarFilaAutorLibro()
// Ejemplo de uso de la función agregarFilaAutorLibro
