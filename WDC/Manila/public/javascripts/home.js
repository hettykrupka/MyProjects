var time = new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();

//START VUE
var vueinst = new Vue({


    el: "#vuemain",
    data: {
        tasks: [{
            name: "No Tasks!",
            description: "Lucky you ;)",
            status: "Completed",
            color: "mediumseagreen"
        }],
        comments: [],
        taskpeople: [],

        //Render variables
        name: '',
        user: [],
        staff: [],
        manager_priv: 0,
        dotw: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dotw_relative: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        new_date_relative: 'Due Date',
        today: '',
        task: [],
        users: [],

        //Display variables
        hcm_var: 0,
        edit_var: 0,
        showsettingsvar: 0,

        //Post comment
        newcomment: "",

        //Create new task
        showpopvar: 0,
        new_name: '',
        new_des: '',
        new_date: 'Due Date',
        checked_people: [],
        expanded: false,
        edit_status: 'Edit Task'
    },

    computed: {
        taskcomments() {
            return this.comments.filter(function(comment) {
                //console.log(vueinst.task);
                return vueinst.task.task_id == comment.task_id;
            });

        },

        taskstat() {
            return this.task.status;
        },

        taskpeoplefilter() {
            return this.taskpeople.filter(function(person) {
                //console.log(vueinst.task);
                return vueinst.task.task_id == person.task_id;
            });
        },

        stafffilter() {
            var due = this.new_date.toLowerCase();
            return this.staff.filter(function(staffmem) {
                console.log(due);
                console.log(staffmem[due]);
                return staffmem[due] == 1;
            });
        },

        task_dd() {
            let day_index = new Date().getDay();
            let tom_index;
            if (day_index==6){
              tom_index=0;
            }
            else {
              tom_index=day_index+1;
            }
            let task_date = this.task.due_date;

            if (task_date == this.dotw[day_index]) {
                return 'Today';


            } else if (task_date == this.dotw[tom_index]){
              return "Tomorrow";
            }

            else{
                return task_date;
            }
        },


        showedit() {
            if ((this.manager_priv == 1) && (this.task.name != "No Tasks!")) {
                return 1;
            } else {
                return 0;
            }
        },

    },


    methods: {

        //START AJAX

        comment: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //alert("You've successfully commented :"+ comment+ " on the task with id "+ task_id);
                    var newcomm = {
                        author_name: vueinst.name,
                        author_lname: vueinst.user.last_name,
                        content: vueinst.newcomment,
                        task_id: vueinst.task.task_id,
                        time_stamp: time
                    };
                    vueinst.comments.push(newcomm);
                    vueinst.newcomment = '';
                } else if (this.readyState == 4 && this.status == 400) {
                    alert("you didnt send it in the right format");
                } else if (this.readyState == 4 && this.status == 403) {
                    alert("you're not logged in");
                } else if (this.readyState == 4 && this.status == 418) {
                    alert("You didnt write anything...");
                }
            };

            xhttp.open("POST", "users/postcomment", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            var comment = this.newcomment;
            var task_id = this.task.task_id;


            if ((comment) && (task_id)) {
                xhttp.send(JSON.stringify({
                    "content": comment,
                    "task_id": task_id,
                    "time_stamp": time
                }));
            } else {
                alert('something went wrong');
            }

        },


        changestatus: function(task_id, color) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // alert("recieved at /updatestatus");
                } else if (this.readyState == 4 && this.status == 403) {
                    alert("not logged in");
                } else if (this.readyState == 4) {
                    alert("error");
                }
            };

            xhttp.open("POST", "users/updatestatus", true);
            xhttp.setRequestHeader("Content-type", "application/json");

            var update_colour;
            var update_status;

            if (color == "yellow") {
                vueinst.task.status = "Working on It";
                update_status = "Working on It";

                vueinst.task.color = "orange";
                update_colour = "orange";
            } else if (color == "green") {
                vueinst.task.status = "Completed";
                update_status = "Completed";

                vueinst.task.color = "mediumseagreen";
                update_colour = "mediumseagreen";
            } else {
                vueinst.task.status = "Haven't Started";
                update_status = "Haven't Started";

                vueinst.task.color = "tomato";
                update_colour = "tomato";
            }


            xhttp.send(JSON.stringify({
                "task_status": update_status,
                "color": update_colour,
                "task_id": this.task.task_id
            }));
        },



        edittask: function() {
            if (this.edit_var == 1) {
                this.edit_var = 0;

                //check for changes and send to server
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        //alert("recieved at /edittask");
                    } else if (this.readyState == 4 && this.status == 403) {
                        //alert("not logged in");
                    } else if (this.readyState == 4) {
                        alert("error");
                    }

                    vueinst.edit_status = 'Edit Task';
                };

                xhttp.open("POST", "users/edittask", true);
                xhttp.setRequestHeader("Content-type", "application/json");

                var description = this.task.description;
                var task_name = this.task.name;
                var t_id = this.task.task_id;
                //alert(description);


                xhttp.send(JSON.stringify({
                    "name": task_name,
                    "des": description,
                    "task_id": t_id
                }));
            }

            //start editting
            else if (this.edit_var == 0) {
                this.edit_var = 1;
                this.edit_status = 'Save';
            }

        },

        deletetask: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //alert("recieved at /deletetask");
                    location.reload();
                } else if (this.readyState == 4 && this.status == 403) {
                    //alert("not logged in");
                } else if (this.readyState == 4) {
                    alert("error");
                }
            };

            xhttp.open("POST", "users/deletetask", true);
            xhttp.setRequestHeader("Content-type", "application/json");

            var t_id = this.task.task_id;

            xhttp.send(JSON.stringify({"task_id": t_id}));
        },


        createnewtask: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    location.reload();
                    //alert('recieved at /newtask');
                } else if (this.readyState == 4 && this.status == 403) {
                    //alert("not logged in");
                } else if (this.readyState == 4) {
                    alert("error");
                }
            };

            xhttp.open("POST", "users/newtask", true);
            xhttp.setRequestHeader("Content-type", "application/json");

            var name = this.new_name;
            var des = this.new_des;
            var date = this.new_date;
            var people = this.checked_people;

            xhttp.send(JSON.stringify({
                "name": name,
                "des": des,
                "date": date,
                "people": people
            }));
        },

        sendsummary: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //alert('recieved at /email');
                } else if (this.readyState == 4 && this.status == 403) {
                    location.href = "/login.html";
                } else if (this.readyState == 4) {
                    alert("Woops, something went wrong...");
                }
            };

            xhttp.open("POST", "users/email", true);
            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send();
        },


        //END AJAX
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
            var CNTpopup = document.getElementById("CNTpopup");
            var settingspopup = document.getElementById("settingspopup");

            if (event.target == CNTpopup && this.showpopvar == 1) {
                this.showpopvar = 0;
            } else if (event.target == settingspopup && this.showsettingsvar == 1) {
                this.showsettingsvar = 0;
            }
        },

        showPeople: function() {
            var checkboxes = document.getElementById("checkboxes");
            if (!this.expanded) {
                checkboxes.style.display = "block";
                this.expanded = true;
            } else {
                checkboxes.style.display = "none";
                this.expanded = false;
            }
        },

        logout: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    location.href = "/login.html";
                } else if (this.readyState == 4 && this.status == 403) {
                    //alert("not logged in");
                } else if (this.readyState == 4) {
                    alert("error");
                }
            };

            xhttp.open("POST", "users/logout", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            //alert('ok');
            xhttp.send();
        }
    }
});




