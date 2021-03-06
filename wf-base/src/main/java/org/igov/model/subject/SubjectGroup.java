/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.igov.model.subject;

import javax.persistence.Column;

import org.igov.model.core.NamedEntity;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 * @author olga
 */
@javax.persistence.Entity
public class SubjectGroup extends NamedEntity {
    
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@JsonProperty(value = "sID_Group_Activiti")
	@Column
    private String sID_Group_Activiti;
    
    @JsonProperty(value = "sChain")
    @Column
    private String sChain;
    
    
	public String getsID_Group_Activiti() {
        return sID_Group_Activiti;
    }

    public void setsID_Group_Activiti(String sID_Group_Activiti) {
        this.sID_Group_Activiti = sID_Group_Activiti;
    }

    public String getsChain() {
        return sChain;
    }

    public void setsChain(String sChain) {
        this.sChain = sChain;
    }

	@Override
	public String toString() {
		return "SubjectGroup [sID_Group_Activiti=" + sID_Group_Activiti + ", sChain=" + sChain + ", getName()="
				+ getName() + ", getId()=" + getId() + "]";
	}

}
