// public/js/inventory.js
'use strict'

document.addEventListener("DOMContentLoaded", () => {
  const classificationList = document.querySelector("#classificationList");
  const inventoryTable = document.getElementById("inventoryDisplay");

  if (classificationList) {
    classificationList.addEventListener("change", async (event) => {
      const classificationId = event.target.value;
      if (!classificationId) return;

      try {
        // Request inventory data from server
        const response = await fetch(`/inv/getInventory/${classificationId}`);
        if (!response.ok) throw new Error("Network response was not OK");
        const data = await response.json();

        // Clear existing table content
        inventoryTable.innerHTML = "";

        if (!data || data.length === 0) {
          inventoryTable.innerHTML = "<tr><td>No vehicles found for this classification.</td></tr>";
          return;
        }

        // Build table header
        const thead = document.createElement("thead");
        thead.innerHTML = `
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price</th>
            <th>Color</th>
          </tr>
        `;
        inventoryTable.appendChild(thead);

        // Build table body
        const tbody = document.createElement("tbody");
        data.forEach(item => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.inv_make}</td>
            <td>${item.inv_model}</td>
            <td>${item.inv_year}</td>
            <td>$${item.inv_price}</td>
            <td>${item.inv_color}</td>
          `;
          tbody.appendChild(row);
        });
        inventoryTable.appendChild(tbody);

      } catch (err) {
        console.error("Error fetching inventory:", err);
        inventoryTable.innerHTML = "<tr><td>Error loading inventory data.</td></tr>";
      }
    });
  }
});

// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
 let inventoryDisplay = document.getElementById("inventoryDisplay"); 
 // Set up the table labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all vehicles in the array and put each in a row 
 data.forEach(function (element) { 
  console.log(element.inv_id + ", " + element.inv_model); 
  dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
  dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
  dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 
 dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 inventoryDisplay.innerHTML = dataTable; 
}
