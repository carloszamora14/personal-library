// filtrado de libros por título y autor
function filterBarInput(value) {
  var input, filter, table, tr, td, i, txtValue;
  var found = 0;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("books-table");
  not = document.getElementById("notfound");
  tr = table.getElementsByTagName("tr");

  // Remove the previous "Not found" message if it exists
  var oldNotFound = document.getElementById("not-found");
  if (oldNotFound) {
    oldNotFound.remove();
  }

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[value];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        found++;
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  if (found === 0) {
    var notFound = document.createElement("h3");
    notFound.id = "not-found";
    notFound.textContent = "No matching results found.";
    not.appendChild(notFound);
    table.style.display = 'none';
  } else {
    table.style.display = '';
  }
}

// Definir la función para filtrar por título o autor
function filterSelectInput() {
  var select = document.getElementById("filter-select");
  var value = select.value;
  if (value == "title") {
    filterBarInput(0);
  } else if (value == "author") {
    filterBarInput(1);
  }
}

// Funcion para mostrar en el navbar la pagina actual
document.addEventListener('DOMContentLoaded', (event) => {
  var path = window.location.pathname.split("/").pop();
  if (path == "") path = "home";
  var target = document.querySelector('.nav-link.' + path);
  target.classList.add('active');
});

function visibilityform() {
  var x = document.getElementsByClassName("gestionate-form")[0];
  if (x.style.display === "none") {
    x.style.display = "";
  } else {
    x.style.display = "none";
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('genre').selectedIndex = 0;
    document.getElementById('status').selectedIndex = 0;
  }
}

//Editar libros
const btnSave = document.getElementById('btnSave');
const btnUpdate = document.getElementById('btnUpdate');

const changeDisplay = (save, update) =>{
  btnSave.style.display = save;
  btnUpdate.style.display = update;
}

const updateBook = async (bookId) => {
  const title = document.getElementById('title').value; 
  const author = document.getElementById('author').value; 
  const genre = document.getElementById('genre').value; 
  const status = document.getElementById('status').value; 

  try {
    await fetch(`/updatebook/${bookId}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, author, genre, status})
    }); 
    window.location.reload();
  } catch (error) {
    res.status(500).send(error);
  }
}

const getBookToUpdate = (bookId) =>{
  fetch(`/findbook/${bookId}`)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    document.getElementById('title').value = data.title;
    document.getElementById('author').value = data.author;
    document.getElementById('genre').value = data.genre;
    document.getElementById('status').value = data.status;
  })
  .catch(err => console.error(err));
}

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('btn-edit')) {
    const btnEdit = event.target;
    const bookId = btnEdit.getAttribute("data-id");
    await getBookToUpdate(bookId);
    changeDisplay('none', 'inline-block');
    btnUpdate.setAttribute('data-id', bookId);
  }
});

btnUpdate.addEventListener('click', async () => {
  const bookId = btnUpdate.getAttribute('data-id');
  await updateBook(bookId);
  changeDisplay('inline-block', 'none');
});