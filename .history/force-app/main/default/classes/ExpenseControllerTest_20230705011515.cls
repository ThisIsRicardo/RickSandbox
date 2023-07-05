@IsTest
private class ExpenseControllerTest {

    @TestSetup

    static void setupTestData() {
        // Create test data
        Annual_Budget__c recruitmentAB = new Annual_Budget__c();
        RecruitmentAB.Name = 'Recruitment, Trainees and Marketing 2023';
        RecruitmentAB.Budget_Category__c = 'Recruitment, Trainees and Marketing';
        RecruitmentAB.Effective_Date__c = Date.newInstance(2023, 1, 01);
        RecruitmentAB.Closed_Date__c = Date.newInstance(2023, 12, 31);
        RecruitmentAB.Expected_Mid_Year_Review__c = Date.newInstance(2023, 6, 30);
        insert RecruitmentAB;

        Subcategory__c recruitmentSubcategory = new Subcategory__c();
        recruitmentSubcategory.Name = 'Fabi Team Building';
        recruitmentSubcategory.Budget_Category__c = 'Recruitment, Trainees and Marketing';
        recruitmentSubcategory.Annual_Budget__c = recruitmentAB.Id;
        recruitmentSubcategory.Annual_Amount__c = 90000;
        insert recruitmentSubcategory;



        Annual_Budget__c employeeAB = new Annual_Budget__c();
        EmployeeAB.Name = 'Employee Experience and Development 2023';
        EmployeeAB.Budget_Category__c = 'Employee Experience and Development';
        EmployeeAB.Effective_Date__c = Date.newInstance(2023, 1, 01);
        EmployeeAB.Closed_Date__c = Date.newInstance(2023, 12, 31);
        EmployeeAB.Expected_Mid_Year_Review__c = Date.newInstance(2023, 6, 30);
        EmployeeAB.Amount__c = 100000;
        insert EmployeeAB;


    }
}