//FUNCTIONS TO POPULATE PAGE
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

vueinst.task = vueinst.tasks[0];

function gettasks() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && (this.responseText) != '[]') {
            vueinst.tasks = JSON.parse(this.responseText);
            console.log("here");
            //alert(this.responseText);
            vueinst.task = vueinst.tasks[0];

        } else if (this.readyState == 4 && this.status == 403) {
            location.href = "/login.html";
        } else if (this.readyState == 4) {
            //alert("Woops, something went wrong...");
        }
    };

    xhttp.open("POST", "users/tasks", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var today_send=new Date();
    var indx=today_send.getDay();
    var day_sort=String(vueinst.dotw[indx]);
   // console.log(day_sort);
    xhttp.send(JSON.stringify( {"today":day_sort} ));
}




function getcomments() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst.comments = JSON.parse(this.responseText);
        } else if (this.readyState == 4 && this.status == 403) {
            location.href = "/login.html";
        } else if (this.readyState == 4) {
            alert("Woops, something went wrong...");
        }
    };

    xhttp.open("GET", "users/comments", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function getpeople() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst.taskpeople = JSON.parse(this.responseText);
        } else if (this.readyState == 4 && this.status == 403) {
            location.href = "/login.html";
        } else if (this.readyState == 4) {
            alert("Woops, something went wrong...");
        }
    };

    xhttp.open("GET", "users/taskspeople", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function getstaff() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            vueinst.staff = JSON.parse(this.responseText);
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
gettasks();
getcomments();
getpeople();
getstaff();
//END FUNCTIONS


vueinst.today = vueinst.dotw[(new Date()).getDay()];
var tom;
if (new Date().getDay()==6){
  tom=0;
}

else {
  tom=new Date().getDay()+1;
}

vueinst.dotw_relative[(new Date()).getDay()] = "Today";
vueinst.dotw_relative[tom] = "Tomorrow";