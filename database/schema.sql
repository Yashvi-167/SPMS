-- Student Project Management System Database Schema (Normalized SQL)

-- Create Database
CREATE DATABASE SPMS;
USE SPMS;

-- 1. Status Table
CREATE TABLE Status (
    StatusId INT PRIMARY KEY IDENTITY(1,1),
    StatusName VARCHAR(50) NOT NULL UNIQUE
);

-- Seed Status
INSERT INTO Status (StatusName) VALUES ('Pending'), ('In Progress'), ('Completed');

-- 2. Priority Table
CREATE TABLE Priority (
    PriorityId INT PRIMARY KEY IDENTITY(1,1),
    PriorityName VARCHAR(50) NOT NULL UNIQUE
);

-- Seed Priority
INSERT INTO Priority (PriorityName) VALUES ('Low'), ('Medium'), ('High');

-- 3. Roles Table
CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

-- Seed Roles
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Faculty'), ('Student');

-- 4. Users Table
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- Hashed passwords
    MobileNumber VARCHAR(20) NULL,
    ProfilePicturePath VARCHAR(255) NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- 5. UserRoles Table (Many-to-Many mapping for Users and Roles)
CREATE TABLE UserRoles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE CASCADE,
    CONSTRAINT UQ_UserRoles UNIQUE(UserId, RoleId)
);

-- 6. Projects Table
CREATE TABLE Projects (
    ProjectId INT PRIMARY KEY IDENTITY(1,1),
    ProjectTitle VARCHAR(200) NOT NULL,
    Description TEXT NULL,
    StudentId INT NOT NULL, -- FK to Users (Student)
    FacultyId INT NOT NULL, -- FK to Users (Faculty)
    StartDate DATE NOT NULL,
    EndDate DATE NULL,
    StatusId INT NOT NULL, -- FK to Status
    ProgressPercentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT FK_Projects_Student FOREIGN KEY (StudentId) REFERENCES Users(UserId),
    CONSTRAINT FK_Projects_Faculty FOREIGN KEY (FacultyId) REFERENCES Users(UserId),
    CONSTRAINT FK_Projects_Status FOREIGN KEY (StatusId) REFERENCES Status(StatusId)
);

-- 7. Tasks Table
CREATE TABLE Tasks (
    TaskId INT PRIMARY KEY IDENTITY(1,1),
    ProjectId INT NOT NULL, -- FK to Projects
    TaskTitle VARCHAR(200) NOT NULL,
    TaskDescription TEXT NULL,
    StatusId INT NOT NULL, -- FK to Status (Pending, In Progress, Completed)
    PriorityId INT NOT NULL, -- FK to Priority (Low, Medium, High)
    AssignedScore DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    EarnedScore DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    StartDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    CompletedDate DATE NULL,
    CONSTRAINT FK_Tasks_Projects FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT FK_Tasks_Status FOREIGN KEY (StatusId) REFERENCES Status(StatusId),
    CONSTRAINT FK_Tasks_Priority FOREIGN KEY (PriorityId) REFERENCES Priority(PriorityId)
);

-- Create Indexes for Performance Optimization
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Projects_Student ON Projects(StudentId);
CREATE INDEX IX_Projects_Faculty ON Projects(FacultyId);
CREATE INDEX IX_Tasks_Project ON Tasks(ProjectId);
