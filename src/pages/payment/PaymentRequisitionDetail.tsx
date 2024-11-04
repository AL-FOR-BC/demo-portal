import React from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useEffect, useState } from "react";
import { split } from "lodash";
import { options } from "../../@types/common.dto";
import { apiCreatePaymentRequisitionLines, apiPaymentRequisition, apiPaymentRequisitionDetail, apiPaymentRequisitionLines, apiUpdatePaymentRequisition } from "../../services/RequisitionServices";
import { apiBankAccountsApi, apiCurrencyCodes, apiCustomersApi, apiDimensionValue, apiGLAccountsApi, apiPaymentCategory, apiPaymentSubCategoryApi, apiWorkPlanLines, apiWorkPlans } from "../../services/CommonServices";
import { toast } from "react-toastify";
import Lines from "../../Components/ui/Lines/Lines";
import { cancelApprovalButton, getErrorMessage } from "../../utils/common";
import { ActionFormatterLines } from "../../Components/ui/Table/TableUtils";
import Swal from "sweetalert2";
import { closeModalRequisition, editRequisitionLine, modelLoadingRequisition, openModalRequisition } from "../../store/slices/Requisitions";
import { PaymentRequisition, PaymentRequisitionLineType, PaymentRequistionLinesSubmitData } from '../../@types/paymentReq.dto';
import { handleSendForApproval } from '../../actions/actions';
import HeaderMui from '../../Components/ui/Header/HeaderMui';


