<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/debit/debit.Master" CodeBehind="debit_order.aspx.vb" Inherits="abc.Website.debtor_order" %>

<%@ Register Assembly="DevExpress.Web.ASPxTreeList.v15.1, Version=15.1.6.0, Culture=neutral, Namespace="DevExpress.Web.ASPxTreeList" TagPrefix="dx" %>

<%@ Register Assembly="DevExpress.Web.v15.1, Version=15.1.6.0, Culture=neutral"
    Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Src="~/Widgets/wid_datetime.ascx" TagName="DateTime" TagPrefix="widget" %>
<%@ Register Src="~/Widgets/CallsForToday.ascx" TagName="CallsForToday" TagPrefix="widget" %>

<%@ Register Assembly="DevExpress.Dashboard.v15.1.Web, Version=15.1.6.0, Culture=neutral, Namespace="DevExpress.DashboardWeb" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
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

        .mb-10 {
            margin-bottom: 10px;
        }

        .mainContainer {
            padding: 10px;
        }
        .dxgvHEC{display:none;}
        .dxgvCSD{overflow-x:auto !important;}
    </style>

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

            </td>

        </tr>
    </table>
    <dx:ASPxDockZone ID="ASPxDockZone1" runat="server" Width="229px" ZoneUID="zone1"
        PanelSpacing="3px" ClientInstanceName="splitter" Height="400px">
    </dx:ASPxDockZone>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainHolder" runat="server">


    <div class="mainContainer">

        <dx:ASPxRoundPanel ID="ASPxRoundPanel1" runat="server" CssClass="date_panel" HeaderText="Debit Order Report" Width="90%">
            <PanelCollection>
                <dx:PanelContent ID="PanelContent1" runat="server" SupportsDisabledAttribute="True">
                    <table style="width: 100%;margin-bottom: 10px;">
                        <tr>
                            <td align="right">
                                <dx:ASPxButton ID="cmdExportCSV" runat="server" Text="Export to CSV">
                                </dx:ASPxButton>
                            </td>
                        </tr>
                    </table>

                    <dx:ASPxGridView ID="grdDebtorOrderDetails" runat="server" AutoGenerateColumns="False" OnDataBinding="grdDebtorOrderDetails_DataBinding"
                                    Width="100%">
                                    <Columns>
                                        <dx:GridViewDataTextColumn FieldName="account_number" Caption="Account Number" VisibleIndex="1" Width="12%" />
                                        <dx:GridViewDataTextColumn FieldName="title" Caption="Name" VisibleIndex="2" Width="12%" />
                                        <dx:GridViewDataTextColumn FieldName="bank_name" Caption="Bank Name" VisibleIndex="3" Width="20%" />
                                        <dx:GridViewDataTextColumn FieldName="branch_name" Caption="Branch Name" VisibleIndex="4" Width="20%" />
                                        <dx:GridViewDataTextColumn FieldName="branch_number" Caption="Branch Code" VisibleIndex="5" Width="12%" />
                                        <dx:GridViewDataTextColumn FieldName="bank_account_number" Caption="Bank Acc Number" VisibleIndex="6" Width="12%" />
                                        <dx:GridViewDataTextColumn FieldName="owning" Caption="Owing" VisibleIndex="7" Width="12%" />
                                    </Columns>
                                    <SettingsBehavior AllowSelectByRowClick="True" AllowSort="False" />
                                    <Settings ShowFooter="true" HorizontalScrollBarMode="Visible" />
                                    <TotalSummary>
                                        <dx:ASPxSummaryItem FieldName="owning" SummaryType="sum" />
                                    </TotalSummary>
                                </dx:ASPxGridView>
                    <dx:ASPxGridViewExporter ID="Exporter" runat="server">
                        </dx:ASPxGridViewExporter>
                </dx:PanelContent>
            </PanelCollection>
        </dx:ASPxRoundPanel>
    </div>
</asp:Content>
