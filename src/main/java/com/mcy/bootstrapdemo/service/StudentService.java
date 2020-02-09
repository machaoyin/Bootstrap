package com.mcy.bootstrapdemo.service;

import com.mcy.bootstrapdemo.custom.CommonService;
import com.mcy.bootstrapdemo.entity.Student;
import com.mcy.bootstrapdemo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService extends CommonService<Student, Integer> {

    @Autowired
    private StudentRepository studentRepository;

    public Student findByUsername(String username) {
        return studentRepository.findByUsername(username);
    }
}
