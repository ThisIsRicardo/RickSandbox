// expenseGrid.js
import { LightningElement, track, wire } from 'lwc'
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

export default class ExpenseCreation extends LightningElement {

  // variable to store team member data
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
  @track transactionType = '';
  @track isTransactionTypeModalOpen = false;
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



  // ------------------------------------------------------------------------------------------------------------------------
  // START OF TRANSACTION TYPE CARD HANDLERS

  handleTransactionTypeChange(event) {
    this.transactionType = event.detail.value;
    this.isOtherExpenseSelected = false;
    if (this.transactionType === 'Other Expense') {
      this.isOtherExpenseSelected = true;
    }

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

    this.isTransactionCardVisible = false;
    this.isExpenseCardVisible = true;
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
            break;
          case 'Multiple Team Members':
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = true;
            break;
          case 'None':
            this.isTeamMemberVisible = false;
            this.isLicenseVisible = false;
            this.isEventVisible = false;
            this.isTeamMemberIconVisible = false;
            break;
          default:
            this.isExpenseCardVisible = false;
            this.isTransactionCardVisible = true;
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
  }


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
    let allValid = true
    this.expenses.forEach(expense => {
      if (
        !expense.Name ||
        !expense.Transaction_Date__c ||
        !expense.Amount_Spent__c ||
        !expense.Associated_Credit_Card__c
      ) {
        allValid = false
      }
    })

    if (!allValid) {
      // if some fields are empty, show a warning and stop execution
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Warning',
          message: 'Please fill out the required fields before saving.',
          variant: 'warning'
        })
      )
      return
    }

    saveExpenses({ expenses: this.expenses})
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

  handleDeleteRow(event) {
    // Get the index of the row to be deleted
    const rowIndex = event.target.dataset.index;
    // Remove the row from the expenses array
    this.expenses = this.expenses.filter((expense, index) => index !== parseInt(rowIndex));
  }


  handlePreviousClick() {
    this.isExpenseCardVisible = false;
    this.isTransactionCardVisible = true;
    this.isLicenseVisible = true;
    this.isEventVisible = true;
    this.isTeamMemberVisible = true;
    this.isTeamMemberIconVisible = true;
    this.handleClearRows();
  }

  handleClearRows(event) {
    this.expenses = this.expenses.slice(0, 1);
    this.triggerRender = !this.triggerRender;
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

  }

  handleTransactionTypeModal() {
    this.isTransactionTypeModalOpen = true;
  }

  handleAddExpense() {
    const id = this.expenses.length + 1;
  
    let isTeamMemberVisible, isLicenseVisible, isEventVisible, isTeamMemberIconVisible;
  
    switch (this.transactionType) {
      case 'License':
        isTeamMemberVisible = false;
        isEventVisible = false;
        isTeamMemberIconVisible = false;
        break;
      case 'Event':
        isTeamMemberVisible = false;
        isLicenseVisible = false;
        isTeamMemberIconVisible = false;
        break;
      case 'Other Expense':
        switch (this.otherExpenseType) {
          case 'One':
            isTeamMemberVisible = true;
            isLicenseVisible = false;
            isEventVisible = false;
            isTeamMemberIconVisible = false;
            break;
          case 'Multiple Team Members':
            isTeamMemberVisible = false;
            isLicenseVisible = false;
            isEventVisible = false;
            isTeamMemberIconVisible = true;
            break;
          case 'None':
            isTeamMemberVisible = false;
            isLicenseVisible = false;
            isEventVisible = false;
            isTeamMemberIconVisible = false;
            break;
        }
        break;
    }
  
    this.expenses.push({
      transactionType: this.transactionType,
      otherExpenseType: this.otherExpenseType,
      Name: '',
      Transaction_Date__c: '',
      Amount_Spent__c: '',
      Associated_Credit_Card__c: '',
      Receipt_Type__c: 'Digital - Recibo',
      Credit_Card_Statement__c: this.creditCardStatement,
      Associated_Team_Member__c: '',
      License__c: '',
      Course__c: '',
      selectedTeamMembers: [],
      multipleTeamMembersAdded: false,
      isTeamMemberVisible: isTeamMemberVisible,
      isLicenseVisible: isLicenseVisible,
      isEventVisible: isEventVisible,
      isTeamMemberIconVisible: isTeamMemberIconVisible
    });
  
    // Clear the selected team members
    this.selectedTeamMembers = []
    // Reset the selected types after use
    this.transactionType = null;
    this.otherExpenseType = null;
    this.isTransactionTypeModalOpen = false;
  }
  


  // END EXPENSE FORM CARD HANDLERS
  // ------------------------------------------------------------------------------------------------------------------------








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

  /*handleSearch(event) {
    const searchTerm = event.target.value ? event.target.value.toLowerCase() : '';
    
    this.filteredTeamMembers = this.teamMembers.filter(member => {
        if (teamMember.Name) {
            console.log('teamMember.name.toLowerCase():', teamMember.name.toLowerCase());
            return member.Name.toLowerCase().includes(searchTerm);

        }
        return false;
        console.log('searchTerm:', searchTerm);
    });

    this.template.querySelector('lightning-datatable').data = this.filteredTeamMembers;
    console.log('this.filteredTeamMembers:', this.filteredTeamMembers);
} */

 // worked
 /*handleSearch(event) {
  const searchKey = event.target.value.toLowerCase();
  const filteredTeamMembers = this.teamMembers.filter(member => member.Name.toLowerCase().includes(searchKey));
  this.teamMembers = filteredTeamMembers;
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
    this.isSelectedRows = true;
  }

  handleRowAction(event) {
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
