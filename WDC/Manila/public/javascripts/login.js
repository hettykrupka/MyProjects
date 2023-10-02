var vueinst = new Vue({
    el: "#vuemain",
    data: {
        lUser: '',
        lPass: '',
        type: 'password',
        showpopvar: 0,

        new_name: '',
        new_lname: '',
        new_username: '',
        new_password: '',
        new_email: '',
        new_dob: '',
        new_manager: '',


    },

    computed: {},

    methods: {
        showpopup: function() {
            this.showpopvar = 1;
        },

        closepopup: function() {
            this.showpopvar = 0;
        },

        closeanywhere: function(event) {
            var SUpopup = document.getElementById("SUpopup");
            if (event.target == SUpopup && this.showpopvar == 1) {
                this.showpopvar = 0;
            }
        },

        login: function() {

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 403) {
                    alert("LOGIN UNSUCCESSFUL!" + '\n' + "Please try again");

                } else if (this.readyState == 4 && this.status == 200) {
                    location.href = "/home.html?user=" + this.responseText;
                } else {
                    console.log("unexpected");
                }
            };
            xhttp.open("POST", "/users/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                username: this.lUser,
                password: this.lPass
            }));
        },

        signup: function() {

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    location.href = "/home.html";
                } else if (this.readyState == 4) {
                    alert("error");
                }

            };
            xhttp.open("POST", "/signup", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            var new_name = this.new_name;
            var new_lname = this.new_lname;
            var new_username = this.new_username;
            var new_password = this.new_password;
            var new_email = this.new_email;
            var new_dob = this.new_dob;
            var new_manager = this.new_manager;

            if ((new_name) && (new_lname) && (new_username) && (new_password) && (new_email) && (new_dob) && (new_manager)) {
                xhttp.send(JSON.stringify({
                    "first_name": new_name,
                    "last_name": new_lname,
                    "username": new_username,
                    "password": new_password,
                    "email": new_email,
                    "dob": new_dob,
                    "manager_priv": new_manager
                }));
            } else {
                alert("You did not fill out the form correctly");
                return;
            }
        }
    }

});


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/tokensignin');
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var r = confirm("We've detected your Google account. Press OK to sign in with Google.");
            if (r == true) {
                location.href = "/home.html";
            }
        } else if (this.readyState == 4) {
            //alert("error");
        }
    };

    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    xhttp.send('idtoken=' + id_token);
}