// Order Report Modal Elements
const orderButton = document.getElementById("button2");
const orderModal = document.getElementById("orderModal");
const closeOrderButton = document.querySelector(".close-button");

// Open Order Modal
orderButton.addEventListener("click", () => {
    orderModal.style.display = "block";
});

// Close Order Modal
closeOrderButton.addEventListener("click", () => {
    orderModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === orderModal) {
        orderModal.style.display = "none";
    }
});

// Load customer names from server
function loadCustomers() {
    fetch("http://localhost:3000/customers")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const customerSelect = document.getElementById("customerSelect");
                customerSelect.innerHTML = '<option value="">-- Select a Customer --</option>';

                data.data.forEach(customer => {
                    const option = document.createElement("option");
                    option.value = customer.CustomerNum;
                    option.textContent = customer.CustomerName;
                    customerSelect.appendChild(option);
                });
            } else {
                alert("Could not load customer list.");
            }
        })
        .catch(error => {
            console.error("Error loading customers:", error);
            alert("Error fetching customer list.");
        });
}

// Submit order report
document.getElementById("submitOrderReport").addEventListener("click", () => {
    const selectedNum = document.getElementById("customerSelect").value;

    if (selectedNum) {
        fetch("http://localhost:3000/order-report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ customerNum: selectedNum }),
        })
            .then(async response => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Fetch failed: ${errorText}`);
                }
                return response.json();
            })
            .then(data => {
                const reportResult = document.getElementById("reportResult");
                console.log("Order report response:", data);

                if (data.success) {
                    let totalPrice = data.data.TotalQuotedPrice;

                    if (typeof totalPrice === "string") {
                        totalPrice = parseFloat(totalPrice);
                    }

                    if (typeof totalPrice === "number" && !isNaN(totalPrice)) {
                        reportResult.innerHTML = `
                            <h3>Customer: ${data.data.CustomerName}</h3>
                            <p><strong>Total Quoted Price:</strong> $${totalPrice.toFixed(2)}</p>
                        `;
                    } else {
                        reportResult.innerHTML = `
                            <h3>Customer: ${data.data.CustomerName}</h3>
                            <p style="color:orange;"><strong>Total Quoted Price:</strong> No valid total available.</p>
                        `;
                    }
                } else {
                    reportResult.innerHTML = `<p style="color:red;">${data.message}</p>`;
                }
            })
            .catch(error => {
                console.error("Error during fetch:", error);
                alert("Server error while generating report.");
            });
    } else {
        alert("Please select a customer.");
    }
});


// Representative Report Modal Elements
const repButton = document.getElementById("button1");
const repModal = document.getElementById("repModal");
const repCloseButton = document.querySelector(".close-rep-button");

// Open Rep Modal + Load Data
repButton.addEventListener("click", () => {
    fetch("http://localhost:3000/rep-report")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("repReportResult");

            if (data.success) {
                const reps = data.data;

                if (reps.length === 0) {
                    container.innerHTML = "<p>No representatives found.</p>";
                    return;
                }

                let html = `
                    <table border="1" style="border-collapse: collapse; width: 100%;">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th># of Customers</th>
                                <th>Average Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                reps.forEach(rep => {
                    html += `
                        <tr>
                            <td>${rep.FirstName}</td>
                            <td>${rep.LastName}</td>
                            <td>${rep.NumCustomers}</td>
                            <td>$${parseFloat(rep.AvgBalance || 0).toFixed(2)}</td>
                        </tr>
                    `;
                });

                html += "</tbody></table>";
                container.innerHTML = html;
                repModal.style.display = "block";
            } else {
                container.innerHTML = `<p style="color:red;">${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching rep report:", error);
            alert("Server error while generating rep report.");
        });
});

// Close Rep Modal
repCloseButton.addEventListener("click", () => {
    repModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === repModal) {
        repModal.style.display = "none";
    }
});

// Add Rep Modal Elements
const addRepButton = document.getElementById("button3");
const addRepModal = document.getElementById("addRepModal");
const closeAddRep = document.querySelector(".close-add-rep");
const submitNewRep = document.getElementById("submitNewRep");
const resultContainer = document.getElementById("addRepResult");

// Open modal
addRepButton.addEventListener("click", () => {
    addRepModal.style.display = "block";
});

// Close modal
closeAddRep.addEventListener("click", () => {
    addRepModal.style.display = "none";
    resultContainer.innerHTML = "";
});

// Outside click
window.addEventListener("click", (event) => {
    if (event.target === addRepModal) {
        addRepModal.style.display = "none";
        resultContainer.innerHTML = "";
    }
});

// Submit new rep
submitNewRep.addEventListener("click", () => {
    const repNum = document.getElementById("newRepNum").value.trim();
    const firstName = document.getElementById("newFirstName").value.trim();
    const lastName = document.getElementById("newLastName").value.trim();
    const password = document.getElementById("newPassword").value;

    if (!repNum || !firstName || !lastName || !password) {
        resultContainer.innerHTML = `<p style="color: red;">All fields are required.</p>`;
        return;
    }

    fetch("http://localhost:3000/add-rep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repNum, firstName, lastName, password }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            resultContainer.innerHTML = `<p style="color: green;">Representative added successfully!</p>`;
        } else {
            resultContainer.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        console.error("Error adding rep:", err);
        resultContainer.innerHTML = `<p style="color: red;">Server error.</p>`;
    });
});

// Update Customer Credit Modal Elements
const updateCreditButton = document.getElementById("button4");
const updateCreditModal = document.getElementById("updateCreditModal");
const closeUpdateCreditButton = document.querySelector(".close-update-credit");
const submitUpdateCreditButton = document.getElementById("submitUpdateCredit");
const updateCreditResultContainer = document.getElementById("updateCreditResult");

// Open Update Customer Credit Modal
updateCreditButton.addEventListener("click", () => {
    updateCreditModal.style.display = "block";
    loadCustomersForCreditUpdate(); // Load customer dropdown on modal open
});

// Close Update Customer Credit Modal
closeUpdateCreditButton.addEventListener("click", () => {
    updateCreditModal.style.display = "none";
    updateCreditResultContainer.innerHTML = "";
});

// Outside click to close modal
window.addEventListener("click", (event) => {
    if (event.target === updateCreditModal) {
        updateCreditModal.style.display = "none";
        updateCreditResultContainer.innerHTML = "";
    }
});

// Load customers for the credit update dropdown
function loadCustomersForCreditUpdate() {
    fetch("http://localhost:3000/customers")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const customerSelectForCredit = document.getElementById("customerSelectForCredit");
                customerSelectForCredit.innerHTML = '<option value="">-- Select a Customer --</option>';

                data.data.forEach(customer => {
                    const option = document.createElement("option");
                    option.value = customer.CustomerNum;
                    option.textContent = customer.CustomerName;
                    customerSelectForCredit.appendChild(option);
                });
            } else {
                alert("Could not load customer list.");
            }
        })
        .catch(error => {
            console.error("Error loading customers:", error);
            alert("Error fetching customer list.");
        });
}

// Submit the new customer credit update
submitUpdateCreditButton.addEventListener("click", () => {
    const selectedCustomerNum = document.getElementById("customerSelectForCredit").value;
    const newCreditAmount = document.getElementById("newCreditAmount").value.trim();

    if (!selectedCustomerNum || !newCreditAmount) {
        updateCreditResultContainer.innerHTML = "<p style='color: red;'>Please select a customer and enter a valid credit amount.</p>";
        return;
    }

    fetch("http://localhost:3000/update-customer-credit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ customerNum: selectedCustomerNum, newCreditAmount: parseFloat(newCreditAmount) })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                updateCreditResultContainer.innerHTML = "<p style='color: green;'>Customer credit updated successfully!</p>";
            } else {
                updateCreditResultContainer.innerHTML = `<p style='color: red;'>${data.message}</p>`;
            }
        })
        .catch(err => {
            console.error("Error updating credit:", err);
            updateCreditResultContainer.innerHTML = "<p style='color: red;'>Server error while updating credit.</p>";
        });
});

// Add event listener to the exit button
document.getElementById('exitButton').addEventListener('click', function() {
    // Check if the window can be closed (this prevents issues with modern browsers)
    if (window.confirm('Are you sure you want to exit?')) {
        window.location.href = 'loginIndex.html'; // This will close the window
    }
});

// Load customers when page loads
document.addEventListener("DOMContentLoaded", loadCustomers);

