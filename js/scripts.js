function presionarTecla(e) {
    if (e.key === 'Enter') {
        buscar_autor()
    }
}

//Crea un array vacío o uno con los objetos guardados en localStorage
//luego se añaden los datos al array para guardarlos y utilizarlos en otro lado
function saveInLS(autor, libro) {
    let savedBooks = JSON.parse(localStorage.getItem('lastSearch')) || []; 
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1; 
    let year = now.getFullYear();
    
    let formattedDate = `${day}/${month}/${year}`;

    let nuevoLibro = {
        autor: autor,
        libro: libro,
        fecha: formattedDate
    };

    savedBooks.push(nuevoLibro);

    const jsonData = JSON.stringify(savedBooks);

    localStorage.setItem('lastSearch', jsonData);
}

function removeFromLS(autor, libro) {
    let savedBooks = JSON.parse(localStorage.getItem('lastSearch'));

    if (savedBooks) {
        // Filtra los libros que no coinciden con el autor y título proporcionados
        let filteredBooks = savedBooks.filter((book) => {
            return !(book.autor === autor && book.libro === libro);
        });

        // Actualiza el Local Storage con los libros filtrados
        const jsonData = JSON.stringify(filteredBooks);
        localStorage.setItem('lastSearch', jsonData);
    }
}

document.querySelector('#boton-buscar').addEventListener('click', () => {
    buscar_autor()
})

//Envía a la API la petición para que devuelva autores que 
//coincidan con el nombre
function buscar_autor() {
    mostrar_cartel_espera();

    let autor = document.querySelector('#buscar').value;
    
    axios.get(`https://openlibrary.org/search/authors.json?q=${autor}&limit=20`)
        .then(respuesta => mostrar_autores(respuesta.data, autor))
        .catch(error => console.error("ERROR:", error))
        .finally(() => document.querySelector('#boton-buscar').disabled = false);
}

//Al hacer click sobre el nombre de un autor, se enviará una petición
//para recibir todos los libros de dicho autor
function mostrar_libros_autor(dato, nombreAutor) {
    mostrar_cartel_espera();

    axios.get(`https://openlibrary.org/authors/${dato}/works.json`)
        .then(respuesta => renderizar_libros(respuesta.data, nombreAutor))
        .catch(error => console.error("ERROR:", error))
        .finally(() => document.querySelector('#boton-buscar').disabled = false);
}

function mostrar_cartel_espera() {
    document.querySelector('#boton-buscar').disabled = true
    document.querySelector('#respuesta p').innerHTML = "Buscando..."
}

//Función que crea la lista con los autores encontrados que coincidan
//con el argumento ingresado por el usuario
function mostrar_autores(datos, autor) {
    document.querySelector('#respuesta').innerHTML = `<p> Autores con el parametro ${autor}: <span id="cantidad"></span></p>`

    let lista = document.createElement('ul')

    let item

    datos.docs.forEach((unDato, index) => {
        item = document.createElement('li')

        item.textContent = unDato.name

        item.onclick = function () {
            mostrar_libros_autor(unDato.key, unDato.name)
        }

        lista.appendChild(item)
    })

    document.querySelector('#respuesta').appendChild(lista)

    document.querySelector('#cantidad').innerHTML = datos.numFound
    document.querySelector('#cantidad').innerHTML += ` (mostrando ${document.querySelectorAll('#respuesta ul li').length})`

    document.querySelector('#boton-buscar').disabled = false
}

//Al cargar los libros verifica si alguno esta en el array de favoritos.
//Si alguno de ellos está ahí modifica las clases del boton 
function checkFav(datos) {
    let dataStored = JSON.parse(localStorage.getItem('lastSearch')) || [];

    dataStored.forEach(libroGuardado => {
        datos.entries.forEach((unDato, index) => {
            if (libroGuardado.libro === unDato.title) {
                let botonCorazon = document.querySelector(`[data-id="${index}"`);
                
                console.log(`[data-id="${index}"]`);
                if (botonCorazon) {
                    botonCorazon.classList.remove('bi-heart')
                    botonCorazon.classList.toggle('bi-heart-fill', true);
                    botonCorazon.classList.toggle('text-danger', true);

                }
            }
        });
    });
}

//Al hacer click sobre el nombre de un autor devuelto por mostrar_autores()
//se modificará la lista, reemplazando los nombres de los autores por
//sus libros
function renderizar_libros(datos, nombreAutor) {
    let respuestaDiv = document.querySelector('#respuesta');
    respuestaDiv.innerHTML = `<p>Libros del autor ${nombreAutor}: <span id="cantidad"></span></p>`;

    let lista = document.createElement('ul');
    let item;
    datos.entries.forEach((unDato, index) => {
        item = document.createElement('li');
        let botonCorazon = document.createElement('button');

        botonCorazon.innerHTML = `<i class="bi bi-heart" data-id="${index}"></i>`;
        
        item.textContent = unDato.title;
        item.appendChild(botonCorazon);
        
        lista.appendChild(item);
        
        botonCorazon.addEventListener('click', function() {
            let bookTitle = unDato.title;
            let dataStored = JSON.parse(localStorage.getItem('lastSearch')) || []; 

            let isFavorite = dataStored.find(book => book.libro === bookTitle);

            if (isFavorite) {
                removeFromLS(nombreAutor, bookTitle);
                botonCorazon.innerHTML = `<i class="bi bi-heart" data-id="${index}"></i>`;
            } else {
                saveInLS(nombreAutor, bookTitle);
                botonCorazon.innerHTML = `<i class="bi bi-heart-fill text-danger" data-id="${index}"></i>`;
            }
        });
    });

    respuestaDiv.appendChild(lista);
    checkFav(datos)
    let cantidadSpan = document.querySelector('#cantidad');
    cantidadSpan.innerHTML = datos.size;
    cantidadSpan.innerHTML += ` (mostrando ${document.querySelectorAll('#respuesta ul li').length})`;

    document.querySelector('#boton-buscar').disabled = false;
}