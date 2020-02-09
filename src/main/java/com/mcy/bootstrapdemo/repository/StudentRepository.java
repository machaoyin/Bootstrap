package com.mcy.bootstrapdemo.repository;

import com.mcy.bootstrapdemo.custom.CommonRepository;
import com.mcy.bootstrapdemo.entity.Student;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends CommonRepository<Student, Integer> {

    Student findByUsername(String username);

}
