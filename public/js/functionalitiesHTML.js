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
  if(oldNotFound) {
    oldNotFound.remove();
  }

  for(i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[value];
    if(td) {
      txtValue = td.textContent || td.innerText;
      if(txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        found++;
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  if(found === 0) {
    var notFound = document.createElement("h3");
    notFound.id = "not-found";
    notFound.textContent = "No matching results found.";
    not.appendChild(notFound);
    table.style.display='none';
    } else {
    table.style.display='';
  }
}

// Definir la función para filtrar por título o autor
function filterSelectInput() {
  var select = document.getElementById("filter-select");
  var value = select.value;
  if(value == "title") {
    filterBarInput(0);
  } else if(value == "author") {
    filterBarInput(1);
  } 
}

// Funcion para mostrar en el navbar la pagina actual
document.addEventListener('DOMContentLoaded', (event) => {
  var path = window.location.pathname.split("/").pop();
  if (path == "") path = "home";
  var target = document.querySelector('.nav-link.' + path);
  console.log("Target: ", target);
  target.classList.add('active');
});

//Editar libros
const btnUpdate = document.getElementById('btnUpdate<%-index%>');
console.log(btnUpdate)
btnUpdate.addEventListener("click", async ()=>{
  const bookId = btn.getAttribute('data-id');
  const Books = await Book.findById(bookId);
  document.getElementById('title').value = Books[prop].title;
  document.getElementById('author').value = Books[prop].author;
  documet.getElementById('genre').value = Books[prop].genre;
  document.getElementById('status').value = Books[prop].status; 
});  

function visibilityform() {
  var x = document.getElementsByClassName("gestionate-form");
  console.log(x.style.display.toString());
  if (x.style.display === "none") {
    x.style.display = "";
  } else {
    x.style.display = "none";
  }
}