// expenseGrid.js
import { LightningElement, track, wire} from 'lwc'
import saveExpenses from '@salesforce/apex/ExpenseController.saveExpenses'
import RecruitmentOwnerMetadata from '@salesforce/apex/ExpenseController.RecruitmentOwnerMetadata'
import EmployeeOwnerMetadata from '@salesforce/apex/ExpenseController.EmployeeOwnerMetadata'
import RecordTypeMetadata from '@salesforce/apex/ExpenseController.RecordTypeMetadata'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi'
import RECEIPT_TYPE_FIELD from '@salesforce/schema/Expense__c.Receipt_Type__c'
import getBudget from '@salesforce/apex/ExpenseController.getBudget'
import getCategory from '@salesforce/apex/ExpenseController.getCategory'
import getTeamMembers from '@salesforce/apex/ExpenseController.getTeamMembers'
import getCategoryOptions from '@salesforce/apex/ExpenseController.getCategoryOptions';
import getExpenses from '@salesforce/apex/ExpenseController.getExpenses';
import { refreshApex } from '@salesforce/apex';
export default class ExpenseCreation extends LightningElement {


   // ------------------------------------------------------------------------------------------------------------------------
  // GETTING RECORD TYPE ID AND OWNER METADATA

  async connectedCallback() {
    await RecordTypeMetadata()
      .then(result => {
        // result is a map so you can retrieve one of the record type IDs
        this.recordTypeId = result['Recruitment, Trainees and Marketing'] // or another key based on your requirement
      })
      .catch(error => {
        console.error('Error in fetchRecordTypeMetadata:', error)
      })

    await RecruitmentOwnerMetadata()
      .then(result => {
        console.log('Result from fetchRecruitmentOwnerMetadata:', result)
        this.recruitmentOwnerMetadata = result
      })
      .catch(error => {
        console.error('Error in fetchRecruitmentOwnerMetadata:', error)
      })

    await EmployeeOwnerMetadata()
      .then(result => {
        console.log('Result from fetchEmployeeOwnerMetadata:', result)
        this.employeeOwnerMetadata = result
      })
      .catch(error => {
        console.error('Error in fetchEmployeeOwnerMetadata:', error)
      })

    await RecordTypeMetadata()
      .then(result => {
        this.recordTypeMap = result
      })
      .catch(error => {
        console.error('Error in fetchRecordTypeMetadata:', error)
      })
  }

  // END OF GETTING RECORD TYPE ID AND OWNER METADATA
  // ------------------------------------------------------------------------------------------------------------------------
 
  @track transactions = [];
  @track existAmountSpentinPending = false;
  @track totalAmountSpentApproved = 0;
  @track totalAmountSpentPending = 0;
  @track isSelectedRows = false;
  @track creditCardStatement = '';
  @track selectedSubcategory = '';
  @track teamMembers = [];
  @track recordTypeId;
  @track receiptTypeValues = [];
  @track recordTypeMap;
  @track isModalOpen = false;
  @track selectedTeamMembers = [];
  @track currentExpenseIndex = null;
  @track isMultipleTeamMembersAdded = false;
  @track value = '';
  //Filter initial data
  @track isOtherExpenseSelected = false;
  @track isTransactionCardVisible = true;
  @track isExpenseCardVisible = false;
  @track isLicenseVisible = true;
  @track isEventVisible = true;
  @track isTeamMemberVisible = true;
  @track isTeamMemberIconVisible = true;
  @track triggerRender = false;
  @track costCenter = '';
  @track transactionType = '';
  @track recordType = '';
  @track isTransactionTypeModalOpen = false;
  @track categoryOptions = [];
   // Initialize the expense object
@track currentExpense = {
  Name: '',
  Transaction_Date__c: '',
  Amount_Spent__c: '',
  Associated_Credit_Card__c: '',
  Receipt_Type__c: 'Digital - Recibo',
  Credit_Card_Statement__c: this.creditCardStatement,
  Associated_Team_Member__c: '',
  Submit_for_Approval__c: false,
  Subcategory__c: '',
  License__c: '',
  Course__c: ''
}


