@IsTest
private class ExpenseControllerTest {

    @TestSetup

    static void setupTestData() {
        // Create test data
        Annual_Budget`__c Recruitmentab = new Annual_Budget__c();
        ab.Name = 'Recruitment, Trainees and Marketing 2023';
        ab.Start_Date__c = Date.newInstance(2019, 1, 1);
        ab.End_Date__c = Date.newInstance(2019, 12, 31);
        ab.Amount__c = 100000;
        insert ab;
    }
}