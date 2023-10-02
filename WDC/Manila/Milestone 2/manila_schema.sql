CREATE DATABASE manila;
USE manila;

CREATE TABLE Staff(
	staff_id INT NOT NULL UNIQUE AUTO_INCREMENT,
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	username VARCHAR(255) UNIQUE,
	password VARCHAR(255),
	email VARCHAR(255) UNIQUE,
	dob VARCHAR(255),
	manager_priv INT,

	PRIMARY KEY (staff_id)

);


CREATE TABLE staff_availability(
	avail_id INT NOT NULL AUTO_INCREMENT,
	monday INT DEFAULT 1,
	tuesday INT DEFAULT 1,
	wednesday INT DEFAULT 1,
	thursday INT DEFAULT 1,
	friday INT DEFAULT 1,
	saturday INT DEFAULT 1,
	sunday INT DEFAULT 1,

	staff_id INT UNIQUE,

	PRIMARY KEY (avail_id, staff_id),
	FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE CASCADE
);


CREATE TABLE notification_preferences(
	day_before INT DEFAULT 0,
	new_task INT DEFAULT 0,

	staff_id INT UNIQUE,

	PRIMARY KEY (staff_id),
	FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE CASCADE
);


CREATE TABLE Tasks(
	task_id INT NOT NULL UNIQUE AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	description VARCHAR(255),
	due_date VARCHAR (10) NOT NULL,
	status VARCHAR (255) DEFAULT "Haven't Started",
	color VARCHAR(255) DEFAULT 'Tomato',

	PRIMARY KEY (task_id)
);


CREATE TABLE Staff_Has_Task(
	task_id INT,
	staff_id INT,

	PRIMARY KEY (task_id, staff_id),
	FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
	FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE NO ACTION
);


CREATE TABLE Comments(
	comment_id INT UNIQUE NOT NULL AUTO_INCREMENT,
	content LONGTEXT,

	task_id INT,
	author_id INT,
	time_stamp VARCHAR(255),

	PRIMARY KEY (comment_id),
	FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
	FOREIGN KEY (author_id) REFERENCES Staff(staff_id) ON DELETE SET NULL
);