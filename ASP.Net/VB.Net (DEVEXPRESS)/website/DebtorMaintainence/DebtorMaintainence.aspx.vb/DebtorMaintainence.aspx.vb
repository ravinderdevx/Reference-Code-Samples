Imports System.IO
Imports System.Windows.Forms
Imports DevExpress.Web
Imports Entities
Imports App.BusinessLayer
Imports System.Xml




Public Class DebtorsMaintainence
    Inherits System.Web.UI.Page
    Dim RG As New clsRegality

    Dim _baseResponse As New BaseResponse
    Dim isLevel0 As Boolean
    Dim isLevel1 As Boolean
    Dim isLevel2 As Boolean
    Dim UserIsSupervisor As Boolean
    Dim lStatus As String
    Dim lCLimit As String
    Dim lBranchCode As String
    Dim lLanguage As String

    Dim _DebtorMaintainence As DebtorsMaintainenceBusinessLayer = New DebtorsMaintainenceBusinessLayer

    Private Sub hud_PreInit(sender As Object, e As System.EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub

    Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)

        If hdWhichButton.Value = "Submit" Then
            cmdBtn_Click()
        End If

        If hdWhichButton.Value = "CheckIdNumber" Then
            CheckIdNumber()
        End If

        If hdWhichButton.Value = "Lookup" Then
            grdDebtorsSearch.DataBind()
        End If

        If hdWhichButton.Value = "ClearPopup" Then
            ClearPopup()
        End If

        If hdWhichButton.Value = "DebtorSelected" Then
            GetSelectedDebtorsDetails()
        End If

        If hdWhichButton.Value = "XmlData" Then
            cmdGetBereauData_Click()
        End If

        If hdWhichButton.Value = "ReportingData" Then
            cmdReportingData_Click()
        End If
    End Sub

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim url As String = Request.Url.AbsoluteUri

        If Not HttpContext.Current.IsDebuggingEnabled Then
            If Session("username") = "" Then
                If Not IsCallback Then
                    Response.Redirect("~/Intranet/Default.aspx")
                Else
                    ASPxWebControl.RedirectOnCallback("~/Intranet/Default.aspx")
                End If
            End If
        Else
            Session("username") = "Adam"
        End If


        '**************** End Initalize Session Values ************

        'isLevel2 = True

        If Not IsPostBack Then
            If isLevel0 = True Then
                cboStatus.ReadOnly = True
                txtCreditLimit.ReadOnly = True
                'txtCardNumber1.Enabled = False
                ''tP(15).Enabled = False
                'txtItcRating.Enabled = False
                ''cboCRate.Enabled = False

                Label1.Caption = "You DO NOT have sufficient permission to access Administration Fields."
            ElseIf isLevel1 = True Then
                cboStatus.ReadOnly = False
                txtCreditLimit.ReadOnly = False
                'txtCardNumber1.Enabled = True
                ''tP(15).Enabled = True
                'txtItcRating.Enabled = True
                ''cboCRate.Enabled = True

                Label1.Caption = "You have limited permission to access Administration Fields."
            ElseIf isLevel2 = True Then
                cboStatus.ReadOnly = False
                txtCreditLimit.ReadOnly = False
                'txtCardNumber1.Enabled = True
                ''tP(15).Enabled = True
                'txtItcRating.Enabled = True
                ''cboCRate.Enabled = True

                Label1.Caption = "You have permission to access Administration Fields."
            End If

            If UserIsSupervisor = True Then
                chkDontSend.ReadOnly = False
                chkAgeAnalysis.ReadOnly = False
            End If

            InitializePersonalValues()

            IntializeAddressValues()

            IntializeBankingValues()

            InitialiseSearchFields()
        End If
    End Sub

    Protected Sub cmdBtn_Click()
        Dim _DebtorsMaintainenceRequest As New DebtorsMaintainenceRequest

        Dim PersonalDetails As New DebtorsPersonalDetails
        PersonalDetails = SetDebtorsPersonalDetails()

        Dim AddressDetails As New DebtorsAddressDetails
        AddressDetails = SetDebtorsAddressDetails()

        Dim EmploymentDetails As New DebtorsEmploymentDetails
        EmploymentDetails = SetDebtorsEmploymentDetails()

        Dim BankingDetails As New DebtorsBankingDetails
        BankingDetails = SetDebtorsBankingDetails()

        Dim CommonDetails As New DebtorsCommonDetails
        CommonDetails = SetDebtorsCommonDetails()

        Dim UserPermissionDetails As New UserPermissionDetails
        UserPermissionDetails = SetUserPermissionDetails()

        _DebtorsMaintainenceRequest.PersonalDetails = PersonalDetails
        _DebtorsMaintainenceRequest.AddressDetails = AddressDetails
        _DebtorsMaintainenceRequest.EmploymentDetails = EmploymentDetails
        _DebtorsMaintainenceRequest.BankingDetails = BankingDetails
        _DebtorsMaintainenceRequest.CommonDetails = CommonDetails
        _DebtorsMaintainenceRequest.UserPermissions = UserPermissionDetails

        Dim SavePersonalDetailsResponse As New BaseResponse

        SavePersonalDetailsResponse = _DebtorMaintainence.SavePersonalDetails(_DebtorsMaintainenceRequest, Session("username"))

        If (SavePersonalDetailsResponse.Success = True) Then
            ClearForm()
            dxPopUpError.HeaderText = "Success"
        Else
            dxPopUpError.HeaderText = "Error"
        End If

        lblError.Text = SavePersonalDetailsResponse.Message
        dxPopUpError.ShowOnPageLoad = True
    End Sub

    Protected Sub cmdGetBereauData_Click()

        If txtAccountNumber.Text <> "" Then
            Dim XmlData As String
            XmlData = _DebtorMaintainence.GetDebtorXmlData(txtAccountNumber.Text)

            If Not XmlData Is Nothing Then
                BureauDataBox.Text = XmlData
            End If
        End If
    End Sub

    Protected Sub cmdReportingData_Click()
        Dim AccountNumber As String

        AccountNumber = txtAccountNumber.Text

        If AccountNumber = "" Then
            Exit Sub
        End If

        Session.Remove("_AgeAnalysis")
        Session.Remove("_DebtorChanges")
        Session.Remove("_ContactHistory")
        Session.Remove("_Transactions")
        Session.Remove("_PaymentPlans")
        Session.Remove("_ClosingBalances")


        Dim _NewDebtorData As DebtorsReporting
        _NewDebtorData = _DebtorMaintainence.GetDebtorsReportingData(AccountNumber)

        If Not IsNothing(_NewDebtorData) Then
            Session("_AgeAnalysis") = _NewDebtorData.AgeAnalysis
            Session("_DebtorChanges") = _NewDebtorData.ChangeHistory
            Session("_ContactHistory") = _NewDebtorData.ContactHistory
            Session("_Transactions") = _NewDebtorData.Transactions
            Session("_PaymentPlans") = _NewDebtorData.PaymentPlans
            Session("_ClosingBalances") = _NewDebtorData.ClosingBalances
        End If

        Dim tmpGrd As ASPxGridView
        tmpGrd = ASPxNavBar1.Groups.FindByName("AgeAnalysis").Items(0).FindControl("grdAgeAnalysis")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("ChangeHistory").Items(0).FindControl("grdAccountHistory")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("ContactHistory").Items(0).FindControl("grdHistory")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("Transactions").Items(0).FindControl("grdTransactions")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("PaymentPlans").Items(0).FindControl("grdPaymentPlans")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("ClosingBalances").Items(0).FindControl("grdClosingBalances")
        tmpGrd.DataBind()
    End Sub

    Private Sub ClearForm()
        txtAccountNumber.Text = ""
        txtEmailAddress.Text = ""
        txtIdNumber.Text = ""
        ''txtContactNumber.Text = ""
        cboTitle.Value = ""
        cboPromo.Value = ""
        txtFirstName.Text = ""
        cboStatementDelivery.Value = ""
        txtMiddleName.Text = ""
        chkCardProtection.Checked = False
        txtSurname.Text = ""

        chkAutoIncrease.Checked = False

        txtDOB.Value = ""
        chkAgeAnalysis.Checked = False
        cboSex.Value = ""
        cboBranch.Value = ""
        txtHomeTel1.Text = ""
        cboLanguage.Value = ""
        txtCellularNumber.Text = ""
        chkDontSend.Checked = False
        cboStatus.Value = ""
        txtCreditLimit.Text = ""
        txtCardNumber1.Text = ""
        txtItcRating.Text = ""


        txtCRAddressLine1.Text = ""
        txtCRAddressLine2.Text = ""
        txtCRAddressLine3.Text = ""
        txtCRAddressLine4.Text = ""
        cboCRProvince.Value = ""
        txtCRPostalCode.Text = ""
        txtPOAAddressLine1.Text = ""
        txtPOAAddressLine2.Text = ""
        txtPOAAddressLine3.Text = ""
        txtPOAPostalCode.Text = ""


        tE_0.Text = ""
        Work1.Text = ""
        tE_2.Text = ""
        tE_3.Text = ""
        tE_4.Text = ""
        tE_5.Text = ""
        tE_6.Text = ""
        LOS.Text = ""
        tE_7.Text = ""
        tE_8.Text = ""


        cboTOA.Value = ""
        cboBName.Value = ""
        tB_0.Text = ""
        tB_1.Text = ""
        tB_2.Text = ""
        cboPType.Value = ""

        txtLastActive.Text = ""
        txtDateOfCreation.Text = ""
        txtDateOfDefault.Text = ""
        txtDateLegalReported.Text = ""
        txtWOReported.Text = ""

        txtNewNotes.Text = ""
        txtOldNotes.Text = ""

        cboStatus.Text = "PENDING"
        txtCreditLimit.Text = "0"

        Dim FullPath As String
        FullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "XML\debtors_xml_data.xml")

        Dim fileExists As Boolean = File.Exists(FullPath)

        If fileExists Then
            System.IO.File.Delete(FullPath)
        End If

        BureaEnquiresGridview.DataBind()
        defaultGridview.DataBind()
        judgementGridview.DataBind()
        CPAGridview.DataBind()
        NLRGridview.DataBind()
        TUExceptionGridview.DataBind()

        ClearReportingGrids()
    End Sub

    Private Sub ClearReportingGrids()
        Session.Remove("_Transactions")
        Session.Remove("_ClosingBalances")
        Session.Remove("_AgeAnalysis")
        Session.Remove("_PaymentPlans")
        Session.Remove("_ContactHistory")
        Session.Remove("_DebtorChanges")

        Dim tmpGrd As ASPxGridView
        tmpGrd = ASPxNavBar1.Groups.FindByName("AgeAnalysis").Items(0).FindControl("grdAgeAnalysis")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("ChangeHistory").Items(0).FindControl("grdAccountHistory")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("ContactHistory").Items(0).FindControl("grdHistory")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("Transactions").Items(0).FindControl("grdTransactions")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("PaymentPlans").Items(0).FindControl("grdPaymentPlans")
        tmpGrd.DataBind()

        tmpGrd = ASPxNavBar1.Groups.FindByName("ClosingBalances").Items(0).FindControl("grdClosingBalances")
        tmpGrd.DataBind()
    End Sub

    Private Sub ClearPopup()
        Dim _tmpCBO As ASPxComboBox
        _tmpCBO = LookupMain.FindControl("cboSearchType")
        _tmpCBO.Items.Clear()

        _tmpCBO.Items.Add("ACCOUNT NUMBER")
        _tmpCBO.Items.Add("ID NUMBER")
        _tmpCBO.Items.Add("LAST NAME")
        _tmpCBO.Items.Add("CELLPHONE")

        ASPxEdit.ClearEditorsInContainer(LookupMain)
    End Sub

    Private Sub CheckIdNumber()

        'If isRecord((Mi & 5), "debtor_personal", "id_number", txtIdNumber.Text) Then
        '    Er "", "This ID number already exists. Please check and re-enter it."
        'Sel
        '    Exit Sub
        'End If

        If Not _DebtorMaintainence.ValidID(txtIdNumber.Text) Then
            dxPopUpError.HeaderText = "Error"
            lblError.Text = "The ID number is invalid."
            dxPopUpError.ShowOnPageLoad = True

            txtDOB.Value = ""
            cboSex.Value = ""
            Exit Sub

        End If

        txtDOB.Text = Mid$(txtIdNumber.Text, 5, 2) & "/" & Mid$(txtIdNumber.Text, 3, 2) & "/" & "19" & Mid$(txtIdNumber.Text, 1, 2)
        'tP(8) = AgeCalc(txtDOB, 0)

        If Val(Mid$(txtIdNumber.Text, 7, 1)) >= 5 Then
            cboSex.Text = "MALE"
        Else
            cboSex.Text = "FEMALE"
        End If

        cboTitle.Focus()




    End Sub

    Private Sub GetSelectedDebtorsDetails()
        Dim selectedValues = New List(Of Object)()

        selectedValues = Nothing

        selectedValues = grdDebtorsSearch.GetSelectedFieldValues("account_number")
        If selectedValues.Count > 0 Then
            Dim strAccNum As String = selectedValues(selectedValues.Count - 1)

            Dim _debtorDetailsResponse As New DebtorDetailsResponse
            _debtorDetailsResponse = _DebtorMaintainence.GetSelectedDebtorsDetails(strAccNum)

            If (_debtorDetailsResponse.Success = False) Then
                dxPopUpError.HeaderText = "Error"
                lblError.Text = _debtorDetailsResponse.Message
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            Dim _dt As DataTable = _debtorDetailsResponse.GetSelectedDebtorsResponse

            If _dt.Rows.Count = 0 Then
                Exit Sub
            End If

            txtAccountNumber.Text = strAccNum
            txtIdNumber.Text = _dt.Rows(_dt.Rows.Count - 1)("id_number")
            cboTitle.Text = _dt.Rows(_dt.Rows.Count - 1)("title")
            txtFirstName.Text = _dt.Rows(_dt.Rows.Count - 1)("first_name")
            txtMiddleName.Text = _dt.Rows(_dt.Rows.Count - 1)("middle_name")
            txtSurname.Text = _dt.Rows(_dt.Rows.Count - 1)("last_name")
            txtDOB.Text = _dt.Rows(_dt.Rows.Count - 1)("date_of_birth").ToString
            cboSex.Text = _dt.Rows(_dt.Rows.Count - 1)("gender")


            txtHomeTel1.Text = _dt.Rows(_dt.Rows.Count - 1)("home_telephone").ToString



            txtCellularNumber.Text = _dt.Rows(_dt.Rows.Count - 1)("cell_number").ToString

            chkDontSend.Checked = _dt.Rows(_dt.Rows.Count - 1)("dont_send_sms")
            txtEmailAddress.Text = _dt.Rows(_dt.Rows.Count - 1)("email_address")



            cboPromo.Text = If(_dt.Rows(_dt.Rows.Count - 1)("send_promos"), "YES", "NO")
            cboStatementDelivery.Text = _dt.Rows(_dt.Rows.Count - 1)("statement_delivery")

            'chkCardProtection.Checked = _dt.Rows(_dt.Rows.Count - 1)("card_protection")
            If IsDBNull(_dt.Rows(_dt.Rows.Count - 1)("card_protection")) Then
                chkCardProtection.Checked = False
            Else
                chkCardProtection.Checked = _dt.Rows(_dt.Rows.Count - 1)("card_protection")
            End If


            'chkAutoIncrease.Checked = _dt.Rows(_dt.Rows.Count - 1)("auto_increase")
            If IsDBNull(_dt.Rows(_dt.Rows.Count - 1)("auto_increase")) Then
                chkAutoIncrease.Checked = False
            Else
                chkAutoIncrease.Checked = _dt.Rows(_dt.Rows.Count - 1)("auto_increase")
            End If

            'chkAgeAnalysis.Checked = _dt.Rows(_dt.Rows.Count - 1)("show_on_age_analysis")
            If IsDBNull(_dt.Rows(_dt.Rows.Count - 1)("show_on_age_analysis")) Then
                chkAgeAnalysis.Checked = False
            Else
                chkAgeAnalysis.Checked = _dt.Rows(_dt.Rows.Count - 1)("show_on_age_analysis")
            End If

            cboBranch.Text = _dt.Rows(_dt.Rows.Count - 1)("branch_code").ToString
            cboLanguage.Text = _dt.Rows(_dt.Rows.Count - 1)("preferred_language").ToString
            cboStatus.Text = _dt.Rows(_dt.Rows.Count - 1)("status").ToString

            If IsDBNull(_dt.Rows(_dt.Rows.Count - 1)("creditlimit")) Then
                txtCreditLimit.Text = "0"
            Else
                txtCreditLimit.Text = _dt.Rows(_dt.Rows.Count - 1)("creditlimit").ToString
            End If

            txtCardNumber1.Text = _dt.Rows(_dt.Rows.Count - 1)("cardnum").ToString

            txtItcRating.Text = _dt.Rows(_dt.Rows.Count - 1)("itc_rating").ToString
            txtOldNotes.Text = _dt.Rows(_dt.Rows.Count - 1)("debtor_notes").ToString
            txtNewNotes.Text = ""

            '********************** Set Address Details ******************************

            txtCRAddressLine1.Text = _dt.Rows(_dt.Rows.Count - 1)("current_address_1").ToString
            txtCRAddressLine2.Text = _dt.Rows(_dt.Rows.Count - 1)("current_address_2").ToString
            txtCRAddressLine3.Text = _dt.Rows(_dt.Rows.Count - 1)("current_address_3").ToString
            txtCRAddressLine4.Text = _dt.Rows(_dt.Rows.Count - 1)("current_address_4").ToString
            cboCRProvince.Text = _dt.Rows(_dt.Rows.Count - 1)("current_address_province").ToString
            txtCRPostalCode.Text = _dt.Rows(_dt.Rows.Count - 1)("current_address_postal_code").ToString

            txtPOAAddressLine1.Text = _dt.Rows(_dt.Rows.Count - 1)("postal_address_1").ToString
            txtPOAAddressLine2.Text = _dt.Rows(_dt.Rows.Count - 1)("postal_address_2").ToString
            txtPOAAddressLine3.Text = _dt.Rows(_dt.Rows.Count - 1)("postal_address_3").ToString
            txtPOAPostalCode.Text = _dt.Rows(_dt.Rows.Count - 1)("postal_address_postal_code").ToString


            '**********************Set Employment Details ********************************


            tE_0.Text = _dt.Rows(_dt.Rows.Count - 1)("employer").ToString
            Work1.Text = _dt.Rows(_dt.Rows.Count - 1)("employer_telephone_1").ToString
            tE_2.Text = _dt.Rows(_dt.Rows.Count - 1)("employer_address_1").ToString
            tE_3.Text = _dt.Rows(_dt.Rows.Count - 1)("employer_address_2").ToString
            tE_4.Text = _dt.Rows(_dt.Rows.Count - 1)("employer_address_3").ToString
            tE_5.Text = _dt.Rows(_dt.Rows.Count - 1)("employer_address_4").ToString
            tE_6.Text = _dt.Rows(_dt.Rows.Count - 1)("employee_number").ToString
            tE_7.Text = _dt.Rows(_dt.Rows.Count - 1)("job_description").ToString
            tE_8.Text = _dt.Rows(_dt.Rows.Count - 1)("income_amount").ToString
            LOS.Text = _dt.Rows(_dt.Rows.Count - 1)("length_of_service").ToString
            chkRageEmployee.Checked = _dt.Rows(_dt.Rows.Count - 1)("is_rage_employee")


            '**********************Set Banking Details *************************************
            cboTOA.Text = _dt.Rows(_dt.Rows.Count - 1)("type_of_account").ToString
            cboBName.Text = _dt.Rows(_dt.Rows.Count - 1)("bank_name").ToString
            tB_0.Text = _dt.Rows(_dt.Rows.Count - 1)("branch_name").ToString
            tB_1.Text = _dt.Rows(_dt.Rows.Count - 1)("branch_number").ToString
            tB_2.Text = _dt.Rows(_dt.Rows.Count - 1)("bank_account_number").ToString
            cboPType.Text = _dt.Rows(_dt.Rows.Count - 1)("payment_type").ToString

            '*********************Set Reporting Details ***********************************
            txtLastActive.Text = _dt.Rows(_dt.Rows.Count - 1)("date_last_used").ToString
            txtDateOfCreation.Text = _dt.Rows(_dt.Rows.Count - 1)("date_of_creation").ToString
            txtDateOfDefault.Text = _dt.Rows(_dt.Rows.Count - 1)("date_of_default").ToString
            txtDateLegalReported.Text = _dt.Rows(_dt.Rows.Count - 1)("date_legal_reported").ToString
            txtWOReported.Text = _dt.Rows(_dt.Rows.Count - 1)("date_write_off_reported").ToString


            '**************** T U Exception Tab ***********************************


            Dim TUFilter_dt As New DataTable
            TUFilter_dt.Columns.Add("Code")
            TUFilter_dt.Columns.Add("Description")

            Dim SBCFILTER_ARRAY As Array = {
                                "1 or more trades currently 3 months PD",
                                "1 or more trades currently 4 months PD",
                                "1 or more trades currently 5 months PD",
                                "1 or more trades currently 6-9 months PD",
                                "1 or more ML trades currently 3 months PD",
                                "1 or more ML trades currently 4 months PD",
                                "1 or more ML trades currently 5 months PD",
                                "1 or more ML trades currently 6-9 months PD",
                                "1 or more write-offs ever (AT)",
                                "1 or more write-offs ever (ML)",
                                "1 or more legal actions / collections ever (AT)",
                                "1 or more legal actions / collections ever (ML)",
                                "1 or more defaults ever",
                                "1 or more Judgements",
                                "1 or more Notices (excl Rehab) >0",
                                "1 or more adverse ever",
                                "Age of Youngest Default Admin Order at most 24 months",
                                "Deceased Filter",
                                "Zero Matches with IDV1"
                            }

            For intLoop = 1 To 19
                If _dt.Rows(_dt.Rows.Count - 1)("sbcfilter" & intLoop).ToString = "True" Or _dt.Rows(_dt.Rows.Count - 1)("sbcfilter" & intLoop).ToString = "1" Then
                    TUFilter_dt.Rows.Add(
                        "SBCFILTER" & intLoop,
                        SBCFILTER_ARRAY(intLoop - 1)
                    )
                End If
            Next


            Dim POLICYFILTER_ARRAY As Array = {
                                "Debt Counselling (DC)",
                                "Dispute (DI)",
                                "ID Unverified",
                                "ID Not Issued",
                                "Verification Surname"
            }

            For intLoop = 1 To 5
                If _dt.Rows(_dt.Rows.Count - 1)("policyfilter" & intLoop).ToString = "True" Or _dt.Rows(_dt.Rows.Count - 1)("policyfilter" & intLoop).ToString = "1" Then
                    TUFilter_dt.Rows.Add(
                        "POLICYFILTER" & intLoop,
                        POLICYFILTER_ARRAY(intLoop - 1)
                    )
                End If
            Next



            Dim EMPERICARULES_ARRAY As Array = {
                                "EmpericaScore = 0 & EmpericaExclusionCode = D",
                                "EmpericaScore = 0 & EmpericaExclusionCode = L",
                                "EmpericaScore = 0 & EmpericaExclusionCode = N",
                                "",
                                "",
                                "7 <= EmpericaScore <= 579",
                                "580 <= EmpericaScore >= 590",
                                "Level 2 Decisioning: Emperica < 7"
            }
            For intLoop = 1 To 8
                If intLoop <> 4 And intLoop <> 5 Then
                    If _dt.Rows(_dt.Rows.Count - 1)("pe0" & intLoop).ToString = "True" Or _dt.Rows(_dt.Rows.Count - 1)("pe0" & intLoop).ToString = "1" Then
                        TUFilter_dt.Rows.Add(
                            "EMPERICARULES" & intLoop,
                            EMPERICARULES_ARRAY(intLoop - 1)
                        )
                    End If
                End If
            Next


            TUExceptionGridview.DataSource = TUFilter_dt
            TUExceptionGridview.DataBind()


            lStatus = cboStatus.Text
            lCLimit = txtCreditLimit.Text
            lBranchCode = _dt.Rows(_dt.Rows.Count - 1)("branch_code").ToString
            lLanguage = _dt.Rows(_dt.Rows.Count - 1)("preferred_language").ToString


            If lBranchCode <> "" Then
                Dim _branchListDS As DataSet
                _branchListDS = _DebtorMaintainence.GetBranchList(lBranchCode)

                If Not _branchListDS Is Nothing Then
                    cboBranch.Items.Clear()

                    For Each dr As DataRow In _branchListDS.Tables(0).Rows
                        cboBranch.Items.Add(dr("branch_code") & " - " & dr("branch_name"))
                    Next
                End If
            End If


            Dim _ReportListDS As DataSet
            _ReportListDS = _DebtorMaintainence.GetReportingList(strAccNum)

            If Not _ReportListDS Is Nothing Then
                Dim Reporting_dt As New DataTable
                Reporting_dt.Columns.Add("ChangeDate")
                Reporting_dt.Columns.Add("ChangeTime")
                Reporting_dt.Columns.Add("Description")
                Reporting_dt.Columns.Add("OldValue")
                Reporting_dt.Columns.Add("NewValue")
                Reporting_dt.Columns.Add("Username")

                For Each dr As DataRow In _ReportListDS.Tables(0).Rows
                    Reporting_dt.Rows.Add(
                            dr("change_date"),
                            dr("change_time"),
                            dr("description"),
                            dr("old_value"),
                            dr("new_value"),
                            dr("username")
                        )
                Next

            End If

            Dim FullPath As String

            Dim FileName As String = "debtors_xml_data.xml"

            Dim XMLStream As String = _dt.Rows(_dt.Rows.Count - 1)("xml_data").ToString

            If XMLStream <> "" Then
                Dim DirectoryPath As String
                DirectoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "XML\")

                If Not Directory.Exists(DirectoryPath) Then
                    Directory.CreateDirectory(DirectoryPath)
                End If

                FullPath = Path.Combine(DirectoryPath, FileName)

                Dim fileExists As Boolean = File.Exists(FullPath)

                If fileExists Then
                    System.IO.File.Delete(FullPath)
                End If

                Using sw As New StreamWriter(File.Open(FullPath, FileMode.CreateNew))
                    sw.WriteLine(Replace(XMLStream, "utf-16", "utf-8"))
                End Using

                BureaEnquiresGridview.DataBind()
                defaultGridview.DataBind()
                judgementGridview.DataBind()
                NLRGridview.DataBind()
                CPAGridview.DataBind()

                BureauDataBox.Text = XMLStream

            End If

            'ClearReportingGrids()
        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = "No Details Found"
            dxPopUpError.ShowOnPageLoad = True
        End If
        LookupMain.ShowOnPageLoad = False
    End Sub

    '******************** Initalize Tabs Values ****************
    Private Sub InitializePersonalValues()

        cboTitle.Items.Add("")
        cboTitle.Items.Add("MRS")
        cboTitle.Items.Add("MR")
        cboTitle.Items.Add("MS")
        cboTitle.Items.Add("MISS")
        cboTitle.Items.Add("DR")
        cboTitle.Items.Add("MEJ")
        cboTitle.Items.Add("MEV")
        cboTitle.Items.Add("MNR")
        cboTitle.Items.Add("ADV")
        cboTitle.Items.Add("CAPT")
        cboTitle.Items.Add("COL")
        cboTitle.Items.Add("DS")
        cboTitle.Items.Add("KAPT")
        cboTitle.Items.Add("KOL")
        cboTitle.Items.Add("LADY")
        cboTitle.Items.Add("LT")
        cboTitle.Items.Add("LORD")
        cboTitle.Items.Add("MAJ")
        cboTitle.Items.Add("ME")
        cboTitle.Items.Add("PAST")
        cboTitle.Items.Add("PROF")
        cboTitle.Items.Add("REV")
        cboTitle.Items.Add("SERS")
        cboTitle.Items.Add("SGT")
        cboTitle.Items.Add("SIR")

        cboSex.Items.Add("")
        cboSex.Items.Add("FEMALE")
        cboSex.Items.Add("MALE")

        cboPromo.Items.Add("")
        cboPromo.Items.Add("YES")
        cboPromo.Items.Add("NO")

        cboStatementDelivery.Items.Add("")
        cboStatementDelivery.Items.Add("EMAIL")
        cboStatementDelivery.Items.Add("ONLINE")
        cboStatementDelivery.Items.Add("POST")

        cboStatus.Items.Add("")
        cboStatus.Items.Add("ACTIVE")
        cboStatus.Items.Add("REFERRAL")
        cboStatus.Items.Add("NA")
        cboStatus.Items.Add("BLOCKED")
        cboStatus.Items.Add("CLOSED")
        cboStatus.Items.Add("DEBT REVIEW")
        cboStatus.Items.Add("DECEASED")
        cboStatus.Items.Add("DECLINED")
        cboStatus.Items.Add("FRAUD")
        cboStatus.Items.Add("LEGAL")
        cboStatus.Items.Add("PENDING")
        cboStatus.Items.Add("SUSPENDED")
        cboStatus.Items.Add("WRITE-OFF")

        cboLanguage.Items.Add("")
        cboLanguage.Items.Add("Zulu")
        cboLanguage.Items.Add("Xhosa")
        cboLanguage.Items.Add("Afrikaans")
        cboLanguage.Items.Add("English")
        cboLanguage.Items.Add("Sepedi")
        cboLanguage.Items.Add("Setswana")
        cboLanguage.Items.Add("Sotho")
        cboLanguage.Items.Add("Tsonga")
        cboLanguage.Items.Add("Swati")
        cboLanguage.Items.Add("Venda")
        cboLanguage.Items.Add("Ndebele")

        Dim _branchListDS As DataSet
        _branchListDS = _DebtorMaintainence.GetBranchList()

        If Not _branchListDS Is Nothing Then
            For Each dr As DataRow In _branchListDS.Tables(0).Rows
                cboBranch.Items.Add(dr("branch_code") & " - " & dr("branch_name"))
            Next
        End If

        cboStatus.Text = "PENDING"
        txtCreditLimit.Text = "0"
    End Sub

    Private Sub IntializeAddressValues()



        cboCRProvince.Items.Add("EASTERN CAPE")
        cboCRProvince.Items.Add("FREE STATE")
        cboCRProvince.Items.Add("GAUTENG")
        cboCRProvince.Items.Add("KWAZULU NATAL")
        cboCRProvince.Items.Add("MPUMALANGA")
        cboCRProvince.Items.Add("NORTHERN CAPE")
        cboCRProvince.Items.Add("NORTHERN PROVINCE")
        cboCRProvince.Items.Add("NORTH WEST PROVINCE")
        cboCRProvince.Items.Add("WESTERN CAPE")





    End Sub

    Private Sub IntializeBankingValues()
        cboTOA.Items.Add("SAVINGS ACCOUNT")
        cboTOA.Items.Add("CURRENT/CHEQUE ACCOUNT")
        cboTOA.Items.Add("TRANSMISSION ACCOUNT")
        cboTOA.Items.Add("NONE")


        cboBName.Items.Add("ABN*AMRO")
        cboBName.Items.Add("ABSA BANK")
        cboBName.Items.Add("BANK OF ATHENS")
        cboBName.Items.Add("BANK WINDHOEK")
        cboBName.Items.Add("BOE BANK")
        cboBName.Items.Add("CAPE OF GOOD HOPE BANK")
        cboBName.Items.Add("CAPITEC BANK LIMITED")
        cboBName.Items.Add("CITI BANK N.A SOUTH AFRICA")
        cboBName.Items.Add("COMMERCIAL BANK OF NAMIBIA")
        cboBName.Items.Add("FIDELITY BANK LIMITED")
        cboBName.Items.Add("FIRST NATIONAL BANK")
        cboBName.Items.Add("HABIB OVERSEAS BANK LTD")
        cboBName.Items.Add("HBZ BANK")
        cboBName.Items.Add("INVESTEC BANK LIMITED")
        cboBName.Items.Add("ITHALA (STANDARD BANK)")
        cboBName.Items.Add("MEEG BANK")
        cboBName.Items.Add("MERCANTILE BANK LIMITED")
        cboBName.Items.Add("NATAL BUILDING SOCIETY")
        cboBName.Items.Add("NEDBANK LESOTHO LIMITED")
        cboBName.Items.Add("NEDBANK SWAZILAND LIMITED")
        cboBName.Items.Add("NEDBANK, PERMANENT, PEOPLES BANK")
        cboBName.Items.Add("PEP BANK")
        cboBName.Items.Add("PERMANENT BANK")
        cboBName.Items.Add("RESERVE BANK")
        cboBName.Items.Add("STANDARD BANK")
        cboBName.Items.Add("STANDARD CHARTERED BANK")
        cboBName.Items.Add("TEBA BANK")
        cboBName.Items.Add("UNIBANK LIMITED")
        cboBName.Items.Add("NONE")










        cboPType.Items.Add("DEBIT ORDER")
        cboPType.Items.Add("IN-STORE")
        cboPType.Items.Add("INTERNET PAYMENT")
        cboPType.Items.Add("DIRECT DEPOSIT")
        cboPType.Items.Add("CHEQUE")
    End Sub

    Private Sub InitialiseSearchFields()
        cboSearchType.Items.Add("ACCOUNT NUMBER")
        cboSearchType.Items.Add("ID NUMBER")
        cboSearchType.Items.Add("LAST NAME")
        cboSearchType.Items.Add("CELLPHONE")
    End Sub

    '******************** Set Debtors Details *****************

    Private Function SetDebtorsPersonalDetails() As DebtorsPersonalDetails
        Dim PersonalDetails As New DebtorsPersonalDetails

        PersonalDetails.IDNumber = txtIdNumber.Text

        PersonalDetails.AccountNumber = txtAccountNumber.Text
        PersonalDetails.Title = cboTitle.Text
        PersonalDetails.FirstName = txtFirstName.Text.ToUpper
        PersonalDetails.MiddleName = txtMiddleName.Text.ToUpper
        Dim FormattedDateOfBirth As String = txtDOB.Date.ToString("dd/MM/yyyy")
        PersonalDetails.LastName = txtSurname.Text.ToUpper
        ''PersonalDetails.DOB = txtDOB.Date
        PersonalDetails.DOB = FormattedDateOfBirth
        PersonalDetails.Gender = cboSex.Text.ToUpper
        PersonalDetails.HomeNumber1 = txtHomeTel1.Text
        PersonalDetails.CellularNumber = txtCellularNumber.Text
        PersonalDetails.DontSend = chkDontSend.Checked
        PersonalDetails.Email = txtEmailAddress.Text
        '' PersonalDetails.ContactNumber = txtContactNumber.Text
        PersonalDetails.SendPromos = If(cboPromo.Text = "YES", True, False)
        PersonalDetails.StatementDelivery = cboStatementDelivery.Text.ToUpper
        PersonalDetails.CardProtection = chkCardProtection.Checked
        PersonalDetails.AutoIncrease = chkAutoIncrease.Checked
        PersonalDetails.AgeAnalysis = chkAgeAnalysis.Checked
        PersonalDetails.BranchName = cboBranch.Text.ToUpper
        PersonalDetails.PreferredLanguage = cboLanguage.Text.ToUpper
        PersonalDetails.CurrentStatus = cboStatus.Text.ToUpper
        PersonalDetails.CreditLimit = txtCreditLimit.Text
        PersonalDetails.CardNumber1 = txtCardNumber1.Text
        PersonalDetails.ITCRating = txtItcRating.Text

        Return PersonalDetails
    End Function

    Private Function SetDebtorsAddressDetails() As DebtorsAddressDetails
        Dim AddressDetails As New DebtorsAddressDetails

        AddressDetails.tA_0 = txtCRAddressLine1.Text.ToUpper
        AddressDetails.tA_1 = txtCRAddressLine2.Text.ToUpper
        AddressDetails.tA_2 = txtCRAddressLine3.Text.ToUpper
        AddressDetails.tA_3 = txtCRAddressLine4.Text.ToUpper
        AddressDetails.cboProv1 = cboCRProvince.Text.ToUpper
        AddressDetails.tA_4 = txtCRPostalCode.Text





        AddressDetails.tA_15 = txtPOAAddressLine1.Text.ToUpper
        AddressDetails.tA_16 = txtPOAAddressLine2.Text.ToUpper
        AddressDetails.tA_17 = txtPOAAddressLine3.Text.ToUpper
        AddressDetails.tA_18 = txtPOAPostalCode.Text

        Return AddressDetails
    End Function

    Private Function SetDebtorsEmploymentDetails() As DebtorsEmploymentDetails
        Dim EmploymentDetails As New DebtorsEmploymentDetails
        EmploymentDetails.tE_0 = tE_0.Text
        EmploymentDetails.Work1 = Work1.Text
        EmploymentDetails.tE_2 = tE_2.Text.ToUpper
        EmploymentDetails.tE_3 = tE_3.Text.ToUpper
        EmploymentDetails.tE_4 = tE_4.Text.ToUpper
        EmploymentDetails.tE_5 = tE_5.Text.ToUpper
        EmploymentDetails.tE_6 = tE_6.Text
        EmploymentDetails.tE_7 = tE_7.Text.ToUpper
        EmploymentDetails.tE_8 = tE_8.Text

        EmploymentDetails.LOS = LOS.Text

        EmploymentDetails.chkRageEmployee = chkRageEmployee.Checked

        Return EmploymentDetails
    End Function

    Private Function SetDebtorsBankingDetails() As DebtorsBankingDetails
        Dim BankingDetails As New DebtorsBankingDetails
        BankingDetails.cboTOA = cboTOA.Text.ToUpper
        BankingDetails.cboBName = cboBName.Text.ToUpper
        BankingDetails.tB_0 = tB_0.Text.ToUpper
        BankingDetails.tB_1 = tB_1.Text
        BankingDetails.tB_2 = tB_2.Text
        BankingDetails.cboPType = cboPType.Text.ToUpper
        Return BankingDetails
    End Function

    Private Function SetDebtorsCommonDetails() As DebtorsCommonDetails
        Dim _DebtorsCommonDetails As New DebtorsCommonDetails
        _DebtorsCommonDetails.OldNotes = txtOldNotes.Text
        _DebtorsCommonDetails.NewNotes = txtNewNotes.Text
        '_DebtorsCommonDetails.User = txtUser.Text
        '_DebtorsCommonDetails.Password = txtPassword.Text
        '_DebtorsCommonDetails.Updated = chkUpdated.Checked
        '_DebtorsCommonDetails.ThinFileCall = chkThin.Checked
        '_DebtorsCommonDetails.ButtonValue = cmdBtn.Text

        Return _DebtorsCommonDetails
    End Function

    Private Function SetUserPermissionDetails() As UserPermissionDetails
        Dim _UserPermissionDetails As New UserPermissionDetails
        _UserPermissionDetails.isLevel0 = isLevel0
        _UserPermissionDetails.isLevel1 = isLevel1
        _UserPermissionDetails.isLevel2 = isLevel2
        _UserPermissionDetails.lStatus = lStatus
        _UserPermissionDetails.lCLimit = lCLimit
        Return _UserPermissionDetails
    End Function

    '******************** Populating Fields with XML ************************************

    Protected Sub BureauEnquiries_DataBinding(ByVal sender As Object, ByVal e As EventArgs) Handles BureaEnquiresGridview.DataBinding
        Dim FullPath As String
        FullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "XML\debtors_xml_data.xml")
        BureaEnquiresGridview.BeginUpdate()

        Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)

        Dim Enquires_dt As New DataTable

        Enquires_dt.Columns.Add("Detail")
        Enquires_dt.Columns.Add("EnquiryDate")
        Enquires_dt.Columns.Add("Subscriber")
        Enquires_dt.Columns.Add("Status")
        Enquires_dt.Columns.Add("InstallmentAmount")
        Enquires_dt.Columns.Add("MonthlySalary")

        Dim fileExists As Boolean = File.Exists(FullPath)

        If fileExists Then

            Dim xmlDoc As New XmlDocument()
            Dim xmlNodeList As XmlNodeList
            Dim xmlNode As XmlNode
            Dim xmlMainNode As XmlNode
            Dim dateOfEnquiry As String
            Dim subscriber As String
            Dim enquiryTypeCode As String
            '' Dim enquiriesListItem As ListItem
            Dim itemIndex As Integer
            Dim ppNumber As Integer
            Dim nlrNumber As Integer


            xmlDoc.Load(FullPath)

            Dim ns As XmlNamespaceManager = New XmlNamespaceManager(xmlDoc.NameTable)

            ns.AddNamespace("BereauNodes", "https://secure.transunion.co.za/TUBureau")
            xmlMainNode = xmlDoc.SelectSingleNode("//BereauNodes:EnquiriesNE50", ns)
            If Not xmlMainNode Is Nothing Then
                xmlNodeList = xmlMainNode.ChildNodes()

                If Not xmlNodeList Is Nothing Then
                    For Each xmlNode In xmlNodeList
                        itemIndex = itemIndex + 1
                        ppNumber = ppNumber + 1
                        dateOfEnquiry = xmlNode.SelectSingleNode(".//BereauNodes:DateOfEnquiry", ns).InnerText
                        enquiryTypeCode = xmlNode.SelectSingleNode(".//BereauNodes:EnquiryTypeCode", ns).InnerText
                        subscriber = xmlNode.SelectSingleNode(".//BereauNodes:Subscriber", ns).InnerText
                        Enquires_dt.Rows.Add(
                                "CPA " & itemIndex,
                                dateOfEnquiry,
                                subscriber,
                                enquiryTypeCode
                                )
                    Next xmlNode
                    xmlNodeList = Nothing
                End If
            End If

            'Get NLR entries
            xmlMainNode = xmlDoc.SelectSingleNode("//BereauNodes:NLREnquiriesME50", ns)

            If Not xmlMainNode Is Nothing Then
                xmlNodeList = xmlMainNode.ChildNodes()

                If Not xmlNodeList Is Nothing Then
                    For Each xmlNode In xmlNodeList
                        itemIndex = itemIndex + 1
                        nlrNumber = nlrNumber + 1
                        dateOfEnquiry = xmlNode.SelectSingleNode(".//BereauNodes:EnquiryDate", ns).InnerText
                        subscriber = xmlNode.SelectSingleNode(".//BereauNodes:EnquirySubscriberName", ns).InnerText

                        Enquires_dt.Rows.Add(
                            "NLR " & itemIndex,
                            dateOfEnquiry,
                            subscriber
                            )
                    Next xmlNode
                End If
            End If
        End If




        gridView.KeyFieldName = "Detail" 'data.PrimaryKey(0).ColumnName
        gridView.DataSource = Enquires_dt

        grdDebtorsSearch.EndUpdate()

        'BureaEnquiresGridview.DataSource = Enquires_dt
        'BureaEnquiresGridview.DataBind()
    End Sub

    '' Private Sub populateDefaults(FullPath As String)

    Protected Sub defaultGridview_DataBinding(ByVal sender As Object, ByVal e As EventArgs) Handles defaultGridview.DataBinding
        Try

            Dim FullPath As String
            FullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "XML\debtors_xml_data.xml")
            defaultGridview.BeginUpdate()

            Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)
            Dim default_dt As New DataTable

            default_dt.Columns.Add("Detail")
            default_dt.Columns.Add("ChangeDescription")
            default_dt.Columns.Add("CurrentBalance")
            default_dt.Columns.Add("StatusCode")


            Dim fileExists As Boolean = File.Exists(FullPath)
            If fileExists Then


                Dim xmlDoc As New XmlDocument()
                Dim xmlNodeList As XmlNodeList
                Dim root As XmlNode
                Dim xmlNode As XmlNode
                Dim xmlMainNode As XmlNode
                Dim recordSequence As String
                Dim supplierName As String
                Dim defaultAmount As String
                Dim defaultType As String
                ''Dim deafaultListItem As ListItem
                Dim itemIndex As Integer

                xmlDoc.Load(FullPath)
                Dim ns As XmlNamespaceManager = New XmlNamespaceManager(xmlDoc.NameTable)

                ns.AddNamespace("DefaultNodes", "https://secure.transunion.co.za/TUBureau")

                xmlMainNode = xmlDoc.SelectSingleNode("//DefaultNodes:DefaultsD701Part1", ns)

                If Not xmlMainNode Is Nothing Then
                    xmlNodeList = xmlMainNode.ChildNodes()

                    If Not xmlNodeList Is Nothing Then


                        For Each xmlNode In xmlNodeList
                            itemIndex = itemIndex + 1
                            recordSequence = xmlNode.SelectSingleNode(".//DefaultNodes:RecordSequence", ns).InnerText
                            supplierName = xmlNode.SelectSingleNode(".//DefaultNodes:SupplierName", ns).InnerText
                            defaultAmount = xmlNode.SelectSingleNode(".//DefaultNodes:DefaultAmount", ns).InnerText
                            defaultType = xmlNode.SelectSingleNode(".//DefaultNodes:DefaultType", ns).InnerText


                            default_dt.Rows.Add(
                            "DEFAULT " & itemIndex,
                            supplierName,
                            RG.Numb(defaultAmount),
                            defaultType
                            )

                        Next xmlNode

                        ' defaultGridview.DataSource = default_dt
                        ' defaultGridview.DataBind()
                        gridView.KeyFieldName = "Detail" 'data.PrimaryKey(0).ColumnName
                        gridView.DataSource = default_dt

                        grdDebtorsSearch.EndUpdate()
                    End If
                End If
            End If
        Catch exc As XmlException
            'MsgBox("Error while reading xml file.")
        End Try
    End Sub

    ''Private Sub populateJudgements(FullPath As String)

    Protected Sub judgementGridview_DataBinding(ByVal sender As Object, ByVal e As EventArgs) Handles judgementGridview.DataBinding
        Dim FullPath As String
        FullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "XML\debtors_xml_data.xml")

        judgementGridview.BeginUpdate()
        Try
            Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)
            Dim judgement_dt As New DataTable
            judgement_dt.Columns.Add("Detail")
            judgement_dt.Columns.Add("Date")
            judgement_dt.Columns.Add("Amount")
            judgement_dt.Columns.Add("Plaintiff")
            Dim fileExists As Boolean = File.Exists(FullPath)
            If fileExists Then


                Dim xmlDoc As New XmlDocument()
                Dim xmlNodeList As XmlNodeList
                Dim root As XmlNode
                Dim xmlNode As XmlNode
                Dim xmlMainNode As XmlNode
                Dim recordSequence As String
                Dim judgmentDate As String
                Dim Amount As String
                Dim plaintiff As String
                'Dim judgementListItem As ListItem
                Dim itemIndex As Integer

                xmlDoc.Load(FullPath)
                'root = xmlDoc.SelectSingleNode("BureauResponse")

                '            XmlNamespaceManager ns = New XmlNamespaceManager(xmlDoc.NameTable);
                'ns.AddNamespace("msbld", "http://schemas.microsoft.com/developer/msbuild/2003");
                'xmlNode node = xmlDoc.SelectSingleNode("//msbld:Compile", ns);

                Dim ns As XmlNamespaceManager = New XmlNamespaceManager(xmlDoc.NameTable)

                ns.AddNamespace("JudgeMentNodes", "https://secure.transunion.co.za/TUBureau")

                xmlMainNode = xmlDoc.SelectSingleNode("//JudgeMentNodes:JudgementsNJ07", ns)
                If Not xmlMainNode Is Nothing Then
                    xmlNodeList = xmlMainNode.ChildNodes()

                    If Not xmlNodeList Is Nothing Then


                        For Each xmlNode In xmlNodeList
                            itemIndex = itemIndex + 1
                            recordSequence = xmlNode.SelectSingleNode(".//JudgeMentNodes:RecordSeq", ns).InnerText
                            judgmentDate = xmlNode.SelectSingleNode(".//JudgeMentNodes:JudgmentDate", ns).InnerText
                            Amount = xmlNode.SelectSingleNode(".//JudgeMentNodes:Amount", ns).InnerText
                            plaintiff = xmlNode.SelectSingleNode(".//JudgeMentNodes:Plaintiff", ns).InnerText

                            judgement_dt.Rows.Add(
                            "JUDGEMENT " & itemIndex,
                            judgmentDate,
                            RG.Numb(Amount),
                            plaintiff
                            )

                        Next xmlNode
                    End If
                    gridView.KeyFieldName = "Detail" 'data.PrimaryKey(0).ColumnName
                    gridView.DataSource = judgement_dt

                    grdDebtorsSearch.EndUpdate()
                    '' judgementGridview.DataSource = judgement_dt
                    ''judgementGridview.DataBind()

                End If
            End If
        Catch exc As XmlException
            'MsgBox("Error while reading xml file.")
        End Try
    End Sub

    ''Private Sub populateAccountsInformation(FullPath As String)
    Protected Sub NLRGridview_DataBinding(ByVal sender As Object, ByVal e As EventArgs) Handles NLRGridview.DataBinding
        Dim FullPath As String
        FullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "XML\debtors_xml_data.xml")

        NLRGridview.BeginUpdate()

        Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)
        Dim NLR_dt As New DataTable
        NLR_dt.Columns.Add("Detail")
        NLR_dt.Columns.Add("Subscriber")
        NLR_dt.Columns.Add("CurrentBalance")
        NLR_dt.Columns.Add("Installment")
        NLR_dt.Columns.Add("PmtStatus")
        NLR_dt.Columns.Add("CreditLmt")
        NLR_dt.Columns.Add("CurBalance")

        Dim fileExists As Boolean = File.Exists(FullPath)
        If fileExists Then

            Dim xmlDoc As New XmlDocument()
            Dim xmlNodeList As XmlNodeList
            Dim root As XmlNode
            Dim xmlNode As XmlNode
            Dim xmlPaymentHistoryNodeList As XmlNodeList
            Dim xmlPaymentHistoryNode As XmlNode
            Dim xmlMainNode As XmlNode
            Dim subscriberName As String
            Dim currentBalance As String
            Dim instalmentAmount As String
            Dim statusCode As String
            Dim balanceOverdue As String
            Dim itemIndex As Integer

            xmlDoc.Load(FullPath)
            Dim ns As XmlNamespaceManager = New XmlNamespaceManager(xmlDoc.NameTable)

            ns.AddNamespace("NLRNodes", "https://secure.transunion.co.za/TUBureau")

            xmlMainNode = xmlDoc.SelectSingleNode(".//NLRNodes:NLRAccountsInformationM701", ns)

            If Not xmlMainNode Is Nothing Then
                xmlNodeList = xmlMainNode.ChildNodes()



                For Each xmlNode In xmlNodeList
                    itemIndex = itemIndex + 1
                    subscriberName = xmlNode.SelectSingleNode(".//NLRNodes:SubscriberName", ns).InnerText
                    currentBalance = xmlNode.SelectSingleNode(".//NLRNodes:CurrentBalance", ns).InnerText
                    instalmentAmount = xmlNode.SelectSingleNode(".//NLRNodes:InstalmentAmount", ns).InnerText
                    balanceOverdue = xmlNode.SelectSingleNode(".//NLRNodes:BalanceOverdue", ns).InnerText

                    'Get into PaymentHistory Nodes
                    xmlPaymentHistoryNodeList = xmlNode.SelectSingleNode(".//NLRNodes:PaymentHistories", ns).SelectNodes(".//NLRNodes:PaymentHistory", ns)
                    statusCode = ""
                    For Each xmlPaymentHistoryNode In xmlPaymentHistoryNodeList
                        statusCode = statusCode + xmlPaymentHistoryNode.SelectSingleNode(".//NLRNodes:StatusCode", ns).InnerText
                    Next xmlPaymentHistoryNode
                    xmlPaymentHistoryNodeList = Nothing

                    NLR_dt.Rows.Add(
                        "NLR" & itemIndex,
                        subscriberName,
                        RG.Numb(currentBalance),
                        instalmentAmount,
                        statusCode,
                        "",
                        RG.Numb(balanceOverdue)
                    )
                Next xmlNode
            End If
            ''NLRGridview.DataSource = NLR_dt
            ''NLRGridview.DataBind()
            NLRGridview.KeyFieldName = "Detail" 'data.PrimaryKey(0).ColumnName
            NLRGridview.DataSource = NLR_dt

            grdDebtorsSearch.EndUpdate()
        End If
    End Sub

    '' Private Sub populatePaymentProfiles(xmlFilePath As String)
    Protected Sub CPAGridview_DataBinding(ByVal sender As Object, ByVal e As EventArgs) Handles CPAGridview.DataBinding
        Dim FullPath As String
        FullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "XML\debtors_xml_data.xml")

        CPAGridview.BeginUpdate()
        Dim CPA_dt As New DataTable
        CPA_dt.Columns.Add("Detail")
        CPA_dt.Columns.Add("Subscriber")
        CPA_dt.Columns.Add("OpenBalance")
        CPA_dt.Columns.Add("Installment")
        CPA_dt.Columns.Add("PmtStatus")
        CPA_dt.Columns.Add("CreditLmt")
        CPA_dt.Columns.Add("CurBalance")
        Dim fileExists As Boolean = File.Exists(FullPath)
        If fileExists Then

            Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)
            Dim xmlDoc As New XmlDocument()
            Dim success As Boolean
            Dim xmlNodeList As XmlNodeList
            Dim xmlNode As XmlNode
            Dim xmlPaymentHistoryNodeList As XmlNodeList
            Dim xmlPaymentHistoriesNode As XmlNode
            Dim xmlPaymentHistoryNode As XmlNode
            Dim xmlMainNode As XmlNode
            Dim supplierName As String
            Dim openingBalance As String
            Dim instalment As String
            Dim statusCode As String
            Dim currentBalance As String
            Dim paymentProfilesListItem As ListItem
            Dim itemIndex As Integer
            Dim paymentHistoryCount As Integer

            xmlDoc.Load(FullPath)
            Dim ns As XmlNamespaceManager = New XmlNamespaceManager(xmlDoc.NameTable)

            ns.AddNamespace("CPANodes", "https://secure.transunion.co.za/TUBureau")

            xmlMainNode = xmlDoc.SelectSingleNode("//CPANodes:PaymentProfilesP701", ns)

            If Not xmlMainNode Is Nothing Then
                xmlNodeList = xmlMainNode.ChildNodes()


                If Not xmlNodeList Is Nothing Then


                    For Each xmlNode In xmlNodeList
                        itemIndex = itemIndex + 1
                        supplierName = xmlNode.SelectSingleNode(".//CPANodes:SupplierName", ns).InnerText
                        openingBalance = xmlNode.SelectSingleNode(".//CPANodes:OpeningBalance", ns).InnerText
                        instalment = xmlNode.SelectSingleNode(".//CPANodes:Instalment", ns).InnerText
                        currentBalance = xmlNode.SelectSingleNode(".//CPANodes:CurrentBalance", ns).InnerText

                        statusCode = ""

                        'Get into PaymentHistory Nodes
                        xmlPaymentHistoriesNode = xmlNode.SelectSingleNode(".//CPANodes:PaymentHistories", ns)
                        If Not xmlPaymentHistoriesNode Is Nothing Then
                            xmlPaymentHistoryNodeList = xmlPaymentHistoriesNode.ChildNodes()
                            paymentHistoryCount = 0
                            For Each xmlPaymentHistoryNode In xmlPaymentHistoryNodeList
                                statusCode = statusCode + xmlPaymentHistoryNode.SelectSingleNode(".//CPANodes:StatusCode", ns).InnerText
                                paymentHistoryCount = paymentHistoryCount + 1
                                If paymentHistoryCount = 12 Then Exit For
                            Next xmlPaymentHistoryNode

                            xmlPaymentHistoryNodeList = Nothing
                        End If


                        CPA_dt.Rows.Add(
                            "PP " & itemIndex,
                            supplierName,
                            RG.Numb(openingBalance),
                            instalment,
                            statusCode,
                            "",
                            RG.Numb(currentBalance)
                        )
                    Next xmlNode
                End If

                CPAGridview.KeyFieldName = "Detail" 'data.PrimaryKey(0).ColumnName
                CPAGridview.DataSource = CPA_dt

                grdDebtorsSearch.EndUpdate()
            End If
        End If
    End Sub


    '*********************** Grid Binding Functions ***********************************
    Protected Sub grdDebtorsSearch_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        grdDebtorsSearch.BeginUpdate()

        Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)

        Dim _tmpCBO As ASPxComboBox

        _tmpCBO = LookupMain.FindControl("cboSearchType")

        Dim _tmpTXT As ASPxTextBox

        _tmpTXT = LookupMain.FindControl("txtCriteria")

        Dim _tmpCheck As ASPxCheckBox

        _tmpCheck = LookupMain.FindControl("chkRageEmployeesOnly")

        Dim data As DataTable = _DebtorMaintainence.GetDebtors(_tmpCBO.Text, _tmpTXT.Text.ToUpper, _tmpCheck.Checked)

        gridView.KeyFieldName = "account_number" 'data.PrimaryKey(0).ColumnName
        gridView.DataSource = data

        grdDebtorsSearch.EndUpdate()
    End Sub

    Protected Sub gridAgeAnalysis_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        ' Assign the data source in grid_DataBinding
        Dim tmpGrd As ASPxGridView

        tmpGrd = ASPxNavBar1.Groups.FindByName("AgeAnalysis").Items(0).FindControl("grdAgeAnalysis")

        If IsNothing(Session("_AgeAnalysis")) Then
            tmpGrd.DataSource = Nothing
        Else
            tmpGrd.DataSource = Session("_AgeAnalysis")
        End If
    End Sub

    Protected Sub gridAccountHistory_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        ' Assign the data source in grid_DataBinding
        Dim tmpGrd As ASPxGridView
        tmpGrd = ASPxNavBar1.Groups.FindByName("ChangeHistory").Items(0).FindControl("grdAccountHistory")

        If IsNothing(Session("_DebtorChanges")) Then
            tmpGrd.DataSource = Nothing
        Else
            tmpGrd.DataSource = Session("_DebtorChanges")
        End If
    End Sub

    Protected Sub gridHistory_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        ' Assign the data source in grid_DataBinding
        Dim tmpGrd As ASPxGridView

        tmpGrd = ASPxNavBar1.Groups.FindByName("ContactHistory").Items(0).FindControl("grdHistory")
        If IsNothing(Session("_ContactHistory")) Then
            tmpGrd.DataSource = Nothing
        Else
            tmpGrd.DataSource = Session("_ContactHistory")
        End If
    End Sub

    Protected Sub gridTransactions_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        ' Assign the data source in grid_DataBinding
        Dim tmpGrd As ASPxGridView

        tmpGrd = ASPxNavBar1.Groups.FindByName("Transactions").Items(0).FindControl("grdTransactions")

        If IsNothing(Session("_Transactions")) Then
            tmpGrd.DataSource = Nothing
        Else
            tmpGrd.DataSource = Session("_Transactions")
        End If
    End Sub

    Protected Sub gridPayments_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        ' Assign the data source in grid_DataBinding
        Dim tmpGrd As ASPxGridView

        tmpGrd = ASPxNavBar1.Groups.FindByName("PaymentPlans").Items(0).FindControl("grdPaymentPlans")

        If IsNothing(Session("_PaymentPlans")) Then
            tmpGrd.DataSource = Nothing
        Else
            tmpGrd.DataSource = Session("_PaymentPlans")
        End If
    End Sub

    Protected Sub gridClosingBalances_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        ' Assign the data source in grid_DataBinding
        Dim tmpGrd As ASPxGridView

        tmpGrd = ASPxNavBar1.Groups.FindByName("ClosingBalances").Items(0).FindControl("grdClosingBalances")

        If IsNothing(Session("_ClosingBalances")) Then
            tmpGrd.DataSource = Nothing
        Else
            tmpGrd.DataSource = Session("_ClosingBalances")
        End If

    End Sub

End Class