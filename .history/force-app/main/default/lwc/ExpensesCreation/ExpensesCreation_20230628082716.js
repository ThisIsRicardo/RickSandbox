// expenseGrid.js
import { LightningElement, track, wire} from 'lwc'
import saveExpenses from '@salesforce/apex/ExpenseController.saveExpenses'
import RecruitmentOwnerMetadata from '@salesforce/apex/ExpenseController.RecruitmentOwnerMetadata'
import EmployeeOwnerMetadata from '@salesforce/apex/ExpenseController.EmployeeOwnerMetadata'
import RecordTypeMetadata from '@salesforce/apex/ExpenseController.RecordTypeMetadata'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi'
import EXPENSE_OBJECT from '@salesforce/schema/Expense__c'
import RECEIPT_TYPE_FIELD from '@salesforce/schema/Expense__c.Receipt_Type__c'
import getBudget from '@salesforce/apex/ExpenseController.getBudget'
import LightningAlert from 'lightning/alert'
import getCategory from '@salesforce/apex/ExpenseController.getCategory'
import getTeamMembers from '@salesforce/apex/ExpenseController.getTeamMembers'
import getSubcategoryName from '@salesforce/apex/ExpenseController.getSubcategoryName'
import getCreditCardName from '@salesforce/apex/ExpenseController.getCreditCardName'
import getStatementName from '@salesforce/apex/ExpenseController.getStatementName'
import getTeamMemberName from '@salesforce/apex/ExpenseController.getTeamMemberName'
import getLicenseName from '@salesforce/apex/ExpenseController.getLicenseName'
import getCourseName from '@salesforce/apex/ExpenseController.getCourseName'
import getCategoryOptions from '@salesforce/apex/ExpenseController.getCategoryOptions';



/*class ExpenseWrapper {

  // similarly for other lookup fields...
}
*/
export default class ExpenseCreation extends LightningElement {



   // ------------------------------------------------------------------------------------------------------------------------
  // GETTING RECORD TYPE ID AND OWNER METADATA

