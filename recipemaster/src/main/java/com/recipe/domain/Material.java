package com.recipe.domain;

public class Material {

	private int materialNo;
	private String materialName;
	private String materiaQuantity;
	private int materialStatement;

	public Material() {	}

	public int getMaterialNo() {
		return materialNo;
	}

	public void setMaterialNo(int materialNo) {
		this.materialNo = materialNo;
	}

	public String getMaterialName() {
		return materialName;
	}

	public String getMateriaQuantity() {
		return materiaQuantity;
	}

	public void setMateriaQuantity(String materiaQuantity) {
		this.materiaQuantity = materiaQuantity;
	}

	public void setMaterialName(String materialName) {
		this.materialName = materialName;
	}

	public int getMaterialStatement() {
		return materialStatement;
	}

	public void setMaterialStatement(int materialStatement) {
		this.materialStatement = materialStatement;
	}

	@Override
	public String toString() {
		return "Material [materialNo=" + materialNo + ", materialName=" + materialName + ", materiaQuantity="
				+ materiaQuantity + ", materialStatement=" + materialStatement + "]";
	}
}
