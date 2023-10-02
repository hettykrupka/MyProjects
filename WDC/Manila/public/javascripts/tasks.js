// var time= new Date().toLocaleTimeString()+"    "+new Date().toLocaleDateString();

// var users = {
//     asmith101: {first_name:"Alice",
//     last_name:"Smith",
//     username:"asmith101",
//     password:"alicelovesanimals",
//     email:"asmith@gmail.com",
//     manager_priv:1,
//     },

//     racecar3: {first_name:"Francesco",
//     last_name:"Bernoulli",
//     username:"racecar3",
//     password:"fast123",
//     email:"franc@gmail.com",
//     manager_priv:0,
//     },

//     lblack:{first_name:"Leo",
//     last_name:"Black",
//     username:"lblack",
//     password:"leo123",
//     email:"leoblack@gmail.com",
//     manager_priv:1,
//     },

//     chels:{first_name:"Chelsea",
//     last_name:"Cameron",
//     username:"chels",
//     password:"cc123",
//     email:"chels@gmail.com",
//     manager_priv:0,
//     }};

// //START VUE
// var vueinst = new Vue({


//     el: "#vuemain",
//     data: {
//         //hard code

//         tasks:[
//         {task_id:0,
//           task_name:"Clean Toilets",
//         task_des:"Please use bleach",
//         task_date: (new Date()).getDay(),
//         task_status:"Haven't Started",
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[
//           {comment_text:"yuck", comment_author:"Alice", comment_time: time},
//           {comment_text:"i want a raise", comment_author:"Alice", comment_time: time},
//           ]
//         },

//         {task_id:1,
//           task_name:"Bake Muffins",
//         task_des:"I'd like them to be raspberry and white chocolate",
//         task_status:"Haven't Started",
//         task_date: (new Date()).getDay(),
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[{comment_text:"i heart muffins", comment_author:"Alice",comment_time: time}]
//         },

//         {task_id:2,
//         task_name:"Write a FB Post",
//         task_des:"Make sure to mention the muffins",
//         task_status:"Haven't Started",
//         task_date: (new Date()).getDay(),
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[{comment_text:"i like instagram more", comment_author:"Alice",comment_time: time}]
//         },

//         {task_id:3,
//           task_name:"Fix the crack in the wall",
//         task_des:"Contact a handy-person",
//         task_status:"Haven't Started",
//         task_date: (new Date()).getDay(),
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[{comment_text:"ill call on monday ", comment_author:"Alice",comment_time: time}]
//         },

//         {task_id:4,
//         task_name:"Mop Floors",
//         task_des:"Do this as you leave for the night",
//         task_status:"Haven't Started",
//         task_date: (new Date()).getDay(),
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[{comment_text:"we are out of soap", comment_author:"Alice"}]
//         },

//         {task_id:5,
//         task_name:"Walk the Dog",
//         task_des:"Use the blue leash",
//         task_status:"Haven't Started",
//         task_date: (new Date()).getDay(),
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[{comment_text:"the blue one is broken", comment_author:"Alice"}]
//         },

//         {task_id:6,
//           task_name:"Make Dinner",
//         task_des:"Something Italian",
//         task_status:"Haven't Started",
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[{comment_text:"how about pizza?", comment_author:"Alice"}]
//         },

//         {task_id:7,
//         task_name:"Pick up Jessie From School",
//         task_des:"Go to the north gate",
//         task_status:"Haven't Started",
//         task_date: (new Date()).getDay(),
//         color:"tomato",
//         task_people:["James", "Bobbie", "Luke"],
//         comments:[{comment_text:"okay but i might be late", comment_author:"Alice",comment_time: time}]
//         }

//     ],

//         dotw:["Sunday", "Monday","Tuesday","Wednesday","Thursday", "Friday", "Saturday", "Sunday"],
//         today:'',
//         newcomment:"",
//         showpopvar:0,
//         showsettingsvar:0,
//         task:[],

//         name:'',
//         user:'',
//         manager_priv:0,
//         hcm_var:0,
//         edit_var:0,
//         expanded:false,
//         users:[],
//         checked_people:[],


//     },

//     computed: {
//     },

//     methods: {

//           comment: function() {

//             var xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function() {
//                 if (this.readyState == 4 && this.status == 200) {
//                     alert("You've successfully commented :"+ comment);
//                     var newcomment={"comment_text":comment, "comment_author": this.name};
//                     var current_task=[];
//                     current_task= this.task;
//                     current_task.comments.push(newcomment);
//                 }

//                 else if (this.readyState == 4 && this.status == 400){
//                   alert("you didnt send it in the right format");
//                 }

//                 else if (this.readyState == 4 && this.status == 403){
//                   alert("you're not logged in");
//                 }

//                 else if (this.readyState == 4 && this.status == 418){
//                   alert("You didnt write anything...");
//                 }

//             };

//             xhttp.open("POST", "users/postcomment", true);
//             xhttp.setRequestHeader("Content-type", "application/json");
//             var comment=this.newcomment;
//             xhttp.send(JSON.stringify({ "newcomment":comment, "task_id":'000', 'staff_id':'000'}));

//         },

//         changestatus: function(task_id, colour){
//             var xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function() {
//                 if (this.readyState == 4 && this.status == 200) {
//                     alert("success");
//                 }

//                 else if (this.readyState == 4) {
//                   alert("error");
//                 }

//             };

//             xhttp.open("POST", "users/updatestatus", true);
//             xhttp.setRequestHeader("Content-type", "application/json");

//           var update;

//           if (colour=="tomato"){
//           update={"status":"Haven't Started", "colour":"Red"};
//           this.tasks[task_id].task_status="Haven't Started";
//           this.tasks[task_id].color="tomato";
//           }

//           else if (colour=="yellow") {
//           update={"status":"Working on It", "colour":"Yellow"};
//           this.tasks[task_id].task_status="Working on It";
//           this.tasks[task_id].color="darkorange";
//           }

//           else if (colour=="green") {
//           update={"status":"Completed", "colour":"Green"};
//           this.tasks[task_id].task_status="Completed";
//           this.tasks[task_id].color="mediumseagreen";
//           }

//         xhttp.send(JSON.stringify(update));
//         },




//         edittask: function (){
//           if (this.edit_var==1){
//             this.edit_var=0;
//             //check for changes
//             var edit={};
//             var xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function() {
//                 if (this.readyState == 4 && this.status == 200) {
//                     alert("success");
//                 }

//                 else if (this.readyState == 4) {
//                   alert("error");
//                 }

//             };
//             xhttp.open("POST", "users/edittask", true);
//             xhttp.setRequestHeader("Content-type", "application/json");
//             xhttp.send(JSON.stringify(edit));
//           }

//           else if (this.edit_var==0){
//             this.edit_var=1;
//           }
//         },

//         newtask: function(){

//         },




//         showpopup:function(){
//           this.showpopvar=1;
//         },

//         showsettings:function(){
//           this.showsettingsvar=1;
//         },


//         closepopup:function(){
//           this.showpopvar=0;
//           this.showsettingsvar=0;
//         },

//         closeanywhere: function(event){
//           var CNTpopup=document.getElementById("CNTpopup");
//           var settingspopup=document.getElementById("settingspopup");

//             if (event.target == CNTpopup&&this.showpopvar==1) {
//               this.showpopvar=0;
//           }

//             else if (event.target == settingspopup && this.showsettingsvar==1) {
//               this.showsettingsvar=0;
//           }
//         },

//             showPeople: function () {
//           var checkboxes = document.getElementById("checkboxes");
//           if (!this.expanded) {
//           checkboxes.style.display = "block";
//           this.expanded = true;
//           }

//           else {
//           checkboxes.style.display = "none";
//           this.expanded = false;
//           }
//         }

//     }
// });
// //END VUE



// vueinst.task=vueinst.tasks[0];
// var url_string = window.location.href;
// var url = new URL(url_string);
// vueinst.user = url.searchParams.get("user");
// vueinst.name=users[vueinst.user].first_name;
// vueinst.manager_priv=users[vueinst.user].manager_priv;
// vueinst.today=vueinst.dotw[(new Date()).getDay()];
// vueinst.dotw[(new Date()).getDay()]="Today";
// vueinst.dotw[(new Date()).getDay()+1]="Tomorrow";
// vueinst.users=users;