  async connectedCallback() {
    //this.newExpense = null;
    /*this.newExpense = new ExpenseWrapper({
      //Id: '', // Replace with actual Id
      Transaction_Date__c: '', // Replace with actual Transaction_Date__c
      Name: '', // Replace with actual Name
      Subcategory__c: '', // Replace with actual Subcategory__c
      Amount_Spent__c: '', // Replace with actual Amount_Spent__c
      Associated_Credit_Card__c: '', // Replace with actual Associated_Credit_Card__c
      Credit_Card_Statement__c: '', // Replace with actual Credit_Card_Statement__c
      Associated_Team_Member__c: '', // Replace with actual Associated_Team_Member__c
      License__c: '', // Replace with actual License__c
      Course__c: '', // Replace with actual Course__c
      Receipt_Type__c: '', // Replace with actual Receipt_Type__c
      // names of lookup records
      SubcategoryName: '', 
      CreditCardName: '',
      CreditCardStatementName: '',
      TeamMemberName: '',
      LicenseName: '',
      CourseName: '',
    });
*/
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
 
// add this method in your class

/*constructor(expense) {
  super();
  this.fetchSubcategoryName = this.fetchSubcategoryName.bind(this);
  this.fetchCreditCardName = this.fetchCreditCardName.bind(this);
  this.fetchStatementName = this.fetchStatementName.bind(this);
  this.fetchTeamMemberName = this.fetchTeamMemberName.bind(this);
  this.fetchLicenseName = this.fetchLicenseName.bind(this);
  this.fetchCourseName = this.fetchCourseName.bind(this);

    //this.Id = expense.Id;
    this.Amount__c = expense.Amount__c;
    this.Subcategory__c = expense.Subcategory__c;
    this.Description__c = expense.Description__c;
    this.Date__c = expense.Date__c;
    this.Associated_Credit_Card__c = expense.Associated_Credit_Card__c;
    this.Credit_Card_Statement__c = expense.Credit_Card_Statement__c;
    this.Associated_Team_Member__c = expense.Associated_Team_Member__c;
    this.License__c = expense.License__c;
    this.Course__c = expense.Course__c;

    // names of lookup records
    this.SubcategoryName = ''; 
    this.CreditCardName = '';
    this.CreditCardStatementName = '';
    this.TeamMemberName = '';
    this.LicenseName = '';
    this.CourseName = '';
    // other fields...
}

setSubcategoryName(name) {
    this.SubcategoryName = name;
}

setCreditCardName(name) {
    this.CreditCardName = name;
}

setCreditCardStatementName(name) {
    this.CreditCardStatementName = name;
}

setTeamMemberName(name) {
    this.TeamMemberName = name;
}

setLicenseName(name) {
    this.LicenseName = name;
}

setCourseName(name) {
    this.CourseName = name;
}

fetchSubcategoryName(subcategoryId) {
  return getSubcategoryName({ subcategoryId })
    .then(result => result)
    .catch(error => {
      console.error('Error in fetchSubcategoryName:', error);
      return '';
    });
}



fetchCreditCardName(creditCardId) {
  return getCreditCardName({ creditCardId })
    .then(result => result)
    .catch(error => {
      console.error('Error in fetchCreditCardName:', error);
      return '';
    });
}


fetchStatementName(statementId) {
  return getStatementName({ statementId })
    .then(result => result)
    .catch(error => {
      console.error('Error in fetchStatementName:', error);
      return '';
    });
}

fetchTeamMemberName(teamMemberId) {
  return getTeamMemberName({ teamMemberId })
    .then(result => result)
    .catch(error => {
      console.error('Error in fetchTeamMemberName:', error);
      return '';
    });
}


fetchLicenseName(licenseId) {
  return getLicenseName({ licenseId })
    .then(result => result)
    .catch(error => {
      console.error('Error in fetchLicenseName:', error);
      return '';
    });
}


fetchCourseName(courseId) {
  return getCourseName({ courseId })
    .then(result => result)
    .catch(error => {
      console.error('Error in fetchCourseName:', error);
      return '';
    });
}
*/


// ...



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
  @track expenses = [
    {
      Name: '',
      Subcategory__c: '',
      Transaction_Date__c: '',
      Amount_Spent__c: '',
      Associated_Credit_Card__c: '',
      Receipt_Type__c: 'Digital - Recibo',
      Credit_Card_Statement__c: this.creditCardStatement,
      Associated_Team_Member__c: '',
      Submit_for_Approval__c: false,
      License__c: '',
      Course__c: '',
      Cost_Center__c: '',
    }
  ]



  @track columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Cost Center', fieldName: 'Cost_Item__c' }
  ]
  /*@track picklistOptions = [
    { label: 'Recruitment, Trainees and Marketing', value: 'Recruitment, Trainees and Marketing' },
    { label: 'Employee Experience and Development', value: 'Employee Experience and Development' }
  ]; */

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
    /*{ label: 'Associated Credit Card', fieldName: 'creditCardName' },
    { label: 'Credit Card Statement', fieldName: 'statementName' },
    { label: 'Receipt Type', fieldName: 'Receipt_Type__c' },
    { label: 'Associated Team Member', fieldName: 'teamMemberName' },
    { label: 'License', fieldName: 'licenseName' },
    { label: 'Event', fieldName: 'courseName' },*/
    // a column called "Multiple Team Members type checkbox"
    { label: 'Multiple Team Members', type: 'text' },
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
  /*handleSubcategorySelect(event) {
    let selectedSubcategoryId = event.target.value;
    this.fetchSubcategoryName(selectedSubcategoryId)
    .catch(error => {
        console.error('Error in handleSubcategorySelect: ', error);
    });
  }

  
  handleCreditCardSelect(event) {
    let selectedCreditCardId = event.target.value;
    this.fetchCreditCardName(selectedCreditCardId);
  }
  
  handleStatementSelect(event) {
    let selectedStatementId = event.target.value;
    this.fetchStatementName(selectedStatementId);
  }
  
  handleTeamMemberSelect(event) {
    let selectedTeamMemberId = event.target.value;
    this.fetchTeamMemberName(selectedTeamMemberId);
  }
  
  handleLicenseSelect(event) {
    let selectedLicenseId = event.target.value;
    this.fetchLicenseName(selectedLicenseId);
  }
  
  handleCourseSelect(event) {
    let selectedCourseId = event.target.value;
    this.fetchCourseName(selectedCourseId);
  }
  
*/



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
    }/*
        // Reset visibility of sections based on transaction type
        switch (this.transactionType) {
            case 'License':
                this.isTeamMemberVisible = false;
                this.isEventVisible = false;
                this.isTeamMemberIconVisible = false;
                break;
            case 'Event':
                this.isTeamMemberVisible = false;
                this.isLicenseVisible = false;
                this.isTeamMemberIconVisible = false;
                break;
        }
    }*/
}

