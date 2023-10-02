var vueinst = new Vue({
    el: "#vuemain",
    data: {
        show1: 1,
        show2: 0,
        show3: 0,

        first_name: '',
        last_name: '',
        manager_priv: 0,
        username: '',
        old_password: '',
        new_password: '',
        email: '',
        user: '',
        showsettingsvar: 0,
        hcm_var: 0,

        //Availability
        availability: [1, 1, 1, 1, 1, 1, 1],
    },

    computed: {},

    methods: {
        changedisp: function(i) {
            if (i == 2) {
                this.show1 = 0;
                this.show2 = 1;
                this.show3 = 0;
            } else if (i == 3) {
                this.show1 = 0;
                this.show2 = 0;
                this.show3 = 1;
            } else {
                this.show1 = 1;
                this.show2 = 0;
                this.show3 = 0;
            }
        },

        submitchanges: function() {
            //get all v-model and send
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //alert("recieved at /updateme ");
                } else if (this.readyState == 4 && this.status == 403) {
                    //alert("not logged in ");
                } else if (this.readyState == 4) {
                    alert("error");
                }

            };

            xhttp.open("POST", "users/updateme", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            var new_fname = this.first_name;
            var new_lname = this.last_name;
            var new_username = this.username;
            var new_email = this.email;
            //alert('sending...');

            xhttp.send(JSON.stringify({
                "first_name": new_fname,
                "last_name": new_lname,
                "username": new_username,
                "email": new_email
            }));

        },

        submitavailability: function() {
            //get all v-model and send
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //alert("recieved at /updateavail ");
                } else if (this.readyState == 4 && this.status == 403) {
                    location.href = "/login.html";
                } else if (this.readyState == 4) {
                    alert("Woops, something went wrong...");
                }
            };

            xhttp.open("POST", "users/updateavail", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            var mon = vueinst.availability[1];
            var tues = vueinst.availability[2];
            var wed = vueinst.availability[3];
            var thurs = vueinst.availability[4];
            var fri = vueinst.availability[5];
            var sat = vueinst.availability[6];
            var sun = vueinst.availability[0];

            xhttp.send(JSON.stringify({
                "mon": mon,
                "tues": tues,
                "wed": wed,
                "thurs": thurs,
                "fri": fri,
                "sat": sat,
                "sun": sun
            }));

        },

        submitpassword: function() {
            //get all v-model and send
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //alert("recieved at /updatepassword ");
                } else if (this.readyState == 4 && this.status == 403) {
                    location.href = "/login.html";
                } else if (this.readyState == 4) {
                    alert("Woops, something went wrong...");
                }
            };

            xhttp.open("POST", "users/updatepassword", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            var old_pass = this.old_password;
            var new_pass = this.new_password;

            xhttp.send(JSON.stringify({
                "old_pasword": old_pass,
                "new_password": new_pass
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
            vueinst.first_name = vueinst.user.first_name;
            vueinst.last_name = vueinst.user.last_name;
            vueinst.manager_priv = vueinst.user.manager_priv;
            vueinst.username = vueinst.user.username;
            vueinst.email = vueinst.user.email;
            //alert('called userdata');

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


function getavail() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var avail = JSON.parse(this.responseText);
            vueinst.availability[0] = avail[0].sunday;
            vueinst.availability[1] = avail[0].monday;
            vueinst.availability[2] = avail[0].tuesday;
            vueinst.availability[3] = avail[0].wednesday;
            vueinst.availability[4] = avail[0].thursday;
            vueinst.availability[5] = avail[0].friday;
            vueinst.availability[6] = avail[0].saturday;
        } else if (this.readyState == 4 && this.status == 403) {
            location.href = "/login.html";
        } else if (this.readyState == 4) {
            alert("Woops, something went wrong...");
        }
    };

    xhttp.open("GET", "users/useravail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

getuser();
getavail();