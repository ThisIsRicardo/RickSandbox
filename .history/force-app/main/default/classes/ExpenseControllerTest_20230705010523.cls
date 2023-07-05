@IsTest
private class ExpenseControllerTest {

    @TestSetup

    static void setupTestData() {
        // Create test data
        Annual_Budget`__c Recruitmentab = new Annual_Budget__c();
        Recruitmentab.Name = 'Recruitment, Trainees and Marketing 2023';
        Recruitmentab.Budget_Category__c = 'Recruitment, Trainees and Marketing';
        Recruitmentab.Effective_Date__c = Date.newInstance(2019, 12, 31);
        ab.Amount__c = 100000;
        insert ab;
    }
}