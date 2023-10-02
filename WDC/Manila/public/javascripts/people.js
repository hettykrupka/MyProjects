var vueinst = new Vue({
    el: "#vuemain",
    data: {

        //New user
        new_name: '',
        new_lname: '',
        new_username: '',
        new_password: '',
        new_email: '',
        new_dob: '',
        new_manager: '',


        //Render Variables
        name: '',
        user: '',
        manager_priv: 0,
        venue: " Bob's Pantry ",
        showpopvar: 0,
        showsettingsvar: 0,
        hcm_var: 0,

        users: [],

    },

    computed: {},

    methods: {
        //AJAX
        signup: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    location.reload();
                } else if (this.readyState == 4 && this.status == 403) {
                    location.href = "/login.html";
                } else if (this.readyState == 4) {
                    alert("Woops, something went wrong...");
                }
                //AJAX
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
            xhttp.send(JSON.stringify({
                "first_name": new_name,
                "last_name": new_lname,
                "username": new_username,
                "password": new_password,
                "email": new_email,
                "dob": new_dob,
                "manager_priv": new_manager
            }));

        },

        showpopup: function() {
            this.showpopvar = 1;
        },

        showsettings: function() {
            this.showsettingsvar = 1;
        },


        closepopup: function() {
            this.showpopvar = 0;
            this.showsettingsvar = 0;
        },

        closeanywhere: function(event) {
            var CNPpopup = document.getElementById("CNPpopup");
            var settingspopup = document.getElementById("settingspopup");

            if (event.target == CNPpopup && this.showpopvar == 1) {
                this.showpopvar = 0;
            } else if (event.target == settingspopup && this.showsettingsvar == 1) {
                this.showsettingsvar = 0;
            }
        },
    }
});


function getuser() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst.user = JSON.parse(this.responseText);
            vueinst.name = vueinst.user.first_name;
            vueinst.manager_priv = vueinst.user.manager_priv;
        } else if (this.readyState == 4 && this.status == 403) {
            location.href = "/login.html";
        } else if (this.readyState == 4) {
            alert("Woops, something went wrong...");
        }
    };

    xhttp.open("GET", "users/userdata", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function getpeople() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst.users = JSON.parse(this.responseText);
        } else if (this.readyState == 4 && this.status == 403) {
            location.href = "/login.html";
        } else if (this.readyState == 4) {
            alert("Woops, something went wrong...");
        }
    };

    xhttp.open("GET", "users/staff", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}


getuser();
getpeople();