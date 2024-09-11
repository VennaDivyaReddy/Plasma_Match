// on page load 
precheck()

function precheck() {
  if (localStorage.getItem('LOGIN_DETAILS')) {
    flag = (JSON.parse(localStorage.getItem('LOGIN_DETAILS'))['loggedIn']);
    if (flag == 0) {
      localStorage.clear();
      window.location.href = "http://127.0.0.1:8080/";
    }
  }
  else{
    localStorage.clear();
      window.location.href = "http://127.0.0.1:8080/";
  }
}

get_preference_data();
get_donation_data();

// post example
// calls post at /update/preference
function post_preference_data() {
  fetch("http://localhost:5000/update/preference", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preference_data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Response recorded succesfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// calls post at /update/donation
function post_update_data() {
  fetch("http://localhost:5000/update/donation", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(update_data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Response recorded succesfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// calls post at /org/update/donation
function post_org_update_data() {
  fetch("http://localhost:5000/org/update/donation", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(org_update_data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Response recorded succesfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// GET calls 

//  step 2: call the data using the route -> /get/org/preference
// Get call used to get records for preference
function get_preference_data() {
  fetch("http://localhost:5000/get/org/preference", {
    method: "GET", // or 'get calls should always be GET ONLY 
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(preference_data), GET does not accept body
  })
    .then((response) => response.json()) // converts your {} to json object
    .then((data) => {
      console.log("Success:", data); // for debugging - to verify & validate data 
      const current_org_id = JSON.parse(localStorage.getItem("LOGIN_DETAILS"))["user_id"];
     
      org_data=data.filter(rec => rec["orgId"] === current_org_id)
      construct_table_using_data(org_data) // this is a helper method 
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// Get call used to get records for donation records
function get_donation_data() {
  fetch("http://localhost:5000/get/org/records", {
    method: "GET", // or 'get calls should always be GET ONLY 
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(preference_data), GET does not accept body
  })
    .then((response) => response.json()) // converts your {} to json object
    .then((data) => {
      console.log("Success:", data); // for debugging - to verify & validate data 
      const current_org_id = JSON.parse(localStorage.getItem("LOGIN_DETAILS"))["user_id"];
     
      org_data=data.filter(rec => rec["org_id"] === current_org_id)

      construct_rec_using_data(org_data) // this is a helper method 
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// Creates HTML script and returns it
function construct_rec_using_data(data) {
  let tableHTML = "";
  tableHTML += "<table class='table'>";
  tableHTML += "<thead>";
  tableHTML += "<tr>";
  tableHTML += "<th>Donor ID</th>";
  tableHTML += "<th>Date</th>";
  tableHTML += "<th>Time</th>";
  tableHTML += "<th>Amount</th>";
  tableHTML += "<th>Comments</th>";
  tableHTML += "</tr>";
  tableHTML += "</thead>";
  tableHTML += "<tbody>";
  data.forEach(row => {
    console.log(row);
    tableHTML += `<tr>
        <td style='text-align:left'>${row['donorId']}</td>        
        <td style='text-align:left'>${row['date']}</td>
        <td style='text-align:left'>${row['time']}</td>
        <td style='text-align:left'>${row['amount']}</td>
        <td style='text-align:left'>${row['comments']}</td>
      </tr>`
  });
  tableHTML += "</tbody>";


  tableHTML += "</table>";
  console.log(tableHTML);
  //                Query happens     |  will set the inner html
  document.getElementById('table-data').innerHTML = tableHTML;
}
// Step 3 : Helper method will construct table HTMLstring and set the HTML of table element 
function construct_table_using_data(data) {
  let tableHTML = "";
  tableHTML += "<table class='table'>";
  tableHTML += "<thead>";
  tableHTML += "<tr>";
  tableHTML += "<th>Donor ID</th>";
  tableHTML += "<th>Org ID </th>";
  tableHTML += "<th>Date</th>";
  tableHTML += "<th>Time</th>";
  tableHTML += "</tr>";
  tableHTML += "</thead>";
  tableHTML += "<tbody>";
  data.forEach(row => {
    console.log(row);
    tableHTML += `<tr>
        <td style='text-align:left'>${row['donorId']}</td>
        <td style='text-align:left'>${row['orgId']}</td>
        <td style='text-align:left'>${row['date']}</td>
        <td style='text-align:left'>${row['time']}</td>
      </tr>`
  });
  tableHTML += "</tbody>";


  tableHTML += "</table>";
  console.log(tableHTML);
  //                Query happens     |  will set the inner html
  document.getElementById('table-root').innerHTML = tableHTML;
}

let preference_data = {
  date: "",
  org_name: "",
  org_id: "",
};

let update_data = {
  date: "",
  org_name: "",
  comments: "",
  user_id: "",
  org_id: "",
};

let org_update_data = {
  don_id: "",
  date: "",
  amt: "",
  comments: "",
  user_id: "",
};

// update-plasma-donation-form
// Goes to preference-form in html and gets pref_data
window.addEventListener("load", function () {
  document
    .getElementById("preference-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // before the code

      // Should be triggered on form submit
      preference_data["date"] = document.querySelector("#preferencetime").value;
      preference_data["org_name"] = document.querySelector("#org").value;
      preference_data["org_id"] = document.querySelector("#org_id").value;
      preference_data["user_id"] = JSON.parse(localStorage.getItem("LOGIN_DETAILS"))["user_id"];
      // make api call here
      post_preference_data();
    });
});
//  Goes to update-plasma-donation-form in html and gets update_data
window.addEventListener("load", function () { 
  document
    .getElementById("update-plasma-donation-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // before the code

      // Should be triggered on form submit
      update_data["date"] = document.querySelector("#datetime").value;
      update_data["org_name"] = document.querySelector("#org").value;
      update_data["org_id"] = document.querySelector("#org_id").value;
      update_data["comments"] = document.querySelector("#comment").value;
      update_data["user_id"] = JSON.parse(localStorage.getItem("LOGIN_DETAILS"))["user_id"];
      // make api call here
      post_update_data();
      // console.log(update_data);
    });
});
// update org-update-plasma-donation-form in html and gets org_update_data
window.addEventListener("load", function () {
  document
    .getElementById("org-update-plasma-donation-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // before the code

      // Should be triggered on form submit
      org_update_data["date"] = document.querySelector("#datetime").value;
      org_update_data["don_id"] = document.querySelector("#don").value;
      org_update_data["comments"] = document.querySelector("#comment").value;
      org_update_data["amt"] = document.querySelector("#amt").value;
      org_update_data["user_id"] = JSON.parse(localStorage.getItem("LOGIN_DETAILS"))["user_id"];
      // make api call here
      post_org_update_data();
      //console.log(org_update_data);
    });
});