handleRecordTypeChange(event) {
  this.recordType = event.detail.value;
  console.log('recordType: ' + this.recordType);
}


  handleOtherExpenseTypeChange(event) {
    this.otherExpenseType = event.detail.value;
    

  }


  handleNextClick() {


    if (!this.creditCardStatement) {
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
  }

  /* handleNextClick() {

    if (!this.creditCardStatement) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Warning',
          message: 'Please, Select a Credit Card Statement before proceeding.',
          variant: 'warning'
        })
      );
      return;
    }

    this.isTransactionCardVisible = false;
    this.isExpenseCardVisible = true;
    switch (this.transactionType) {
      case 'License':
        this.isLicenseVisible = true;
        this.isTeamMemberVisible = false;
        this.isEventVisible = false;
        this.isTeamMemberIconVisible = false;
      console.log('License');

        break;
      case 'Event':
        this.isEventVisible = true;
        this.isTeamMemberVisible = false;
        this.isLicenseVisible = false;
        this.isTeamMemberIconVisible = false;
      console.log('Event');


        break;
      case 'Other Expense':

        if (!this.creditCardStatement) {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Warning',
              message: 'Please, Select a Credit Card Statement before proceeding.',
              variant: 'warning'
            })
          );
          return;
        }
        switch (this.otherExpenseType) {
          case 'One':
            this.isTeamMemberVisible = true;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = false;
            this.transactionType = 'Other Expense';
            console.log('One');
            break;
          case 'Multiple Team Members':
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = true;
            this.transactionType = 'Other Expense';
            console.log('Multiple Team Members');
            break;
          case 'None':
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = false;
            this.transactionType = 'Other Expense';
            console.log('None');
            break;
          default:
            this.isExpenseCardVisible = false;
            this.isTransactionCardVisible = true;
            console.log('default Other Expense');
            this.dispatchEvent(
              new ShowToastEvent({
                title: 'Selection Error',
                message: 'Please, select how many team members the expense will have.',
                variant: 'warning'
              })
            )
        }
        break;
      default:
        console.log('General default');
        this.isExpenseCardVisible = false;
        this.isTransactionCardVisible = true;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Selection Error',
            message: 'Please, select a transaction type.',
            variant: 'warning'
          })
        )

    }
  } */


  // END OF TRANSACTION TYPE CARD HANDLERS
  // ------------------------------------------------------------------------------------------------------------------------








  // ------------------------------------------------------------------------------------------------------------------------
  // START EXPENSE FORM CARD HANDLERS

  handleDateChange(event) {
    const index = event.target.dataset.index
    const transactionDate = event.target.value
    this.expenses[index].Transaction_Date__c = transactionDate

    // Fetch the budget if the amount and subcategory are set
    if (
      this.expenses[index].Amount_Spent__c &&
      this.expenses[index].Subcategory__c
    ) {
      // console.log('Calling fetchBudget from handleDateChange')
      this.fetchBudget(
        this.expenses[index].Subcategory__c,
        transactionDate,
        index
      )
    }
  }

  handleNameChange(event) {
    const expenseIndex = event.target.dataset.index
    this.expenses[expenseIndex].Name = event.target.value
  }

  handleSubcategoryChange(event) {
    this.selectedSubcategory = event.target.value
    console.log('Subcategory changed:', this.selectedSubcategory)
    const expenseIndex = event.target.dataset.index
    this.expenses[expenseIndex].Subcategory__c = event.target.value

    getCategory({ subcategoryId: event.target.value })
      .then(category => {
        if (category === 'Recruitment, Trainees and Marketing') {
          this.expenses[expenseIndex].RecordTypeId =
            this.recordTypeMap['Recruitment, Trainees and Marketing']
          this.expenses[expenseIndex].OwnerId = this.recruitmentOwnerMetadata
        } else if (category === 'Employee Experience and Development') {
          this.expenses[expenseIndex].RecordTypeId =
            this.recordTypeMap['Employee Experience and Development']
          this.expenses[expenseIndex].OwnerId = this.employeeOwnerMetadata
        }
      })
      .catch(error => {
        // console.error('Error fetching category:', error)
      })
  }


  handleAmountChange(event) {
    const expenseIndex = parseInt(event.target.dataset.index, 10)
    if (
      isNaN(expenseIndex) ||
      expenseIndex < 0 ||
      expenseIndex >= this.expenses.length
    ) {
      // console.error('Invalid expense index:', event.target.dataset.index)
      return
    }

    const expense = this.expenses[expenseIndex]
    if (!expense) {
      // console.error('No expense found at index:', expenseIndex)
      return
    }

    // Update the expense amount
    expense.Amount_Spent__c = event.target.value
    this.expenses = [...this.expenses] // Ensure the change is reactive

    // Ensure date and subcategory are set before fetching budget
    if (!expense.Transaction_Date__c || !expense.Subcategory__c) {
      // console.log('Cannot fetch budget, date or subcategory not set.')
      return
    }

    // Convert the date string to a Date object
    let transactionDate = new Date(expense.Transaction_Date__c)
    // console.log('Calling fetchBudget from handleAmountChange')
    // Fetch the Budget record each time Amount_Spent__c changes
    this.fetchBudget(
      expense.Subcategory__c,
      transactionDate,
      expenseIndex
    ).catch(error => {
      // Print the error to the console
      //  console.error('Error fetching budget: ', error)
    })
  }

  handleCreditCardChange(event) {
    const expenseIndex = event.target.dataset.index
    this.expenses[expenseIndex].Associated_Credit_Card__c = event.target.value
  }

  
  handleCreditCardStatementChange(event) {
    if(Array.isArray(event.detail.value) && event.detail.value.length > 0) {
      this.creditCardStatement = event.detail.value[0];
    } else {
      this.creditCardStatement = event.detail.value;
    }
    this.updateExpensesWithCreditCardStatement();
  }
  
  updateExpensesWithCreditCardStatement() {
    // Iterate over expenses and update Credit_Card_Statement__c if necessary
    this.expenses = this.expenses.map(expense => {
      if (!expense.Credit_Card_Statement__c) {
        return { ...expense, Credit_Card_Statement__c: this.creditCardStatement };
      } else {
        return expense;
      }
    });
  }
  

  

  handleTeamMemberChange(event) {
    const expenseIndex = event.target.dataset.index
    this.expenses[expenseIndex].Associated_Team_Member__c = event.target.value
  }

  handleLicenseChange(event) {
    const expenseIndex = event.target.dataset.index
    this.expenses[expenseIndex].License__c = event.target.value
  }

  handleEventChange(event) {
    const expenseIndex = event.target.dataset.index
    this.expenses[expenseIndex].Course__c = event.target.value
  }

  handleReceiptTypeChange(event) {
    const expenseIndex = this.expenses.findIndex(
      expense => expense.index === event.target.dataset.index
    )
    this.expenses[expenseIndex].Receipt_Type__c = event.detail.value
  }

  handlePaymentMethodChange(event) {
    const expenseIndex = event.target.dataset.index
    this.expenses[expenseIndex].Payment_Method__c = event.target.value
  }

  handleSaveExpenses() {

    saveExpenses({ expenses: this.transactions.map(({ Id, ...rest }) => rest) })
      .then(result => {
        // Handle successful save
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Expenses saved successfully',
            variant: 'success'
          })
        )
        // Reset the expenses array to the initial state
        this.expenses = [
          {
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
        ]
        // Clear selected team members after successful save
        this.selectedTeamMembers = []
        // Reset the transaction array to the initial state
        this.transactions = []
        // Reset the Total Amount Spent to zero
        this.totalAmountSpentApproved = 0
        this.totalAmountSpentPending = 0
        this.existAmountSpentInPending = false
        
      })
      .catch(error => {
        // Handle error
        let message = 'An error occurred while trying to save the expenses.'
        console.log("Expenses to be saved: ", this.expenses);
  
        if (
          error.body.message.includes(
            'REQUIRED_FIELD_MISSING, Required fields are missing: [Subcategory]'
          )
        ) {
          message =
            'Please make sure to fill out the Subcategory field before saving.'
        }
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error saving expenses',
            message: message,
            variant: 'error'
          })
        )
      })
  }
  
  /*handleDeleteRow(event) {
    // Get the index of the row to be deleted
    const rowIndex = event.target.dataset.index;
    // Remove the row from the expenses array
    this.expenses = this.expenses.filter((expense, index) => index !== parseInt(rowIndex));
  } */

  handleDeleteRow(event) {
    const rowId = event.detail.row.Id;
  
    // Find the index of the row to be deleted
    const rowIndex = this.transactions.findIndex(transaction => transaction.Id === rowId);
  
    if (rowIndex !== -1) {
      // Remove the row from the transactions array
      this.transactions.splice(rowIndex, 1);
  
      // Update the component state to trigger a re-render
      this.transactions = [...this.transactions];
    }
  }
  
  handleTransactionRowAction(event) {
    const actionName = event.detail.action.name;
    const rowId = event.detail.row.Id;

    if (actionName === 'delete') {
        this.transactions = this.transactions.filter(transaction => transaction.Id !== rowId);
        this.calculateTotals();
    }
}


