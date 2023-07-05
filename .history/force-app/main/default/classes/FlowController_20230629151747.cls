public with sharing class FlowController {
    
    public class FlowController {
        public FlowController(){
            //Intialization
        }
        
        public void callFlow(){
            Lead l = new Lead();
            l.FirstName = 'Sapna';
            l.LastName = 'Chandani';
            l.Email = 'sapna.chandani@emizentech.com';
            l.Phone = '8522256355';
            l.MobilePhone = '876545465';
            l.Company = 'Emizentech';
            insert l;
            
            Map<String,Lead> leadMap = new Map<String, Lead>();
            leadMap.put('newLead', l);
            
            Flow.Interview.Email_Flow flow1 = new Flow.Interview.Email_Flow(leadMap);
            flow1.start();
        }
    }
}