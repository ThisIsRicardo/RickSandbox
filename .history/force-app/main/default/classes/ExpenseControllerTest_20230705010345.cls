@IsTest
private class ExpenseControllerTest {

    @TestSetup

    static void setupTestData() {
        // Create test data
        Annual_Budget`__c ab = new Annual_Budget__c();
        ab.Name = 'Test Budget';
        ab.Start_Date__c = Date.newInstance(2019, 1, 1);
    }
}