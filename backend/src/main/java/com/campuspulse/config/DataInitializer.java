package com.campuspulse.config;

import com.campuspulse.model.Category;
import com.campuspulse.model.Complaint;
import com.campuspulse.model.ComplaintStatus;
import com.campuspulse.model.Priority;
import com.campuspulse.repository.ComplaintRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(ComplaintRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Complaint c1 = new Complaint(
                        "Air conditioning not cooling in CS Lab 2",
                        "The central AC unit in Computer Lab 2 has stopped cooling, making it difficult for students to concentrate during afternoon lab sessions.",
                        Category.ELECTRICITY,
                        "Computer Science Block - 2nd Floor, Lab 2",
                        "Aarav Sharma",
                        "aarav.sharma@college.edu",
                        "21BCSE042",
                        Priority.HIGH
                );
                c1.setStatus(ComplaintStatus.IN_PROGRESS);
                c1.setAdminRemarks("Maintenance team notified. Technician assigned for 2 PM inspection.");

                Complaint c2 = new Complaint(
                        "Water cooler leakage in Central Library",
                        "Water is leaking from the drinking water dispenser near the digital reading area, creating a slip hazard.",
                        Category.WATER,
                        "Central Library - Ground Floor",
                        "Priya Patel",
                        "priya.patel@college.edu",
                        "22BCSE115",
                        Priority.URGENT
                );
                c2.setStatus(ComplaintStatus.PENDING);

                Complaint c3 = new Complaint(
                        "Campus Wi-Fi connectivity dropped in Hostel B",
                        "Students are unable to connect to the 'CampusNet-HostelB' access point on the 3rd floor since last night.",
                        Category.INTERNET,
                        "Boys Hostel Block B - 3rd Floor Corridor",
                        "Rohan Verma",
                        "rohan.verma@college.edu",
                        "21BIT089",
                        Priority.HIGH
                );
                c3.setStatus(ComplaintStatus.RESOLVED);
                c3.setAdminRemarks("Access point was rebooted and firmware updated. Wi-Fi restored.");

                Complaint c4 = new Complaint(
                        "Broken bench armrest in Lecture Hall 101",
                        "Two desks in row 4 have wobbly legs and broken armrests which need urgent welding or replacement.",
                        Category.FURNITURE,
                        "Main Academic Block - Room 101",
                        "Ananya Singh",
                        "ananya.singh@college.edu",
                        "23BCSE012",
                        Priority.LOW
                );
                c4.setStatus(ComplaintStatus.PENDING);

                Complaint c5 = new Complaint(
                        "Classroom dustbins overflowing after cultural fest",
                        "Dustbins outside Seminar Hall 1 have not been cleared since yesterday's event.",
                        Category.CLEANLINESS,
                        "Auditorium Complex - Seminar Hall 1",
                        "Vikram Mehta",
                        "vikram.mehta@college.edu",
                        "22MECH064",
                        Priority.MEDIUM
                );
                c5.setStatus(ComplaintStatus.RESOLVED);
                c5.setAdminRemarks("Housekeeping staff dispatched. Area cleaned and sanitized.");

                repository.save(c1);
                repository.save(c2);
                repository.save(c3);
                repository.save(c4);
                repository.save(c5);
            }
        };
    }
}
