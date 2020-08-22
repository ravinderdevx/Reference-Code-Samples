Imports DevExpress.Web
Imports abc.BusinessLayer
Imports Entities
Imports DevExpress.Web.ASPxTreeList

Public Class ManageUsers1
    Inherits System.Web.UI.Page

    Dim _ManageUser As ManageUserBusinessLayer = New ManageUserBusinessLayer

    Private Sub ManageUsers_Init(sender As Object, e As EventArgs) Handles Me.Init

        Dim url As String = Request.Url.AbsoluteUri

        If HttpContext.Current.IsDebuggingEnabled Then
            Session("current_company") = "010"
        End If

        'Me.Form.DefaultButton = cmdAccept.UniqueID

        Page.Server.ScriptTimeout = 300

        If Not IsPostBack Then
            Populate()

        End If

        HOPermissions()
        ShopPermissions()

    End Sub

    Protected Sub treeList_CustomDataCallback(ByVal sender As Object, ByVal e As DevExpress.Web.ASPxTreeList.TreeListCustomDataCallbackEventArgs)
        e.Result = treeListAll.SelectionCount.ToString()
    End Sub


    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

        Dim url As String = Request.Url.AbsoluteUri

        If Not url.Contains("localhost") Then
            If Session("username") = "" Then
                If Not IsCallback Then
                    Response.Redirect("~/Intranet/Default.aspx")
                Else
                    ASPxWebControl.RedirectOnCallback("~/Intranet/Default.aspx")
                End If
            End If
        End If

    End Sub

    Private Sub ManageUsers_PreInit(sender As Object, e As EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub

    Private Sub hud_PreInit(sender As Object, e As System.EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub

    Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)

        If hdWhichButton.Value = "optChange" Then
            opt_Click()
        End If


        If hdWhichButton.Value = "UnCheckAll" Then
            cmdUnCheckAll_Click()
        End If

        If hdWhichButton.Value = "CheckAll" Then
            cmdCheckAll_Click()
        End If

        If hdWhichButton.Value = "cboShopSelectedIndexChanged" Then
            cboShopSelectedIndexChanged()
        End If

        If hdWhichButton.Value = "cboUserSelectedIndexChanged" Then
            cboUser_SelectedIndexChanged()
        End If

        If hdWhichButton.Value = "clear" Then
            cmdClear_Click()
            cmdUnCheckAll_Click()
            treeListAll.Visible = True
            treeListAll1.Visible = False
        End If

        If hdWhichButton.Value = "deleteuser" Then
            cmdDelete_Click()
            cmdUnCheckAll_Click()
            treeListAll.Visible = True
            treeListAll1.Visible = False
        End If

        If hdWhichButton.Value = "save" Then
            cmdSave_Click()
            cmdUnCheckAll_Click()
            treeListAll.Visible = True
            treeListAll1.Visible = False
        End If

    End Sub

    Private Function CreateHeadNodeCore(ByVal key As Object, ByVal iconName As String, ByVal text As String, ByVal parentNode As TreeListNode) As TreeListNode
        Dim node As TreeListNode = treeListAll.AppendNode(key, parentNode)
        node("IconName") = iconName
        node("Name") = text
        Return node
    End Function

    Private Function CreateShopNodeCore(ByVal key As Object, ByVal iconName As String, ByVal text As String, ByVal parentNode As TreeListNode) As TreeListNode
        Dim node As TreeListNode = treeListAll1.AppendNode(key, parentNode)
        node("IconName") = iconName
        node("Name") = text
        Return node
    End Function

    Protected Function GetIconUrl(ByVal container As TreeListDataCellTemplateContainer) As String
        Return "~/Images/blue_pixel.png"
    End Function

    Private Sub HOPermissions()

        Dim maintainence As TreeListNode = CreateHeadNodeCore("maint", "Features", "<b>Maintainence</b>", Nothing)
        CreateHeadNodeCore("branch_maintenance", "Features", "Branch Maintenance", maintainence)
        CreateHeadNodeCore("till_maintenance", "Features", "Till Maintenance", maintainence)
        CreateHeadNodeCore("user_maintenance", "Features", "User Maintenance", maintainence)
        CreateHeadNodeCore("itemcode_maintenance", "Features", "Itemcode Maintenance", maintainence)
        CreateHeadNodeCore("customer_maintenance", "Features", "Customer Maintenance", maintainence)
        CreateHeadNodeCore("supplier_maintenance", "Features", "Supplier Maintenance", maintainence)
        CreateHeadNodeCore("stockcodes_maintenance", "Features", "Stockcodes Maintenance", maintainence)
        CreateHeadNodeCore("company_settings", "Features", "Company Settings", maintainence)
        CreateHeadNodeCore("customer_management", "Features", "Customer Management", maintainence)
        CreateHeadNodeCore("points_management", "Features", "Points Management", maintainence)
        CreateHeadNodeCore("send_text_messages", "Features", "Send Text Messages", maintainence)
        CreateHeadNodeCore("employee_management", "Features", "Employee Management", maintainence)
        CreateHeadNodeCore("extra_stockcode_import", "Features", "Extra: Stockcode Import", maintainence)
        CreateHeadNodeCore("create_cards", "Features", "Create Cards", maintainence)
        CreateHeadNodeCore("card_maintenance", "Features", "Card Maintenance", maintainence)
        CreateHeadNodeCore("assign_card", "Features", "Assign Card", maintainence)
        CreateHeadNodeCore("stationary_maintenance", "Features", "Stationary Maintenance", maintainence)
        CreateHeadNodeCore("minimum_stock_qty_per_branch", "Features", "Minimum Stock Qty Per Branch", maintainence)
        CreateHeadNodeCore("targets", "Features", "Targets", maintainence)

        'HO permissions
        'Tv.Nodes.Clear()
        'Tv.Nodes.Add("Maintenance", "maint")
        'Tv.Nodes.Item("0").Nodes.Add("Branch Maintenance")
        ''Tv.Nodes.Item("maint").Nodes.Add("Till Maintenance")
        ''Tv.Nodes.Item("maint").Nodes.Add("User Maintenance")
        ''Tv.Nodes.Item("maint").Nodes.Add("Itemcode Maintenance")
        ''Tv.Nodes.Item("maint").Nodes.Add("Customer Maintenance")
        'Tv.Nodes.Item("0").Nodes.Add("Supplier Maintenance")
        'Tv.Nodes.Item("0").Nodes.Add("Stockcodes Maintenance")
        'Tv.Nodes.Item("0").Nodes.Add("Company Settings")
        'Tv.Nodes.Item("0").Nodes.Add("Customer Management")
        'Tv.Nodes.Item("0").Nodes.Add("Points Management")
        'Tv.Nodes.Item("0").Nodes.Add("Send Text Messages")
        'Tv.Nodes.Item("0").Nodes.Add("Employee Management")
        'Tv.Nodes.Item("0").Nodes.Add("Extra: Stockcode Import")
        'Tv.Nodes.Item("0").Nodes.Add("Create Cards")
        'Tv.Nodes.Item("0").Nodes.Add("Card Maintenance")
        'Tv.Nodes.Item("0").Nodes.Add("Assign Card")
        'Tv.Nodes.Item("0").Nodes.Add("Stationary Maintenance")
        'Tv.Nodes.Item("0").Nodes.Add("Minimum Stock Qty Per Branch")
        'Tv.Nodes.Item("0").Nodes.Add("Targets")


        Dim transactions As TreeListNode = CreateHeadNodeCore("trans", "Features", "<b>Transactions</b>", Nothing)
        CreateHeadNodeCore("ibt_in", "Features", "IBT In", transactions)
        CreateHeadNodeCore("manual_ibt_in", "Features", "Manual IBT In", transactions)
        CreateHeadNodeCore("ibt_out", "Features", "IBT Out", transactions)
        CreateHeadNodeCore("grv", "Features", "GRV", transactions)
        CreateHeadNodeCore("stock_adjustment", "Features", "Stock Adjustment", transactions)
        CreateHeadNodeCore("dispatch", "Features", "Dispatch", transactions)
        CreateHeadNodeCore("return_to_warehouse", "Features", "Return to Warehouse", transactions)



        'Tv.Nodes.Add("Transactions", "trans")
        'Tv.Nodes.Item("1").Nodes.Add("IBT In")
        ''Tv.Nodes.Item("trans").Nodes.Add("Manual IBT In")
        'Tv.Nodes.Item("1").Nodes.Add("IBT Out")
        'Tv.Nodes.Item("1").Nodes.Add("GRV")
        'Tv.Nodes.Item("1").Nodes.Add("Stock Adjustment")
        'Tv.Nodes.Item("1").Nodes.Add("Dispatch")
        'Tv.Nodes.Item("1").Nodes.Add("Return to Warehouse")

        Dim other As TreeListNode = CreateHeadNodeCore("other", "Features", "<b>Printing</b>", Nothing)
        CreateHeadNodeCore("view_quantities", "Features", "View Quantities", other)
        CreateHeadNodeCore("selling_price_changes", "Features", "Selling Price Changes", other)
        CreateHeadNodeCore("cost_price_changes", "Features", "Cost Price Changes", other)
        CreateHeadNodeCore("reprints", "Features", "Reprints", other)
        CreateHeadNodeCore("barcode_printing", "Features", "Barcode Printing", other)

        'Tv.Nodes.Add("Printing", "other")
        ''Tv.Nodes.Item("other").Nodes.Add("View Quantities")
        ''Tv.Nodes.Item("other").Nodes.Add("Selling Price Changes")
        ''Tv.Nodes.Item("other").Nodes.Add("Cost Price Changes")
        'Tv.Nodes.Item("2").Nodes.Add("Reprints")
        'Tv.Nodes.Item("2").Nodes.Add("Barcode Printing")

    End Sub

    Private Sub ShopPermissions()
        Dim pos As TreeListNode = CreateShopNodeCore("pos", "Features", "<b>Point of Sale</b>", Nothing)
        CreateShopNodeCore("pos_discounts", "Features", "Discounts", pos)
        CreateShopNodeCore("pos_returns", "Features", "Returns", pos)
        CreateShopNodeCore("pos_void_sale", "Features", "Void Sale", pos)
        CreateShopNodeCore("pos_customers_management", "Features", "Customer Management", pos)
        CreateShopNodeCore("pos_edit_customer_credit_limits", "Features", "Edit Customer Credit Limits", pos)
        CreateShopNodeCore("pos_customer_payments", "Features", "Customer Payments", pos)
        CreateShopNodeCore("pos_layby", "Features", "Layby", pos)

        'Tv.Nodes.Clear()

        ''Shop permissions
        'Tv.Nodes.Add("Point of Sale", "pos")


        'Tv.Nodes.Item("0").Nodes.Add("Discounts")
        'Tv.Nodes.Item("0").Nodes.Add("Returns")
        'Tv.Nodes.Item("0").Nodes.Add("Void Sale")
        'Tv.Nodes.Item("0").Nodes.Add("Customer Management")
        'Tv.Nodes.Item("0").Nodes.Add("Edit Customer Credit Limits")
        'Tv.Nodes.Item("0").Nodes.Add("Customer Payments")
        'Tv.Nodes.Item("0").Nodes.Add("Layby")

        Dim manage As TreeListNode = CreateShopNodeCore("manage", "Features", "<b>Management</b>", Nothing)
        CreateShopNodeCore("manage_reprints", "Features", "Reprints", manage)
        CreateShopNodeCore("manage_paid_in_out", "Features", "Paid In / Out", manage)
        CreateShopNodeCore("manage_open_till", "Features", "Open Till", manage)
        CreateShopNodeCore("manage_ibt_in", "Features", "IBT In", manage)
        CreateShopNodeCore("manage_ibt_out", "Features", "IBT Out", manage)
        CreateShopNodeCore("manage_stockex", "Features", "StockEx", manage)
        CreateShopNodeCore("manage_cash_reports", "Features", "Cash Reports", manage)
        CreateShopNodeCore("manage_stock_reports", "Features", "Stock Reports", manage)
        CreateShopNodeCore("manage_stocktake", "Features", "Stocktake", manage)
        CreateShopNodeCore("manage_layby_management", "Features", "Layby Management", manage)
        CreateShopNodeCore("manage_clocking", "Features", "Clocking", manage)
        CreateShopNodeCore("manage_stock_on_hand_reports", "Features", "Stock On Hand Report", manage)
        CreateShopNodeCore("manage_count_stationary", "Features", "Count Stationary", manage)

        'Tv.Nodes.Add("Management", "manage")
        'Tv.Nodes.Item("1").Nodes.Add("Reprints")
        'Tv.Nodes.Item("1").Nodes.Add("Paid In / Out")
        'Tv.Nodes.Item("1").Nodes.Add("Open Till")
        'Tv.Nodes.Item("1").Nodes.Add("IBT In")
        'Tv.Nodes.Item("1").Nodes.Add("IBT Out")
        'Tv.Nodes.Item("1").Nodes.Add("StockEx")
        'Tv.Nodes.Item("1").Nodes.Add("Cash Reports")
        'Tv.Nodes.Item("1").Nodes.Add("Stock Reports")
        'Tv.Nodes.Item("1").Nodes.Add("Stocktake")
        'Tv.Nodes.Item("1").Nodes.Add("Layby Management")
        'Tv.Nodes.Item("1").Nodes.Add("Clocking")
        'Tv.Nodes.Item("1").Nodes.Add("Stock On Hand Report")
        'Tv.Nodes.Item("1").Nodes.Add("Count Stationary")

        'Tv.RefreshVirtualTree()

        'Tv.Nodes.Add("trans", "Transactions")
        'Tv.Nodes.Item("trans").Nodes.Add("Auto IBT In")
        'Tv.Nodes.Item("trans").Nodes.Add("Manual IBT In")
        'Tv.Nodes.Item("trans").Nodes.Add("IBT Out")
        ''Tv.Nodes.Item("trans").Nodes.Add("GRV")
        ''Tv.Nodes.Item("trans").Nodes.Add("Invoice")
        'Tv.Nodes.Item("trans").Nodes.Add("Stock Adjustment")

        'Tv.Nodes.Add("other", "Other")
        'Tv.Nodes.Item("other").Nodes.Add("Allow Return of Items")
        'Tv.Nodes.Item("other").Nodes.Add("Selling Price Changes")
        'Tv.Nodes.Item("other").Nodes.Add("Allow Voids")
        'Tv.Nodes.Item("other").Nodes.Add("Reprints")
        'Tv.Nodes.Item("other").Nodes.Add("Cash Reports")
        'Tv.Nodes.Item("other").Nodes.Add("Stock Reports")

        'Me.Tv.Nodes.Clear()
        'CreateTreeViewNodesRecursive(dt, Me.Tv.Nodes, "0", False)



    End Sub


    Private Sub opt_Click()
        If optHo.Checked = True Then

            treeListAll.Visible = True
            treeListAll1.Visible = False
        Else
            treeListAll.Visible = False
            treeListAll1.Visible = True
        End If

    End Sub



    'Private Sub optShop_Click()
    '    If optShop.Checked = True Then
    '        ShopPermissions()
    '    End If

    'End Sub

    Private Sub Populate()
        Dim dataTableResponse As New DataTableResponse

        cboShop.Items.Clear()
        cboShop.Items.Add("")

        dataTableResponse = _ManageUser.GetBranchDetails()
        If dataTableResponse.Success = True Then
            For Each dr As DataRow In dataTableResponse.Detail.Rows
                If dr("branch_code") <> "" Then
                    cboShop.Items.Add(dr("branch_code") & " - " & dr("branch_name"))
                End If
            Next

            cboShop.Text = ""

            cboUser.Items.Clear()
            cboUser.Text = ""

            optHo.Checked = True


            cboUser.Items.Clear()
            cboUser.Text = ""

            txtPassword.Text = ""

            chkLockToBranch.Checked = False




        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = dataTableResponse.Message
            dxPopUpError.ShowOnPageLoad = True
        End If
    End Sub


    Private Sub cboShopSelectedIndexChanged()
        If cboShop.Text <> "" Then

            Dim dataTableResponse As New DataTableResponse

            cboUser.Items.Clear()
            cboUser.Text = ""
            Dim User As String

            Dim BranchCode() As String
            BranchCode = cboShop.Text.Split(" - ")
            dataTableResponse = _ManageUser.GetUserPermissions(BranchCode, User)
            If dataTableResponse.Success = True Then
                For Each dr As DataRow In dataTableResponse.Detail.Rows
                    If dr("user_name") <> "" Then
                        cboUser.Items.Add(dr("user_name"))
                    End If
                Next

                dxPopUpError.ShowOnPageLoad = False
            Else
                dxPopUpError.HeaderText = "Error"
                lblError.Text = dataTableResponse.Message
                dxPopUpError.ShowOnPageLoad = True
            End If
            txtPassword.Text = ""

        End If
    End Sub

    Protected Sub cmdDelete_Click()
        Dim deleteRequest As New DeleteRequest
        Dim BranchCode() As String
        Dim dataTableResponse As New DataTableResponse

        deleteRequest.Branch = cboShop.Value
        deleteRequest.User = cboUser.Value

        BranchCode = cboShop.Text.Split(" - ")

        dataTableResponse = _ManageUser.DeleteUser(deleteRequest, BranchCode)
        If dataTableResponse.Success = True Then
            Populate()
            dxPopUpError.HeaderText = "Success"
            lblError.Text = dataTableResponse.Message
        Else

            dxPopUpError.HeaderText = "Error"
            lblError.Text = dataTableResponse.Message
            dxPopUpError.ShowOnPageLoad = True
        End If





    End Sub

    Protected Sub cmdClear_Click()
        Populate()

    End Sub


    Protected Sub cmdSave_Click()
        Dim saveUserRequest As New SaveUserRequest
        Dim dataTableResponse As New DataTableResponse
        Dim BranchCode() As String

        Dim strPOS As String
        Dim strMaint As String
        Dim strTrans As String
        Dim strOther As String

        strMaint = ""
        strTrans = ""
        strPOS = ""
        strOther = ""

        If optHo.Checked Then
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("branch_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("till_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("user_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("itemcode_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("customer_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("supplier_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("stockcodes_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("company_settings").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("customer_management").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("points_management").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("send_text_messages").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("employee_management").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("extra_stockcode_import").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("create_cards").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("card_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("assign_card").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("stationary_maintenance").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("minimum_stock_qty_per_branch").Selected())
            strMaint &= TrueFalse(treeListAll.FindNodeByKeyValue("targets").Selected())


            strTrans &= TrueFalse(treeListAll.FindNodeByKeyValue("ibt_in").Selected())
            strTrans &= TrueFalse(treeListAll.FindNodeByKeyValue("manual_ibt_in").Selected())
            strTrans &= TrueFalse(treeListAll.FindNodeByKeyValue("ibt_out").Selected())
            strTrans &= TrueFalse(treeListAll.FindNodeByKeyValue("grv").Selected())
            strTrans &= TrueFalse(treeListAll.FindNodeByKeyValue("stock_adjustment").Selected())
            strTrans &= TrueFalse(treeListAll.FindNodeByKeyValue("dispatch").Selected())
            strTrans &= TrueFalse(treeListAll.FindNodeByKeyValue("return_to_warehouse").Selected())


            strOther &= TrueFalse(treeListAll.FindNodeByKeyValue("view_quantities").Selected())
            strOther &= TrueFalse(treeListAll.FindNodeByKeyValue("selling_price_changes").Selected())
            strOther &= TrueFalse(treeListAll.FindNodeByKeyValue("cost_price_changes").Selected())
            strOther &= TrueFalse(treeListAll.FindNodeByKeyValue("reprints").Selected())
            strOther &= TrueFalse(treeListAll.FindNodeByKeyValue("barcode_printing").Selected())

        Else

            strPOS &= TrueFalse(treeListAll1.FindNodeByKeyValue("pos_returns").Selected())
            strPOS &= TrueFalse(treeListAll1.FindNodeByKeyValue("pos_void_sale").Selected())
            strPOS &= TrueFalse(treeListAll1.FindNodeByKeyValue("pos_customers_management").Selected())
            strPOS &= TrueFalse(treeListAll1.FindNodeByKeyValue("pos_edit_customer_credit_limits").Selected())
            strPOS &= TrueFalse(treeListAll1.FindNodeByKeyValue("pos_customer_payments").Selected())
            strPOS &= TrueFalse(treeListAll1.FindNodeByKeyValue("pos_layby").Selected())
        End If


        BranchCode = cboShop.Text.Split(" - ")
        saveUserRequest.Branch = cboShop.Value
        saveUserRequest.User = cboUser.Value
        saveUserRequest.Password = txtPassword.Text
        saveUserRequest.LockToBranch = chkLockToBranch.Checked
        saveUserRequest.HeadOfficeUser = optHo.Checked
        saveUserRequest.ShopUser = optShop.Checked

        dataTableResponse = _ManageUser.SaveUser(saveUserRequest, BranchCode, strPOS, strMaint, strTrans, strOther)
        If dataTableResponse.Success = True Then
            dxPopUpError.HeaderText = "Success"
            lblError.Text = dataTableResponse.Message
            Populate()
        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = dataTableResponse.Message
            dxPopUpError.ShowOnPageLoad = True
        End If

    End Sub


    Private Sub cmdCheckAll_Click()
        Dim tempTreeListAll As New ASPxTreeList
        If optHo.Checked = True Then
            For i As Integer = 0 To treeListAll.Nodes.Count - 1

                treeListAll.Nodes(i).Selected = False
                If treeListAll.Nodes(i).HasChildren Then
                    For x As Integer = 0 To treeListAll.Nodes(i).ChildNodes.Count - 1
                        treeListAll.Nodes(i).ChildNodes(x).Selected = True
                    Next x
                End If

            Next
            treeListAll1.Visible = False
        Else
            'tempTreeListAll = treeListAll1
            For i As Integer = 0 To treeListAll1.Nodes.Count - 1

                treeListAll1.Nodes(i).Selected = False
                If treeListAll1.Nodes(i).HasChildren Then
                    For x As Integer = 0 To treeListAll1.Nodes(i).ChildNodes.Count - 1
                        treeListAll1.Nodes(i).ChildNodes(x).Selected = True
                    Next x
                End If

            Next
            treeListAll.Visible = False
            treeListAll1.Visible = True
        End If


    End Sub

    Private Sub cmdUnCheckAll_Click()
        Dim tempTreeListAll As ASPxTreeList
        If optHo.Checked = True Then
            tempTreeListAll = treeListAll
        Else
            tempTreeListAll = treeListAll1
        End If

        For i As Integer = 0 To tempTreeListAll.Nodes.Count - 1

            tempTreeListAll.Nodes(i).Selected = False
            If treeListAll.Nodes(i).HasChildren Then
                For x As Integer = 0 To tempTreeListAll.Nodes(i).ChildNodes.Count - 1
                    tempTreeListAll.Nodes(i).ChildNodes(x).Selected = False
                Next x
            End If

        Next
    End Sub


    Private Sub cboUser_SelectedIndexChanged()

        Dim dataTableResponse As New DataTableResponse

        Dim tmpMaint As String
        Dim tmpTrans As String
        Dim tmpPOS As String
        Dim tmpOther As String

        tmpMaint = ""
        tmpTrans = ""
        tmpPOS = ""
        tmpOther = ""

        Dim theCounter As Long = 0
        Dim User As String
        User = cboUser.Text

        'Get the settings
        Dim BranchCode() As String
        BranchCode = cboShop.Text.Split(" - ")

        dataTableResponse = _ManageUser.GetUserPermissions(BranchCode, User)
        If dataTableResponse.Success = True Then
            For Each dr As DataRow In dataTableResponse.Detail.Rows
                If dr("user_name") <> "" Then
                    tmpPOS = dr("pos_sequence") & ""
                    tmpMaint = dr("maintenance_sequence") & ""
                    tmpTrans = dr("transaction_sequence") & ""
                    tmpOther = dr("other_permissions_sequence") & ""
                    txtPassword.Text = dr("user_password") & ""
                    chkLockToBranch.Checked = dr("is_locked_to_branch") & ""

                    'If dr("is_head_office_user") & "" = True Then
                    '    optHo.Checked = True
                    '    optShop.Checked = False

                    'Else
                    '    optHo.Checked = False
                    '    optShop.Checked = True


                    'End If
                End If
            Next

            ' Populate the TreeView

            If tmpPOS <> "" Then


                'If Mid$(tmpPOS, 1, 1) = "1" Then
                '    treeListAll1.FindNodeByKeyValue("pos").Selected() = True
                'End If

                If Mid$(tmpPOS, 2, 1) = "1" Then
                    treeListAll1.FindNodeByKeyValue("pos_discounts").Selected() = True
                End If

                If Mid$(tmpPOS, 3, 1) = "1" Then
                    treeListAll1.FindNodeByKeyValue("pos_returns").Selected() = True
                End If

                If Mid$(tmpPOS, 4, 1) = "1" Then
                    treeListAll1.FindNodeByKeyValue("pos_void_sale").Selected() = True
                End If

                If Mid$(tmpPOS, 5, 1) = "1" Then
                    treeListAll1.FindNodeByKeyValue("pos_customers_management").Selected() = True
                End If

                If Mid$(tmpPOS, 6, 1) = "1" Then
                    treeListAll1.FindNodeByKeyValue("pos_edit_customer_credit_limits").Selected() = True
                End If

                If Mid$(tmpPOS, 7, 1) = "1" Then
                    treeListAll1.FindNodeByKeyValue("pos_customer_payments").Selected() = True
                End If

                If Mid$(tmpPOS, 8, 1) = "1" Then
                    treeListAll1.FindNodeByKeyValue("pos_layby").Selected() = True
                End If

                treeListAll1.Visible = True
                treeListAll.Visible = False
                optShop.Checked = True
                optHo.Checked = False
            End If

            '' Populate Maintainence
            If tmpMaint <> "" Then

                'If Mid$(tmpMaint, 1, 1) = "1" Then
                '    treeListAll.FindNodeByKeyValue("maint").Selected() = True
                'End If

                If Mid$(tmpMaint, 1, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("branch_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 2, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("till_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 3, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("user_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 4, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("itemcode_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 5, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("customer_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 6, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("supplier_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 7, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("stockcodes_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 8, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("company_settings").Selected() = True
                End If

                If Mid$(tmpMaint, 9, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("customer_management").Selected() = True
                End If

                If Mid$(tmpMaint, 10, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("points_management").Selected() = True
                End If

                If Mid$(tmpMaint, 11, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("send_text_messages").Selected() = True
                End If

                If Mid$(tmpMaint, 12, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("employee_management").Selected() = True
                End If

                If Mid$(tmpMaint, 13, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("extra_stockcode_import").Selected() = True
                End If

                If Mid$(tmpMaint, 14, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("create_cards").Selected() = True
                End If

                If Mid$(tmpMaint, 15, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("card_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 16, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("assign_card").Selected() = True
                End If

                If Mid$(tmpMaint, 17, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("stationary_maintenance").Selected() = True
                End If

                If Mid$(tmpMaint, 18, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("minimum_stock_qty_per_branch").Selected() = True
                End If

                If Mid$(tmpMaint, 19, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("targets").Selected() = True
                End If


                treeListAll.Visible = True
                treeListAll1.Visible = False

            End If

            ' Populate Transaction
            If tmpTrans <> "" Then

                'If Mid$(tmpTrans, 1, 1) = "1" Then
                '    treeListAll.FindNodeByKeyValue("trans").Selected() = True
                'End If

                If Mid$(tmpTrans, 1, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("ibt_in").Selected() = True
                End If

                If Mid$(tmpTrans, 2, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("manual_ibt_in").Selected() = True
                End If

                If Mid$(tmpTrans, 3, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("ibt_out").Selected() = True
                End If

                If Mid$(tmpTrans, 4, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("grv").Selected() = True
                End If

                If Mid$(tmpTrans, 5, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("stock_adjustment").Selected() = True
                End If

                If Mid$(tmpTrans, 6, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("dispatch").Selected() = True
                End If

                If Mid$(tmpTrans, 7, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("return_to_warehouse").Selected() = True
                End If

                treeListAll.Visible = True
                treeListAll1.Visible = False
            End If

            'Populate Printing

            If tmpTrans <> "" Then


                '    If Mid$(tmpTrans, 1, 1) = "1" Then
                '    treeListAll.FindNodeByKeyValue("other").Selected() = True
                'End If

                If Mid$(tmpOther, 1, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("view_quantities").Selected() = True
                End If

                If Mid$(tmpOther, 2, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("selling_price_changes").Selected() = True
                End If

                If Mid$(tmpOther, 3, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("cost_price_changes").Selected() = True
                End If

                If Mid$(tmpOther, 4, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("reprints").Selected() = True
                End If

                If Mid$(tmpOther, 5, 1) = "1" Then
                    treeListAll.FindNodeByKeyValue("barcode_printing").Selected() = True
                End If

                treeListAll.Visible = True
                treeListAll1.Visible = False
                optShop.Checked = False
                optHo.Checked = True
            End If



        Else
                dxPopUpError.HeaderText = "Error"
            lblError.Text = dataTableResponse.Message
            dxPopUpError.ShowOnPageLoad = True
        End If
    End Sub

    Protected Sub Tv_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        If optHo.Checked = True Then
            HOPermissions()
        Else
            ShopPermissions()
        End If

    End Sub

    Private Function TrueFalse(ByVal tmpTrueFalse As Boolean) As String

        If tmpTrueFalse = True Then
            Return "1"
        Else
            Return "0"
        End If

    End Function

End Class