calculateTotals() {
  this.totalAmountSpentApproved = 0;
  this.totalAmountSpentPending = 0;
  this.existAmountSpentInPending = false;

  for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].Submit_for_Approval__c === false || this.transactions[i].Submit_for_Approval__c === undefined) {
          this.totalAmountSpentApproved += parseFloat(this.transactions[i].Amount_Spent__c);
      } else if (this.transactions[i].Submit_for_Approval__c === true) {
          this.totalAmountSpentPending += parseFloat(this.transactions[i].Amount_Spent__c);
          if (this.totalAmountSpentPending > 0)
          this.existAmountSpentInPending = true;
      } else if (this.totalAmountSpentPending === 0) {
          this.existAmountSpentInPending = false;
      
      
          
      }
  }
}


  
  
  
  




  handleOpenNewExpense() {
    this.isTransactionTypeModalOpen = true;
    //this.transactionType = '';
  }

// You'll need to make this function async to use await inside it.
/*async handleAddExpense() {
  // Create a new expense with the values from the form.
  let newExpense = {
    // Copy all properties from the original expense.
    ...this.expenses[0],
    
    // Add placeholder values for the names. These will be overwritten 
    // by the actual names once they're fetched.
    subcategoryName: '',
    creditCardName: '',
    statementName: '',
    teamMemberName: '',
    licenseName: '',
    courseName: '',
  };

  // Fetch the names and add them to the new expense.
  // We use Promise.all() to wait for all promises to complete before proceeding.
  await Promise.all([
    this.fetchSubcategoryName(newExpense.Subcategory__c)
      .then(name => newExpense.subcategoryName = name),
    this.fetchCreditCardName(newExpense.Associated_Credit_Card__c)
      .then(name => newExpense.creditCardName = name),
    this.fetchStatementName(newExpense.Credit_Card_Statement__c)
      .then(name => newExpense.statementName = name),
    this.fetchTeamMemberName(newExpense.Associated_Team_Member__c)
      .then(name => newExpense.teamMemberName = name),
    this.fetchLicenseName(newExpense.License__c)
      .then(name => newExpense.licenseName = name),
    this.fetchCourseName(newExpense.Course__c)
      .then(name => newExpense.courseName = name),
  ]);

  // Add the new expense to the transactions array.
  this.transactions = [...this.transactions, newExpense];

  // Clear out the form fields by resetting the single item in the `expenses` array.
  this.expenses[0] = {
    Transaction_Date__c: '',
    Name: '',
    Subcategory__c: '',
    Amount_Spent__c: '',
    Associated_Credit_Card__c: '',
    Associated_Team_Member__c: '',
    License__c: '',
    Course__c: '',
    Receipt_Type__c: ''
  };
}*/

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