  @track columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Cost Center', fieldName: 'Cost_Item__c' }
  ]


  @track expensesColumns = [
    { label: 'Transaction Date', fieldName: 'Transaction_Date__c', type: 'date' },
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Subcategory', fieldName: 'Subcategory__c', type: 'text' },
    // Define other columns here...
  ];
  
  @track selectedColumns = [
    { label: 'Transaction Date', fieldName: 'Transaction_Date__c' },
    { label: 'Payment Concept', fieldName: 'Name' },
    { label: 'Category', fieldName: 'Subcategory__c' },
    { label: 'Amount Spent', fieldName: 'Amount_Spent__c', type: 'currency' },
    { label: 'Associated Credit Card', fieldName: 'Associated_Credit_Card__c' },
    { label: 'Credit Card Statement', fieldName: 'Credit_Card_Statement__c' },
    { label: 'Receipt Type', fieldName: 'Receipt_Type__c', wrapText: true },
    { label: 'Associated Team Member', fieldName: 'Associated_Team_Member__c' },
    { label: 'License', fieldName: 'License__c' },
    { label: 'Event', fieldName: 'Course__c' },
    //{ label: 'Multiple Team Members', type: 'text' },
    //{ label: 'Submit for Approval', type: 'checkbox', fieldName: 'Submit_for_Approval__c'},
    {
      type: 'action',
      typeAttributes: {
        rowActions: [
          { name: 'delete', label: 'Delete', iconName: 'utility:delete' }
        ]
      }
    }
  ];
  

  @track columnsWithActions = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Cost Center', fieldName: 'Cost_Item__c' },
    {
      type: 'action',
      typeAttributes: {
        rowActions: [
          {
            name: 'delete_record',
            label: 'Delete',
            iconName: 'action:delete'
          }
        ]
      }
    }
  ]

  @track transactionTypeValues = [
    { label: 'License', value: 'License' },
    { label: 'Event', value: 'Event' },
    { label: 'Other Expense', value: 'Other Expense' }
  ];
  @track otherExpenseTypeValues = [
    { label: 'One', value: 'One' },
    { label: 'Multiple Team Members', value: 'Multiple Team Members' },
    { label: 'None', value: 'None' }
  ];

  
  @track recordTypeValues = [
    { label: 'Recruitment, Trainees and Marketing' , value: 'Recruitment, Trainees and Marketing' },
    { label: 'Employee Experience and Development', value: 'Employee Experience and Development' }
  ];

  // Wire to fetch all 

  @wire(getCategoryOptions, { filterValue: 'Recruitment, Trainees and Marketing' })
  wiredCategoryOptions({ data, error }) {
      if (data) {
          this.categoryOptions = data.map(option => {
              return {
                  label: option.Name,
                  value: option.Id
                
              };
              
          });
      } else if (error) {
          console.error('Error retrieving subcategories:', error);
      }
  }

  @wire(getPicklistValues, {
    recordTypeId: '$recordTypeId',
    fieldApiName: RECEIPT_TYPE_FIELD
  })
  wiredPicklistValues({ error, data }) {
    if (data) {
      this.receiptTypeValues = data.values
      this.error = undefined
    } else if (error) {
      this.error = error
      this.receiptTypeValues = undefined
    }
  }


  get isLicenseOrEventVisible() {
    // I want t
    return this.isLicenseVisible || this.isEventVisible;
}

getRowOptions(rowId) {
  // Find the row
  const row = this.rows.find(r => r.id === rowId);

  if (!row) {
      // If no row found (should not happen), return all options
      return this.allOptions;
  }

  // If row found, filter options based on the transaction type and other expense type
  const filteredOptions = this.allOptions.filter(o => o.transactionType === row.transactionType && o.otherExpenseType === row.otherExpenseType);

  return filteredOptions;
}


handleChange(event) {
  this.value = event.detail.value;
  // The value contains the selected option's id, use this id to store in the record
}


  // ------------------------------------------------------------------------------------------------------------------------
  // START OF TRANSACTION TYPE CARD HANDLERS

  handleTransactionTypeChange(event) {
    this.transactionType = event.detail.value;

    if (this.transactionType === 'Other Expense') {
        this.isOtherExpenseSelected = true;
    } else if (this.transactionType === 'License' || this.transactionType === 'Event') {
        // Reset 'Other Expense' radio group
        this.otherExpenseType = '';
        this.isOtherExpenseSelected = false;
    }
}

