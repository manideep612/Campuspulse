package com.campuspulse.repository;

import com.campuspulse.model.Category;
import com.campuspulse.model.Complaint;
import com.campuspulse.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findAllByOrderByCreatedAtDesc();

    List<Complaint> findByCategoryOrderByCreatedAtDesc(Category category);

    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);

    List<Complaint> findByCategoryAndStatusOrderByCreatedAtDesc(Category category, ComplaintStatus status);

    List<Complaint> findByStudentRollNoIgnoreCaseOrderByCreatedAtDesc(String studentRollNo);

    @Query("SELECT c FROM Complaint c WHERE " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.studentRollNo) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> searchComplaints(@Param("query") String query);

    long countByStatus(ComplaintStatus status);

    long countByCategory(Category category);
}
