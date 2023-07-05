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
        recruitmentSubcategory.Category__c = 'Recruitment, Trainees and Marketing';
        recruitmentSubcategory.Annual_Budget__c = recruitmentAB.Id;
        recruitmentSubcategory.Annual_Amount__c = 90000;
        insert recruitmentSubcategory;

        Budget__c recruitmentJanuaryBudget = new Budget__c();
        recruitmentJanuaryBudget.Name = 'Fabi Team Building January 2023';
        recruitmentJanuaryBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentJanuaryBudget.Month__c = 'January';
        recruitmentJanuaryBudget.Monthly_Amount__c = 7500;
        insert recruitmentJanuaryBudget;

        Budget__c recruitmentFebruaryBudget = new Budget__c();
        recruitmentFebruaryBudget.Name = 'Fabi Team Building February 2023';
        recruitmentFebruaryBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentFebruaryBudget.Month__c = 'February';
        recruitmentFebruaryBudget.Monthly_Amount__c = 7500;
        insert recruitmentFebruaryBudget;

        Budget__c recruitmentMarchBudget = new Budget__c();
        recruitmentMarchBudget.Name = 'Fabi Team Building March 2023';
        recruitmentMarchBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentMarchBudget.Month__c = 'March';
        recruitmentMarchBudget.Monthly_Amount__c = 7500;
        insert recruitmentMarchBudget;

        Budget__c recruitmentAprilBudget = new Budget__c();
        recruitmentAprilBudget.Name = 'Fabi Team Building April 2023';
        recruitmentAprilBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentAprilBudget.Month__c = 'April';
        recruitAprilBudget.Monthly_Amount__c = 7500;
        insert recruitmentAprilBudget;

        Budget__c recruitmentMayBudget = new Budget__c();
        recruitmentMayBudget.Name = 'Fabi Team Building May 2023';
        recruitmentMayBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentMayBudget.Month__c = 'May';
        recruitmentMayBudget.Monthly_Amount__c = 7500;
        insert recruitmentMayBudget;

        Budget__c recruitmentJuneBudget = new Budget__c();
        recruitmentJuneBudget.Name = 'Fabi Team Building June 2023';
        recruitmentJuneBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentJuneBudget.Month__c = 'June';
        recruitmentJuneBudget.Monthly_Amount__c = 7500;
        insert recruitmentJuneBudget;

        Budget__c recruitmentJulyBudget = new Budget__c();
        recruitmentJulyBudget.Name = 'Fabi Team Building July 2023';
        recruitmentJulyBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentJulyBudget.Month__c = 'July';
        recruitmentJulyBudget.Monthly_Amount__c = 7500;
        insert recruitmentJulyBudget;

        Budget__c recruitmentAugustBudget = new Budget__c();
        recruitmentAugustBudget.Name = 'Fabi Team Building August 2023';
        recruitmentAugustBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentAugustBudget.Month__c = 'August';
        recruitmentAugustBudget.Monthly_Amount__c = 7500;
        insert recruitmentAugustBudget;

        Budget__c recruitmentSeptemberBudget = new Budget__c();
        recruitmentSeptemberBudget.Name = 'Fabi Team Building September 2023';
        recruitmentSeptemberBudget.Subcategory__c = recruitmentSubcategory.Id;
        recruitmentSeptemberBudget.Month__c = 'September';
        recruitmentSeptemberBudget.Monthly_Amount__c = 7500;
        insert recruitmentSeptemberBudget;

        Budget__c recruitmentOctoberBudget = new Budget__c();
        recruitmentOctoberBudget.Name = 'Fabi Team Building October 2023';
        recruitmentOctoberBudget.Subcategory__c = recruitmentSubcategory.Id;
        



        Annual_Budget__c employeeAB = new Annual_Budget__c();
        EmployeeAB.Name = 'Employee Experience and Development 2023';
        EmployeeAB.Budget_Category__c = 'Employee Experience and Development';
        EmployeeAB.Effective_Date__c = Date.newInstance(2023, 1, 01);
        EmployeeAB.Closed_Date__c = Date.newInstance(2023, 12, 31);
        EmployeeAB.Expected_Mid_Year_Review__c = Date.newInstance(2023, 6, 30);
        insert EmployeeAB;


    }
}