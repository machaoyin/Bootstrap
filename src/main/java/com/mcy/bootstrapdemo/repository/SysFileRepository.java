package com.mcy.bootstrapdemo.repository;

import com.mcy.bootstrapdemo.custom.CommonRepository;
import com.mcy.bootstrapdemo.entity.SysFile;
import org.springframework.stereotype.Repository;

@Repository
public interface SysFileRepository extends CommonRepository<SysFile, Integer> {

    SysFile findByUuid(String uuid);

}