// handle without data table formatted
handleAddExpense() {

  // Toast based on the transaction type selected
  switch (this.transactionType) {

    case 'License':
      // Make sure that all the required fields are filled in before saving.
      if (this.expenses[0].Transaction_Date__c === '' || this.expenses[0].Name === '' || this.expenses[0].Amount_Spent__c === '' || this.expenses[0].Associated_Credit_Card__c === '' || this.expenses[0].License__c === '' || this.expenses[0].Receipt_Type__c === '') {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Missing Required Fields',
            message: 'Please, fill in all the required fields.',
            variant: 'error'
          })
        );
        // we need to stop the process of adding
        return;
      } else {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'License Expense',
          message: 'License Expense added successfully.',
          variant: 'success'
        })
      )};
      break;

    case 'Event':
      // Make sure that all the required fields are filled in before saving.
      if (this.expenses[0].Transaction_Date__c === '' || this.expenses[0].Name === '' ||this.expenses[0].Subcategory__c === '' || this.expenses[0].Amount_Spent__c === '' || this.expenses[0].Associated_Credit_Card__c === '' || this.expenses[0].Course__c === '' || this.expenses[0].Receipt_Type__c === '') {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Missing Required Fields',
            message: 'Please, fill in all the required fields.',
            variant: 'error'
          })
        );
        // we need to stop the process of adding
        return;
      } else {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Event Expense',
          message: 'Event Expense added successfully.',
          variant: 'success'
        })
      )};
      break;

    case 'Other Expense':
      switch (this.otherExpenseType) {
        case 'One':
          // Make sure that all the required fields are filled in before saving.
          if (this.expenses[0].Transaction_Date__c === '' || this.expenses[0].Name === '' ||this.expenses[0].Subcategory__c === '' || this.expenses[0].Amount_Spent__c === '' || this.expenses[0].Associated_Credit_Card__c === '' || this.expenses[0].Associated_Team_Member__c === '' || this.expenses[0].Receipt_Type__c === '') {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Success',
              message: "One team member's expense was added successfully.",
              variant: 'success'
            })
          );
      break;
        case 'Multiple Team Members':
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Success',
              message: "Multiple team members' expense was added successfully.",
              variant: 'success'
            })
          );
          break;
        case 'None':
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Success',
              message: 'Expense for non-team members was added successfully.',
              variant: 'success'
            })
          );
          break;
    default:
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Selection Error',
          message: 'Please, select a transaction type.',
          variant: 'warning'
        })
      );
      }
    }
  

  // create a new expense with the values from the form
  let newExpense = {
      Id: Date.now().toString(),
      Transaction_Date__c: this.expenses[0].Transaction_Date__c,
      Name: this.expenses[0].Name,
      Subcategory__c: this.expenses[0].Subcategory__c,
      // Make sure Amount_Spent__c is a float and uses period as decimal point
      Amount_Spent__c: parseFloat(this.expenses[0].Amount_Spent__c.replace(',', '.')),
      Associated_Credit_Card__c: this.expenses[0].Associated_Credit_Card__c,
      Associated_Team_Member__c: this.expenses[0].Associated_Team_Member__c,
      License__c: this.expenses[0].License__c,
      Course__c: this.expenses[0].Course__c,
      Receipt_Type__c: this.expenses[0].Receipt_Type__c,
      Credit_Card_Statement__c: this.creditCardStatement,
      Submit_for_Approval__c: this.expenses[0].Submit_for_Approval__c,
      RecordTypeId: this.expenses[0].RecordTypeId,
      OwnerId: this.expenses[0].OwnerId        


  };

  // add the new expense to the transactions array
  this.transactions = [...this.transactions, newExpense];
  // create a var to hold the total amount spent
  this.totalAmountSpentApproved = 0;

  // loop through the transactions array and add up the total amount spent
  // sum only the expenses that have submit for approval as false
  for (let i = 0; i < this.transactions.length; i++) {
    if (this.transactions[i].Submit_for_Approval__c === false || this.transactions[i].Submit_for_Approval__c === undefined) {
      this.totalAmountSpentApproved += parseFloat(this.transactions[i].Amount_Spent__c);
  }
  // Else if Loop for expenses with submit for approval as true

  else if (this.transactions[i].Submit_for_Approval__c === true) {
      this.totalAmountSpentPending += parseFloat(this.transactions[i].Amount_Spent__c);
      this.existAmountSpentinPending = true;
  }


  
}
  // clear out the form fields by resetting the single item in the `expenses` array
  this.expenses[0] = {
      Transaction_Date__c: '',
      Name: '',
      Subcategory__c: '',
      Amount_Spent__c: '',
      Associated_Credit_Card__c: '',
      Associated_Team_Member__c: '',
      License__c: '',
      Course__c: '',
      Receipt_Type__c: 'Digital - Recibo'
  };

}
  

  


  // END EXPENSE FORM CARD HANDLERS
  // ------------------------------------------------------------------------------------------------------------------------




  get transactionsLength() {
    return this.transactions.length;
}




  // ------------------------------------------------------------------------------------------------------------------------
  // START MULTIPLE TEAM MEMBER MODAL HANDLERS


  

  openModal(event) {
    const index = event.target.dataset.index // New line - Get the index from the button

    getTeamMembers({ subcategory: this.selectedSubcategory })
      .then(result => {
        console.log('Result from getTeamMembers:', result)
        this.teamMembers = result
        this.filteredTeamMembers = [...result] // Copying data into filteredTeamMembers
        console.log('Team Members:', this.teamMembers)
        console.log('Filtered Team Members:', this.filteredTeamMembers)
        // New line - Copy the selected team members from the expense to the selectedTeamMembers array
        this.selectedTeamMembers = [...this.expenses[index].selectedTeamMembers]
      })
      .catch(error => {
        console.error('Error in getTeamMembers:', error)
      })

    // New lines - Store the current index to use when saving the team members
    this.currentExpenseIndex = index

    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false
    this.isTransactionTypeModalOpen = false;
  }

  /*handleComboboxChange(event) {
    this.value = event.detail.value;
    // Call Apex method
    getTeamMembers({ costCenter: this.value })
      .then(result => {
        // Do something with the result
        this.teamMembers = result;
      })
      .catch(error => {
        // Handle the error
        console.error(error);
      });
  } */

  /*handleSearch(event) {
    const searchTerm = event.target.value ? event.target.value.toLowerCase() : '';
    
    this.filteredTeamMembers = this.teamMembers.filter(teamMember => {
        if (teamMember.name) {
            console.log('teamMember.name.toLowerCase():', teamMember.name.toLowerCase());
            return teamMember.name.toLowerCase().includes(searchTerm);

        }
        return false;
        console.log('searchTerm:', searchTerm);
    });

    this.template.querySelector('lightning-datatable').data = this.filteredTeamMembers;
    console.log('this.filteredTeamMembers:', this.filteredTeamMembers);
} */



 // worked


 handleSearch(event) {

  const searchKey = event.target.value.toLowerCase();

  const filteredTeamMembers = this.teamMembers.filter(member => member.Name.toLowerCase().includes(searchKey));

  this.teamMembers = filteredTeamMembers;

  // if searchkey is deleted, then display again all the data
  if (searchKey.length === 0) {
      this.teamMembers = this.filteredTeamMembers;
  }



}





  handleRowSelection(event) {
    const selectedRows = event.detail.selectedRows
    

    // create a copy of our current selected team members
    let newSelectedTeamMembers = [...this.selectedTeamMembers]

    // iterate over each selected row
    for (let i = 0; i < selectedRows.length; i++) {
      let row = selectedRows[i]

      // check if this row is already in our selected team members
      if (!newSelectedTeamMembers.find(item => item.Id === row.Id)) {
        // if it isn't, add it
        newSelectedTeamMembers.push(row)
      }
    }

    // set our selected team members to the new list
    this.selectedTeamMembers = newSelectedTeamMembers
    console.log('this.selectedTeamMembers:', this.selectedTeamMembers)
    console.log('this.selectedTeamMembers.length:', this.selectedTeamMembers.length)
    console.log('Team Members List:', newSelectedTeamMembers)
    this.isSelectedRows = true;
  }

  handleRowAction(event) { // Selected Team Members
    const actionName = event.detail.action.name
    if (actionName === 'delete_record') {
      const id = event.detail.row.Id // note that it should be 'Id' with a capital 'I'
      this.deleteTeamMember(id)
    }
  }

  handleAddTeamMembers() {
    // Extract the IDs from the selectedTeamMembers and join them with commas
    const ids = this.selectedTeamMembers.map(member => member.Id).join(',')

    // Store the selected team members in the current expense
    this.expenses[this.currentExpenseIndex] = {
      ...this.expenses[this.currentExpenseIndex],
      Team_Members_ID_s__c: ids,
      selectedTeamMembers: [...this.selectedTeamMembers] // New line - Store the selected team members in the current expense
    }

    // Assuming 'currentExpenseIndex' is the index of the current expense being edited
    this.expenses[this.currentExpenseIndex].multipleTeamMembersAdded = true

    // Force a re-render of the component to reflect the changes
    this.expenses = [...this.expenses]

    // Show a success toast
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Team Members added successfully!',
        variant: 'success'
      })
    )

    // After adding, you might want to close the modal
    this.isModalOpen = false
  }


  deleteTeamMember(id) {
    this.selectedTeamMembers = this.selectedTeamMembers.filter(
      member => member.Id !== id
    )
    // If the selected team members is empty, set the isSelectedRows to false
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

  fetchBudget(subcategory, transactionDate, expenseIndex) {
    // If there is no amount in the expense, resolve the promise immediately
    if (!this.expenses[expenseIndex].Amount_Spent__c) {
      this.expenses[expenseIndex].showWarning = false
      return Promise.resolve()
    }

    // convert JavaScript date to Apex-friendly string
    let transactionDateObj = new Date(transactionDate)
    transactionDateObj.setHours(0, 0, 0, 0) // zero out the time portion

    const apexFriendlyDate = this.formatDateAsISOString(transactionDate)
    String(transactionDateObj.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(transactionDateObj.getDate()).padStart(2, '0')

    return getBudget({
      subcategory: subcategory,
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
          this.expenses[expenseIndex].Amount_Spent__c >
          result.Available_Amount__c
        ) {
          this.expenses[expenseIndex].Submit_for_Approval__c = true
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Warning',
              message: `You are exceeding the available amount for this month. The available amount is ${result.Available_Amount__c}. Therefore, the expense will be send to "Pending Approval".`,
              variant: 'warning'
            })
          )
        } else {
          this.expenses[expenseIndex].showWarning = false
          this.expenses[expenseIndex].Submit_for_Approval__c = false
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