function PaymentRequisitionDetail() {
  const { companyId } = useAppSelector(state => state.auth.session)
  const dispatch = useAppDispatch();
  const { employeeNo, employeeName } = useAppSelector(state => state.auth.user)
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  // const [docError, setDocError] = useState('');
  // const [showError, setShowError] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState < options[] > ([]);
  const [selectedWorkPlan, setSelectedWorkPlan] = useState < options[] > ([]);
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState < options[] > ([]);
  const [selectedDimension, setSelectedDimension] = useState < options[] > ([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState < options[] > ([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState < options[] > ([]);
  const [selectedCustomer, setSelectedCustomer] = useState < options[] > ([]);
  const [selectedSupplier, setSelectedSupplier] = useState < options[] > ([]);

  const [customerOptions, setCustomerOptions] = useState < options[] > ([]);
  const [dimensionValues, setDimensionValues] = useState < options[] > ([]);
  const [paymentSubCategoryOptions, setPaymentSubCategoryOptions] = useState < options[] > ([]);
  const [bankAccountOptions, setBankAccountOptions] = useState < options[] > ([]);
  const [requestNo, setRequest] = useState < string > ('');

  const [workPlansList, setWorkPlansList] = useState < any[] > ([]);
  const [currencyOptions, setCurrencyOptions] = useState < { label: string; value: string }[] > ([]);
  const [workPlans, setWorkPlans] = useState < { label: string; value: string }[] > ([]);
  const [paymentCategoryOptions, setPaymentCategoryOptions] = useState < { label: string; value: string }[] > ([]);
  const [description, setDescription] = useState < string > ('');
  const [expectedReceiptDate, setExpectedReceiptDate] = useState < Date > (new Date());
  const [budgetCode, setBudgetCode] = useState < string > ('');
  const [status, setStatus] = useState < string > ('');
  const [paymentRequisitionLines, setPaymentRequisitionLines] = useState < PaymentRequisitionLineType[] > ([]);
  const [lineSystemId, setLineSystemId] = useState < string > ('');
  const [lineEtag, setLineEtag] = useState < string > ('');

  // -------------------------------- line modal --------------------------------
  const [glAccounts, setGlAccounts] = useState < options[] > ([]);
  const [workPlanLines, setWorkPlanLines] = useState < options[] > ([]);


  const [selectedAccountNo, setSelectedAccountNo] = useState < options[] > ([]);
  const [selectedWorkPlanLine, setSelectedWorkPlanLine] = useState < options[] > ([]);
  const accountTypeOptions: options[] = [{ label: 'G/L Account', value: 'G/L Account' }, { label: 'Fixed Asset', value: 'Fixed Asset' }, { label: 'Bank Account', value: 'Bank Account' }];
  const [accountType, setAccountType] = useState < options[] > ([]);

  const [quantity, setQuantity] = useState < number > (0);
  const [rate, setRate] = useState < number > (0);
  console.log(workPlansList, selectedSupplier)
  const fields = [
    [
      { label: 'Requisition No', type: 'text', value: requestNo, disabled: true, id: 'requestNo' },
      { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
      { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },

      {
        label: 'Project Code', type: 'select',
        options: dimensionValues,
        onChange: (e: options) => {

          if (paymentRequisitionLines.length > 0) {
            Swal.fire({
              title: 'Are you sure?',
              text: "Changing the department code will delete all existing lines. This action cannot be undone!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete all lines!'
            }).then((result) => {
              if (result.isConfirmed) {
                setSelectedDimension([{ label: e.label, value: e.value }])
                quickUpdate({
                  project: e.value
                })
                setSelectedWorkPlan([{ label: '', value: '' }])
                setBudgetCode('')
              }
            })
          } else if (selectedWorkPlan[0]?.value !== '') {
            Swal.fire({
              title: 'Are you sure?',
              text: "Changing the department code will require you to re-select the work plan",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, re-select work plan!'
            }).then((result) => {
              if (result.isConfirmed) {
                setSelectedDimension([{ label: e.label, value: e.value }])
                quickUpdate({
                  project: e.value
                })
                setSelectedWorkPlan([{ label: '', value: '' }])
                setBudgetCode('')
              }
            })
          } else {
            quickUpdate({
              project: e.value
            })
            setSelectedDimension([{ label: e.label, value: e.value }])
          }
        },
        id: 'departmentCode',
        value: selectedDimension,
      },


    ],

    [
      {
        label: 'Work Plan',
        type: 'select',
        value: selectedWorkPlan,
        onChange: (e: options) => {
          if (paymentRequisitionLines.length > 0) {
            Swal.fire({
              title: 'Are you sure?',
              text: "Changing the work plan will delete all existing lines. This action cannot be undone!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete all lines!'
            }).then((result) => {
              if (result.isConfirmed) {
                setSelectedWorkPlan([{ label: e.label, value: e.value }])
                quickUpdate({
                  workPlanNo: split(e.value, '::')[0]
                })
                setBudgetCode(workPlansList.filter(workPlan => workPlan.no == split(e.value, '::')[0])[0].budgetCode)
              }
            })
          } else {
            setSelectedWorkPlan([{ label: e.label, value: e.value }])
            setBudgetCode(workPlansList.filter(workPlan => workPlan.no == split(e.value, '::')[0])[0].budgetCode)
          }
        },
        options: workPlans.filter(plan => split(plan.value, "::")[1] == selectedDimension[0]?.value),
        id: 'workPlan',
      },

      {
        label: 'Payment Category',
        type: 'select',
        value: selectedPaymentCategory,
        options: paymentCategoryOptions,
        onChange: async (e: options) => {
          setSelectedPaymentCategory([{ label: e.label, value: e.value }])
          quickUpdate({
            paymentCategory: e.value
          })
          setPaymentSubCategoryOptions([])
          const res = await apiPaymentSubCategoryApi(companyId)
          let paymentSubCategoryOptions: options[] = [];
          res.data.value.map((e) => {
            paymentSubCategoryOptions.push({ label: `${e.paymentType}::${e.name}`, value: e.code })
          });
          setPaymentSubCategoryOptions(paymentSubCategoryOptions.filter(sub => split(sub.label, '::')[0] == e.value))
          setSelectedSubCategory([])
          setSelectedCustomer([])
          setSelectedBankAccount([])
        },
        id: 'paymentCategory',
      }, {
        label: 'Payment Subcategory',
        type: 'select',
        value: selectedSubCategory,
        options: paymentSubCategoryOptions,
        onChange: (e: options) => {
          setSelectedSubCategory([{ label: e.label, value: e.value }])
          quickUpdate({
            paySubcategory: e.value
          })
        },
        id: 'subCategory',
      },

      ...(
        selectedPaymentCategory[0]?.value === 'IMPREST' || selectedPaymentCategory[0]?.value === 'PETTY CASH'
          ? [
            {
              label: 'Payee',
              type: 'select',
              value: selectedCustomer,
              options: customerOptions,
              onChange: (e: options) => setSelectedCustomer([{ label: e.label, value: e.value }]),
              id: 'payee',
            }
          ]
          : selectedPaymentCategory[0]?.value === 'BANK'
            ? [
              {
                label: 'Bank Account',
                type: 'select',
                value: selectedBankAccount,
                options: bankAccountOptions,
                onChange: (e: options) => setSelectedBankAccount([{ label: e.label, value: e.value }]),
                id: 'bankAccount',
              }
            ]
            : selectedPaymentCategory[0]?.value === 'SUPPLIER'
              ? [
                // {
                //   label: 'Supplier No',
                //   type: 'text',
                //   value: selectedSupplier,
                //   disabled: true,
                //   id: 'supplierNo'
                // }
              ]
              : []
      )

    ],
    // Third row of inputs
    [
      ...(
        selectedPaymentCategory[0]?.value === "IMPREST" ?
          [
            {
              label: 'Work Plan',
              type: 'select',
              value: selectedWorkPlan,
              onChange: (e: options) => setSelectedWorkPlan([{ label: e.label, value: e.value }]),
              options: workPlans.filter(plan => split(plan.value, "::")[1] == selectedDimension[0]?.value),
              id: 'workPlan',
            },

          ] : []
      ),

      {
        label: 'Budget Code',
        type: 'text',
        value: budgetCode,
        disabled: true,
        id: 'budgetCode'
      },

      {
        label: 'Currency',
        type: 'select',
        value: selectedCurrency,
        options: currencyOptions,
        onChange: (e: options) => {
          setSelectedCurrency([{ label: e.label, value: e.value }])
          quickUpdate({
            currencyCode: e.value
          })
        },
        id: 'currency',
      },

      {
        label: "Status",
        type: 'text', value: status,
        disabled: true,
        id: 'docStatus'
      },
      {
        label: 'Document Date',
        type: 'date',
        value: expectedReceiptDate,
        onChange: (e: Date) => {
          setExpectedReceiptDate(e)
        },
        onBlur: (e: Date) => {
          quickUpdate({
            expectedReceiptDate: e.toISOString()
          })
        },
        id: 'documentDate',
      },
      {
        label: 'Purpose',
        type: 'textarea',
        value: description,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setDescription(e.target.value)
        },
        onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
          quickUpdate({
            purpose: e.target.value
          })
        },
        id: 'purpose',
        rows: 2,
      },


    ],

  ];
  const populateData = async () => {
    try {
      setIsLoading(true)
      if (id) {

        const filterQueryPayetail = `$expand=paymentRequestLines`
        const res = await apiPaymentRequisitionDetail(companyId, id, filterQueryPayetail);
        const resData = res.data as PaymentRequisition
        console.log(resData)
        if (resData.no) {
          setRequest(resData.no)
          setDescription(resData.purpose)
          // setExpectedReceiptDate(resData.expectedReceiptDate)
          setSelectedDimension([{ label: resData.project, value: resData.project }])
          setSelectedCurrency([{ label: resData.currencyCode, value: resData.currencyCode }])
          setSelectedPaymentCategory([{ label: resData.paymentCategory, value: resData.paymentCategory }])
          if (resData.paymentCategory == 'IMPREST' || resData.paymentCategory == 'PETTY CASH') {
            setSelectedCustomer([{ label: `${resData.payeeNo}::${resData.payeeName}`, value: resData.payeeNo }])
          } else if (resData.paymentCategory == 'BANK' || resData.paymentCategory == 'BANK TRANSFER') {
            setSelectedBankAccount([{ label: `${resData.payeeNo}::${resData.payeeName}`, value: resData.payeeNo }])
          } else if (resData.paymentCategory == 'SUPPLIER') {
            setSelectedSupplier([{ label: `${resData.payeeNo}::${resData.payeeName}`, value: resData.payeeNo }])
          }


          setSelectedCurrency(resData.currencyCode ? [{ label: resData.currencyCode, value: resData.currencyCode }] : [{ label: 'UGX', value: '' }]);
          setStatus(resData.status)
          setPaymentRequisitionLines(resData.paymentRequestLines)
        }



        const resCurrencyCodes = await apiCurrencyCodes(companyId);
        let currencyOptions = [{ label: 'UGX', value: '' }]; // Add UGX as the first option
        resCurrencyCodes.data.value.map((e) => {
          currencyOptions.push({ label: e.code, value: e.code });
        });
        setCurrencyOptions(currencyOptions);

        const resWorkPlans = await apiWorkPlans(companyId);
        setWorkPlansList(resWorkPlans.data.value)
        let workPlansOptions: options[] = [];
        resWorkPlans.data.value.map(plan => {
          workPlansOptions.push({ label: `${plan.no}::${plan.description}`, value: `${plan.no}::${plan.shortcutDimension1Code}` })
          if (plan.no === resData.workPlanNo) {
            if (plan.shortcutDimension1Code === resData.project) {
              setSelectedWorkPlan([{ label: `${plan.no}::${plan.description}`, value: `${plan.no}::${plan.shortcutDimension1Code}` }])
              setBudgetCode(resWorkPlans.data.value.filter(workPlan => workPlan.no == plan.no)[0].budgetCode)
            }
          }
        })
        setWorkPlans(workPlansOptions)

        const resPaymentSubCategory = await apiPaymentSubCategoryApi(companyId);
        let paymentSubCategoryOptions: options[] = [];
        resPaymentSubCategory.data.value.map((e) => {
          paymentSubCategoryOptions.push({ label: `${e.paymentType}::${e.name}`, value: e.code })
        });
        setPaymentSubCategoryOptions(paymentSubCategoryOptions.filter(sub => split(sub.label, '::')[0] == resData.paymentCategory))

        const paymentSubCategory = paymentSubCategoryOptions.filter(sub => sub.value == resData.paySubcategory)
        setSelectedSubCategory(paymentSubCategory)



        const resPaymentCategory = await apiPaymentCategory(companyId);
        let paymentCategoryOptions: options[] = [];
        resPaymentCategory.data.value.map((e) => {
          paymentCategoryOptions.push({ label: e.description, value: e.code })
        });
        setPaymentCategoryOptions(paymentCategoryOptions);


        const dimensionFilter = `&$filter=globalDimensionNo eq 1`
        const resDimensionValues = await apiDimensionValue(companyId, dimensionFilter);
        let dimensionValues: options[] = [];
        resDimensionValues.data.value.map((e) => {
          dimensionValues.push({ label: `${e.code}::${e.name}`, value: e.code })
          if (e.code === resData.project) {
            setSelectedDimension([{ label: `${e.code}::${e.name}`, value: e.code }])
          }
        });
        setDimensionValues(dimensionValues)

        const customerFilter = `&$filter=staff eq true`
        const resCustomers = await apiCustomersApi(companyId, customerFilter);
        let customerOptions: options[] = [];
        resCustomers.data.value.map((e) => {
          customerOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
        });
        setCustomerOptions(customerOptions)


        const resBankAccounts = await apiBankAccountsApi(companyId);
        let bankAccountOptions: options[] = [];
        resBankAccounts.data.value.map((e) => {
          bankAccountOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
        });
        setBankAccountOptions(bankAccountOptions)

        const glAccounts = await apiGLAccountsApi(companyId);
        let glAccountsOptions: options[] = [];
        glAccounts.data.value.map((e) => {
          glAccountsOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
        });
        setGlAccounts(glAccountsOptions)

      }



    } catch (error) {
      toast.error(`Error fetching data requisitions:${error}`)
    } finally {
      setIsLoading(false)
    }

  }



  useEffect(() => {


    populateData();
  }, [])
  const columns =
    status == "Open"
      ? [
        {
          dataField: "accountType",
          text: "Account Type",
          sort: true,
        },
        {
          dataField: "accountNo",
          text: "Account No",
          sort: true,
        },
        {
          dataField: "accountName",
          text: "Account Name",
          sort: true,
        },
        {
          dataField: "description",
          text: "Description",
          sort: true,
        },
        {
          dataField: "quantity",
          text: "Quantity",
          sort: true,
        },
        {
          dataField: "rate",
          text: "Rate",
          sort: true,
          formatter: (cell) => {
            return parseInt(cell).toLocaleString()
          },
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
          formatter: (cell) => {
            return parseInt(cell).toLocaleString()
          },
        },
        {
          dataField: "action",
          isDummyField: true,
          text: "Action",
          formatter: (cellContent, row) => {
            console.log("Cell Content:", cellContent);
            return (
              <ActionFormatterLines
                row={row}
                companyId={companyId}
                apiHandler={apiPaymentRequisitionLines}
                handleEditLine={handleEditLine}
                handleDeleteLine={handleDelteLine}
                populateData={populateData}
              />
            )
          }
        },


      ]
      : [
        {
          dataField: "accountType",
          text: "Account Type",
          sort: true,
        },
        {
          dataField: "accountNo",
          text: "Account No",
          sort: true,
        },
        {
          dataField: "accountName",
          text: "Account Name",
          sort: true,
        },
        {
          dataField: "description",
          text: "Description",
          sort: true,
        },
        {
          dataField: "quantity",
          text: "Quantity",
          sort: true,
        },
        {
          dataField: "rate",
          text: "Rate",
          sort: true,
          formatter: (cell) => {
            return parseInt(cell).toLocaleString()
          },
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
          formatter: (cell) => {
            return parseInt(cell).toLocaleString()
          },
        },
      ]
  const modalFields = [[
    {
      label: "Account Type",
      type: "select",
      value: accountType,
      options: accountTypeOptions,
      readOnly: true, disabled: false,
      onChange: async (e: options) => {
        setSelectedAccountNo([])
        setSelectedWorkPlanLine([])
        setAccountType([{ label: e.label, value: e.value }])
        if (e.value == 'Bank Account') {
          const bankAccount = await apiBankAccountsApi(companyId);
          let bankAccountOptions: options[] = [];
          bankAccount.data.value.map((e) => {
            bankAccountOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
          });
          setGlAccounts(bankAccountOptions)
        } else {
          const glAccounts = await apiGLAccountsApi(companyId);
          let glAccountsOptions: options[] = [];
          glAccounts.data.value.map((e) => {
            glAccountsOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
          });
          setGlAccounts(glAccountsOptions)
        }
      }
      ,

      style: { backgroundColor: 'grey' }
    },
    {
      label: "Account No", type: "select", value: selectedAccountNo,
      onChange: async (e: options) => {
        setSelectedWorkPlanLine([])
        setSelectedAccountNo([{ label: e.label, value: e.value }])
        const filterQuery = `$filter=workPlanNo eq '${split(selectedWorkPlan[0].value, '::')[0]}' and accountNo eq '${e?.value}'`
        const workPlanLines = await apiWorkPlanLines(companyId, filterQuery);
        let workPlanLinesOptions: options[] = [];
        workPlanLines.data.value.map((e) => {
          workPlanLinesOptions.push({
            label: e.entryNo + ':: ' + e.activityDescription,
            value: `${e.entryNo}`
          })
        });
        setWorkPlanLines(workPlanLinesOptions)
      }
      , options: glAccounts, isSearchable: true
    },
    ...(
      selectedPaymentCategory[0]?.value === 'IMPREST' || selectedPaymentCategory[0]?.value === 'PETTY CASH' || selectedPaymentCategory[0]?.value === 'BANK TRANSFER' || selectedPaymentCategory[0]?.value === 'BANK' || selectedPaymentCategory[0]?.value === 'SUPPLIER'
        ? [
          {
            label: "Work Entry No",
            type: "select",
            value: selectedWorkPlanLine,
            options: workPlanLines,
            disabled: false,
            onChange: (e: options) => setSelectedWorkPlanLine([{ label: e.label, value: e.value }]),

          },
        ]
        : []
    ),


    {
      label: "Quantity",
      type: "number",
      value: quantity,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) < 0) {
          toast.error('Quantity cannot be negative')
          return
        }
        setQuantity(Number(e.target.value))
      }
    },
    {
      label: "Rate",
      type: "text",
      value: rate.toLocaleString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) < 0) {
          toast.error('Rate cannot be negative')
          return
        }
        setRate(Number(e.target.value.replace(/,/g, '')))
      }
    },
    {
      label: "Description",
      type: "textarea",
      value: description,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value),
      rows: 2
    }

  ],

  ]
  const clearModalFields = () => {
    setAccountType([])
    setSelectedAccountNo([])
    setSelectedWorkPlanLine([])
    setQuantity(0)
    setRate(0)
    setDescription("")
    setWorkPlanLines([])
    setLineSystemId('')
    setLineEtag('')

  }

  const updateLineAfterBudgetCheck = async (systemId: string, etag: string) => {
    try {
      const commonData: PaymentRequistionLinesSubmitData = {
        description: description,
        quantity: parseInt(quantity.toString()),
        rate: parseInt(rate.toString()),
        workPlanEntryNo: Number(selectedWorkPlanLine[0]?.value)
      };

      // if (selectedPaymentCategory[0]?.value === 'IMPREST') {
      //   commonData.workPlanEntryNo = parseInt(selectedWorkPlanLine[0]?.value);
      // }

      const res = await apiPaymentRequisitionLines(companyId, 'PATCH', commonData, systemId, etag);

      if (res.status === 200) {
        toast.success('Line added successfully');
        populateData()
      }
    } catch (error) {
      toast.error(`Error updating line: ${getErrorMessage(error)}`);
    }
  }

  const handleSubmitLines = async () => {

    if (selectedAccountNo[0]?.value == '' || selectedWorkPlanLine[0]?.value == '' || quantity == 0 || rate == 0) {
      const missingField = selectedAccountNo[0]?.value == '' ? 'Account No' : selectedWorkPlanLine[0]?.value == '' ? 'Work Plan Line' : quantity == 0 ? 'Quantity' : 'Rate'
      toast.error(`Please fill in the missing field: ${missingField}`)
      return
    }
    try {
      const data: PaymentRequistionLinesSubmitData = {
        accountNo: selectedAccountNo[0]?.value,
        accountType: accountType[0]?.value,
        documentType: 'Payment Requisition',
        workPlanNo: split(selectedWorkPlan[0].value, '::')[0],
        documentNo: requestNo,
      }
      const res = await apiCreatePaymentRequisitionLines(companyId, data)
      if (res.status == 201) {
        updateLineAfterBudgetCheck(res.data.systemId, res.data['@odata.etag'])
        // toast.success('Line added successfully')
        populateData()
        dispatch(closeModalRequisition())
        clearModalFields()

      }
    } catch (error) {
      toast.error(`Error adding line:${getErrorMessage(error)}`)
    }
  }
  const handleDelteLine = async (row: any) => {
    console.log(row)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resDelteLine = await apiPaymentRequisitionLines(companyId, "DELETE", undefined, row.systemId, row["@odata.etag"]);
        if (resDelteLine.status == 204) {
          toast.success("Line deleted successfully")
        }
      }
    })
  }

  const handleEditLine = async (row: any) => {
    dispatch(openModalRequisition())
    dispatch(modelLoadingRequisition(true))
    dispatch(editRequisitionLine(true))
    console.log("Row data new", row)
    setAccountType([])
    setSelectedAccountNo([])
    setQuantity(0)
    setRate(0)
    setSelectedWorkPlanLine([])
    setDescription("")

    setLineSystemId(row.systemId)
    setLineEtag(row['@odata.etag'])

    const filterQuery = `$filter=workPlanNo eq '${split(selectedWorkPlan[0].value, '::')[0]}' and accountNo eq '${row.accountNo}'`
    const workPlanEntryNoRes = await apiWorkPlanLines(companyId, filterQuery);
    const workPlanLines = workPlanEntryNoRes.data.value.map(plan => ({ label: `${plan.entryNo}::${plan.activityDescription}`, value: `${plan.entryNo}` }));
    const workPlanEntryNo = workPlanLines.filter(e => e.value === row.workPlanEntryNo.toString());
    workPlanEntryNo.length > 0 ? setSelectedWorkPlanLine([{ label: workPlanEntryNo[0].label, value: workPlanEntryNo[0].value }]) : setSelectedWorkPlanLine([{ label: '', value: '' }]);

    setAccountType([{ label: row.accountType, value: row.accountType }])
    setSelectedAccountNo([{ label: row.accountNo, value: row.accountNo }])
    setQuantity(row.quantity)
    setRate(row.rate)
    setDescription(row.description)

    if (row.accountType == 'Bank Account') {
      const bankAccount = await apiBankAccountsApi(companyId);
      let bankAccountOptions: options[] = [];
      bankAccount.data.value.map((e) => {
        bankAccountOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
      });
      setGlAccounts(bankAccountOptions)
    } else {
      const glAccounts = await apiGLAccountsApi(companyId);
      let glAccountsOptions: options[] = [];
      glAccounts.data.value.map((e) => {
        glAccountsOptions.push({ label: e.name, value: e.no })
      });
      setGlAccounts(glAccountsOptions)
    }
    dispatch(modelLoadingRequisition(false))
  }

  const handleSubmitUpdatedLine = async () => {
    if (selectedAccountNo[0]?.value == '' || selectedWorkPlanLine[0]?.value == '' || quantity == 0 || rate == 0) {
      const missingField = selectedAccountNo[0]?.value == '' ? 'Account No' : selectedWorkPlanLine[0]?.value == '' ? 'Work Plan Line' : quantity == 0 ? 'Quantity' : 'Rate'
      toast.error(`Please fill in the missing field: ${missingField}`)
      return
    }
    try {
      const data: PaymentRequistionLinesSubmitData = {
        accountNo: selectedAccountNo[0]?.value,
        accountType: accountType[0]?.value,
        documentType: 'Payment Requisition',
        workPlanNo: split(selectedWorkPlan[0].value, '::')[0],
        documentNo: requestNo,
        rate: parseInt(rate.toString()),
        quantity: parseInt(quantity.toString()),
        description: description,
        workPlanEntryNo: Number(selectedWorkPlanLine[0]?.value)
      }
      console.log("data", data)
      console.log("lineEtag", lineEtag)
      const res = await apiPaymentRequisitionLines(companyId, 'PATCH', data, lineSystemId, lineEtag)
      if (res.status == 200) {
        toast.success('Line updated successfully')
        populateData()
        dispatch(closeModalRequisition())
        clearModalFields()
      }
    } catch (error) {
      toast.error(`Error updating line:${error}`)
    }
  }

  const handleDeletePaymentRequisition = async () => {
    const response = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    if (response.isConfirmed) {
      try {
        const response = await apiPaymentRequisition(companyId, 'DELETE', undefined, undefined, id)
        if (response.status == 204) {
          toast.success('Payment Requisition deleted successfully')
          navigate('/payment-requisitions');

        }

      }
      catch (error) {
        toast.error(`Error deleting Payment Requisition:${error}`)
      }
    }
  }

  const quickUpdate = async (kwargs) => {
    try {
      if (id) {
        const response = await apiUpdatePaymentRequisition(companyId, id, {
          ...kwargs,
          expectedReceiptDate: kwargs.expectedReceiptDate ? kwargs.expectedReceiptDate.toISOString() : undefined
        }, '*');
        if (response.status == 200) {
          toast.success("Updated successfully");
        }
      }
    } catch (error) {
      toast.error(`Error updating: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleValidateHeaderFields = () => {
    // if (
    //   (selectedWorkPlan[0]?.value == '' || selectedWorkPlan[0]?.value == null || selectedWorkPlan[0]?.value == undefined) ||
    //   (selectedPaymentCategory[0]?.value == '' || selectedPaymentCategory[0]?.value == null || selectedPaymentCategory[0]?.value == undefined) ||
    //   (selectedCurrency[0]?.value == '' || selectedCurrency[0]?.value == null || selectedCurrency[0]?.value == undefined) ||
    //   (selectedDimension[0]?.value == '' || selectedDimension[0]?.value == null || selectedDimension[0]?.value == undefined)) {
    //   const missingField = (selectedAccountNo[0]?.value == '' || selectedAccountNo[0]?.value == null || selectedAccountNo[0]?.value == undefined) ? 'Account No' :
    //     (selectedWorkPlan[0]?.value == '' || selectedWorkPlan[0]?.value == null || selectedWorkPlan[0]?.value == undefined) ? 'Work Plan' :
    //       (selectedPaymentCategory[0]?.value == '' || selectedPaymentCategory[0]?.value == null || selectedPaymentCategory[0]?.value == undefined) ? 'Payment Category' :
    //         (selectedCurrency[0]?.value == '' || selectedCurrency[0]?.value == null || selectedCurrency[0]?.value == undefined) ? 'Currency' :
    //           (selectedDimension[0]?.value == '' || selectedDimension[0]?.value == null || selectedDimension[0]?.value == undefined) ? 'Dimension' : '';
    //   toast.error(`Please fill in the missing field: ${missingField}`)

    //   return false
    // }
    return true
  }
  return (
    <>
      <HeaderMui
        title="Payment Requisition Detail"
        subtitle='Purchase Requisition Detail'
        breadcrumbItem='Payment Requisition Detail'
        documentType='Payment Requisition'
        requestNo={requestNo}
        companyId={companyId}
        fields={fields}
        isLoading={isLoading}
        // setIsLoading={setIsLoading}
        // docError={docError}    
        handleBack={() => navigate('/payment-requisitions')}
        status={status}
        pageType='detail'
        handleCancelApprovalRequest={
          async () => {
            const documentNo = requestNo;
            const action = 'cancelPaymentHeaderApprovalRequest'
            await cancelApprovalButton({ companyId, data: { documentNo }, action, populateDoc: populateData, documentLines: paymentRequisitionLines });
          }}
        handleSendApprovalRequest={async () => {
          const documentNo = requestNo;
          const documentLines = paymentRequisitionLines;
          const link = 'sendPaymtHeaderApprovalReqs'

          await handleSendForApproval(documentNo, documentLines, companyId, link, populateData);
        }}
        handleDeletePurchaseRequisition={handleDeletePaymentRequisition}

        lines={
          <Lines
            title="Payment Requisition Lines"
            subTitle="Payment Requisition Lines"
            breadcrumbItem="Payment Requisition Lines"
            addLink=""
            addLabel=""
            iconClassName=""
            noDataMessage="No lines found"
            isLoading={isLoading}
            clearLineFields={clearModalFields}
            handleValidateHeaderFields={handleValidateHeaderFields}
            data={paymentRequisitionLines}
            columns={columns}
            status={status}
            modalFields={modalFields}
            handleSubmitLines={handleSubmitLines}
            handleDeleteLines={handleDelteLine}
            handleSubmitUpdatedLine={handleSubmitUpdatedLine}

          />
        }


      />

    </>
  )
}

export default PaymentRequisitionDetail