handleRecordTypeChange(event) {
  this.recordType = event.detail.value;
  console.log('recordType: ' + this.recordType);
}


  handleOtherExpenseTypeChange(event) {
    this.otherExpenseType = event.detail.value;
    

  }


  handleNextClick() {

    // warning if credit card statement is empty or null
    if (!this.currentExpense.Credit_Card_Statement__c) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Warning',
          message: 'Please, Select a Credit Card Statement before proceeding.',
          variant: 'warning'
        })
      );
      return;
      }
    // if recordtype is empty or null show a toast
     if (!this.recordType) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Warning',
          message: 'Please, Select a Record Type before proceeding.',
          variant: 'warning'
        })
      );
      return;
    } 



    this.isTransactionCardVisible = false;
    this.isExpenseCardVisible = true;
    this.isLicenseVisible = false;
    this.isEventVisible = false;
    this.isTeamMemberIconVisible = false;
    this.isTeamMemberVisible = false;
  }




  // END OF TRANSACTION TYPE CARD HANDLERS
  // ------------------------------------------------------------------------------------------------------------------------

handleOpenNewExpense() {
  this.isTransactionTypeModalOpen = true;
}

  handleNewExpense() {

    switch (this.transactionType) {
      case 'License':
        
                  // Toast to show that the component has been filtered based on the selected value
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Success',
          message: 'License has been selected successfully.',
          variant: 'success'
        })
      );
  
        this.isLicenseVisible = true;
        this.isTeamMemberVisible = false;
        this.isEventVisible = false;
        this.isTeamMemberIconVisible = false;
        break;
      case 'Event':
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Event has been selected successfully.',
            variant: 'success'
          })
        );
        this.isEventVisible = true;
        this.isTeamMemberVisible = false;
        this.isLicenseVisible = false;
        this.isTeamMemberIconVisible = false;
      console.log('Event');
      
  
  
        break;
      case 'Other Expense':
  
        switch (this.otherExpenseType) {
          case 'One':
            this.dispatchEvent(
              new ShowToastEvent({
                title: 'Success',
                message: "One team member's expense selection was successful.",
                variant: 'success'
              })
            );
            this.isTeamMemberVisible = true;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = false;
            this.transactionType = 'Other Expense';
            console.log('One');
            break;
          case 'Multiple Team Members':
            this.dispatchEvent(
              new ShowToastEvent({
                title: 'Success',
                message: "Multiple team members' selection was successful.",
                variant: 'success'
              })
            );
  
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = true;
            this.transactionType = 'Other Expense';
            console.log('Multiple Team Members');
            break;
          case 'None':
            this.dispatchEvent(
              new ShowToastEvent({
                title: 'Success',
                message: 'Expense selection for non-team members was successful.',
                variant: 'success'
              })
            );
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = false;
            this.transactionType = 'Other Expense';
            console.log('None');
            break;
          default:
            console.log('default Other Expense');
            this.dispatchEvent(
              new ShowToastEvent({
                title: 'Selection Error',
                message: 'Please, select how many team members the expense will have.',
                variant: 'warning'
              })
            );
        }
        break;
      default:
        console.log('General default');
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Selection Error',
            message: 'Please, select a transaction type.',
            variant: 'warning'
          })
        );
        
  
    }
    this.isTransactionTypeModalOpen = false;
  
  }




  // ------------------------------------------------------------------------------------------------------------------------
  // START EXPENSE FORM CARD HANDLERS


handleDateChange(event) {
  this.currentExpense.Transaction_Date__c = event.target.value;
  // Fetch the budget if the amount and subcategory are set
  if (
    this.currentExpense.Amount_Spent__c &&
    this.currentExpense.Subcategory__c
  ) {
    // Fetch the budget 
    this.fetchBudget(
      this.currentExpense.Subcategory__c,
      this.currentExpense.Transaction_Date__c
    )
  }
}

handleNameChange(event) {
  this.currentExpense.Name = event.target.value;
}

