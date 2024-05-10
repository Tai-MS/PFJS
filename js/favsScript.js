//Agrega los libros guardados en localStorage a la tabla
function agregarFilaAutorLibro() {
    let savedBooks = JSON.parse(localStorage.getItem('lastSearch')); 

    let tbody = document.querySelector('tbody');

    savedBooks.forEach(info => {
        console.log(info);
        let fila = document.createElement('tr');
        let celdaAutor = document.createElement('td');
        let celdaLibro = document.createElement('td');
        let celdaFecha = document.createElement('td');
        celdaAutor.textContent = info.autor;
        celdaLibro.textContent = info.libro;
        celdaFecha.textContent = info.fecha;

        fila.appendChild(celdaAutor);
        fila.appendChild(celdaLibro);
        fila.appendChild(celdaFecha);
    
        tbody.appendChild(fila);
    })

}
agregarFilaAutorLibro()
