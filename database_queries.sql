CREATE TABLE IF NOT EXISTS seat_data (
    id SERIAL PRIMARY KEY,
    college VARCHAR(10) CHECK (college IN ('vit', 'vu', 'viit')) NOT NULL,
    branch VARCHAR(10) CHECK (branch IN ('cse', 'it', 'aids', 'ai', 'aiml', 'civil', 'mech', 'entc', 'ds', 'iot')) NOT NULL,
    seat_type VARCHAR(10) CHECK (seat_type IN ('NRI', 'OCI', 'FN', 'PIO', 'CIWGC')) NOT NULL,
    intake INTEGER NOT NULL,
    filled INTEGER NOT NULL,
    vacant INTEGER NOT NULL,
	UNIQUE (college, branch, seat_type)
);


CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('admin', 'guest', 'user')),
	email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_pic TEXT,
    CONSTRAINT email_unique UNIQUE (email)
);


SELECT 
    college,
    branch,
    SUM(CASE WHEN seat_type = 'NRI' THEN intake ELSE 0 END) AS nri_intake,
    SUM(CASE WHEN seat_type = 'NRI' THEN filled ELSE 0 END) AS nri_filled,
    SUM(CASE WHEN seat_type = 'NRI' THEN vacant ELSE 0 END) AS nri_vacant,
    SUM(CASE WHEN seat_type = 'OCI' THEN intake ELSE 0 END) AS oci_intake,
    SUM(CASE WHEN seat_type = 'OCI' THEN filled ELSE 0 END) AS oci_filled,
    SUM(CASE WHEN seat_type = 'OCI' THEN vacant ELSE 0 END) AS oci_vacant,
    SUM(CASE WHEN seat_type = 'FN' THEN intake ELSE 0 END) AS fn_intake,
    SUM(CASE WHEN seat_type = 'FN' THEN filled ELSE 0 END) AS fn_filled,
    SUM(CASE WHEN seat_type = 'FN' THEN vacant ELSE 0 END) AS fn_vacant,
    SUM(CASE WHEN seat_type = 'PIO' THEN intake ELSE 0 END) AS pio_intake,
    SUM(CASE WHEN seat_type = 'PIO' THEN filled ELSE 0 END) AS pio_filled,
    SUM(CASE WHEN seat_type = 'PIO' THEN vacant ELSE 0 END) AS pio_vacant,
    SUM(CASE WHEN seat_type = 'CIWGC' THEN intake ELSE 0 END) AS ciwgc_intake,
    SUM(CASE WHEN seat_type = 'CIWGC' THEN filled ELSE 0 END) AS ciwgc_filled,
    SUM(CASE WHEN seat_type = 'CIWGC' THEN vacant ELSE 0 END) AS ciwgc_vacant,
    SUM(intake) AS total_intake,
    SUM(filled) AS total_filled,
    SUM(vacant) AS total_vacant

FROM 
    seat_data
GROUP BY 
    college, branch
ORDER BY 
    college ASC, branch ASC;


    CREATE TABLE IF NOT EXISTS student_details (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    enrolment_no VARCHAR(20) UNIQUE NOT NULL,
    seat_type VARCHAR(10) CHECK (seat_type IN ('NRI', 'FN', 'OCI', 'PIO', 'CIWGC')) NOT NULL,
    candidate_type VARCHAR(10) CHECK (candidate_type IN ('NRI', 'FN', 'OCI', 'PIO', 'CIWGC')) NOT NULL,
    college VARCHAR(10) CHECK (college IN ('viit', 'vit', 'vu')) NOT NULL,
    branch VARCHAR(10) CHECK (branch IN ('cse', 'it', 'aids', 'ai', 'aiml', 'civil', 'mech', 'entc', 'ds', 'iot')) NOT NULL,
    fee_status VARCHAR(10) CHECK (fee_status IN ('paid', 'unpaid')) NOT NULL,
    doa DATE NOT NULL
);

INSERT INTO student_details (first_name, last_name, mobile, email, enrolment_no, seat_type, candidate_type, college, branch, fee_status, doa)
VALUES
    ('Akash', 'Sharma', '9876543210', 'akash.sharma@example.com', '20220001', 'NRI', 'NRI', 'viit', 'cse', 'paid', '2024-03-31'),
    ('Neha', 'Patel', '8765432109', 'neha.patel@example.com', '20220002', 'FN', 'FN', 'vit', 'it', 'paid', '2024-03-31'),
    ('Rahul', 'Singh', '7654321098', 'rahul.singh@example.com', '20220003', 'OCI', 'OCI', 'vu', 'civil', 'unpaid', '2024-03-31'),
    ('Priya', 'Das', '6543210987', 'priya.das@example.com', '20220004', 'PIO', 'PIO', 'viit', 'entc', 'paid', '2024-03-31'),
    ('Ananya', 'Gupta', '5432109876', 'ananya.gupta@example.com', '20220005', 'CIWGC', 'CIWGC', 'vit', 'mech', 'unpaid', '2024-03-31');


