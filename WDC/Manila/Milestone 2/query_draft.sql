--Add Things (all works but sometimes needs to be entered in parts??)
	--Staff
	INSERT INTO Staff (first_name, last_name, username, password, email, dob, manager_priv) VALUES ("Alice", "Smith", "asmith101", "alicerox", "a@gmail.com", "27.11.1998", 0);
	INSERT INTO staff_availability(staff_id) VALUES(1);
	INSERT INTO notification_preferences(staff_id) VALUES(1);

	INSERT INTO Staff (first_name, last_name, username, password, email, dob, manager_priv) VALUES ("Bob", "Black", "bb30", "bobrox", "b@gmail.com", "27.11.1998", 1);
	INSERT INTO staff_availability(staff_id) VALUES(2);
	INSERT INTO notification_preferences(staff_id) VALUES(2);

	INSERT INTO Staff (first_name, last_name, username, password, email, dob, manager_priv) VALUES ("Olivia", "Grey", "olive9", "olives", "o@gmail.com", "27.11.1998", 1);
	INSERT INTO staff_availability(staff_id) VALUES(3);
	INSERT INTO notification_preferences(staff_id) VALUES(3);

	--Tasks
	INSERT INTO Tasks(name, description, due_date) VALUES ("clean toilet", "now", "tuesday");
	INSERT INTO Tasks(name, description, due_date) VALUES ("bake muffins", "no gluten", "wednesday");
	INSERT INTO Staff_Has_Task(task_id, staff_id) VALUES (1,2);
	INSERT INTO Staff_Has_Task(task_id, staff_id) VALUES (2,1);
	INSERT INTO Staff_Has_Task(task_id, staff_id) VALUES (2,3);
	INSERT INTO Staff_Has_Task(task_id, staff_id) VALUES (2,2);


--FILLED QUERIES (BLANK BELOW)
--HOME AND TASKS
	--retrieve user tasks (all) for a user
	SELECT Tasks.name, Tasks.description, Tasks.due_date, Tasks.task_colour, Tasks.status FROM Tasks INNER JOIN Staff_Has_Task ON Tasks.task_id=Staff_Has_Task.task_id INNER JOIN Staff ON Staff_Has_Task.staff_id=Staff.staff_id WHERE Staff.username="bb30";

	--retrieve all people involved in a task
	SELECT Staff.first_name, Staff.last_name FROM Staff INNER JOIN Staff_Has_Task ON Staff.staff_id= Staff_Has_Task.staff_id WHERE Staff_Has_Task.task_id=2;

	--update task status
	UPDATE Tasks SET Tasks.status = "Completed", Tasks.task_colour="Green" WHERE Tasks.task_id=2;

	--update task details
	UPDATE Tasks SET Tasks.name="no more muffins", Tasks.description="i like biccies" WHERE Tasks.task_id=2;

	--Create new task
	INSERT INTO Tasks(name, description, due_date) VALUES ("clean toilet", "now", "tuesday");
	INSERT INTO Staff_Has_Task(task_id, staff_id) VALUES (1, 1);

	--Delete tasks
	DELETE FROM Tasks WHERE Tasks.task_id=1;


--PEOPLE AND LOGIN
	--retrieve users
	SELECT Staff.first_name, Staff.last_name, Staff.email, Staff.staff_id FROM Staff;

	--Add new user
	INSERT INTO Staff (first_name, last_name, username, password, email, dob, manager_priv) VALUES ("Alice", "Smith", "asmith101", "alicerox", "a@gmail.com", "27.11.1998", 0);



--ME
	--retrieve personal information
	SELECT Staff.first_name, Staff.last_name, Staff.email, Staff.password, Staff.dob FROM Staff WHERE Staff.staff_id=1;

	--update personal information
	UPDATE Staff SET Staff.first_name="name", Staff.last_name="lname", Staff.email="email", Staff.password="password", Staff.dob="today" WHERE Staff.staff_id=1;

	--update notification preferences

	--update availability
	UPDATE  staff_availability SET staff_availability.monday=0, staff_availability.tuesday=0, staff_availability.wednesday=0, staff_availability.thursday=0, staff_availability.friday=0, staff_availability.saturday=0, staff_availability.sunday=0 WHERE staff_availability.staff_id=1;


--BLANK QUERIES
--HOME AND TASKS
	--retrieve user tasks (all) for a user
	SELECT Tasks.name, Tasks.description, Tasks.due_date, Tasks.task_colour, Tasks.status FROM Tasks INNER JOIN Staff_Has_Task ON Tasks.task_id=Staff_Has_Task.task_id INNER JOIN Staff ON Staff_Has_Task.staff_id=Staff.staff_id WHERE Staff.username=?;

	--retrieve all people involved in a task
	SELECT Staff.first_name, Staff.last_name FROM Staff INNER JOIN Staff_Has_Task ON Staff.staff_id= Staff_Has_Task.staff_id WHERE Staff_Has_Task.task_id=?;

	--update task status
	UPDATE Tasks SET Tasks.status = ?, Tasks.task_colour=? WHERE Tasks.task_id=?;

	--update task details
	UPDATE Tasks SET Tasks.name=?, Tasks.description=? WHERE Tasks.task_id=?;

	--Create new task
	INSERT INTO Tasks(name, description, due_date) VALUES ( ?, ?, ?);
	INSERT INTO Staff_Has_Task(task_id, staff_id) VALUES (?, ?);

	--Delete tasks
	DELETE FROM Tasks WHERE Tasks.task_id=?;


--PEOPLE AND LOGIN
	--retrieve users
	SELECT Staff.first_name, Staff.last_name, Staff.email, Staff.staff_id FROM Staff;

	--Add new user
	INSERT INTO Staff (first_name, last_name, username, password, email, dob, manager_priv) VALUES (?, ?, ?, ?, ?, ?, ?);



--ME
	--retrieve personal information
	SELECT Staff.first_name, Staff.last_name, Staff.email, Staff.password, Staff.dob FROM Staff WHERE Staff.staff_id=?;

	--update personal information
	UPDATE Staff SET Staff.first_name=?, Staff.last_name=?, Staff.email=?, Staff.password=?, Staff.dob=? WHERE Staff.staff_id=?;

	--update notification preferences

	--update availability
	UPDATE  staff_availability SET staff_availability.monday=?, staff_availability.tuesday=?, staff_availability.wednesday=?, staff_availability.thursday=?, staff_availability.friday=?, staff_availability.saturday=?, staff_availability.sunday=? WHERE staff_availability.staff_id=?;



	INSERT INTO Staff_Has_Task VALUES(21,21) WHERE Staff_Has_Task INNER JOIN Tasks ON Tasks.task_id=Staff_Has_Task.task_id WHERE Tasks.task_id=(SELECT MAX(Tasks.task_id) FROM Tasks)

	INSERT INTO Staff_Has_Task (21,21) SELECT * FROM Staff_Has_Task INNER JOIN Tasks ON Tasks.task_id=Staff_Has_Task.task_id WHERE Tasks.task_id=(SELECT MAX(Tasks.task_id) FROM Tasks)

insert into prices (group, id, price)
select
    7, articleId, 1.50
from article where name like 'ABC%';

INSERT INTO Staff_Has_Task (task_id, staff_id) SELECT Tasks.task_id, 1 FROM Tasks WHERE Tasks.task_id=(SELECT MAX(Tasks.task_id) FROM Tasks);

INSERT INTO Staff_Has_Task (task_id, staff_id) SELECT 3, 3;