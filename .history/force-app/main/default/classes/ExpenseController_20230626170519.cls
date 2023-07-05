// ExpenseController.cls
public with sharing class ExpenseController {
    @AuraEnabled
    public static void saveExpenses(List<Expense__c> expenses) {
        try {
            insert expenses;
        } catch (Exception e) {
            
            throw new AuraHandledException('Could not save expenses: ' + e.getMessage());
        }
    }

    // ExpenseController.cls
    @AuraEnabled
    public static Budget__c getBudget(String subcategory, Date transactionDate) {
        // Convert the month and year to strings
        String monthAsString;
        switch on transactionDate.month() {
            when 1 { monthAsString = 'January'; }
            when 2 { monthAsString = 'February'; }
            when 3 { monthAsString = 'March'; }
            when 4 { monthAsString = 'April'; }
            when 5 { monthAsString = 'May'; }
            when 6 { monthAsString = 'June'; }
            when 7 { monthAsString = 'July'; }
            when 8 { monthAsString = 'August'; }
            when 9 { monthAsString = 'September'; }
            when 10 { monthAsString = 'October'; }
            when 11 { monthAsString = 'November'; }
            when 12 { monthAsString = 'December'; }
        }
        String yearAsString = String.valueOf(transactionDate.year());
    
        // Query for the budget
        List<Budget__c> budgets = [
            SELECT Id, Name, Available_Amount__c 
            FROM Budget__c 
            WHERE Subcategory__c = :subcategory 
            AND Month__c = :monthAsString
            AND Year__c = :yearAsString
            LIMIT 1
        ];
        
        // Throw an exception if no matching budget was found
        if (budgets.isEmpty()) {
            throw new AuraHandledException('No matching budget found for subcategory and transaction date: ' + subcategory + ', ' + transactionDate);
        }
        
        return budgets[0];
    }

    @AuraEnabled
    public static string RecruitmentOwnerMetadata(){
        
        Expense_Record_Owner__mdt recruitmentOwnerID = [
            SELECT Owner_ID__c
            FROM Expense_Record_Owner__mdt
            WHERE MasterLabel = 'Recruitment Owner ID'
        ];
        return recruitmentOwnerID.Owner_ID__c;
        
    }

    @AuraEnabled
    public static string EmployeeOwnerMetadata(){
        
        Expense_Record_Owner__mdt employeeOwnerID = [
            SELECT Owner_ID__c
            FROM Expense_Record_Owner__mdt
            WHERE MasterLabel = 'Employee Owner ID'
        ];
        return employeeOwnerID.Owner_ID__c;
    }

    @AuraEnabled
    public static Map<String, String> RecordTypeMetadata() {
        Expenses_and_Budgets_Parameters__mdt recordTypeId = [
            SELECT 	Recruitment_Record_Type_ID__c, Employee_Record_Type_ID__c
            FROM Expenses_and_Budgets_Parameters__mdt
            WHERE MasterLabel = 'Recruitment Parameters'
        ];
        Map<String, String> recordTypeMap = new Map<String, String>();
        recordTypeMap.put('Recruitment, Trainees and Marketing', recordTypeId.Recruitment_Record_Type_ID__c);
        recordTypeMap.put('Employee Experience and Development', recordTypeId.Employee_Record_Type_ID__c);
        return recordTypeMap;
    }

    @AuraEnabled
    public static String getCategory(String subcategoryId) {
    Subcategory__c subcategory = [SELECT Category__c FROM Subcategory__c WHERE Id = :subcategoryId];
    return subcategory.Category__c;
    }

    @AuraEnabled
    public static List<Team_Member__c> getTeamMembers(String subcategory) {
    // You'll need to adjust this SOQL query based on your actual field and object names
    Subcategory__c subcategoryCostCenter = [SELECT Category__c FROM Subcategory__c WHERE Id = :subcategory];
    return [
        SELECT Id, Name, Cost_Item__c FROM Team_Member__c 
        WHERE Cost_item__c = :subcategoryCostCenter.Category__c
    ];
    
}

@AuraEnabled(cacheable=true)
public static String getSubcategoryName(String subcategoryId) {
    try {
        Subcategory__c subcategory = [SELECT Name FROM Subcategory__c WHERE Id = :subcategoryId LIMIT 1];
        return subcategory.Name;
    } catch (Exception e) {
        throw new AuraHandledException('Could not fetch subcategory name: ' + e.getMessage());
    }
}

@AuraEnabled(cacheable=true)
public static String getCreditCardName(String creditCardId) {
    try {
        Credit_Card__c creditCard = [SELECT Name FROM Credit_Card__c WHERE Id = :creditCardId LIMIT 1];
        return creditCard.Name;
    } catch (Exception e) {
        throw new AuraHandledException('Could not fetch credit card name: ' + e.getMessage());
    }
}

@AuraEnabled(cacheable=true)
public static String getStatementName(String statementId) {
    try {
        Credit_Card_Amount__c statement = [SELECT Name FROM Credit_Card_Amount__c WHERE Id = :statementId LIMIT 1];
        return statement.Name;
    } catch (Exception e) {
        throw new AuraHandledException('Could not fetch statement name: ' + e.getMessage());
    }
}

@AuraEnabled(cacheable=true)
public static String getTeamMemberName(String teamMemberId) {
    try {
        Team_Member__c teamMember = [SELECT Name FROM Team_Member__c WHERE Id = :teamMemberId LIMIT 1];
        return teamMember.Name;
    } catch (Exception e) {
        throw new AuraHandledException('Could not fetch team member name: ' + e.getMessage());
    }
}

@AuraEnabled(cacheable=true)
public static String getLicenseName(String licenseId) {
    try {
        Licenses__c license = [SELECT Name FROM Licenses__c WHERE Id = :licenseId LIMIT 1];
        return license.Name;
    } catch (Exception e) {
        throw new AuraHandledException('Could not fetch license name: ' + e.getMessage());
    }
}

@AuraEnabled(cacheable=true)
public static String getCourseName(String courseId) {
    try {
        Course__c course = [SELECT Name FROM Course__c WHERE Id = :courseId LIMIT 1];
        return course.Name;
    } catch (Exception e) {
        throw new AuraHandledException('Could not fetch course name: ' + e.getMessage());
    }
}


    @AuraEnabled(cacheable=true)
    public static List<Subcategory__c> getCategoryOptions(String recordType) {
        // Add your filtering logic here
        return [SELECT Id, Name FROM Subcategory__c WHERE Category__c = 'Recruitment, Trainees and Marketing'];
        //debug list to get results retrieved
        System.debug('Subcategory__c: ' + subcategory);       
    }



    
}
   


