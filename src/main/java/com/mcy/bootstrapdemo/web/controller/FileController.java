package com.mcy.bootstrapdemo.web.controller;

import com.mcy.bootstrapdemo.service.SysFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping(value = "/file")
public class FileController {

    @Autowired
    private SysFileService fileService;

    @RequestMapping(value = "manage")
    public void manage(){

    }

    /**
     * 图片上传
     * @param file
     * @return
     */
    @RequestMapping(value = "imgSave")
    @ResponseBody
    public Map imgSave(MultipartFile file){
        Map<String, Object> map = new HashMap();
        try{
            String uuid = UUID.randomUUID().toString()+".jpg";
            Boolean bool = fileService.saveFile(file, uuid);
            map.put("result", bool);
            map.put("msg", "上传成功");
            return map;
        }catch (Exception e){
            map.put("result", false);
            map.put("msg", "上传失败");
            return map;
        }
    }

}
