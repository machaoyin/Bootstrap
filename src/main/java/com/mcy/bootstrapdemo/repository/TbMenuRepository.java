package com.mcy.bootstrapdemo.repository;

import com.mcy.bootstrapdemo.custom.CommonRepository;
import com.mcy.bootstrapdemo.entity.TbMenu;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TbMenuRepository extends CommonRepository<TbMenu, Integer> {

    List<TbMenu> findByParentIsNullOrderByIdx();

    TbMenu findByName(String name);

}
