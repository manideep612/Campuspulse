package com.campuspulse.dto;

import com.campuspulse.model.Category;
import com.campuspulse.model.Priority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private Category category;

    @NotBlank(message = "Location/Room is required")
    @Size(max = 120, message = "Location cannot exceed 120 characters")
    private String location;

    @NotBlank(message = "Student Name is required")
    @Size(max = 100, message = "Student name cannot exceed 100 characters")
    private String studentName;

    @NotBlank(message = "Student Email is required")
    @Email(message = "Invalid email format")
    private String studentEmail;

    @NotBlank(message = "Student Roll Number is required")
    @Size(max = 50, message = "Roll number cannot exceed 50 characters")
    private String studentRollNo;

    private Priority priority = Priority.MEDIUM;

    public ComplaintRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentRollNo() {
        return studentRollNo;
    }

    public void setStudentRollNo(String studentRollNo) {
        this.studentRollNo = studentRollNo;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}
