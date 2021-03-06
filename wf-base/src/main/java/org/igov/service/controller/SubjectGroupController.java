
package org.igov.service.controller;

import org.igov.model.subject.SubjectGroupResult;
import org.igov.service.business.subject.SubjectGroupService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Controller
@Api(tags = {"SubjectGroupController — Организационная иерархия"})
@RequestMapping(value = "/subject/group")
public class SubjectGroupController {
	
	 private static final Logger LOG = LoggerFactory.getLogger(SubjectGroupController.class);


    @Autowired
    private SubjectGroupService subjectGroupService;



    
    @ApiOperation(value = "Получение организационной иерархии")
    @RequestMapping(value = "/getSubjectGroups", method = RequestMethod.GET)
    @ResponseBody
    public SubjectGroupResult getSubjectGroups(@ApiParam(value = "ид группы", required = true) @RequestParam(value = "sID_Group_Activiti") String sID_Group_Activiti,
    		 @ApiParam(value = "глубина выборки", required = false) @RequestParam(value = "nDeepLevel", required = false) Long nDeepLevel)
            throws Exception  {
    	SubjectGroupResult subjectGroupResult = null;
    	try {
    		subjectGroupResult = subjectGroupService.getSubjectGroupsByGroupActiviti(sID_Group_Activiti,nDeepLevel);
    		
    	} catch (Exception e) {
    		 LOG.error("FAIL: ", e);
        }
		return subjectGroupResult;
    }
    
}
