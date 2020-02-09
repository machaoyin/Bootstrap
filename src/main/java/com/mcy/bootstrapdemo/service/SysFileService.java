package com.mcy.bootstrapdemo.service;

import com.mcy.bootstrapdemo.custom.CommonService;
import com.mcy.bootstrapdemo.entity.SysFile;
import com.mcy.bootstrapdemo.repository.SysFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.*;
import java.text.SimpleDateFormat;

@Service
public class SysFileService extends CommonService<SysFile, Integer> {

    @Autowired
    private SysFileRepository fileRepository;

    // 图片存放位置
    private final static String IMAGEPATH="E:\\bootstrap\\image";

    //保存图片
    @Transactional
    public boolean saveFile(MultipartFile file, String uuid){
        try{
            File path = path(file.getContentType());
            String filename = file.getOriginalFilename();
            SysFile fileEntity = new SysFile();
            fileEntity.setFileName(filename);
            fileEntity.setUuid(uuid);
            String storeaddress = path.getAbsolutePath();
            fileEntity.setStoreaddress(storeaddress);
            File saveFile = new File(path,uuid);
            try {
                fileRepository.save(fileEntity);
                file.transferTo(saveFile);
                return true;
            } catch (IllegalStateException | IOException e) {
                e.printStackTrace();
                return false;
            }
        }catch (Exception e){
            System.out.println("图片保存异常");
            return false;
        }
    }

    //图片地址是否存在
    private File path(String filename) {
        File pat=new File("E:\\bootstrap");
        File path=new File(SysFileService.IMAGEPATH);
        if(!pat.isDirectory()) {
            pat.mkdir();
        }
        if(!path.isDirectory()) {
            path.mkdir();
        }
        return path;
    }

    /**
     * 下载
     * @param uuid
     * @param request
     * @param response
     */
    public void download(String uuid, HttpServletRequest request, HttpServletResponse response) {
        SysFile fileentity = fileRepository.findByUuid(uuid);
        String filename = fileentity.getFileName();
        filename = getStr(request, filename);
        File file = new File(fileentity.getStoreaddress(), uuid);
        if(file.exists()) {
            FileInputStream fis;
            try {
                fis = new FileInputStream(file);
                response.setContentType("application/x-msdownload");
                response.addHeader("Content-Disposition", "attachment; filename=" + filename );
                ServletOutputStream out = response.getOutputStream();
                byte[] buf = new byte[2048];
                int n = 0;
                while((n = fis.read(buf))!=-1){
                    out.write(buf, 0, n);
                }
                fis.close();
                out.flush();
                out.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private String getStr(HttpServletRequest request, String fileName) {
        String downloadFileName = null;
        String agent = request.getHeader("USER-AGENT");
        try {
            if(agent != null && agent.toLowerCase().indexOf("firefox") > 0){
                //downloadFileName = "=?UTF-8?B?" + (new String(Base64Utils.encode(fileName.getBytes("UTF-8")))) + "?=";
                //设置字符集
                downloadFileName = "=?UTF-8?B?" + Base64Utils.encodeToString(fileName.getBytes("UTF-8")) + "?=";
            }else{
                downloadFileName =  java.net.URLEncoder.encode(fileName, "UTF-8");
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return downloadFileName;
    }
}
