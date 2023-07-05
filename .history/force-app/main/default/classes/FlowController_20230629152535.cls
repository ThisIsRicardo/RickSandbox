public with sharing class FlowController {

    @AuraEnabled
    public static void callMyFlow(String statementId) {
        // Instantiate a new Flow.Interview for your Flow
        Flow.Interview.My_Auto_Launched_Flow flow = new Flow.Interview.My_Auto_Launched_Flow(new Map<String, Object>{'inputVariable' => inputParameter});
        
        // Start the Flow
        flow.start();
    }
}
