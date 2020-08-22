<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/DebtorsMaintainence/Debtors.Master" CodeBehind="DebtorsMaintainence.aspx.vb" Inherits="App.Website.DebtorsMaintainence" ValidateRequest="false" %>

<%@ Register Assembly="DevExpress.Web.ASPxRichEdit.v15.1, Version=15.1.6.0, Culture=neutral" Namespace="DevExpress.Web.ASPxRichEdit" TagPrefix="dx" %>

<%@ Register Assembly="DevExpress.Web.v15.1, Version=15.1.6.0, Culture=neutral"
    Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Src="~/Widgets/wid_datetime.ascx" TagName="DateTime" TagPrefix="widget" %>
<%@ Register Src="~/Widgets/CallsForToday.ascx" TagName="CallsForToday" TagPrefix="widget" %>

<%@ Register Assembly="DevExpress.Dashboard.v15.1.Web, Version=15.1.6.0, Culture=neutral" Namespace="DevExpress.DashboardWeb" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="../js/General/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="../js/Collections/contactinvestigation.js"></script>
    <script type="text/javascript" src="../js/General/application.js"></script>
    <style type="text/css">
        .style3 {
        }

        .style4 {
            width: 104px;
        }

        .style6 {
            width: 422px;
        }

        .auto-style1 {
            width: 104px;
            height: 23px;
        }

        .auto-style2 {
            height: 23px;
        }

        .auto-style3 {
            width: 150px;
        }

        .auto-style4 {
            width: 104px;
            height: 100%;
        }

        .auto-style6 {
            width: 104px;
            height: 27px;
        }

        .auto-style7 {
            height: 27px;
        }

        .main_view {
            margin: 20px 0px 0px 20px;
        }

            .main_view .dxtc-strip {
                height: auto !important;
            }

            .main_view table tr td span, .main_view a > .dx-vam {
                text-transform: uppercase;
            }

        .UpperCase {
            text-transform: uppercase;
        }

        .auto-style8 {
            margin-left: 40px;
        }

        .burea_btn {
            margin: 0 5px 10px 0;
        }

        .text-center {
            text-align: center;
        }
        .mb-10{margin-bottom:10px;}
    </style>



    <script type="text/javascript">

        function SubmitForm(s, e) {
            debugger;
            e.processOnServer = false;

            var tabPageCount = 4;
            for (var i = 0; i < tabPageCount; i++) {
                PageControl.SetActiveTab(PageControl.GetTab(i));
                if (!ASPxClientEdit.ValidateGroup("update")) {
                    return;
                }
            }
            //do validation here
            //if (!ASPxClientEdit.ValidateGroup("update")) return;

            document.getElementById('<%=hdWhichButton.ClientID%>').value = "Submit";

            lp.Show();
            cab.PerformCallback();
        }


        function onEnd(s, e) {
            lp.Hide();
        }

        function tP_KeyPress(s, e) {
            if (!txtIdNumber.GetValue() || txtIdNumber.GetValue() == "") return;

            if (s.keyCode == 13) {
                CheckIdNumber(s, e);
            }
        }

        function CheckIdNumber(s, e) {
            if (!txtIdNumber.GetValue() || txtIdNumber.GetValue() == "") {
                pd.SetValue(null);
                cbSex.SetValue(null);
                return;
            }

            document.getElementById('<%=hdWhichButton.ClientID%>').value = "CheckIdNumber";

            cab.PerformCallback();
        }

        function CopyAddress(s, e) {
            e.processOnServer = false;
            var address1 = txtCRAddressLine1.GetValue();
            var address2 = txtCRAddressLine2.GetValue();
            var address3 = txtCRAddressLine3.GetValue();
            var postalcode = txtCRPostalCode.GetValue();

            txtPOAAddressLine1.SetValue(address1);
            txtPOAAddressLine2.SetValue(address2);
            txtPOAAddressLine3.SetValue(address3);
            txtPOAPostalCode.SetValue(postalcode);
        }

        //function ClearPopup(s, e) {
        //    e.processOnServer = false;
        //    ASPxClientEdit.ClearEditorsInContainerById('contentDiv');
        //     PopupGrid.Refresh();
        //}

        function FindDebtors(s, e) {
            e.processOnServer = false;

            document.getElementById('<%=hdWhichButton.ClientID%>').value = "Lookup";

            lp.Show();
            cab.PerformCallback();
        }

        function FillDebtorsDetails(s, e) {
            e.processOnServer = false;

            document.getElementById('<%=hdWhichButton.ClientID%>').value = "DebtorSelected";

            cab.PerformCallback();
        }


        function GetBureauXMLData(s, e) {
            e.processOnServer = false;

            document.getElementById('<%=hdWhichButton.ClientID%>').value = "XmlData";

            cab.PerformCallback();
        }

        function GetReportingGridData(s, e) {
            e.processOnServer = false;

            document.getElementById('<%=hdWhichButton.ClientID%>').value = "ReportingData";

            cab.PerformCallback();
        }


    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="SideHolder" runat="server">
    <table>
        <tr>
            <td>
                <dx:ASPxDockPanel runat="server" ID="ASPxDockPanel1" PanelUID="DateTime" HeaderText="Date & Time"
                    Height="95px" ClientInstanceName="dateTimePanel" Width="230px" OwnerZoneUID="zone1">
                    <ContentCollection>
                        <dx:PopupControlContentControl ID="PopupControlContentControl1" runat="server" SupportsDisabledAttribute="True">
                            <widget:DateTime ID="xDTWid" runat="server" />
                        </dx:PopupControlContentControl>
                    </ContentCollection>
                </dx:ASPxDockPanel>
                <%-- <dx:ASPxNavBar ID="ASPxNavBar2" runat="server" RenderMode="Lightweight">
                    <Groups>
                        <dx:NavBarGroup Name="GetNewDebtor" Text="Get New Debtor">
                            <Items>
                                <%-- <dx:NavBarItem Name="30days" Text="30 Days">
                                </dx:NavBarItem>
                                <dx:NavBarItem Name="GetNewDebtor" Text="Get Debtor">
                                </dx:NavBarItem>

                            </Items>
                        </dx:NavBarGroup>
                    </Groups>
                </dx:ASPxNavBar>--%>
            </td>

        </tr>
    </table>
    <dx:ASPxDockZone ID="ASPxDockZone1" runat="server" Width="229px" ZoneUID="zone1"
        PanelSpacing="3px" ClientInstanceName="splitter" Height="400px">
    </dx:ASPxDockZone>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainHolder" runat="server">
    <dx:ASPxCallbackPanel ID="ASPxCallbackPanel1" runat="server" Width="100%" ClientInstanceName="cab"
        OnCallback="ASPxCallback1_Callback" ShowLoadingPanel="False">
        <SettingsLoadingPanel Enabled="False"></SettingsLoadingPanel>

        <ClientSideEvents EndCallback="onEnd"></ClientSideEvents>
        <PanelCollection>
            <dx:PanelContent ID="PanelContent3" runat="server">
                <dx:ASPxLoadingPanel ID="ASPxLoadingPanel1" runat="server" Modal="true" ContainerElementID=""
                    ClientInstanceName="lp">
                </dx:ASPxLoadingPanel>

                <dx:ASPxPageControl ID="ASPxPageControl1" runat="server" ActiveTabIndex="4" ClientInstanceName="PageControl" CssClass="main_view">
                    <TabPages>
                        <dx:TabPage Name="Personal" Text="Personal">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl1" runat="server">
                                    <table id="tblContainer0">
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtAccountNumberLabel" runat="server" Text="Account Number">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="auto-style8">
                                                <dx:ASPxTextBox ID="txtAccountNumber" runat="server" Width="170px" ClientEnabled="False" ReadOnly="True">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td class="style3">
                                                <dx:ASPxImage ID="OpenPopup" runat="server" ImageUrl="~/images/search.png">
                                                </dx:ASPxImage>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxLabel ID="txtEmailAddressLabel" runat="server" Text="Email Address">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxTextBox ID="txtEmailAddress" runat="server" Width="170px" MaxLength="80">
                                                </dx:ASPxTextBox>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtIdNumberLabel" runat="server" Text="ID Number">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="auto-style8">
                                                <dx:ASPxTextBox ID="txtIdNumber" runat="server" Width="170px" ClientInstanceName="txtIdNumber" EnableClientSideAPI="True" onKeyPress="javascript:return isNumber(event)" MaxLength="15">
                                                    <ClientSideEvents LostFocus="CheckIdNumber" />
                                                    <ValidationSettings Display="Dynamic" ErrorText="Please Supply An ID Number " SetFocusOnError="True" ValidationGroup="update">
                                                        <RequiredField ErrorText="Please Supply An ID Number " IsRequired="True" />
                                                    </ValidationSettings>
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td class="style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>

                                                <dx:ASPxLabel ID="cboPromoLabel" runat="server" Text="Promotional">
                                                </dx:ASPxLabel>

                                            </td>
                                            <td></td>
                                            <td>

                                                <dx:ASPxComboBox ID="cboPromo" runat="server" ClientInstanceName="cbPromo" EnableClientSideAPI="True">
                                                </dx:ASPxComboBox>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="cboTitleLabel" runat="server" Text="Title">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxComboBox ID="cboTitle" runat="server" EnableClientSideAPI="True" ClientInstanceName="cbTitle"
                                                    ValueType="System.String">
                                                </dx:ASPxComboBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxLabel ID="cboStatementDeliveryLabel" runat="server" Text="Statement Delivery">
                                                </dx:ASPxLabel>

                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxComboBox ID="cboStatementDelivery" runat="server" ClientInstanceName="cbStat" EnableClientSideAPI="True">
                                                </dx:ASPxComboBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtFirstNameLabel" runat="server" Text="First Name">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtFirstName" CssClass="UpperCase" runat="server" Width="170px" onKeyPress="return onlyAlphabets(event,this)" MaxLength="25">

                                                    <ValidationSettings Display="Dynamic" ErrorText="Please Supply A First Name " SetFocusOnError="True" ValidationGroup="update">
                                                        <RequiredField ErrorText="Please Supply A First Name " IsRequired="True" />

                                                    </ValidationSettings>
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxLabel ID="chkCardProtectionLabel" runat="server" Text="Card Protection">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxCheckBox ID="chkCardProtection" runat="server"></dx:ASPxCheckBox>
                                                &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtMiddleNameLabel" runat="server" Text="MIddle Name">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtMiddleName" CssClass="UpperCase" onKeyPress="return onlyAlphabets(event,this)" runat="server" Width="170px" MaxLength="25">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>

                                                <dx:ASPxLabel ID="chkAutoIncreaseLabel" runat="server" Text="Auto Increase">
                                                </dx:ASPxLabel>

                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>

                                                <dx:ASPxCheckBox ID="chkAutoIncrease" runat="server" CheckState="Unchecked">
                                                </dx:ASPxCheckBox>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtSurnameLabel" runat="server" Text="SurName">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtSurname" CssClass="UpperCase" onKeyPress="return onlyAlphabets(event,this)" runat="server" Width="170px" MaxLength="25">
                                                    <ValidationSettings Display="Dynamic" ErrorText="Please Supply A SurName " SetFocusOnError="True" ValidationGroup="update">
                                                        <RequiredField ErrorText="Please Supply A SurName " IsRequired="True" />
                                                    </ValidationSettings>
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="chkAgeAnalysisLabel" runat="server" Text="Age Analysis">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxCheckBox ID="chkAgeAnalysis" runat="server" CheckState="Unchecked" ReadOnly="True" ClientEnabled="false">
                                                </dx:ASPxCheckBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtDateOfBirthLabel" runat="server" Text="Date Of Birth">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxDateEdit ID="txtDOB" runat="server" ClientInstanceName="pd" DisplayFormatString="dd/MM/yyyy" EditFormat="Custom" EditFormatString="dd/MM/yyyy" UseMaskBehavior="True" Enabled="True" ReadOnly="True" ClientEnabled="False">
                                                    <CalendarProperties ShowClearButton="False">
                                                    </CalendarProperties>
                                                </dx:ASPxDateEdit>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="cboBranchLabel" runat="server" Text="Branch">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxComboBox ID="cboBranch" runat="server" ClientInstanceName="cBranchName" EnableClientSideAPI="True">
                                                </dx:ASPxComboBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="cboSexLabel" runat="server" Text="Gender">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxComboBox ID="cboSex" runat="server" EnableClientSideAPI="True" ClientInstanceName="cbSex" Enabled="true" ReadOnly="True"
                                                    ValueType="System.String" ClientEnabled="False" ShowShadow="False">
                                                </dx:ASPxComboBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="cboLanguageLabel" runat="server" Text="Pref. Language">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxComboBox ID="cboLanguage" runat="server" ClientInstanceName="cb" EnableClientSideAPI="True">
                                                </dx:ASPxComboBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtHomeTel1Label" runat="server" Text="Home Tel 1">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtHomeTel1" runat="server" validationgroup="save" Width="170px">
                                                    <MaskSettings ErrorText="Please input missing digits" Mask="999-999-9999" />
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxLabel ID="cboStatusLabel0" runat="server" Text="Status">
                                                </dx:ASPxLabel>

                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>
                                                <dx:ASPxComboBox ID="cboStatus" runat="server" EnableClientSideAPI="True" ReadOnly="True" ClientEnabled="false">
                                                </dx:ASPxComboBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style4">
                                                <dx:ASPxLabel ID="txtCellularNumberLabel" runat="server" Text="Cellular Number">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2">
                                                <dx:ASPxTextBox ID="txtCellularNumber" runat="server" Height="17px" Width="170px">
                                                    <MaskSettings Mask="999-999-9999" />
                                                    <ValidationSettings Display="Dynamic" ErrorText="Please Supply Cellular Number" SetFocusOnError="True" ValidationGroup="update">
                                                        <RequiredField IsRequired="True" ErrorText="Please Supply Cellular Number"></RequiredField>
                                                    </ValidationSettings>
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td class="auto-style2">
                                                <dx:ASPxCheckBox ID="chkDontSend" runat="server" CheckState="Unchecked" ReadOnly="true" ClientEnabled="false">
                                                </dx:ASPxCheckBox>
                                                <dx:ASPxLabel ID="ASPxLabel1" runat="server" Text="Don't Send "></dx:ASPxLabel>
                                            </td>
                                            <td></td>
                                            <td>
                                                <dx:ASPxLabel ID="txtCreditLimitLabel" runat="server" Text="Credit Limit">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>

                                                <dx:ASPxSpinEdit ID="txtCreditLimit" runat="server" Number="0" ReadOnly="true" ClientEnabled="false" MaxLength="10" MinValue="0" MaxValue="6000">
                                                </dx:ASPxSpinEdit>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="txtCardNumber1Label" runat="server" Text="Card Number">
                                                </dx:ASPxLabel>

                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxTextBox ID="txtCardNumber1" runat="server" ClientInstanceName="tp"
                                                     ClientEnabled="false" mask="0" masktype="Numeric" MaxLength="20" Width="170px" ReadOnly="True">
                                                    <ClientSideEvents KeyPress="NumericOnly" Validation="OnPTPValidation" />
                                                    <ValidationSettings Display="Dynamic" ErrorText="Please enter a PTP Amount" SetFocusOnError="True" ValidationGroup="save">
                                                    </ValidationSettings>
                                                </dx:ASPxTextBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="txtItcRatingLabel0" runat="server" Text="ITC Rating">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxTextBox ID="txtItcRating" runat="server" ClientEnabled="False" ReadOnly="true" MaxLength="10" Width="170px">
                                                </dx:ASPxTextBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="Label1" runat="server" Text=""></dx:ASPxLabel>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </table>
                                    <dx:ASPxPopupControl ClientInstanceName="ASPxPopupClientControl" Width="700px" Height="250px"
                                        MaxWidth="850px" MaxHeight="250px" MinHeight="250px" MinWidth="150px" ID="LookupMain"
                                        ShowFooter="True" FooterText="" PopupElementID="OpenPopup" HeaderText="Lookup Debtors"
                                        runat="server" PopupHorizontalAlign="Center" PopupVerticalAlign="Middle" EnableHierarchyRecreation="True" AllowDragging="True">
                                        <ContentCollection>
                                            <dx:PopupControlContentControl ID="PopupControlContentControl2" runat="server">
                                                <asp:Panel ID="Panel1" runat="server">
                                                    <table border="0" align="center" cellpadding="4" cellspacing="0" id="PopupContentDiv">
                                                        <tr>
                                                            <td>
                                                                <table>
                                                                    <tr>
                                                                        <td>
                                                                            <dx:ASPxLabel ID="txtSearchFieldlabel" runat="server" Text="Search Field"></dx:ASPxLabel>

                                                                        </td>
                                                                        <td>
                                                                            <dx:ASPxComboBox ID="cboSearchType" runat="server" Width="170px" ClientInstanceName="cboSearch">
                                                                            </dx:ASPxComboBox>
                                                                        </td>
                                                                        <td>
                                                                            <dx:ASPxCheckBox ID="chkRageEmployeesOnly" runat="server"></dx:ASPxCheckBox>
                                                                            <dx:ASPxLabel ID="chkRageEmployeesOnlylabel" runat="server" Text="Rage Employees Only"></dx:ASPxLabel>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <dx:ASPxLabel ID="txtCriteriaLabel" runat="server" Text="Criteria"></dx:ASPxLabel>

                                                                        </td>
                                                                        <td>
                                                                            <dx:ASPxTextBox ID="txtCriteria" CssClass="UpperCase" runat="server" Width="170px">
                                                                            </dx:ASPxTextBox>
                                                                        </td>
                                                                        <td>
                                                                            <dx:ASPxButton ID="cmdLookUp" runat="server" Text="LookUp" CssClass="px-0" AutoPostBack="false">
                                                                                <ClientSideEvents Click="FindDebtors"></ClientSideEvents>
                                                                            </dx:ASPxButton>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: #666666; font-family: Tahoma; font-size: 14px;" valign="top">
                                                                <dx:ASPxGridView ID="grdDebtorsSearch" runat="server" AutoGenerateColumns="False" ClientInstanceName="PopupGrid"
                                                                    OnDataBinding="grdDebtorsSearch_DataBinding" Width="660px">

                                                                    <SettingsBehavior AllowSelectByRowClick="True" AllowSort="False" />
                                                                    <%-- <ClientSideEvents RowDblClick="FillDebtorsDetails"></ClientSideEvents>--%>

                                                                    <Columns>
                                                                        <dx:GridViewDataTextColumn FieldName="account_number" Caption="Account Number" VisibleIndex="1" />
                                                                        <dx:GridViewDataTextColumn FieldName="id_number" Caption="ID Number" VisibleIndex="2" />
                                                                        <dx:GridViewDataTextColumn FieldName="first_name" Caption="First Name" VisibleIndex="3" />
                                                                        <dx:GridViewDataTextColumn FieldName="last_name" Caption="Last Name" VisibleIndex="4" />
                                                                        <dx:GridViewDataTextColumn FieldName="status" Caption="Status" VisibleIndex="5" />
                                                                        <dx:GridViewDataTextColumn FieldName="cardnum" Caption="Card Number" VisibleIndex="6" />
                                                                        <dx:GridViewDataTextColumn FieldName="cell_number" Caption="Cellphone" VisibleIndex="7" />
                                                                    </Columns>
                                                                </dx:ASPxGridView>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: #666666; font-family: Tahoma; font-size: 14px;" valign="top">
                                                                <dx:ASPxButton ID="cmdSelect" runat="server" Text="LOAD" Width="100%" AutoPostBack="false" ClientInstanceName="SelectStockcode">
                                                                    <ClientSideEvents Click="FillDebtorsDetails"></ClientSideEvents>
                                                                </dx:ASPxButton>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </asp:Panel>
                                            </dx:PopupControlContentControl>
                                        </ContentCollection>
                                    </dx:ASPxPopupControl>
                                </dx:ContentControl>
                            </ContentCollection>

                        </dx:TabPage>

                        <dx:TabPage Text="Addresses">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl2" runat="server">
                                    <table id="tblContainer1">
                                        <tr>
                                            <td class="auto-style3" colspan="2">
                                                <strong>Current Residential Address</strong>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="auto-style3" colspan="2">
                                                <strong>Postal Address</strong>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtCRAddressLine1Label0" runat="server" Text="Address Line1">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtCRAddressLine1" ClientEnabled="true" ClientInstanceName="txtCRAddressLine1" CssClass="UpperCase" runat="server" Width="170px" MaxLength="30">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="auto-style3">

                                                <dx:ASPxLabel ID="txtPOAAddressLine1Label" runat="server" Text="Address Line 1">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>

                                                <dx:ASPxTextBox ID="txtPOAAddressLine1" ClientEnabled="true" ClientInstanceName="txtPOAAddressLine1" CssClass="UpperCase" runat="server" Width="170px" MaxLength="30">
                                                </dx:ASPxTextBox>

                                            </td>

                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtCRAddressLine2Label" runat="server" Text="Address Line 2">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtCRAddressLine2" ClientInstanceName="txtCRAddressLine2" CssClass="UpperCase" runat="server" Width="170px" MaxLength="30">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>

                                                <dx:ASPxLabel ID="txtPOAAddressLine2Label" runat="server" Text="Address Line 2">
                                                </dx:ASPxLabel>

                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>

                                                <dx:ASPxTextBox ID="txtPOAAddressLine2" ClientInstanceName="txtPOAAddressLine2" CssClass="UpperCase" runat="server" Width="170px" MaxLength="30">
                                                </dx:ASPxTextBox>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtCRAddressLine3Label" runat="server" Text="Address Line 3">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtCRAddressLine3" ClientInstanceName="txtCRAddressLine3" CssClass="UpperCase" runat="server" Width="170px" MaxLength="30">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="txtPOAAddressLine3Label" runat="server" Text="Address Line 3">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>

                                                <dx:ASPxTextBox ID="txtPOAAddressLine3" ClientInstanceName="txtPOAAddressLine3" CssClass="UpperCase" runat="server" Width="170px" MaxLength="30">
                                                </dx:ASPxTextBox>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtCRAddressLine4Label" runat="server" Text="Address Line 4">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtCRAddressLine4" CssClass="UpperCase" runat="server" Width="170px" MaxLength="30"></dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="txtPOAPostalCodeLabel" runat="server" Text="PostalCode">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxTextBox ID="txtPOAPostalCode" ClientEnabled="true" ClientInstanceName="txtPOAPostalCode" runat="server" onKeyPress="javascript:return isNumber(event)" Size="6" MaxLength="4">
                                                </dx:ASPxTextBox>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="cboCRProvinceLabel" runat="server" Text="Province">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxComboBox ID="cboCRProvince" runat="server" ValueType="System.String"></dx:ASPxComboBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtCRPostalCodeLabel" runat="server" Text="Postal Code">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtCRPostalCode" ClientInstanceName="txtCRPostalCode" ClientEnabled="true" onKeyPress="javascript:return isNumber(event)" runat="server" Width="170px" MaxLength="4"></dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">

                                                <dx:ASPxButton ID="A_cmdCRCopy" runat="server" Text="Copy">
                                                    <ClientSideEvents Click="CopyAddress" />
                                                </dx:ASPxButton>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style4"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </table>
                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="Employment">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl3" runat="server">
                                    <table id="tblContainer2">

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_53" runat="server" Text="Employer">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tE_0" runat="server" Width="170px">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_54" runat="server" Text="Employer Tel No 1">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3">
                                                <dx:ASPxTextBox ID="Work1" runat="server" Width="170px">
                                                    <MaskSettings Mask="999-999-999" />
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td class="style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_57" runat="server" Text="Employer Address 1">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tE_2" CssClass="UpperCase" runat="server" Width="170px">
                                                </dx:ASPxTextBox>

                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_58" runat="server" Text="Employer Address 2">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tE_3" CssClass="UpperCase" runat="server" Width="170px">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_59" runat="server" Text="Employer Address 3">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tE_4" CssClass="UpperCase" runat="server" Width="170px">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_60" runat="server" Text="Employer Address 4">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tE_5" CssClass="UpperCase" runat="server" Width="170px">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style8">&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_64" runat="server" Text="Employer Number">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tE_6" runat="server" CssClass="UpperCase" Height="17px" Width="170px">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_61" runat="server" Text="Length Of Service">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="LOS" runat="server" Width="170px">
                                                    <MaskSettings Mask="99-99" />
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <dx:ASPxLabel ID="E_txtSPRageEmployeelabel" runat="server" Text="Rage Employee">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td class="auto-style9">
                                                <dx:ASPxCheckBox ID="chkRageEmployee" runat="server" CheckState="Unchecked">
                                                </dx:ASPxCheckBox>
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_65" runat="server" Text="Job Description">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tE_7" CssClass="UpperCase" runat="server" Width="170px">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style4">
                                                <dx:ASPxLabel ID="L_62" runat="server" Text="Income Amount">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2">
                                                <dx:ASPxTextBox ID="tE_8" onKeyPress="javascript:return isNumber(event)" runat="server" Width="170px">
                                                    <ValidationSettings Display="Dynamic" ErrorText="Please Supply Income Amount " SetFocusOnError="True" ValidationGroup="update">
                                                        <RequiredField ErrorText="Please Supply Income Amount" IsRequired="True" />
                                                    </ValidationSettings>
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td class="auto-style2">&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9"></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style6">&nbsp;</td>
                                            <td class="auto-style7">&nbsp;</td>
                                            <td class="auto-style7">&nbsp;</td>
                                            <td class="auto-style7">&nbsp;</td>
                                            <td class="auto-style7">&nbsp;</td>
                                            <td class="auto-style7">&nbsp;</td>
                                            <td class="auto-style7">&nbsp;</td>
                                            <td class="auto-style10">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="auto-style9">* Whole Numbers Only ie: No Cents</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                            <td class="auto-style9">&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td class="auto-style9">&nbsp;
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </table>
                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="Banking Info">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl4" runat="server">
                                    <table id="tblContainer3">

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_45" runat="server" Text="Type Of Account">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxComboBox ID="cboTOA" runat="server" ValueType="System.String"></dx:ASPxComboBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                  
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_46" runat="server" Text="Bank Name">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3">
                                                <dx:ASPxComboBox ID="cboBName" runat="server" ValueType="System.String"></dx:ASPxComboBox>
                                            </td>
                                            <td class="style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_47" runat="server" Text="Branch Name">
                                                </dx:ASPxLabel>

                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tB_0" CssClass="UpperCase" onKeyPress="return onlyAlphabets(event,this)" runat="server" Width="170px" MaxLength="35"></dx:ASPxTextBox>

                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                    
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style6">

                                                <dx:ASPxLabel ID="L_49" runat="server" Text="Branch Number">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td class="auto-style7">&nbsp;
                                            </td>
                                            <td class="auto-style7">&nbsp;
                                            </td>
                                            <td class="auto-style7" colspan="2">

                                                <dx:ASPxTextBox ID="tB_1" runat="server" onKeyPress="javascript:return isNumber(event)" Width="170px" MaxLength="20">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td class="auto-style7">&nbsp;
                                            </td>
                                            <td class="auto-style7"></td>
                                            <td class="auto-style7">&nbsp;
                                    
                                                          
                                            </td>
                                            <td class="auto-style7"></td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_48" runat="server" Text="Account Number"></dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="tB_2" onKeyPress="javascript:return isNumber(event)" runat="server" Width="170px" MaxLength="20"></dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                  
                                            </td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_52" runat="server" Text="Payment Type">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2">
                                                <dx:ASPxComboBox ID="cboPType" runat="server">
                                                </dx:ASPxComboBox>
                                            </td>
                                            <td class="auto-style2"></td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td class="style3" colspan="2">&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </table>
                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="Reporting">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl5" runat="server">
                                    <table id="tblContainer4">

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="L_90" runat="server" Text="Last Active">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtLastActive" runat="server" Width="170px" ReadOnly="true" ClientEnabled="false"></dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtDateOfCreationLabel" runat="server" Text="Date Of Creation">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3">
                                                <dx:ASPxTextBox ID="txtDateOfCreation" runat="server" Width="170px" EnableClientSideAPI="True"  ReadOnly="true" ClientEnabled="false">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td class="style3"></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtDateOfDefaultLabel" runat="server" Text="Date Of Default">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtDateOfDefault" runat="server" Width="170px"  ReadOnly="true" ClientEnabled="false"></dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtDateLegalReportedLabel" runat="server" Text="Date Legal Reported">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtDateLegalReported" runat="server" Width="170px"  ReadOnly="true" ClientEnabled="false">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3">
                                                <dx:ASPxLabel ID="txtWOReportedLabel" runat="server" Text="Date W/O Reported">
                                                </dx:ASPxLabel>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td class="style3" colspan="2">
                                                <dx:ASPxTextBox ID="txtWOReported" runat="server" Width="170px"  ReadOnly="true" ClientEnabled="false">
                                                </dx:ASPxTextBox>
                                            </td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                            <td>&nbsp;
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td class="auto-style3"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td class="auto-style2"></td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </table>

                                    <dx:ASPxButton ID="cmdReportingData" runat="server" Text="Get Data" CssClass="float_right_menu mb-10" Width="35px" Height="16px" AutoPostBack="false">
                                        <ClientSideEvents Click="GetReportingGridData"></ClientSideEvents>
                                    </dx:ASPxButton>

                                    <dx:ASPxNavBar ID="ASPxNavBar1" runat="server" Width="100%">
                                        <Groups>
                                            <dx:NavBarGroup  Expanded="False" Text="Age Analysis" Name="AgeAnalysis">
                                                <Items>
                                                    <dx:NavBarItem>
                                                        <Template>
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <dx:ASPxGridView ID="grdAgeAnalysis" runat="server" AutoGenerateColumns="False" EnableTheming="True"
                                                                            OnDataBinding="gridAgeAnalysis_DataBinding">
                                                                            <Columns>
                                                                                <dx:GridViewDataTextColumn Caption="Total" FieldName="aaTotal" VisibleIndex="0" Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Current" FieldName="aaCurrent" VisibleIndex="1"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="30 Days" FieldName="aa30Days" VisibleIndex="2"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="60 Days" FieldName="aa60Days" VisibleIndex="3"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="90 Days" FieldName="aa90Days" VisibleIndex="4"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="120 Days" FieldName="aa120Days" VisibleIndex="5"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="150 Days" FieldName="aa150Days" VisibleIndex="6"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                            </Columns>
                                                                            <SettingsPager PageSize="20">
                                                                            </SettingsPager>
                                                                        </dx:ASPxGridView>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </Template>
                                                    </dx:NavBarItem>

                                                </Items>
                                            </dx:NavBarGroup>
                                            <dx:NavBarGroup  Expanded="False" Text="Account Change History" Name="ChangeHistory">
                                                <Items>
                                                    <dx:NavBarItem>
                                                        <Template>
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <dx:ASPxGridView ID="grdAccountHistory" runat="server" AutoGenerateColumns="False" EnableTheming="True"
                                                                            OnDataBinding="gridAccountHistory_DataBinding">
                                                                            <Columns>
                                                                                <dx:GridViewDataTextColumn Caption="Date" FieldName="ChangeDate" VisibleIndex="0"
                                                                                    Width="120px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Time" VisibleIndex="1" FieldName="ChangeTime"
                                                                                    Width="120px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Description" FieldName="ChangeDescription" VisibleIndex="2"
                                                                                    Width="360px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Old Value" FieldName="OldValue" VisibleIndex="2"
                                                                                    Width="140px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="New Value" FieldName="NewValue" VisibleIndex="3"
                                                                                    Width="140px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Username" FieldName="Username" VisibleIndex="3"
                                                                                    Width="160px">
                                                                                </dx:GridViewDataTextColumn>

                                                                            </Columns>
                                                                            <SettingsPager PageSize="20">
                                                                            </SettingsPager>
                                                                        </dx:ASPxGridView>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </Template>
                                                    </dx:NavBarItem>

                                                </Items>
                                            </dx:NavBarGroup>
                                            <dx:NavBarGroup Expanded="False" Text="Contact History" Name="ContactHistory">
                                                <Items>
                                                    <dx:NavBarItem>
                                                        <Template>
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <dx:ASPxGridView ID="grdHistory" runat="server" AutoGenerateColumns="False" EnableTheming="True"
                                                                            OnDataBinding="gridHistory_DataBinding">
                                                                            <Columns>
                                                                                <dx:GridViewDataTextColumn Caption="Date / Time" FieldName="TimeStampOfAction" VisibleIndex="0"
                                                                                    Width="160px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="User" VisibleIndex="1" Width="150px" FieldName="ActionUser">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Type" FieldName="TypeOfContact" VisibleIndex="2"
                                                                                    Width="160px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Result" FieldName="ResultOfAction" VisibleIndex="2"
                                                                                    Width="160px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="PTP Amount" FieldName="PTPAmount" VisibleIndex="3"
                                                                                    Width="70px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="PTP Date" FieldName="PTPDate" VisibleIndex="3"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Notes" FieldName="ActionNotes" VisibleIndex="4"
                                                                                    Width="200px">
                                                                                </dx:GridViewDataTextColumn>
                                                                            </Columns>
                                                                            <SettingsPager PageSize="20">
                                                                            </SettingsPager>
                                                                        </dx:ASPxGridView>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </Template>
                                                    </dx:NavBarItem>
                                                </Items>
                                            </dx:NavBarGroup>
                                            <dx:NavBarGroup Expanded="False" Text="Transactions" Name="Transactions">
                                                <Items>
                                                    <dx:NavBarItem>
                                                        <Template>
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <dx:ASPxGridView ID="grdTransactions" runat="server" AutoGenerateColumns="False"
                                                                            EnableTheming="True" OnDataBinding="gridTransactions_DataBinding">
                                                                            <Columns>
                                                                                <dx:GridViewDataTextColumn Caption="Date" FieldName="tDate" VisibleIndex="0" Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Time" FieldName="tTime" VisibleIndex="1" Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="User" VisibleIndex="2" Width="150px" FieldName="tUser">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Type" FieldName="tType" VisibleIndex="3" Width="70px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Reference" FieldName="tReference" VisibleIndex="4"
                                                                                    Width="110px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Amount" FieldName="tAmount" VisibleIndex="5"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Period" FieldName="tPeriod" VisibleIndex="6"
                                                                                    Width="40px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Balance" FieldName="tRunningBalance" VisibleIndex="7"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                            </Columns>
                                                                            <SettingsPager PageSize="20">
                                                                            </SettingsPager>
                                                                        </dx:ASPxGridView>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </Template>
                                                    </dx:NavBarItem>
                                                </Items>
                                            </dx:NavBarGroup>
                                            <dx:NavBarGroup Text="Payment Plans" Expanded="False" Name="PaymentPlans">
                                                <Items>
                                                    <dx:NavBarItem>
                                                        <Template>
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <dx:ASPxGridView ID="grdPaymentPlans" runat="server" AutoGenerateColumns="False"
                                                                            EnableTheming="True" OnDataBinding="gridPayments_DataBinding">
                                                                            <Columns>
                                                                                <dx:GridViewDataTextColumn Caption="Date" FieldName="ppDate" VisibleIndex="0" Width="90px"
                                                                                    UnboundType="String">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Time" FieldName="ppTime" VisibleIndex="1" Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Total" FieldName="ppTotal" VisibleIndex="2" Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Period 1" FieldName="ppPeriod1" VisibleIndex="3"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Amount 1" FieldName="ppAmount1" VisibleIndex="4"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Period 2" FieldName="ppPeriod2" VisibleIndex="5"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Amount 2" VisibleIndex="6" Width="90px" FieldName="ppAmount2">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Period 3" FieldName="ppPeriod3" VisibleIndex="7"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Amount 3" FieldName="ppAmount3" VisibleIndex="8"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Period 4" FieldName="ppPeriod4" VisibleIndex="9"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Amount 4" FieldName="ppAmount4" VisibleIndex="10"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Period 5" FieldName="ppPeriod5" VisibleIndex="11"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Amount 5" FieldName="ppAmount5" VisibleIndex="12"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Period 6" FieldName="ppPeriod6" VisibleIndex="13"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Amount 6" FieldName="ppAmount6" VisibleIndex="14"
                                                                                    Width="90px">
                                                                                </dx:GridViewDataTextColumn>
                                                                            </Columns>
                                                                        </dx:ASPxGridView>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </Template>
                                                    </dx:NavBarItem>
                                                </Items>
                                            </dx:NavBarGroup>
                                            <dx:NavBarGroup Text="Closing Balances" Expanded="False" Name="ClosingBalances">
                                                <Items>
                                                    <dx:NavBarItem>
                                                        <Template>
                                                            <table>
                                                                <tr>
                                                                    <td>
                                                                        <dx:ASPxGridView ID="grdClosingBalances" runat="server" AutoGenerateColumns="False"
                                                                            EnableTheming="True" OnDataBinding="gridClosingBalances_DataBinding">
                                                                            <Columns>
                                                                                <dx:GridViewDataTextColumn Caption="Period" FieldName="cbPeriod" VisibleIndex="0"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="Total" FieldName="cbTotal" VisibleIndex="1" Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="30 Days" FieldName="cb30Days" VisibleIndex="2"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="60 Days" FieldName="cb60Days" VisibleIndex="3"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="90 Days" FieldName="cb90Days" VisibleIndex="4"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="120 Days" FieldName="cb120Days" VisibleIndex="5"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                                <dx:GridViewDataTextColumn Caption="150 Days" FieldName="cb150Days" VisibleIndex="6"
                                                                                    Width="100px">
                                                                                </dx:GridViewDataTextColumn>
                                                                            </Columns>
                                                                        </dx:ASPxGridView>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </Template>
                                                    </dx:NavBarItem>
                                                </Items>
                                            </dx:NavBarGroup>
                                        </Groups>
                                    </dx:ASPxNavBar>
                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="Bureau Enquiries">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl6" runat="server">
                                    <strong>Enquiries</strong>
                                    <br />
                                    <br />
                                    <dx:ASPxGridView ID="BureaEnquiresGridview" runat="server" AutoGenerateColumns="False" EnableTheming="True">
                                        <Columns>
                                            <dx:GridViewDataTextColumn Caption="Enquiry Date" FieldName="EnquiryDate" VisibleIndex="1"
                                                Width="360px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Subscriber" FieldName="Subscriber" VisibleIndex="2"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Status" FieldName="Status" VisibleIndex="3"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Installment Amount" FieldName="InstallmentAmount" VisibleIndex="4"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Monthly Salary" FieldName="MonthlySalary" VisibleIndex="5"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                        </Columns>
                                    </dx:ASPxGridView>
                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="D &amp; J">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl7" runat="server">
                                    <strong>Defaults</strong>
                                    <br />
                                    <br />
                                    <dx:ASPxGridView ID="defaultGridview" runat="server" AutoGenerateColumns="False" EnableTheming="True">
                                        <Columns>
                                            <dx:GridViewDataTextColumn Caption="Detail" FieldName="Detail" VisibleIndex="0"
                                                Width="120px">
                                            </dx:GridViewDataTextColumn>

                                            <dx:GridViewDataTextColumn Caption="Subscriber" FieldName="ChangeDescription" VisibleIndex="1"
                                                Width="360px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Current Balance" FieldName="CurrentBalance" VisibleIndex="2"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Status Code" FieldName="StatusCode" VisibleIndex="3"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                        </Columns>
                                    </dx:ASPxGridView>
                                    <br />
                                    <strong>Judgements</strong>
                                    <br />
                                    <br />
                                    <dx:ASPxGridView ID="judgementGridview" runat="server" AutoGenerateColumns="False" EnableTheming="True">
                                        <Columns>
                                            <dx:GridViewDataTextColumn Caption="Detail" FieldName="Detail" VisibleIndex="1"
                                                Width="120px">
                                            </dx:GridViewDataTextColumn>

                                            <dx:GridViewDataTextColumn Caption="Date" FieldName="Date" VisibleIndex="2"
                                                Width="360px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Amount" FieldName="Amount" VisibleIndex="3"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Plaintiff" FieldName="Plaintiff" VisibleIndex="4"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                        </Columns>
                                    </dx:ASPxGridView>

                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="Accounts">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl8" runat="server">
                                    <strong>CPA Accounts</strong>
                                    <br />
                                    <br />
                                    <dx:ASPxGridView ID="CPAGridview" runat="server" AutoGenerateColumns="False" EnableTheming="True">
                                        <Columns>
                                            <dx:GridViewDataTextColumn Caption="Detail" FieldName="Detail" VisibleIndex="1"
                                                Width="120px">
                                            </dx:GridViewDataTextColumn>

                                            <dx:GridViewDataTextColumn Caption="Subscriber" FieldName="Subscriber" VisibleIndex="2"
                                                Width="360px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Open Balance" FieldName="OpenBalance" VisibleIndex="3"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Installment" FieldName="Installment" VisibleIndex="4"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Pmt Status" FieldName="PmtStatus" VisibleIndex="5"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Credit Lmt" FieldName="CreditLmt" VisibleIndex="6"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Cur Balance" FieldName="CurBalance" VisibleIndex="7"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                        </Columns>
                                    </dx:ASPxGridView>
                                    <br />
                                    <strong>NLR Accounts</strong>
                                    <br />
                                    <br />

                                    <dx:ASPxGridView ID="NLRGridview" runat="server" AutoGenerateColumns="False" EnableTheming="True">
                                        <Columns>
                                            <dx:GridViewDataTextColumn Caption="Detail" FieldName="Detail" VisibleIndex="1"
                                                Width="120px">
                                            </dx:GridViewDataTextColumn>

                                            <dx:GridViewDataTextColumn Caption="Subscriber" FieldName="Subscriber" VisibleIndex="2"
                                                Width="360px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Current Balance" FieldName="CurrentBalance" VisibleIndex="3"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Installment" FieldName="Installment" VisibleIndex="4"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Pmt Status" FieldName="PmtStatus" VisibleIndex="5"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Credit Lmt" FieldName="CreditLmt" VisibleIndex="6"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                            <dx:GridViewDataTextColumn Caption="Overdue Bal...." FieldName="CurBalance" VisibleIndex="7"
                                                Width="160px">
                                            </dx:GridViewDataTextColumn>
                                        </Columns>
                                    </dx:ASPxGridView>

                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="T U Exceptions">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl9" runat="server">
                                    <strong>TU Filters</strong>
                                    <br />
                                    <br />
                                    <dx:ASPxGridView ID="TUExceptionGridview" runat="server" AutoGenerateColumns="False" EnableTheming="True">
                                        <SettingsPager Mode="ShowAllRecords">
                                        </SettingsPager>
                                        <Columns>
                                            <dx:GridViewDataTextColumn Caption="Code" FieldName="Code" VisibleIndex="0"
                                                Width="120px">
                                            </dx:GridViewDataTextColumn>

                                            <dx:GridViewDataTextColumn Caption="Description" FieldName="Description" VisibleIndex="1"
                                                Width="360px">
                                            </dx:GridViewDataTextColumn>

                                        </Columns>
                                    </dx:ASPxGridView>

                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                        <dx:TabPage Text="Bureau Data">
                            <ContentCollection>
                                <dx:ContentControl ID="ContentControl10" runat="server">
                                    <dx:ASPxButton ID="btnGetBureauData" runat="server" Text="Get Data" CssClass="float_right_menu burea_btn" Width="35px" Height="16px" AutoPostBack="false">
                                        <ClientSideEvents Click="GetBureauXMLData"></ClientSideEvents>
                                    </dx:ASPxButton>
                                    <br />
                                    <dx:ASPxMemo ID="BureauDataBox" runat="server" Height="400px" Text="" Width="952px" Enabled="false" AutoPostBack="false" ClientEnabled="false" ReadOnly="True" ValidateRequestMode="Disabled">
                                    </dx:ASPxMemo>

                                    <%--<dx:ASPxRichEdit ID="BureauDataBox" runat="server" WorkDirectory="~\App_Data\WorkDirectory"></dx:ASPxRichEdit>--%>
                                    <br />
                                </dx:ContentControl>
                            </ContentCollection>
                        </dx:TabPage>

                    </TabPages>

                </dx:ASPxPageControl>

                <dx:ASPxValidationSummary ID="ASPxValidationSummary1" runat="server" RenderMode="BulletedList" ValidationGroup="update" ForeColor="#FF3300">
                </dx:ASPxValidationSummary>

                <table class="notes_table">
                    <tr>
                        <td class="style4">
                            <dx:ASPxLabel ID="txtOldNotesLabel" runat="server" Text="Old Notes">
                            </dx:ASPxLabel>
                        </td>
                        <td>&nbsp;
                        </td>
                        <td>&nbsp;
                        </td>
                        <td>
                            <dx:ASPxMemo ID="txtOldNotes" runat="server" Height="71px" Width="520px" ClientInstanceName="notes"
                                ValidationSettings-Display="Dynamic" ValidationSettings-ValidateOnLeave="true"
                                ValidationSettings-ValidationGroup="save" ValidationSettings-ErrorText="ttt" ReadOnly="True">
                                <ClientSideEvents KeyDown="RecalculateCharsRemaining" KeyUp="RecalculateCharsRemaining"
                                    GotFocus="EnableMaxLengthMemoTimer" LostFocus="DisableMaxLengthMemoTimer"
                                    Init="function(s, e) { InitMemoMaxLength(s, 2500); RecalculateCharsRemaining(s); }"></ClientSideEvents>
                                <ValidationSettings SetFocusOnError="True" ErrorText="You must fill in a note if you are marking an account as 'Under Investigation'">
                                </ValidationSettings>
                            </dx:ASPxMemo>
                            <span class="chrm">
                                <dx:ASPxLabel ID="txtOldNotes_cr" runat="server" EnableClientSideAPI="True" />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td class="style4">
                            <dx:ASPxLabel ID="txtNewNotesLabel" runat="server" Text="New Notes">
                            </dx:ASPxLabel>
                        </td>
                        <td>&nbsp;
                        </td>
                        <td>&nbsp;
                        </td>
                        <td>
                            <dx:ASPxMemo ID="txtNewNotes" runat="server" Height="71px" Width="520px" ClientInstanceName="notes"
                                ValidationSettings-Display="Dynamic" ValidationSettings-ValidateOnLeave="true"
                                ValidationSettings-ValidationGroup="save" ValidationSettings-ErrorText="ttt">
                                <ClientSideEvents KeyDown="RecalculateCharsRemaining" KeyUp="RecalculateCharsRemaining"
                                    GotFocus="EnableMaxLengthMemoTimer" LostFocus="DisableMaxLengthMemoTimer"
                                    Init="function(s, e) { InitMemoMaxLength(s, 2500); RecalculateCharsRemaining(s); }"></ClientSideEvents>
                                <ValidationSettings SetFocusOnError="True" ErrorText="You must fill in a note if you are marking an account as 'Under Investigation'">
                                </ValidationSettings>
                            </dx:ASPxMemo>
                            <span class="chrm">
                                <dx:ASPxLabel ID="txtNewNotes_cr" runat="server" EnableClientSideAPI="True" />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td class="style4">&nbsp;&nbsp;
                        </td>
                        <td>&nbsp;&nbsp;
                        </td>
                        <td>&nbsp;&nbsp;
                        </td>
                        <td>
                            <dx:ASPxButton ID="cmdBtn" runat="server" Text="Submit"
                                AutoPostBack="false" Style="height: 23px">
                                <ClientSideEvents Click="SubmitForm"></ClientSideEvents>
                            </dx:ASPxButton>
                        </td>
                    </tr>
                </table>

                <asp:HiddenField ID="hdWhichButton" runat="server" />

                <dx:ASPxPopupControl ID="dxPopUpError" runat="server" ShowCloseButton="True" Style="margin-right: 328px"
                    HeaderText="" Width="548px" CloseAction="None" ClientInstanceName="dxPopUpError"
                    PopupHorizontalAlign="WindowCenter" PopupVerticalAlign="WindowCenter" AppearAfter="100"
                    DisappearAfter="1000" PopupAnimationType="Fade">
                    <ClientSideEvents CloseButtonClick="fadeOut"></ClientSideEvents>
                    <ContentCollection>
                        <dx:PopupControlContentControl ID="PopupControlContentControl4" runat="server">
                            <div>
                                <div id="Div2" class="text-center">
                                    <dx:ASPxLabel ID="lblError" runat="server"
                                        Font-Size="16px">
                                    </dx:ASPxLabel>
                                </div>
                            </div>
                        </dx:PopupControlContentControl>
                    </ContentCollection>
                    <ClientSideEvents CloseButtonClick="fadeOut" />
                </dx:ASPxPopupControl>

            </dx:PanelContent>
        </PanelCollection>
    </dx:ASPxCallbackPanel>
    <script type="text/javascript">
        function isNumber(evt) {
            var iKeyCode = (evt.which) ? evt.which : evt.keyCode
            if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                return false;
            return true;
        }
        function onlyAlphabets(evt) {
            var charCode;
            if (window.event)
                charCode = window.event.keyCode;  //for IE
            else
                charCode = evt.which;  //for firefox
            if (charCode == 32) //for &lt;space&gt; symbol
                return true;
            if (charCode > 31 && charCode < 65) //for characters before 'A' in ASCII Table
                return false;
            if (charCode > 90 && charCode < 97) //for characters between 'Z' and 'a' in ASCII Table
                return false;
            if (charCode > 122) //for characters beyond 'z' in ASCII Table
                return false;
            return true;
        }
        function isNumberandTextValidTE(evt) {
            debugger;
            if (isNumber(evt) == false) {
                tP_KeyPress(s, e)
            }


        }

    </script>
</asp:Content>

