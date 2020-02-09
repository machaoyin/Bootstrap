package com.mcy.bootstrapdemo.web.form;

import com.mcy.bootstrapdemo.custom.BaseForm;

public class TbClassForm extends BaseForm<Integer> {
    private String name;
    private String teacher;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeacher() {
        return teacher;
    }

    public void setTeacher(String teacher) {
        this.teacher = teacher;
    }
}
