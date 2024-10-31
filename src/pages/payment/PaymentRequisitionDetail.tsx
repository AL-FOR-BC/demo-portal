import React from 'react'
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Components/ui/Header/Header";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useEffect, useState } from "react";
import { split } from "lodash";
import { options } from "../../@types/common.dto";
import { apiCreatePaymentRequisitionLines, apiPaymentRequisition, apiPaymentRequisitionDetail, apiPaymentRequisitionLines } from "../../services/RequisitionServices";
import { apiBankAccountsApi, apiCurrencyCodes, apiCustomersApi, apiDimensionValue, apiGLAccountsApi, apiPaymentCategory, apiPaymentSubCategoryApi, apiWorkPlanLines, apiWorkPlans } from "../../services/CommonServices";
import { toast } from "react-toastify";
import Lines from "../../Components/ui/Lines/Lines";
import { cancelApprovalButton } from "../../utils/common";
import { ActionFormatterLines } from "../../Components/ui/Table/TableUtils";
import Swal from "sweetalert2";
import { closeModalPurchaseReq, editPurchaseReqLine, modelLoadingPurchaseReq, openModalPurchaseReq } from "../../store/slices/Requisitions";
import { PaymentRequisition, PaymentRequisitionLineType, PaymentRequistionLinesSubmitData } from '../../@types/paymentReq.dto';
import { handleSendForApproval } from '../../actions/actions';


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


  const [customerOptions, setCustomerOptions] = useState < options[] > ([]);
  const [dimensionValues, setDimensionValues] = useState < options[] > ([]);
  const [paymentSubCategory, setPaymentSubCategory] = useState < options[] > ([]);
  const [bankAccountOptions, setBankAccountOptions] = useState < options[] > ([]);
  const [requestNo, setRequest] = useState < string > ('');

  const [currencyOptions, setCurrencyOptions] = useState < { label: string; value: string }[] > ([]);
  const [workPlans, setWorkPlans] = useState < { label: string; value: string }[] > ([]);
  const [paymentCategoryOptions, setPaymentCategoryOptions] = useState < { label: string; value: string }[] > ([]);
  const [description, setDescription] = useState < string > ('');
  const [expectedReceiptDate, setExpectedReceiptDate] = useState < Date > (new Date());
  // const [budgetCode, setBudgetCode] = useState < string > ('');
  const [status, setStatus] = useState < string > ('');
  const [paymentRequisitionLines, setPaymentRequisitionLines] = useState < PaymentRequisitionLineType[] > ([]);

  // -------------------------------- line modal --------------------------------
  const [glAccounts, setGlAccounts] = useState < options[] > ([]);
  const [workPlanLines, setWorkPlanLines] = useState < options[] > ([]);


  const [selectedAccountNo, setSelectedAccountNo] = useState < options[] > ([]);
  const [selectedWorkPlanLine, setSelectedWorkPlanLine] = useState < options[] > ([]);
  const accountTypeOptions: options[] = [{ label: 'G/L Account', value: 'G/L Account' }, { label: 'Fixed Asset', value: 'Fixed Asset' }, { label: 'Bank Account', value: 'Bank Account' }];
  const [accountType, setAccountType] = useState < options[] > ([]);

  const [quantity, setQuantity] = useState < number > (0);
  const [rate, setRate] = useState < number > (0);

  const fields = [
    // First row of inputs
    [
      { label: 'Requisition No', type: 'text', value: requestNo, disabled: true, id: 'requestNo' },
      { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
      { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },
      {
        label: 'Document Date',
        type: 'date',
        value: expectedReceiptDate,
        onChange: (e: Date) => setExpectedReceiptDate(e),
        id: 'documentDate',
      },
    ],

    [

      {
        label: 'Department Code', type: 'select',
        options: dimensionValues,
        onChange: (e: options) => setSelectedDimension([{ label: e.label, value: e.value }]),
        id: 'departmentCode',
        value: selectedDimension,
      },

      {
        label: 'Payment Category',
        type: 'select',
        value: selectedPaymentCategory,
        options: paymentCategoryOptions,
        onChange: (e: options) => {
          setSelectedPaymentCategory([{ label: e.label, value: e.value }])
          setSelectedSubCategory([])
          setSelectedCustomer([])
          setSelectedBankAccount([])
        },
        id: 'paymentCategory',
      }, {
        label: 'Payment Subcategory',
        type: 'select',
        value: selectedSubCategory,
        options: paymentSubCategory.filter(sub => sub.value == selectedPaymentCategory[0]?.value),
        onChange: (e: options) => setSelectedSubCategory([{ label: e.label, value: e.value }]),
        id: 'subCategory',
      },

      ...(
        selectedPaymentCategory[0]?.value === 'IMPREST'
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
        label: 'Currency',
        type: 'select',
        value: selectedCurrency,
        options: currencyOptions,
        onChange: (e: options) => setSelectedCurrency([{ label: e.label, value: e.value }]),
        id: 'currency',
      },

      {
        label: "Status",
        type: 'text', value: status,
        disabled: true,
        id: 'docStatus'
      },
      {
        label: 'Purpose',
        type: 'textarea',
        value: description,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value),
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
          setSelectedSubCategory([{ label: resData.paySubcategory, value: resData.paySubcategory }])
          if (resData.paymentCategory == 'IMPREST') {
            setSelectedCustomer([{ label: resData.payeeName, value: resData.payeeNo }])
          } else if (resData.paymentCategory == 'BANK') {
            setSelectedBankAccount([{ label: `${resData.payeeName}`, value: resData.payeeNo }])
          }

          setSelectedCurrency(resData.currencyCode ? [{ label: resData.currencyCode, value: resData.currencyCode }] : [{ label: 'UGX', value: '' }]);

          setSelectedWorkPlan([{ label: `${resData.workPlanNo}::${resData.budgetCode}`, value: `${resData.workPlanNo}::${resData.budgetCode}` }])
          setDimensionValues([{ label: resData.project, value: resData.project }])
          // setBudgetCode(resData.budgetCode)
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
        setWorkPlans(resWorkPlans.data.value.map(plan => ({ label: `${plan.no}::${plan.description}`, value: `${plan.no}::${plan.shortcutDimension1Code}` })));


        const resPaymentSubCategory = await apiPaymentSubCategoryApi(companyId);
        let paymentSubCategoryOptions: options[] = [];
        resPaymentSubCategory.data.value.map((e) => {
          paymentSubCategoryOptions.push({ label: e.name, value: e.code })
        });
        setPaymentSubCategory(paymentSubCategoryOptions);


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
          glAccountsOptions.push({ label: e.name, value: e.no })
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
          formatter: (row) => (
            <ActionFormatterLines
              row={row}
              companyId={companyId}
              apiHandler={apiPaymentRequisitionLines}
              handleEditLine={handleEditLine}
              handleDeleteLine={handleDelteLine}
              populateData={populateData}
            />
          )

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
            glAccountsOptions.push({ label: e.name, value: e.no })
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
      selectedPaymentCategory[0]?.value === 'IMPREST'
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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))
    },
    {
      label: "Rate",
      type: "text",
      value: rate.toLocaleString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRate(Number(e.target.value.replace(/,/g, '')))
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
  }

  const updateLineAfterBudgetCheck = async (systemId: string, etag: string) => {
    try {
      const commonData: PaymentRequistionLinesSubmitData = {
        description: description,
        quantity: parseInt(quantity.toString()),
        rate: parseInt(rate.toString()),
      };

      if (selectedPaymentCategory[0]?.value === 'IMPREST') {
        commonData.workPlanEntryNo = parseInt(selectedWorkPlanLine[0]?.value);
      }

      const res = await apiPaymentRequisitionLines(companyId, 'PATCH', commonData, systemId, etag);

      if (res.status === 200) {
        toast.success('Line updated successfully');
        // populateData()
      }
    } catch (error) {
      toast.error(`Error updating line: ${error}`);
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
        toast.success('Line added successfully')
        populateData()
        dispatch(closeModalPurchaseReq())
        clearModalFields()

      }
    } catch (error) {
      toast.error(`Error adding line:${error}`)
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
    dispatch(openModalPurchaseReq())
    dispatch(modelLoadingPurchaseReq(true))
    dispatch(editPurchaseReqLine(true))
    console.log("Row data new", row)
    setAccountType([])
    setSelectedAccountNo([])
    setQuantity(0)
    setRate(0)
    setSelectedWorkPlanLine([])
    setDescription("")

    setAccountType([{ label: row.accountType, value: row.accountType }])
    setSelectedAccountNo([{ label: row.accountNo, value: row.accountNo }])
    setQuantity(row.quantity)
    setRate(row.rate)
    setSelectedWorkPlanLine([{ label: row.workPlanEntryNo, value: row.workPlan }])
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
    dispatch(modelLoadingPurchaseReq(false))
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
        description: description
      }
      const res = await apiPaymentRequisitionLines(companyId, 'PATCH', data, paymentRequisitionLines[0].systemId, paymentRequisitionLines[0]['@odata.etag'])
      if (res.status == 200) {
        toast.success('Line updated successfully')
        populateData()
        dispatch(closeModalPurchaseReq())
        clearModalFields()

        populateData()
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
  return (
    <>
      <Header title="Payment Requisition Detail"
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
            handleValidateHeaderFields={() => true}
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
