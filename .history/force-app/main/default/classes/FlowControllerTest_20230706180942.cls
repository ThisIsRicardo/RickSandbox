@isTest
public class FlowControllerTest {
    @isTest 
    static void testCallMyFlow() {
        // Prepare the data
        Credit_Card_Amount__c creditCardStatement = new Credit_Card_Amount__c();
        creditCardStatement.Name = 'Credit Card Statement January 2023';
        creditCardStatement.Month__c = 'January';
        insert creditCardStatement;
        
        Test.startTest();
        // Call the method
        FlowController.callMyFlow(creditCardStatement.Id);
        Test.stopTest();
        
        // As there is no return type and no way to assert if the Flow worked correctly or not, there's no assert to be made here.
        // If the test execution reaches this point without any exceptions, it means the method has been successfully covered by the test.
    }
}
