@IsTest
private class ExpenseControllerTest {

    @TestSetup

    static void setupTestData() {
        // Create test data
        Annual_Budget__c RecruitmentAB = new Annual_Budget__c();
        RecruitmentAB.Name = 'Recruitment, Trainees and Marketing 2023';
        RecruitmentAB.Budget_Category__c = 'Recruitment, Trainees and Marketing';
        RecruitmentAB.Effective_Date__c = Date.newInstance(2023, 1, 01);
        RecruitmentAB.End_Date__c = Date.newInstance(2023, 12, 31);
        RecruitmentAB.Amount__c = 90000;
        insert RecruitmentAB;
    }
}