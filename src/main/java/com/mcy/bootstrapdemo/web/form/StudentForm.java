package com.mcy.bootstrapdemo.web.form;

import com.mcy.bootstrapdemo.custom.BaseForm;
import com.mcy.bootstrapdemo.entity.TbClass;

public class StudentForm extends BaseForm<Integer> {
    private String name;   //姓名
    private Boolean isUsed;
    private String username;    //用户名
    private TbClass tbClass;    //班级
    private String teahcerName;
    private Double grade;   //成绩

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getUsed() {
        return isUsed;
    }

    public void setUsed(Boolean used) {
        isUsed = used;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public TbClass getTbClass() {
        return tbClass;
    }

    public void setTbClass(TbClass tbClass) {
        this.tbClass = tbClass;
    }

    public String getTeahcerName() {
        return teahcerName;
    }

    public void setTeahcerName(String teahcerName) {
        this.teahcerName = teahcerName;
    }

    public Double getGrade() {
        return grade;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    }
}
