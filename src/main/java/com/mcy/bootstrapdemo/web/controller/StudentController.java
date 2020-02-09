package com.mcy.bootstrapdemo.web.controller;

import com.mcy.bootstrapdemo.custom.AjaxResult;
import com.mcy.bootstrapdemo.custom.CommonController;
import com.mcy.bootstrapdemo.custom.TablePageable;
import com.mcy.bootstrapdemo.entity.Student;
import com.mcy.bootstrapdemo.service.StudentService;
import com.mcy.bootstrapdemo.service.TbClassService;
import com.mcy.bootstrapdemo.web.form.StudentForm;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Controller
@RequestMapping(value = "/student")
public class StudentController extends CommonController<Student, Integer, StudentForm> {

    @Autowired
    private TbClassService tbClassService;
    @Autowired
    private StudentService studentService;

    @Override
    public Object save(StudentForm form) throws InstantiationException, IllegalAccessException {
        try {
            Student model = new Student();
            Integer id = form.getId();
            if(id!=null) {
                model = studentService.findById(id);
            }
            BeanUtils.copyProperties(form, model,"id");
            studentService.save(model);
            return new AjaxResult("数据保存成功");
        } catch (Exception e) {
            return new AjaxResult(false,"数据保存失败");
        }
    }

    @Override
    public void edit(StudentForm form, ModelMap map) throws InstantiationException, IllegalAccessException {
        //把所有班级查询出来传递到前台
        map.put("tbClass", tbClassService.findAll());
        Student model = new Student();
        Integer id = form.getId();
        if (id != null) {
            model = studentService.findById(id);
        }
        map.put("model", model);
    }

    @Override
    public Object page(TablePageable pageParam, StudentForm form) {
        PageRequest pageable = pageParam.bulidPageRequest();
        Specification<Student> spec = buildSpec(form);
        Page<Student> page = studentService.findAll(spec, pageable);
        return AjaxResult.bulidPageResult(page);
    }

    @RequestMapping(value="/verify")
    public void verify(){

    }

    @RequestMapping(value="/verifyUsername")
    @ResponseBody
    public Map verifyUsername(String username){
        Student stu = studentService.findByUsername(username);
        Map map = new HashMap();
        if (stu == null) {
            map.put("valid", true);
        }else{
            map.put("valid", false);
        }
        return map;
    }

    @RequestMapping(value = "/update")
    @ResponseBody
    public Object update(Integer id, Boolean isUsed) {
        try {
            Student stu = studentService.findById(id);
            stu.setIsUsed(isUsed);
            studentService.save(stu);
            return new AjaxResult("数据修改成功");
        } catch (Exception e) {
            return new AjaxResult(false, "数据修改失败");
        }
    }

    @RequestMapping(value = "/updateGrade")
    @ResponseBody
    public Object updateGrade(Integer id, double grade) {
        try {
            Student stu = studentService.findById(id);
            stu.setGrade(grade);
            studentService.save(stu);
            return new AjaxResult("数据修改成功");
        } catch (Exception e) {
            return new AjaxResult(false, "数据修改失败");
        }
    }

    @RequestMapping(value = "delete1")
    @ResponseBody
    public Object delete(String id) {
        try {
            String[] split = id.split(",");
            for (int i = 0; i < split.length; i++) {
                studentService.deleteById(Integer.parseInt(split[i]));
            }
            return new AjaxResult("数据删除成功");
        } catch (Exception e) {
            return new AjaxResult(false, "数据删除失败");
        }
    }

    @Override
    public Specification<Student> buildSpec(StudentForm form) {
        Specification<Student> specification = new Specification<Student>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<Student> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                HashSet<Predicate> rules = new HashSet<>();
                if (StringUtils.hasText(form.getName())) {
                    Predicate name = cb.like(root.get("name"), "%" + form.getName() + "%");
                    rules.add(name);
                }
                if (StringUtils.hasText(form.getTeahcerName())) {
                    Predicate code = cb.like(root.get("tbClass").get("name"), "%" + form.getTeahcerName() + "%");
                    rules.add(code);
                }
                if (StringUtils.hasText(form.getSearch())) {
                    Predicate name2 = cb.like(root.get("name"), "%" + form.getSearch() + "%");
                    Predicate username2 = cb.like(root.get("username"), "%" + form.getSearch() + "%");
                    Predicate or = cb.or(name2, username2);
                    rules.add(or);
                }
                return cb.and(rules.toArray(new Predicate[rules.size()]));
            }

        };
        return specification;
    }
}