INSERT INTO seat_data (college, branch, seat_type, intake, filled, vacant)
VALUES
    ('vit', 'cse', 'NRI', 100, 50, 50),
    ('vit', 'cse', 'OCI', 50, 25, 25),
    ('vit', 'cse', 'FN', 75, 40, 35),
    ('vit', 'cse', 'PIO', 25, 10, 15),
    ('vit', 'cse', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other branches, colleges, and seat types
    ('vu', 'cse', 'NRI', 120, 60, 60),
    ('vu', 'cse', 'OCI', 60, 30, 30),
    ('vu', 'cse', 'FN', 90, 45, 45),
    ('vu', 'cse', 'PIO', 30, 15, 15),
    ('vu', 'cse', 'CIWGC', 60, 25, 35),
    -- Repeat for other branches, colleges, and seat types
    ('viit', 'cse', 'NRI', 80, 40, 40),
    ('viit', 'cse', 'OCI', 40, 20, 20),
    ('viit', 'cse', 'FN', 60, 30, 30),
    ('viit', 'cse', 'PIO', 20, 10, 10),
    ('viit', 'cse', 'CIWGC', 40, 15, 25),
    -- Repeat for other branches, colleges, and seat types

        ('vit', 'it', 'NRI', 100, 50, 50),
    ('vit', 'it', 'OCI', 50, 25, 25),
    ('vit', 'it', 'FN', 75, 40, 35),
    ('vit', 'it', 'PIO', 25, 10, 15),
    ('vit', 'it', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other branches, colleges, and seat types
    ('vu', 'it', 'NRI', 120, 60, 60),
    ('vu', 'it', 'OCI', 60, 30, 30),
    ('vu', 'it', 'FN', 90, 45, 45),
    ('vu', 'it', 'PIO', 30, 15, 15),
    ('vu', 'it', 'CIWGC', 60, 25, 35),
    -- Repeat for other branches, colleges, and seat types
    ('viit', 'it', 'NRI', 80, 40, 40),
    ('viit', 'it', 'OCI', 40, 20, 20),
    ('viit', 'it', 'FN', 60, 30, 30),
    ('viit', 'it', 'PIO', 20, 10, 10),
    ('viit', 'it', 'CIWGC', 40, 15, 25),

        ('vit', 'aids', 'NRI', 100, 50, 50),
    ('vit', 'aids', 'OCI', 50, 25, 25),
    ('vit', 'aids', 'FN', 75, 40, 35),
    ('vit', 'aids', 'PIO', 25, 10, 15),
    ('vit', 'aids', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'aids', 'NRI', 120, 60, 60),
    ('vu', 'aids', 'OCI', 60, 30, 30),
    ('vu', 'aids', 'FN', 90, 45, 45),
    ('vu', 'aids', 'PIO', 30, 15, 15),
    ('vu', 'aids', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'aids', 'NRI', 80, 40, 40),
    ('viit', 'aids', 'OCI', 40, 20, 20),
    ('viit', 'aids', 'FN', 60, 30, 30),
    ('viit', 'aids', 'PIO', 20, 10, 10),
    ('viit', 'aids', 'CIWGC', 40, 15, 25),

    ('vit', 'aiml', 'NRI', 100, 50, 50),
    ('vit', 'aiml', 'OCI', 50, 25, 25),
    ('vit', 'aiml', 'FN', 75, 40, 35),
    ('vit', 'aiml', 'PIO', 25, 10, 15),
    ('vit', 'aiml', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'aiml', 'NRI', 120, 60, 60),
    ('vu', 'aiml', 'OCI', 60, 30, 30),
    ('vu', 'aiml', 'FN', 90, 45, 45),
    ('vu', 'aiml', 'PIO', 30, 15, 15),
    ('vu', 'aiml', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'aiml', 'NRI', 80, 40, 40),
    ('viit', 'aiml', 'OCI', 40, 20, 20),
    ('viit', 'aiml', 'FN', 60, 30, 30),
    ('viit', 'aiml', 'PIO', 20, 10, 10),
    ('viit', 'aiml', 'CIWGC', 40, 15, 25),

    ('vit', 'ai', 'NRI', 100, 50, 50),
    ('vit', 'ai', 'OCI', 50, 25, 25),
    ('vit', 'ai', 'FN', 75, 40, 35),
    ('vit', 'ai', 'PIO', 25, 10, 15),
    ('vit', 'ai', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'ai', 'NRI', 120, 60, 60),
    ('vu', 'ai', 'OCI', 60, 30, 30),
    ('vu', 'ai', 'FN', 90, 45, 45),
    ('vu', 'ai', 'PIO', 30, 15, 15),
    ('vu', 'ai', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'ai', 'NRI', 80, 40, 40),
    ('viit', 'ai', 'OCI', 40, 20, 20),
    ('viit', 'ai', 'FN', 60, 30, 30),
    ('viit', 'ai', 'PIO', 20, 10, 10),
    ('viit', 'ai', 'CIWGC', 40, 15, 25),

    ('vit', 'civil', 'NRI', 100, 50, 50),
    ('vit', 'civil', 'OCI', 50, 25, 25),
    ('vit', 'civil', 'FN', 75, 40, 35),
    ('vit', 'civil', 'PIO', 25, 10, 15),
    ('vit', 'civil', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'civil', 'NRI', 120, 60, 60),
    ('vu', 'civil', 'OCI', 60, 30, 30),
    ('vu', 'civil', 'FN', 90, 45, 45),
    ('vu', 'civil', 'PIO', 30, 15, 15),
    ('vu', 'civil', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'civil', 'NRI', 80, 40, 40),
    ('viit', 'civil', 'OCI', 40, 20, 20),
    ('viit', 'civil', 'FN', 60, 30, 30),
    ('viit', 'civil', 'PIO', 20, 10, 10),
    ('viit', 'civil', 'CIWGC', 40, 15, 25),

    ('vit', 'mech', 'NRI', 100, 50, 50),
    ('vit', 'mech', 'OCI', 50, 25, 25),
    ('vit', 'mech', 'FN', 75, 40, 35),
    ('vit', 'mech', 'PIO', 25, 10, 15),
    ('vit', 'mech', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'mech', 'NRI', 120, 60, 60),
    ('vu', 'mech', 'OCI', 60, 30, 30),
    ('vu', 'mech', 'FN', 90, 45, 45),
    ('vu', 'mech', 'PIO', 30, 15, 15),
    ('vu', 'mech', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'mech', 'NRI', 80, 40, 40),
    ('viit', 'mech', 'OCI', 40, 20, 20),
    ('viit', 'mech', 'FN', 60, 30, 30),
    ('viit', 'mech', 'PIO', 20, 10, 10),
    ('viit', 'mech', 'CIWGC', 40, 15, 25),

     ('vit', 'entc', 'NRI', 100, 50, 50),
    ('vit', 'entc', 'OCI', 50, 25, 25),
    ('vit', 'entc', 'FN', 75, 40, 35),
    ('vit', 'entc', 'PIO', 25, 10, 15),
    ('vit', 'entc', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'entc', 'NRI', 120, 60, 60),
    ('vu', 'entc', 'OCI', 60, 30, 30),
    ('vu', 'entc', 'FN', 90, 45, 45),
    ('vu', 'entc', 'PIO', 30, 15, 15),
    ('vu', 'entc', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'entc', 'NRI', 80, 40, 40),
    ('viit', 'entc', 'OCI', 40, 20, 20),
    ('viit', 'entc', 'FN', 60, 30, 30),
    ('viit', 'entc', 'PIO', 20, 10, 10),
    ('viit', 'entc', 'CIWGC', 40, 15, 25),

    ('vit', 'ds', 'NRI', 100, 50, 50),
    ('vit', 'ds', 'OCI', 50, 25, 25),
    ('vit', 'ds', 'FN', 75, 40, 35),
    ('vit', 'ds', 'PIO', 25, 10, 15),
    ('vit', 'ds', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'ds', 'NRI', 120, 60, 60),
    ('vu', 'ds', 'OCI', 60, 30, 30),
    ('vu', 'ds', 'FN', 90, 45, 45),
    ('vu', 'ds', 'PIO', 30, 15, 15),
    ('vu', 'ds', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'ds', 'NRI', 80, 40, 40),
    ('viit', 'ds', 'OCI', 40, 20, 20),
    ('viit', 'ds', 'FN', 60, 30, 30),
    ('viit', 'ds', 'PIO', 20, 10, 10),
    ('viit', 'ds', 'CIWGC', 40, 15, 25),

     ('vit', 'iot', 'NRI', 100, 50, 50),
    ('vit', 'iot', 'OCI', 50, 25, 25),
    ('vit', 'iot', 'FN', 75, 40, 35),
    ('vit', 'iot', 'PIO', 25, 10, 15),
    ('vit', 'iot', 'CIWGC', 50, 20, 30),
    -- Continue adding values for other colleges and seat types
    ('vu', 'iot', 'NRI', 120, 60, 60),
    ('vu', 'iot', 'OCI', 60, 30, 30),
    ('vu', 'iot', 'FN', 90, 45, 45),
    ('vu', 'iot', 'PIO', 30, 15, 15),
    ('vu', 'iot', 'CIWGC', 60, 25, 35),
    -- Repeat for other colleges and seat types
    ('viit', 'iot', 'NRI', 80, 40, 40),
    ('viit', 'iot', 'OCI', 40, 20, 20),
    ('viit', 'iot', 'FN', 60, 30, 30),
    ('viit', 'iot', 'PIO', 20, 10, 10),
    ('viit', 'iot', 'CIWGC', 40, 15, 25);


