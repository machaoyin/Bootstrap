package com.mcy.bootstrapdemo.repository;

import com.mcy.bootstrapdemo.custom.CommonRepository;
import com.mcy.bootstrapdemo.entity.TbClass;
import org.springframework.stereotype.Repository;

@Repository
public interface TbClassRepository extends CommonRepository<TbClass, Integer> {

}
