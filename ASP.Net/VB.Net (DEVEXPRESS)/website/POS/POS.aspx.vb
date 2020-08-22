Imports DevExpress.Web
Imports abc.BusinessLayer
Imports Entities
Imports abc.DataLayer

Public Class POSAccountAssign
    Inherits System.Web.UI.Page


    Dim _POSBusinessLayer As POSBusinessLayer = New POSBusinessLayer
    Dim RG As New Utilities.clsUtil

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            Session("AccountInfo") = Nothing
            InitialiseValues()
        End If

    End Sub

    Private Sub hud_PreInit(sender As Object, e As System.EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub

    Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)

        If hdWhichButton.Value = "AutoIncrease" Then
            CheckedChanged()
        End If


        If hdWhichButton.Value = "Accept" Then
            cmdAccept_Click()
        End If

        If hdWhichButton.Value = "CheckID" Then
            txtIDNumber_KeyUp()
        End If

        If hdWhichButton.Value = "CardChanged" Then
            txtCardNumber_TextChanged()
        End If


        If hdWhichButton.Value = "clear" Then
            ClearScreen()

        End If

    End Sub

    Private Sub InitialiseValues()
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

        lblOverRide.Visible = True
        txtCardNumber.Text = ""
        ''txtCardNumber.PasswordChar = ""
        chkAutoIncrease.Checked = True

        Dim _branchListDS As DataSet
        _branchListDS = _POSBusinessLayer.GetBranchList()

        If Not _branchListDS Is Nothing Then
            For Each dr As DataRow In _branchListDS.Tables(0).Rows
                cboBranch.Items.Add(dr("branch_code") & " - " & dr("branch_name"))
            Next
        End If
    End Sub

    Private Sub ClearScreen()

        txtIDNumber.Text = ""
        txtCellphone.Text = ""
        txtFirstName.Text = ""
        txtSurname.Text = ""
        chkAutoIncrease.Checked = True
        chkLostCard.Checked = False
        txtCellphone.ReadOnly = True
        txtFirstName.ReadOnly = True
        txtSurname.ReadOnly = True
        chkAutoIncrease.Enabled = False
        chkLostCard.Enabled = False
        txtCardNumber.ReadOnly = True
        txtEmployeeNumber.ReadOnly = True

        lblOverRide.Visible = False
        'txtCardNumber.PasswordChar = "*"

        txtCardNumber.Text = ""
        txtEmployeeNumber.Text = ""

        'AccountNumber = ""
        'FirstName = ""
        'Surname = ""
        'CellPhone = ""
        'CreditLimit = 0

        txtStatus.Text = ""
        txtCreditLimit.Text = ""

        cboLanguage.Text = ""

        lbllostCardCharge.Text = ""

        lblActivate.Visible = False

        txtIDNumber.Focus()

        txtIDNumber.ReadOnly = False

    End Sub

    Private Sub CheckedChanged()
        If chkAutoIncrease.Checked = False Then
            'If MsgBox("If you take off this tick the Customer will NOT GET AN AUTOMATIC INCREASE!!!" & vbCrLf & vbCrLf &
            '          "DOES THE CUSTOMER WANT AN AUTO-INCREASE?", MsgBoxStyle.Critical + vbYesNo, "WARNING!!!") = MsgBoxResult.Yes Then
            chkAutoIncrease.Checked = True
        Else
            chkAutoIncrease.Checked = False
            'End If

        End If
    End Sub

    Private Sub txtIDNumber_KeyUp()

        Dim selfactivate As Boolean = True

        If Len(txtIDNumber.Text) = 13 Then

            If RG.ValidID(txtIDNumber.Text) = False Then
                dxPopUpError.HeaderText = "Error"
                lblError.Text = "Invalid ID Number"
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            Dim result As Debtor

            result = _POSBusinessLayer.GetSelfActivateDetails(txtIDNumber.Text)

            Dim account As New POSAccountEntites

            account.AccountNumber = result.AccountNumber
            account.FirstName = result.FirstName
            account.Surname = result.LastName
            account.CellPhone = result.ContactNumber
            account.CreditLimit = result.CreditLimit

            Session("AccountInfo") = account

            txtStatus.Text = result.CurrentStatus
            txtCreditLimit.Text = result.CreditLimit

            txtCellphone.ReadOnly = False
            txtFirstName.ReadOnly = False
            txtSurname.ReadOnly = False
            chkAutoIncrease.Enabled = True
            chkLostCard.Enabled = True
            txtCardNumber.ReadOnly = False
            txtEmployeeNumber.ReadOnly = False

            txtFirstName.Focus()

            If result.SelfActivate = False Then
                If result.ReturnMessage <> "" Then
                    dxPopUpError.HeaderText = "Error"
                    lblError.Text = result.ReturnMessage
                    dxPopUpError.ShowOnPageLoad = True
                End If
            End If

            If Val(result.PayNewCard) = 0 Then
                If result.SelfActivate = False Then
                    cmdClear.Enabled = True
                    lblActivate.Visible = True
                Else

                    lblActivate.Visible = False
                End If
            Else
                lbllostCardCharge.Text = Val(result.PayNewCard)
                dxPopUpError.HeaderText = "Error"
                lblError.Text = result.ReturnMessage
                dxPopUpError.ShowOnPageLoad = True
                lblActivate.Visible = False
            End If

        End If

    End Sub

    Private Sub cmdAccept_Click()
        If Session("AccountInfo") IsNot Nothing Then
            Dim account As New POSAccountEntites
            account = Session("AccountInfo")

            Dim strCardNumber As String
            Dim DebtorDetails As New Debtor
            Dim OverRide As Boolean

            If txtCardNumber.Text = "" Then
                dxPopUpError.HeaderText = "Error"
                lblError.Text = "Please scan or fill-in a Card Number."
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            If txtEmployeeNumber.Text = "" Then
                dxPopUpError.HeaderText = "Error"
                lblError.Text = "Please fill-in your Employee Number."
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            If lblOverRide.Visible = True Then
                OverRide = True
            Else
                OverRide = False
            End If


            If OverRide = True Then
                If Len(txtCardNumber.Text) <> 16 Then
                    dxPopUpError.HeaderText = "Error"
                    lblError.Text = "The Card Number Is Invalid."
                    dxPopUpError.ShowOnPageLoad = True
                    Exit Sub
                Else
                    strCardNumber = txtCardNumber.Text
                End If
            End If


            If OverRide = False Then
                If Mid$(txtCardNumber.Text, 1, 4) <> "%(#!" Then
                    dxPopUpError.HeaderText = "Error"
                    lblError.Text = "This Card Is Not Valid At A Rage Store."
                    dxPopUpError.ShowOnPageLoad = True
                    txtCardNumber.Focus()
                    Exit Sub
                End If
            End If

            strCardNumber = txtCardNumber.Text

            If Mid$(txtCardNumber.Text, 1, 4) = "%(#!" Then
                If Mid$(txtCardNumber.Text, 5, 1) = "4" Then 'Old Account Card
                    strCardNumber = EncryptToCard(Mid$(txtCardNumber.Text, 5, 16))
                ElseIf Mid$(txtCardNumber.Text, 5, 1) = "6" Then 'New Account and Gift Card
                    strCardNumber = Mid$(txtCardNumber.Text, 5, 16)
                Else
                    dxPopUpError.HeaderText = "Error"
                    lblError.Text = "Invalid Card Read."
                    dxPopUpError.ShowOnPageLoad = True
                    Exit Sub
                End If
            End If

            If Mid(txtCardNumber.Text, 1, 4) <> "6501" Then
                dxPopUpError.HeaderText = "Error"
                lblError.Text = "The Card Number Is Invalid."
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If


            If txtFirstName.Text.ToUpper <> account.FirstName.ToUpper Then
                dxPopUpError.HeaderText = "Positive"
                lblError.Text = "The First Name you entered does not match the details for the ID Number."
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            If cboLanguage.Text = "" Then
                dxPopUpError.HeaderText = "Please correct"
                lblError.Text = "Please select a Preferred Language for the Customer."
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            If txtSurname.Text.ToUpper <> account.Surname.ToUpper Then
                dxPopUpError.HeaderText = "Please correct"
                lblError.Text = "The Surname you entered does not match the details for the ID Number."
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            If txtCellphone.Text <> account.CellPhone Then
                dxPopUpError.HeaderText = "Please correct"
                lblError.Text = "The Cellphone Number you entered does not match the details for the ID Number."
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            '        If MsgBox("I confirm that the customer has presented to me their ID Book or Drivers License.", MsgBoxStyle.Question + MsgBoxStyle.YesNo,
            '              "Please Confirm") = MsgBoxResult.No Then
            '            Exit Sub
            '        End If

            'If Val(lbllostCardCharge.Text) <> 0 Then
            '    If MsgBox("I confirm that the customer acknowledges that they will be charged R" & Val(lbllostCardCharge.Text) &
            '          " for their new card.", MsgBoxStyle.Critical + MsgBoxStyle.YesNo,
            '      "Please Confirm") = MsgBoxResult.No Then
            '        Exit Sub
            '    End If
            'End If

            Dim Current_Branch_Code As String = Mid$(cboBranch.Value, 1, 3)

            DebtorDetails.FirstName = account.FirstName
            DebtorDetails.LastName = account.Surname
            DebtorDetails.AccountNumber = RG.Apos(account.AccountNumber)
            DebtorDetails.CardNumber = RG.Apos(txtCardNumber.Text)
            DebtorDetails.EmployeeNumber = RG.Apos(txtEmployeeNumber.Text)
            DebtorDetails.Autoincrease = chkAutoIncrease.Checked
            DebtorDetails.LostCard = chkLostCard.Checked
            DebtorDetails.ContactNumber = txtCellphone.Text
            DebtorDetails.BranchCode = Current_Branch_Code
            DebtorDetails.PreferredLanguage = cboLanguage.Text
            DebtorDetails.PayNewCard = Val(lbllostCardCharge.Text)


            Dim Result As Debtor

            Result = _POSBusinessLayer.InsertSelfActivated(DebtorDetails)

            If Result.SelfActivate = False Then
                If Result.ReturnMessage <> "" Then
                    lblError.Text = Result.ReturnMessage
                    dxPopUpError.ShowOnPageLoad = True
                    cmdClear.Enabled = True
                    cmdAccept.Enabled = True
                Else
                    cmdClear.Enabled = True
                    lblError.Text = Result.ReturnMessage
                    dxPopUpError.ShowOnPageLoad = True
                    cmdAccept.Enabled = True
                    lblActivate.Visible = True
                End If
            Else
                dxPopUpError.HeaderText = "Success"
                lblError.Text = "The card is Active. The Customer has a CREDIT LIMIT OF R" & txtCreditLimit.Text
                dxPopUpError.ShowOnPageLoad = True
                ClearScreen()

            End If
        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = "Please enter ID number before submitting"
            dxPopUpError.ShowOnPageLoad = True
        End If

    End Sub
    Private Sub txtCardNumber_TextChanged()
        If Len(txtCardNumber.Text) = 21 Then
            If Mid$(txtCardNumber.Text, 1, 4) = "%(#!" Then
                If Mid$(txtCardNumber.Text, 5, 1) = "4" Then 'Old Account Card
                    txtCardNumber.Text = EncryptToCard(Mid$(txtCardNumber.Text, 5, 16))
                ElseIf Mid$(txtCardNumber.Text, 5, 1) = "6" Then 'New Account and Gift Card
                    txtCardNumber.Text = Mid$(txtCardNumber.Text, 5, 16)
                ElseIf Mid$(txtCardNumber.Text, 5, 1) = "9" Then 'Old Gift Card
                    txtCardNumber.Text = EncryptToCard(Mid$(txtCardNumber.Text, 5, 16))
                Else
                    dxPopUpError.HeaderText = "Error"
                    lblError.Text = "Invalid Card Read"
                    dxPopUpError.ShowOnPageLoad = True
                End If
            End If
        End If
    End Sub
    Public Function EncryptToCard(ByVal cString As String) As String

        Dim strConvert(16) As String
        Dim strSwap(16) As String
        Dim strNormal(16) As String

        For encryptLoop As Integer = 1 To 16
            strConvert(encryptLoop) = Mid$(cString, encryptLoop, 1)
        Next encryptLoop
        'position 1 becomes 4

        strSwap(4) = strConvert(1)
        strSwap(6) = strConvert(2)
        strSwap(10) = strConvert(3)
        strSwap(5) = strConvert(4)
        strSwap(8) = strConvert(5)
        strSwap(1) = strConvert(6)
        strSwap(11) = strConvert(7)
        strSwap(15) = strConvert(8)
        strSwap(3) = strConvert(9)
        strSwap(16) = strConvert(10)
        strSwap(14) = strConvert(11)
        strSwap(7) = strConvert(12)
        strSwap(2) = strConvert(13)
        strSwap(13) = strConvert(14)
        strSwap(9) = strConvert(15)
        strSwap(12) = strConvert(16)
        '6 => 1

        For encryptLoop As Integer = 1 To 16
            Select Case strSwap(encryptLoop)
                Case "4" : strNormal(encryptLoop) = "1"
                Case "9" : strNormal(encryptLoop) = "2"
                Case "0" : strNormal(encryptLoop) = "3"
                Case "3" : strNormal(encryptLoop) = "4"
                Case "6" : strNormal(encryptLoop) = "5"
                Case "2" : strNormal(encryptLoop) = "6"
                Case "5" : strNormal(encryptLoop) = "7"
                Case "1" : strNormal(encryptLoop) = "8"
                Case "7" : strNormal(encryptLoop) = "9"
                Case "8" : strNormal(encryptLoop) = "0"
            End Select
        Next encryptLoop

        EncryptToCard = ""

        For encryptLoop As Integer = 1 To 16
            EncryptToCard = EncryptToCard & strNormal(encryptLoop)
        Next encryptLoop

    End Function
End Class