handleSubcategoryChange(event) {
  this.currentExpense.Subcategory__c = event.target.value;
  getCategory({ subcategoryId: event.target.value })
    .then(category => {
      if (category === 'Recruitment, Trainees and Marketing') {
        this.currentExpense.RecordTypeId =
          this.recordTypeMap['Recruitment, Trainees and Marketing'];
        this.currentExpense.OwnerId = this.recruitmentOwnerMetadata;
      } else if (category === 'Employee Experience and Development') {
        this.currentExpense.RecordTypeId =
          this.recordTypeMap['Employee Experience and Development'];
        this.currentExpense.OwnerId = this.employeeOwnerMetadata;
      }
    })
    .catch(error => {
      // Handle error
    });
}

handleAmountChange(event) {
  this.currentExpense.Amount_Spent__c = event.target.value;

  // Ensure date and subcategory are set before fetching budget
  if (
    !this.currentExpense.Transaction_Date__c ||
    !this.currentExpense.Subcategory__c
  ) {
    return;
  }

  // Fetch the Budget record each time Amount_Spent__c changes
  this.fetchBudget(
    this.currentExpense.Subcategory__c,
    this.currentExpense.Transaction_Date__c
  ).catch(error => {
    // Print the error to the console
  });
}

handleCreditCardStatementChange(event) {
  console.log('handleCreditCardStatementChange');
  console.log(event.detail.value);
  if(Array.isArray(event.detail.value) && event.detail.value.length > 0) {
    this.currentExpense.Credit_Card_Statement__c = event.detail.value[0];
    console.log('handleCreditCardStatementChange if');
    console.log(event.detail.value[0]);
  } else {
    this.currentExpense.Credit_Card_Statement__c = event.detail.value;
    console.log('handleCreditCardStatementChange else');
    console.log(event.detail.value);
  }

  this.updateExpenseWithCreditCardStatement();
}

updateExpenseWithCreditCardStatement() {
  if (!this.currentExpense.Credit_Card_Statement__c) {
    this.currentExpense.Credit_Card_Statement__c = this.creditCardStatement;
  }

  getExpenses({ statementId: this.currentExpense.Credit_Card_Statement__c })
    .then(result => {
      this.expenses = result;  // Populate the expenses data table with the result
      //ref
    })
    .catch(error => {
      console.error('Error in updateExpenseWithCreditCardStatement:', error);
    })
}


handleCreditCardChange(event) {
  this.currentExpense.Associated_Credit_Card__c = event.target.value;
}

handleTeamMemberChange(event) {
  this.currentExpense.Associated_Team_Member__c = event.target.value;
}

handleLicenseChange(event) {
  this.currentExpense.License__c = event.target.value;
}

handleEventChange(event) {
  this.currentExpense.Course__c = event.target.value;
}

handleReceiptTypeChange(event) {
  this.currentExpense.Receipt_Type__c = event.detail.value;
}

handlePaymentMethodChange(event) {
  this.currentExpense.Payment_Method__c = event.target.value;
}

