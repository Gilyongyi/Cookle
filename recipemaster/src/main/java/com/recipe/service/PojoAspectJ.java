package com.recipe.service;

import org.aspectj.lang.ProceedingJoinPoint;

public class PojoAspectJ {
	public PojoAspectJ(){
		System.out.println("::" + getClass() + " default Construct");
	}
	
	//Around  Advice
		public Object invoke(ProceedingJoinPoint joinPoint) throws Throwable {
				
			System.out.println("\n[Around before] "+getClass()+".invoke() start.....");
			System.out.println("[Around before]  :"+
														joinPoint.getTarget().getClass().getName());
			System.out.println("[Around before] method :"+
														joinPoint.getSignature().getName());
			if(joinPoint.getArgs().length !=0){
				System.out.println("[Around before] : "+ joinPoint.getArgs()[0]);
			}
			Object obj = joinPoint.proceed();

			System.out.println("[Around after] return value  : "+obj);
			System.out.println("[Around after] "+getClass()+".invoke() end.....\n");

			return obj;
		}
}
