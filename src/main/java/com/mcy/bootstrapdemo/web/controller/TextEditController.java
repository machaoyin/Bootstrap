package com.mcy.bootstrapdemo.web.controller;

import com.mcy.bootstrapdemo.service.SysFileService;
import com.mcy.bootstrapdemo.service.TextEditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@Controller
@RequestMapping(value = "textEdit")
public class TextEditController {

    @Autowired
    private TextEditService textEditService;
    @Autowired
    private SysFileService fileService;

    @RequestMapping(value = "/manage")
    public void manage(){

    }

    /**
     * 图片上传
     * @param file
     * @return
     */
    @RequestMapping(value = "/imgUpload")
    @ResponseBody
    private Object imgUpload(MultipartFile file) {
        String uuid = UUID.randomUUID().toString()+".jpg";
        fileService.saveFile(file, uuid);
        return "http://localhost:8080/bootstrap/textEdit/download?uuid="+uuid;
    }

    /**
     * 图片下载
     * @param uuid
     * @param request
     * @param response
     */
    @RequestMapping(value = "/download")
    @ResponseBody
    private void download(String uuid, HttpServletRequest request, HttpServletResponse response) {
        fileService.download(uuid, request, response);
    }

}
