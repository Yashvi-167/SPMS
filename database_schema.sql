-- Database Schema for SPMS (Student Project Management System)

-- 1. Priority Table
CREATE TABLE Priority (
    PriorityID INT PRIMARY KEY,
    PriorityName VARCHAR(50) NOT NULL,
    PriorityCssClass VARCHAR(100) NOT NULL
);

INSERT INTO Priority (PriorityID, PriorityName, PriorityCssClass) VALUES
(1, 'Low', 'badge bg-success'),
(2, 'Medium', 'badge bg-warning text-dark'),
(3, 'High', 'badge bg-danger'),
(4, 'Critical', 'badge bg-dark');

-- 2. Status Table
CREATE TABLE Status (
    StatusID INT PRIMARY KEY,
    StatusName VARCHAR(50) NOT NULL,
    StatusCssClass VARCHAR(100) NOT NULL
);

INSERT INTO Status (StatusID, StatusName, StatusCssClass) VALUES
(1, 'Active', 'badge bg-success'),
(2, 'Inactive', 'badge bg-danger'),
(3, 'Pending', 'badge bg-warning text-dark'),
(4, 'Approved', 'badge bg-primary'),
(5, 'Rejected', 'badge bg-danger'),
(6, 'Completed', 'badge bg-success'),
(7, 'Ongoing', 'badge bg-info');

-- 3. Task Table (Snippet showing the requested Foreign Keys)
-- Note: This assumes a Task table exists. The constraints below enforce the schema.
CREATE TABLE Task (
    TaskID INT PRIMARY KEY IDENTITY(1,1),
    TaskTitle VARCHAR(255) NOT NULL,
    TaskDescription TEXT,
    
    -- Task Status & Priority Foreign Keys as requested
    TaskStatusID INT NOT NULL,
    TaskPriorityID INT NOT NULL,
    
    CONSTRAINT FK_Task_Status FOREIGN KEY (TaskStatusID) REFERENCES Status(StatusID),
    CONSTRAINT FK_Task_Priority FOREIGN KEY (TaskPriorityID) REFERENCES Priority(PriorityID)
);
