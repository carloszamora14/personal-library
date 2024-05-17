
var selecionado
function filterBarInput(value) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("books-table");
  tr = table.getElementsByTagName("tr");

  for(i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[value];
    if(td) {
      txtValue = td.textContent || td.innerText;
      if(txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function filterSelectInput() {
  var select = document.getElementById("filter-select");
  var value = select.value;
  if(value == "title") {
    filterBarInput(0);
  } else if(value == "author") {
    filterBarInput(1);
  } 
}
