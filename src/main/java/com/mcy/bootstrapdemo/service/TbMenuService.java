package com.mcy.bootstrapdemo.service;

import com.mcy.bootstrapdemo.custom.CommonService;
import com.mcy.bootstrapdemo.entity.TbMenu;
import com.mcy.bootstrapdemo.repository.TbMenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TbMenuService extends CommonService<TbMenu, Integer> {
    @Autowired
    private TbMenuRepository menuRepository;

}
