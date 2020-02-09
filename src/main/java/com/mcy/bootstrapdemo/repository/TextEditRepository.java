package com.mcy.bootstrapdemo.repository;

import com.mcy.bootstrapdemo.custom.CommonRepository;
import com.mcy.bootstrapdemo.entity.TextEdit;
import org.springframework.stereotype.Repository;

@Repository
public interface TextEditRepository extends CommonRepository<TextEdit, Integer> {

}
