public with sharing class FlowController {

    @AuraEnabled
    public static void callMyFlow(String statementId) {
        // Instantiate a new Flow.Interview for your Flow
        Flow.Interview.E_B_Credit_Card_Statement_for_Approval flow = new Flow.Interview.E_B_Credit_Card_Statement_for_Approval(new Map<String, Object>{'inputVariable' => statementId});
        
        // Start the Flow
        flow.start();
    }
}