// Refactor the handleSaveExpenses method to use currentExpense instead of expenses
handleSaveExpenses() {
  // Add here validations similar to those in your previous implementation
  saveExpenses({ expense: this.currentExpense }) // remember to update the method name to saveExpense in your Apex class
    .then(result => {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Success',
          message: 'Expense saved successfully',
          variant: 'success'
        })
      )
      this.resetCurrentExpense();
    })
    .catch(error => {
      let message = 'An error occurred while trying to save the expense.';
      if (
        error.body.message.includes(
          'REQUIRED_FIELD_MISSING, Required fields are missing: [Subcategory]'
        )
      ) {
        message =
          'Please make sure to fill out the Subcategory field before saving.';
      }
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error saving expense',
          message: message,
          variant: 'error'
        })
      )
    });
}
resetCurrentExpense() {
  // Reset the currentExpense to its initial state
  this.currentExpense = {
    Name: '',
    Transaction_Date__c: '',
    Amount_Spent__c: '',
    Associated_Credit_Card__c: '',
    Receipt_Type__c: 'Digital - Recibo',
    Credit_Card_Statement__c: this.creditCardStatement,
    Associated_Team_Member__c: '',
    Submit_for_Approval__c: false,
    Subcategory__c: '',
    License__c: '',
    Course__c: ''
  };
}


  // ------------------------------------------------------------------------------------------------------------------------
  // START MULTIPLE TEAM MEMBER MODAL HANDLERS


  

  openModal() {
    getTeamMembers({ subcategory: this.currentExpense.Subcategory__c })
      .then(result => {
        console.log('Result from getTeamMembers:', result)
        this.teamMembers = result
        this.filteredTeamMembers = [...result]
        console.log('Team Members:', this.teamMembers)
        console.log('Filtered Team Members:', this.filteredTeamMembers)
        this.selectedTeamMembers = [...this.currentExpense.selectedTeamMembers]
      })
      .catch(error => {
        console.error('Error in getTeamMembers:', error)
      })
  
    this.isModalOpen = true
  }
  
  closeModal() {
    this.isModalOpen = false
    this.isTransactionTypeModalOpen = false;
  }
  
  handleSearch(event) {
    const searchKey = event.target.value.toLowerCase();
    this.teamMembers = this.filteredTeamMembers.filter(member => member.Name.toLowerCase().includes(searchKey));
  }
  
  handleRowSelection(event) {
    const selectedRows = event.detail.selectedRows
    let newSelectedTeamMembers = [...this.selectedTeamMembers]
  
    for (let i = 0; i < selectedRows.length; i++) {
      let row = selectedRows[i]
      if (!newSelectedTeamMembers.find(item => item.Id === row.Id)) {
        newSelectedTeamMembers.push(row)
      }
    }
  
    this.selectedTeamMembers = newSelectedTeamMembers
    this.isSelectedRows = true;
  }
  
  handleRowAction(event) {
    const actionName = event.detail.action.name
    if (actionName === 'delete_record') {
      const id = event.detail.row.Id
      this.deleteTeamMember(id)
    }
  }
  
  handleAddTeamMembers() {
    const ids = this.selectedTeamMembers.map(member => member.Id).join(',')
    this.currentExpense = {
      ...this.currentExpense,
      Team_Members_ID_s__c: ids,
      selectedTeamMembers: [...this.selectedTeamMembers],
      multipleTeamMembersAdded: true
    }
  
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Team Members added successfully!',
        variant: 'success'
      })
    )
  
    this.isModalOpen = false
  }
  
  deleteTeamMember(id) {
    this.selectedTeamMembers = this.selectedTeamMembers.filter(
      member => member.Id !== id
    )
    if (this.selectedTeamMembers.length === 0) {
      this.isSelectedRows = false;
    }
  }
  

  // END MULTIPLE TEAM MEMBER MODAL HANDLERS
  // ------------------------------------------------------------------------------------------------------------------------




  // ------------------------------------------------------------------------------------------------------------------------
  // HELPER METHODS FOR BUDGET AND FORMATTING DATES


  formatDateAsISOString(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // months are 0-indexed in JS
    const day = String(date.getDate()).padStart(2, '0')
  
    return `${year}-${month}-${day}`
  }
  
  fetchBudget() {
    // If there is no amount in the current expense, resolve the promise immediately
    if (!this.currentExpense.Amount_Spent__c) {
      this.currentExpense.showWarning = false
      return Promise.resolve()
    }
  
    // convert JavaScript date to Apex-friendly string
    let transactionDateObj = new Date(this.currentExpense.Transaction_Date__c)
    transactionDateObj.setHours(0, 0, 0, 0) // zero out the time portion
  
    const apexFriendlyDate = this.formatDateAsISOString(transactionDateObj)
  
    return getBudget({
      subcategory: this.currentExpense.Subcategory__c,
      transactionDate: apexFriendlyDate
    })
      .then(result => {
        console.log('Result from getBudget:', result)
        return result || null
      })
      .then(result => {
        console.log('Result from fetchBudget:', result)
        if (
          result &&
          this.currentExpense.Amount_Spent__c >
          result.Available_Amount__c
        ) {
          this.currentExpense.Submit_for_Approval__c = true
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Warning',
              message: `You are exceeding the available amount for this month. The available amount is ${result.Available_Amount__c}. Therefore, the expense will be send to "Pending Approval".`,
              variant: 'warning'
            })
          )
        } else {
          this.currentExpense.showWarning = false
          this.currentExpense.Submit_for_Approval__c = false
        }
        return result // Ensure that the result is returned
      })
      .catch(error => {
        console.error('Error in fetchBudget:', error)
      })
  }
  
  // END HELPER METHODS FOR BUDGET AND FORMATTING DATES
  // ------------------------------------------------------------------------------------------------------------------------

}