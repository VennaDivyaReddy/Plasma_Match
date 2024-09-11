console.log("Running login sctipt.js ...");
pre_check_credentials();

function pre_check_credentials() {
	localStorage.clear();
}

// API call to validate login info

function post_org_update_data() {
	fetch("http://localhost:5000/login", {
		method: "POST", // or 'PUT'
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(login_data),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			alert(data);
			localStorage.setItem("LOGIN_DETAILS", JSON.stringify(data));

			if (data["role_id"] == 1) {
				window.location.href = "http://127.0.0.1:8080/user/";
			} else {
				window.location.href = "http://127.0.0.1:8080/org/";

			}

		})
		.catch((error) => {
			alert("Something went wrong ! Please try again");
			reset_login_details();
			console.error("Error:", error);
		});
}

function reset_login_details() {
	document.querySelector("#user-name").value = '';
	document.querySelector("#password").value = '';

}


// Initializing variables

let login_data = {
	userName: "",
	password: "",
	role: ""
};

window.addEventListener("load", function () {
	document
		.getElementById("user-login-form")
		.addEventListener("submit", function (e) {
			e.preventDefault(); // prevents the page from refresh

			// Should be triggered on form submit
			login_data["userName"] = document.querySelector("#user-name").value;
			login_data["password"] = document.querySelector("#password").value;
			// make api call here
			post_org_update_data();
		});

	document
		.getElementById("donor-button")
		.addEventListener("click", function (e) {
			// Should be triggered on form submit
			login_data["role"] = 1;
			alert("You will be loggin in as Donor")
		});


	document
		.getElementById("org-button")
		.addEventListener("click", function (e) {
			// Should be triggered on form submit
			login_data["role"] = 2;
			alert("You will be loggin in as organization")
		});

});

