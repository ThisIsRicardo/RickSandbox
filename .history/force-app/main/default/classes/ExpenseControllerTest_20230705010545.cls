@IsTest
private class ExpenseControllerTest {

    @TestSetup

    static void setupTestData() {
        // Create test data
        Annual_Budget__c RecruitmentAB = new Annual_Budget__c();
        RecruitmentAB.Name = 'Recruitment, Trainees and Marketing 2023';
        RecruitmentAB.Budget_Category__c = 'Recruitment, Trainees and Marketing';
        RecruitmentAB.Effective_Date__c = Date.newInstance(2019, 12, 31);
        RecruitmentAB.Amount__c = 100000;
        insert RecruitmentAB;
    }
}